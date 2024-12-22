package com.example.websiteChat.demo.DTO;

import com.example.websiteChat.demo.Entity.ChatGroup;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatGroupDTO {
    private Long id;
    private String name;
    private String avatarUrl;
    private Set<UserDTO> members;

    public ChatGroupDTO(ChatGroup group) {
        this.id = group.getId();
        this.name = group.getName();
        this.avatarUrl = group.getAvatarUrl();
    }
}

