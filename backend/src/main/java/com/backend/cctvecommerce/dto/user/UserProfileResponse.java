package com.backend.cctvecommerce.dto.user;

public class UserProfileResponse {
    private Long id;
    private String fullName;
    private String email;
    private String role;
    private String phoneNumber;
    private String address;
    private String city;
    private String state;
    private String postalCode;
    private String country;

    public UserProfileResponse() {}

    public UserProfileResponse(Long id, String fullName, String email, String role, String phoneNumber, 
                              String address, String city, String state, String postalCode, String country) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.city = city;
        this.state = state;
        this.postalCode = postalCode;
        this.country = country;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

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
