package com.backend.cctvecommerce.controller;

import com.backend.cctvecommerce.dto.user.AuthResponse;
import com.backend.cctvecommerce.dto.user.UserLoginRequest;
import com.backend.cctvecommerce.dto.user.UserRegisterRequest;
import com.backend.cctvecommerce.dto.user.GoogleLoginRequest;
import com.backend.cctvecommerce.dto.user.ForgotPasswordRequest;
import com.backend.cctvecommerce.dto.user.ResetPasswordRequest;
import com.backend.cctvecommerce.entity.User;
import com.backend.cctvecommerce.repository.UserRepository;
import com.backend.cctvecommerce.security.JwtTokenProvider;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Value("${google.client.id:}")
    private String googleClientId;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String mailSenderAccount;

    private final NetHttpTransport transport = new NetHttpTransport();
    private final GsonFactory jsonFactory = new GsonFactory();
    private GoogleIdTokenVerifier googleVerifier;

    private synchronized GoogleIdTokenVerifier getGoogleVerifier() {
        if (googleVerifier == null) {
            if (googleClientId == null || googleClientId.isEmpty()) {
                throw new IllegalStateException("Google Client ID is not configured on the server.");
            }
            googleVerifier = new GoogleIdTokenVerifier.Builder(transport, jsonFactory)
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();
        }
        return googleVerifier;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody @Valid UserRegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()) != null) {
            return ResponseEntity.badRequest().body("Email address already in use.");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        
        // Handle role assignment
        String requestedRole = request.getRole();
        if (requestedRole == null || requestedRole.isEmpty()) {
            user.setRole("ROLE_USER");
        } else {
            String roleUpper = requestedRole.toUpperCase();
            if (!roleUpper.startsWith("ROLE_")) {
                roleUpper = "ROLE_" + roleUpper;
            }
            if ("ROLE_ADMIN".equals(roleUpper) || "ROLE_USER".equals(roleUpper)) {
                user.setRole(roleUpper);
            } else {
                user.setRole("ROLE_USER");
            }
        }

        user.setPhoneNumber(request.getPhoneNumber());
        user.setAddress(request.getAddress());
        user.setCity(request.getCity());
        user.setState(request.getState());
        user.setPostalCode(request.getPostalCode());
        user.setCountry(request.getCountry());

        User savedUser = userRepository.save(user);

        // Generate token for auto login
        String token = tokenProvider.generateToken(
                new org.springframework.security.core.userdetails.User(
                        savedUser.getEmail(),
                        savedUser.getPassword(),
                        Collections.singletonList(new org.springframework.security.core.authority.SimpleGrantedAuthority(savedUser.getRole()))
                )
        );

        return ResponseEntity.ok(new AuthResponse(token, savedUser));
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody @Valid UserLoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(request.getEmail());
        return ResponseEntity.ok(new AuthResponse(jwt, user));
    }

    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody @Valid GoogleLoginRequest request) {
        if (googleClientId == null || googleClientId.isEmpty()) {
            return ResponseEntity.internalServerError().body("Google Client ID is not configured on the server.");
        }

        try {
            GoogleIdTokenVerifier verifier;
            try {
                verifier = getGoogleVerifier();
            } catch (IllegalStateException ise) {
                return ResponseEntity.internalServerError().body(ise.getMessage());
            }

            GoogleIdToken idToken = verifier.verify(request.getIdToken());
            if (idToken == null) {
                return ResponseEntity.badRequest().body("Invalid Google ID Token.");
            }

            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String name = (String) payload.get("name");
            if (name == null || name.isEmpty()) {
                name = (String) payload.get("given_name");
            }
            if (name == null || name.isEmpty()) {
                name = email.split("@")[0];
            }

            // Find or create user
            User user = userRepository.findByEmail(email);
            if (user == null) {
                user = new User();
                user.setEmail(email);
                user.setFullName(name);
                user.setRole("ROLE_USER");
                // Generate a random secure password since they log in via OAuth
                user.setPassword(passwordEncoder.encode(java.util.UUID.randomUUID().toString()));
                user = userRepository.save(user);
            }

            // Generate JWT token
            String jwtToken = tokenProvider.generateToken(
                    new org.springframework.security.core.userdetails.User(
                            user.getEmail(),
                            user.getPassword(),
                            Collections.singletonList(new org.springframework.security.core.authority.SimpleGrantedAuthority(user.getRole()))
                    )
            );

            return ResponseEntity.ok(new AuthResponse(jwtToken, user));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Google token verification failed: " + e.getMessage());
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody @Valid ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail());
        if (user == null) {
            return ResponseEntity.badRequest().body("Email address is not registered.");
        }

        // Generate 6-digit OTP
        String otp = String.format("%06d", new java.util.Random().nextInt(1000000));
        user.setResetToken(otp);
        user.setResetTokenExpiry(java.time.LocalDateTime.now().plusMinutes(15));
        userRepository.save(user);

        // Print to console for easy local testing fallback
        System.out.println("\n==================================================");
        System.out.println("PASSWORD RESET OTP GENERATED FOR: " + user.getEmail());
        System.out.println("OTP CODE: " + otp);
        System.out.println("==================================================");

        // Send Email
        try {
            if (mailSender != null && mailSenderAccount != null && !mailSenderAccount.isEmpty()) {
                SimpleMailMessage mailMessage = new SimpleMailMessage();
                mailMessage.setFrom(mailSenderAccount);
                mailMessage.setTo(user.getEmail());
                mailMessage.setSubject("TN Automation - Password Reset Code");
                mailMessage.setText("Dear " + user.getFullName() + ",\n\n" +
                        "You requested to reset your password. Please use the following 6-digit verification code to complete the process:\n\n" +
                        "Verification Code: " + otp + "\n\n" +
                        "This code is valid for 15 minutes. If you did not request a password reset, please ignore this email.\n\n" +
                        "Best regards,\n" +
                        "TN Automation Support Team");
                mailSender.send(mailMessage);
            } else {
                System.out.println("SMTP Mail Sender is not configured, skipped email dispatch.");
            }
        } catch (Exception e) {
            System.err.println("CRITICAL WARNING: SMTP Password Reset Email Dispatch Failed: " + e.getMessage());
        }

        return ResponseEntity.ok("Verification code sent to email.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody @Valid ResetPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail());
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found with this email.");
        }

        if (user.getResetToken() == null || !user.getResetToken().equals(request.getToken())) {
            return ResponseEntity.badRequest().body("Invalid verification code.");
        }

        if (user.getResetTokenExpiry() == null || user.getResetTokenExpiry().isBefore(java.time.LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("Verification code has expired.");
        }

        // Token is valid and not expired, update password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);

        return ResponseEntity.ok("Password has been reset successfully.");
    }
}
