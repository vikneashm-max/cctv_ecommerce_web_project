package com.backend.cctvecommerce.service.admin;

import com.backend.cctvecommerce.dto.user.OrderResponse;
import com.backend.cctvecommerce.entity.Order;
import com.backend.cctvecommerce.exception.ResourceNotFoundException;
import com.backend.cctvecommerce.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminOrderService {

    @Autowired
    private OrderRepository orderRepository;

    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAllByOrderByOrderDateDesc().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public OrderResponse getOrderById(@org.springframework.lang.NonNull Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
        return convertToResponse(order);
    }

    public OrderResponse updateOrderStatus(@org.springframework.lang.NonNull Long id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
        order.setStatus(status.toUpperCase());
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
                        item.getQuantity(),
                        item.getPrice()
                ))
                .collect(Collectors.toList());
        
        response.setItems(items);
        return response;
    }
}
