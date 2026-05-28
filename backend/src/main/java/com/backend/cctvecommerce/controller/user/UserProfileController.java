package com.backend.cctvecommerce.controller.user;

import com.backend.cctvecommerce.dto.user.UserProfileResponse;
import com.backend.cctvecommerce.entity.User;
import com.backend.cctvecommerce.service.user.UserProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/user/profile")
@CrossOrigin(origins = "http://localhost:5173")
public class UserProfileController {

    @Autowired
    private UserProfileService userProfileService;

    @GetMapping
    public ResponseEntity<UserProfileResponse> getProfile() {
        return ResponseEntity.ok(userProfileService.getProfile());
    }

    @PutMapping("/personal")
    public ResponseEntity<UserProfileResponse> updatePersonalInfo(@RequestBody User user) {
        return ResponseEntity.ok(userProfileService.updatePersonalInfo(user));
    }

    @PutMapping("/address")
    public ResponseEntity<UserProfileResponse> updateAddress(@RequestBody User user) {
        return ResponseEntity.ok(userProfileService.updateAddress(user));
    }

    @PutMapping("/password")
    public ResponseEntity<UserProfileResponse> updatePassword(@RequestBody Map<String, String> body) {
        String newPassword = body.get("password");
        if (newPassword == null || newPassword.length() < 6) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(userProfileService.updatePassword(newPassword));
    }
}
