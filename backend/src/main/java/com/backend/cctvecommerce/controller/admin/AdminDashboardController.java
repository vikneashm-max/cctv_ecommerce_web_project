package com.backend.cctvecommerce.controller.admin;

import com.backend.cctvecommerce.dto.admin.AdminDashboardResponse;
import com.backend.cctvecommerce.service.admin.AdminDashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/dashboard")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminDashboardController {

    @Autowired
    private AdminDashboardService adminDashboardService;

    @GetMapping
    public ResponseEntity<AdminDashboardResponse> getDashboardStats() {
        return ResponseEntity.ok(adminDashboardService.getDashboardStats());
    }
}
