package com.backend.cctvecommerce.controller.admin;

import com.backend.cctvecommerce.dto.admin.AdminUserResponse;
import com.backend.cctvecommerce.service.admin.AdminUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/users")
@CrossOrigin(origins = "http://localhost:5173")
@SuppressWarnings("null")
public class AdminUserManagementController {

    @Autowired
    private AdminUserService adminUserService;

    @GetMapping
    public ResponseEntity<List<AdminUserResponse>> getAllUsers() {
        return ResponseEntity.ok(adminUserService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdminUserResponse> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(adminUserService.getUserById(id));
    }

    @PutMapping("/{id}/role")
    public ResponseEntity<AdminUserResponse> updateUserRole(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String role = body.get("role");
        if (role == null || role.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(adminUserService.updateUserRole(id, role));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        adminUserService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
