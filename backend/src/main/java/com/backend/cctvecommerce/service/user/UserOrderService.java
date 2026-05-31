package com.backend.cctvecommerce.service.user;

import com.backend.cctvecommerce.dto.user.OrderResponse;
import com.backend.cctvecommerce.dto.user.PlaceOrderRequest;
import com.backend.cctvecommerce.entity.CartItem;
import com.backend.cctvecommerce.entity.Order;
import com.backend.cctvecommerce.entity.OrderItem;
import com.backend.cctvecommerce.entity.Product;
import com.backend.cctvecommerce.entity.User;
import com.backend.cctvecommerce.exception.ResourceNotFoundException;
import com.backend.cctvecommerce.repository.CartItemRepository;
import com.backend.cctvecommerce.repository.OrderRepository;
import com.backend.cctvecommerce.repository.ProductRepository;
import com.backend.cctvecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserOrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new ResourceNotFoundException("Logged in user not found.");
        }
        return user;
    }

    public OrderResponse placeOrder(PlaceOrderRequest request) {
        User user = getCurrentUser();
        List<CartItem> cartItems = cartItemRepository.findByUser(user);

        if (cartItems.isEmpty()) {
            throw new IllegalArgumentException("Cannot place order with an empty cart");
        }

        Order order = new Order();
        order.setUser(user);
        order.setStatus("PENDING");
        order.setShippingAddress(request.getShippingAddress());
        order.setCity(request.getCity());
        order.setState(request.getState());
        order.setPostalCode(request.getPostalCode());
        order.setCountry(request.getCountry());
        order.setPhoneNumber(request.getPhoneNumber());
        order.setOrderDate(LocalDateTime.now());

        double totalAmount = 0;
        List<OrderItem> orderItems = new ArrayList<>();

        for (CartItem cartItem : cartItems) {
            Product product = cartItem.getProduct();
            if (product.getStock() < cartItem.getQuantity()) {
                throw new IllegalArgumentException("Insufficient stock for product: " + product.getName());
            }

            // Deduct stock
            product.setStock(product.getStock() - cartItem.getQuantity());
            productRepository.save(product);

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(product.getPrice());
            orderItems.add(orderItem);

            totalAmount += product.getPrice() * cartItem.getQuantity();
        }

        order.setOrderItems(orderItems);
        order.setTotalAmount(totalAmount);

        Order savedOrder = orderRepository.save(order);

        // Clear the cart
        cartItemRepository.deleteByUser(user);

        return convertToResponse(savedOrder);
    }

    public List<OrderResponse> getMyOrders() {
        User user = getCurrentUser();
        return orderRepository.findByUserOrderByOrderDateDesc(user).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public OrderResponse getOrderById(@org.springframework.lang.NonNull Long id) {
        User user = getCurrentUser();
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("You do not have permission to view this order.");
        }

        return convertToResponse(order);
    }

    public OrderResponse cancelOrder(@org.springframework.lang.NonNull Long id) {
        User user = getCurrentUser();
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("You do not have permission to cancel this order.");
        }

        if (!"PENDING".equalsIgnoreCase(order.getStatus())) {
            throw new IllegalArgumentException("Only PENDING orders can be cancelled.");
        }

        order.setStatus("CANCELLED");

        // Restore stock
        for (OrderItem item : order.getOrderItems()) {
            Product product = item.getProduct();
            product.setStock(product.getStock() + item.getQuantity());
            productRepository.save(product);
        }

        Order updatedOrder = orderRepository.save(order);
        return convertToResponse(updatedOrder);
    }

    private OrderResponse convertToResponse(Order order) {
        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        response.setUserId(order.getUser().getId());
        response.setUserEmail(order.getUser().getEmail());
        response.setTotalAmount(order.getTotalAmount());
        response.setStatus(order.getStatus());
        response.setShippingAddress(order.getShippingAddress());
        response.setCity(order.getCity());
        response.setState(order.getState());
        response.setPostalCode(order.getPostalCode());
        response.setCountry(order.getCountry());
        response.setPhoneNumber(order.getPhoneNumber());
        response.setOrderDate(order.getOrderDate());

        List<OrderResponse.OrderItemResponse> items = order.getOrderItems().stream()
                .map(item -> new OrderResponse.OrderItemResponse(
                        item.getId(),
                        item.getProduct().getId(),
                        item.getProduct().getName(),
                        item.getProduct().getImageUrl(),
                        item.getQuantity(),
                        item.getPrice()
                ))
                .collect(Collectors.toList());

        response.setItems(items);
        return response;
    }
}
