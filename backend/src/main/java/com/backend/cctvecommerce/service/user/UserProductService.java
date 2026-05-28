package com.backend.cctvecommerce.service.user;

import com.backend.cctvecommerce.entity.Product;
import com.backend.cctvecommerce.exception.ResourceNotFoundException;
import com.backend.cctvecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(@org.springframework.lang.NonNull Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }
}
