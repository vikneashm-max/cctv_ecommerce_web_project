package com.backend.cctvecommerce.controller;

import com.backend.cctvecommerce.entity.User;
import com.backend.cctvecommerce.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

@RestController

@RequestMapping("/api/users")

@CrossOrigin(origins = "http://localhost:5173")

public class UserController {

    @Autowired
    private UserService userService;

    // UPDATE PERSONAL INFO
    @PutMapping("/{id}/personal")
    public User updatePersonal(
            @PathVariable @NonNull Long id,
            @RequestBody User user
    ) {
        return userService.updatePersonalInfo(id, user);
    }

    // UPDATE ADDRESS
    @PutMapping("/{id}/address")
    public User updateAddress(
            @PathVariable @NonNull Long id,
            @RequestBody User user
    ) {
        return userService.updateAddress(id, user);
    }

    // UPDATE PASSWORD
    @PutMapping("/{id}/password")

    public User updatePassword(
            @PathVariable @NonNull Long id,

            @RequestBody User user
    ) {

        return userService.updatePassword(
                id,
                user.getPassword()
        );
    }
}