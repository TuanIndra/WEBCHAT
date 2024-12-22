package com.example.websiteChat.demo.DTO;

import com.example.websiteChat.demo.Entity.Message;

import java.time.LocalDateTime;

public class MessageDTO {
    private Long id;
    private Long senderId;
    private Long receiverId; // Dành cho tin nhắn cá nhân
    private Long groupId; // Dành cho tin nhắn nhóm
    private String content;
    private LocalDateTime timestamp;

    // Constructor
    public MessageDTO(Message message) {
        this.id = message.getId();
        this.senderId = message.getSender().getId();
        this.receiverId = message.getReceiver() != null ? message.getReceiver().getId() : null; // Null nếu là tin nhắn nhóm
        this.groupId = message.getChatGroup() != null ? message.getChatGroup().getId() : null; // Null nếu là tin nhắn cá nhân
        this.content = message.getContent();
        this.timestamp = message.getTimestamp();
    }

    // Getters
    public Long getId() {
        return id;
    }

    public Long getSenderId() {
        return senderId;
    }

    public Long getReceiverId() {
        return receiverId;
    }

    public Long getGroupId() {
        return groupId;
    }

    public String getContent() {
        return content;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }
}
