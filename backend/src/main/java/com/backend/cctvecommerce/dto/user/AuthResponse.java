package com.backend.cctvecommerce.dto.user;

public class AuthResponse {
    private String token;
    private String email;
    private String role;
    private Long userId;
    private Long id;
    private String fullName;

    public AuthResponse(String token, String email, String role, Long userId, String fullName) {
        this.token = token;
        this.email = email;
        this.role = role;
        this.userId = userId;
        this.id = userId;
        this.fullName = fullName;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
}
