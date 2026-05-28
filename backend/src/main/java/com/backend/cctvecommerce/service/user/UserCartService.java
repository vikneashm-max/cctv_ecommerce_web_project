package com.backend.cctvecommerce.service.user;

import com.backend.cctvecommerce.dto.user.CartItemDto;
import com.backend.cctvecommerce.dto.user.UserCartResponse;
import com.backend.cctvecommerce.entity.CartItem;
import com.backend.cctvecommerce.entity.Product;
import com.backend.cctvecommerce.entity.User;
import com.backend.cctvecommerce.exception.ResourceNotFoundException;
import com.backend.cctvecommerce.repository.CartItemRepository;
import com.backend.cctvecommerce.repository.ProductRepository;
import com.backend.cctvecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserCartService {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    private @org.springframework.lang.NonNull User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new ResourceNotFoundException("Logged in user not found in database.");
        }
        return user;
    }

    public UserCartResponse getCart() {
        User user = getCurrentUser();
        List<CartItem> items = cartItemRepository.findByUser(user);
        
        List<CartItemDto> itemDtos = items.stream().map(item -> new CartItemDto(
                item.getId(),
                item.getProduct().getId(),
                item.getProduct().getName(),
                item.getProduct().getPrice(),
                item.getProduct().getImageUrl(),
                item.getQuantity()
        )).collect(Collectors.toList());

        double totalAmount = items.stream()
                .mapToDouble(item -> item.getProduct().getPrice() * item.getQuantity())
                .sum();

        return new UserCartResponse(itemDtos, totalAmount);
    }

    public UserCartResponse addItemToCart(@org.springframework.lang.NonNull Long productId, Integer quantity) {
        User user = getCurrentUser();
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        Optional<CartItem> existingItemOpt = cartItemRepository.findByUserAndProduct(user, product);
        
        if (existingItemOpt.isPresent()) {
            CartItem item = existingItemOpt.get();
            item.setQuantity(item.getQuantity() + quantity);
            cartItemRepository.save(item);
        } else {
            CartItem item = new CartItem();
            item.setUser(user);
            item.setProduct(product);
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        }

        return getCart();
    }

    public UserCartResponse updateItemQuantity(@org.springframework.lang.NonNull Long cartItemId, Integer quantity) {
        User user = getCurrentUser();
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + cartItemId));

        if (!cartItem.getUser().getId().equals(user.getId())) {
            throw new org.springframework.security.access.AccessDeniedException("You do not own this cart item.");
        }

        if (quantity <= 0) {
            cartItemRepository.delete(cartItem);
        } else {
            cartItem.setQuantity(quantity);
            cartItemRepository.save(cartItem);
        }

        return getCart();
    }

    public UserCartResponse removeItemFromCart(@org.springframework.lang.NonNull Long cartItemId) {
        User user = getCurrentUser();
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + cartItemId));

        if (!cartItem.getUser().getId().equals(user.getId())) {
            throw new org.springframework.security.access.AccessDeniedException("You do not own this cart item.");
        }

        cartItemRepository.delete(cartItem);
        return getCart();
    }

    public void clearCart() {
        User user = getCurrentUser();
        cartItemRepository.deleteByUser(user);
    }
}
