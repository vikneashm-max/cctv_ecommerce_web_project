package com.backend.cctvecommerce.dto.admin;

public class AdminDashboardResponse {
    private Double totalSales;
    private Long totalOrders;
    private Long totalProducts;
    private Long totalUsers;

    public AdminDashboardResponse() {}

    public AdminDashboardResponse(Double totalSales, Long totalOrders, Long totalProducts, Long totalUsers) {
        this.totalSales = totalSales;
        this.totalOrders = totalOrders;
        this.totalProducts = totalProducts;
        this.totalUsers = totalUsers;
    }

    public Double getTotalSales() { return totalSales; }
    public void setTotalSales(Double totalSales) { this.totalSales = totalSales; }

    public Long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(Long totalOrders) { this.totalOrders = totalOrders; }

    public Long getTotalProducts() { return totalProducts; }
    public void setTotalProducts(Long totalProducts) { this.totalProducts = totalProducts; }

    public Long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(Long totalUsers) { this.totalUsers = totalUsers; }
}
