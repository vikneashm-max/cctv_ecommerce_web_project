package com.backend.cctvecommerce.dto.user;

import java.time.LocalDateTime;
import java.util.List;

public class OrderResponse {
    private Long id;
    private Long userId;
    private String userEmail;
    private Double totalAmount;
    private String status;
    private String shippingAddress;
    private String city;
    private String state;
    private String postalCode;
    private String country;
    private String phoneNumber;
    private LocalDateTime orderDate;
    private List<OrderItemResponse> items;

    public OrderResponse() {}

    public static class OrderItemResponse {
        private Long id;
        private Long productId;
        private String productName;
        private Integer quantity;
        private Double price;

        public OrderItemResponse() {}

        public OrderItemResponse(Long id, Long productId, String productName, Integer quantity, Double price) {
            this.id = id;
            this.productId = productId;
            this.productName = productName;
            this.quantity = quantity;
            this.price = price;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }

        public String getProductName() { return productName; }
        public void setProductName(String productName) { this.productName = productName; }

        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }

        public Double getPrice() { return price; }
        public void setPrice(Double price) { this.price = price; }
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getPostalCode() { return postalCode; }
    public void setPostalCode(String postalCode) { this.postalCode = postalCode; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public LocalDateTime getOrderDate() { return orderDate; }
    public void setOrderDate(LocalDateTime orderDate) { this.orderDate = orderDate; }

    public List<OrderItemResponse> getItems() { return items; }
    public void setItems(List<OrderItemResponse> items) { this.items = items; }
}
