package com.backend.cctvecommerce.controller;

import com.backend.cctvecommerce.dto.user.AuthResponse;
import com.backend.cctvecommerce.dto.user.UserLoginRequest;
import com.backend.cctvecommerce.dto.user.UserRegisterRequest;
import com.backend.cctvecommerce.dto.user.GoogleLoginRequest;
import com.backend.cctvecommerce.dto.user.ForgotPasswordRequest;
import com.backend.cctvecommerce.entity.User;
import com.backend.cctvecommerce.repository.UserRepository;
import com.backend.cctvecommerce.security.JwtTokenProvider;
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
        
        // Handle role assignment (accept valid roles directly; default to ROLE_USER)
        String requestedRole = request.getRole();
        if (requestedRole == null || requestedRole.isEmpty()) {
            user.setRole("ROLE_USER");
        } else {
            String roleNorm = requestedRole.toUpperCase();
            if ("ADMIN".equals(roleNorm) || "ROLE_ADMIN".equals(roleNorm)) {
                user.setRole("ROLE_ADMIN");
            } else if ("USER".equals(roleNorm) || "ROLE_USER".equals(roleNorm)) {
                user.setRole("ROLE_USER");
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

    @GetMapping("/ping")
    public ResponseEntity<String> ping() {
        return ResponseEntity.ok("pong");
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody @Valid UserLoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail());
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found.");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

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

        // Directly update user's password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);

        return ResponseEntity.ok("Password has been reset successfully.");
    }
}
