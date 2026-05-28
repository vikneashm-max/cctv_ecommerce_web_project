package com.backend.cctvecommerce.service.admin;

import com.backend.cctvecommerce.dto.admin.AdminDashboardResponse;
import com.backend.cctvecommerce.entity.Order;
import com.backend.cctvecommerce.repository.OrderRepository;
import com.backend.cctvecommerce.repository.ProductRepository;
import com.backend.cctvecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminDashboardService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    public AdminDashboardResponse getDashboardStats() {
        List<Order> orders = orderRepository.findAll();
        
        double totalSales = orders.stream()
                .filter(order -> !"CANCELLED".equalsIgnoreCase(order.getStatus()))
                .mapToDouble(Order::getTotalAmount)
                .sum();
        
        long totalOrders = orders.size();
        long totalProducts = productRepository.count();
        long totalUsers = userRepository.count();

        return new AdminDashboardResponse(totalSales, totalOrders, totalProducts, totalUsers);
    }
}
