package com.backend.cctvecommerce.controller.user;

import com.backend.cctvecommerce.dto.user.OrderResponse;
import com.backend.cctvecommerce.dto.user.PlaceOrderRequest;
import com.backend.cctvecommerce.service.user.UserOrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user/orders")
@CrossOrigin(origins = "http://localhost:5173")
@SuppressWarnings("null")
public class UserOrderController {

    @Autowired
    private UserOrderService userOrderService;

    @PostMapping
    public ResponseEntity<OrderResponse> placeOrder(@RequestBody @Valid PlaceOrderRequest request) {
        OrderResponse response = userOrderService.placeOrder(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getMyOrders() {
        return ResponseEntity.ok(userOrderService.getMyOrders());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(userOrderService.getOrderById(id));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<OrderResponse> cancelOrder(@PathVariable Long id) {
        return ResponseEntity.ok(userOrderService.cancelOrder(id));
    }
}
