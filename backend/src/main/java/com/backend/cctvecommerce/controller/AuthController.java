package com.backend.cctvecommerce.controller;

import com.backend.cctvecommerce.entity.User;
import com.backend.cctvecommerce.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import org.springframework.lang.NonNull;

@RestController

@RequestMapping("/api/auth")

@CrossOrigin(origins = "http://localhost:5173")

public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public User registerUser(
            @RequestBody @NonNull User user
    ) {

        return userService.register(user);
    }

    @PostMapping("/login")
    public org.springframework.http.ResponseEntity<?> loginUser(@RequestBody java.util.Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        User user = userService.login(email, password);
        if (user != null) {
            return org.springframework.http.ResponseEntity.ok(user);
        } else {
            return org.springframework.http.ResponseEntity.status(401).body("Invalid email or password");
        }
    }
}
