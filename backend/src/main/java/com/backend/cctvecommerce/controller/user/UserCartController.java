package com.backend.cctvecommerce.controller.user;

import com.backend.cctvecommerce.dto.user.UserCartResponse;
import com.backend.cctvecommerce.service.user.UserCartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/user/cart")
@CrossOrigin(origins = "http://localhost:5173")
@SuppressWarnings("null")
public class UserCartController {

    @Autowired
    private UserCartService userCartService;

    @GetMapping
    public ResponseEntity<UserCartResponse> getCart() {
        return ResponseEntity.ok(userCartService.getCart());
    }

    @PostMapping
    public ResponseEntity<UserCartResponse> addToCart(@RequestBody Map<String, Object> body) {
        Long productId = ((Number) body.get("productId")).longValue();
        Integer quantity = ((Number) body.get("quantity")).intValue();
        return ResponseEntity.ok(userCartService.addItemToCart(productId, quantity));
    }

    @PutMapping("/{itemId}")
    public ResponseEntity<UserCartResponse> updateCartItemQuantity(@PathVariable Long itemId, @RequestBody Map<String, Object> body) {
        Integer quantity = ((Number) body.get("quantity")).intValue();
        return ResponseEntity.ok(userCartService.updateItemQuantity(itemId, quantity));
    }

    @DeleteMapping("/{itemId}")
    public ResponseEntity<UserCartResponse> removeFromCart(@PathVariable Long itemId) {
        return ResponseEntity.ok(userCartService.removeItemFromCart(itemId));
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart() {
        userCartService.clearCart();
        return ResponseEntity.noContent().build();
    }
}
