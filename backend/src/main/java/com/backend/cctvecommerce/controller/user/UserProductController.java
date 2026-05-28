package com.backend.cctvecommerce.controller.user;

import com.backend.cctvecommerce.entity.Product;
import com.backend.cctvecommerce.service.user.UserProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user/products")
@CrossOrigin(origins = "http://localhost:5173")
@SuppressWarnings("null")
public class UserProductController {

    @Autowired
    private UserProductService userProductService;

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(userProductService.getAllProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(userProductService.getProductById(id));
    }
}
