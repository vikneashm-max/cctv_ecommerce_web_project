package com.backend.cctvecommerce.repository;

import com.backend.cctvecommerce.entity.Order;
import com.backend.cctvecommerce.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserOrderByOrderDateDesc(User user);
    List<Order> findByUserIdOrderByOrderDateDesc(Long userId);
    List<Order> findAllByOrderByOrderDateDesc();
}
