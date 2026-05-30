package com.backend.cctvecommerce.service.admin;

import com.backend.cctvecommerce.entity.Product;
import com.backend.cctvecommerce.exception.ResourceNotFoundException;
import com.backend.cctvecommerce.repository.ProductRepository;
import com.backend.cctvecommerce.dto.admin.AdminProductRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public @org.springframework.lang.NonNull Product getProductById(@org.springframework.lang.NonNull Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }

    public Product createProduct(AdminProductRequest request) {
        Product product = new Product();
        updateProductFields(product, request);
        return productRepository.save(product);
    }

    public Product updateProduct(@org.springframework.lang.NonNull Long id, AdminProductRequest request) {
        Product product = getProductById(id);
        updateProductFields(product, request);
        return productRepository.save(product);
    }

    public void deleteProduct(@org.springframework.lang.NonNull Long id) {
        Product product = getProductById(id);
        productRepository.delete(product);
    }

    private void validateImageUrl(String imageUrl) {
        if (imageUrl == null || imageUrl.trim().isEmpty()) {
            throw new IllegalArgumentException("Product image URL is required");
        }
        if (!imageUrl.startsWith("http://") && !imageUrl.startsWith("https://")) {
            throw new IllegalArgumentException("Product image URL must start with http:// or https://");
        }
    }

    private void updateProductFields(Product product, AdminProductRequest request) {
        validateImageUrl(request.getImageUrl());
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setImageUrl(request.getImageUrl());
        product.setBrand(request.getBrand());
        product.setCategory(request.getCategory());
        product.setShippingTax(request.getShippingTax() != null ? request.getShippingTax() : 0.0);
        product.setGst(request.getGst() != null ? request.getGst() : 0.0);
    }
}
