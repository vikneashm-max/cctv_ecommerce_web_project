package com.backend.cctvecommerce.dto.user;

import java.util.List;

public class UserCartResponse {
    private List<CartItemDto> items;
    private Double totalAmount;

    public UserCartResponse() {}

    public UserCartResponse(List<CartItemDto> items, Double totalAmount) {
        this.items = items;
        this.totalAmount = totalAmount;
    }

    public List<CartItemDto> getItems() { return items; }
    public void setItems(List<CartItemDto> items) { this.items = items; }

    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }
}
