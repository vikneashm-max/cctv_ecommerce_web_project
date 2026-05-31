package com.backend.cctvecommerce.dto.user;

import com.backend.cctvecommerce.entity.User;

public class AuthResponse {
    private String token;
    private String email;
    private String role;
    private Long userId;
    private Long id;
    private String fullName;
    private String profilePictureUrl;
    private String phoneNumber;
    private String address;
    private String city;
    private String state;
    private String postalCode;
    private String country;

    public AuthResponse() {}

    public AuthResponse(String token, String email, String role, Long userId, String fullName) {
        this.token = token;
        this.email = email;
        this.role = role;
        this.userId = userId;
        this.id = userId;
        this.fullName = fullName;
    }

    public AuthResponse(String token, User user) {
        this.token = token;
        this.email = user.getEmail();
        this.role = user.getRole();
        this.userId = user.getId();
        this.id = user.getId();
        this.fullName = user.getFullName();
        this.profilePictureUrl = user.getProfilePictureUrl();
        this.phoneNumber = user.getPhoneNumber();
        this.address = user.getAddress();
        this.city = user.getCity();
        this.state = user.getState();
        this.postalCode = user.getPostalCode();
        this.country = user.getCountry();
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

    public String getProfilePictureUrl() { return profilePictureUrl; }
    public void setProfilePictureUrl(String profilePictureUrl) { this.profilePictureUrl = profilePictureUrl; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getPostalCode() { return postalCode; }
    public void setPostalCode(String postalCode) { this.postalCode = postalCode; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
}
