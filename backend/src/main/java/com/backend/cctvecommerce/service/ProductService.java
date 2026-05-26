package com.backend.cctvecommerce.service;

import com.backend.cctvecommerce.entity.Product;
import com.backend.cctvecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.lang.NonNull;

import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(@NonNull Long id) {
        return productRepository.findById(id).orElse(null);
    }

    public Product createProduct(@NonNull Product product) {
        return productRepository.save(product);
    }

    public Product updateProduct(@NonNull Long id, @NonNull Product updatedProduct) {
        Product existingProduct = productRepository.findById(id).orElseThrow();

        existingProduct.setName(updatedProduct.getName());
        existingProduct.setDescription(updatedProduct.getDescription());
        existingProduct.setPrice(updatedProduct.getPrice());
        existingProduct.setStock(updatedProduct.getStock());
        existingProduct.setImageUrl(updatedProduct.getImageUrl());
        existingProduct.setCategory(updatedProduct.getCategory());

        return productRepository.save(existingProduct);
    }

    public void deleteProduct(@NonNull Long id) {
        productRepository.deleteById(id);
    }
}
