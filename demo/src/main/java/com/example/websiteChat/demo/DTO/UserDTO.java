package com.example.websiteChat.demo.DTO;

import com.example.websiteChat.demo.Entity.User;

public class UserDTO {
    private Long id;
    private String fullName;
    private String username;
    private String avatarUrl;

    // Constructors
    public UserDTO(Long id, String fullName, String username, String avatarUrl) {
        this.id = id;
        this.fullName = fullName;
        this.username = username;
        this.avatarUrl = avatarUrl;
    }

    public UserDTO(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.fullName = user.getFullName();
        this.avatarUrl = user.getAvatarUrl();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }
}

