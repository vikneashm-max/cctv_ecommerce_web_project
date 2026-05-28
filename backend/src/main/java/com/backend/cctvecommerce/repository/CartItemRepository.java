package com.backend.cctvecommerce.repository;

import com.backend.cctvecommerce.entity.CartItem;
import com.backend.cctvecommerce.entity.User;
import com.backend.cctvecommerce.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUser(User user);
    List<CartItem> findByUserId(Long userId);
    Optional<CartItem> findByUserAndProduct(User user, Product product);
    Optional<CartItem> findByUserIdAndProductId(Long userId, Long productId);
    void deleteByUser(User user);
    void deleteByUserId(Long userId);
}
