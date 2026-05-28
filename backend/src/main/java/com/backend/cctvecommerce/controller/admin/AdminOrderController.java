package com.backend.cctvecommerce.controller.admin;

import com.backend.cctvecommerce.dto.user.OrderResponse;
import com.backend.cctvecommerce.service.admin.AdminOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/orders")
@CrossOrigin(origins = "http://localhost:5173")
@SuppressWarnings("null")
public class AdminOrderController {

    @Autowired
    private AdminOrderService adminOrderService;

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        return ResponseEntity.ok(adminOrderService.getAllOrders());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(adminOrderService.getOrderById(id));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        if (status == null || status.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(adminOrderService.updateOrderStatus(id, status));
    }
}
