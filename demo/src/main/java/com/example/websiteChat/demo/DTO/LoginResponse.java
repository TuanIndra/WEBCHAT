package com.example.websiteChat.demo.DTO;

public class LoginResponse {
    private Long userId;
    private String fullName;
    private String username;
    private String email;
    private String avatarUrl;

    // Constructor
    public LoginResponse(Long userId, String fullName, String username, String email, String avatarUrl) {
        this.userId = userId;
        this.fullName = fullName;
        this.username = username;
        this.email = email;
        this.avatarUrl = avatarUrl;
    }

    // Getters và Setters
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }
}
