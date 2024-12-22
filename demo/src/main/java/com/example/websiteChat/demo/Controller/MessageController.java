package com.example.websiteChat.demo.Controller;

import com.example.websiteChat.demo.DTO.MessageDTO;
import com.example.websiteChat.demo.Entity.Message;
import com.example.websiteChat.demo.Service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @Autowired
    private MessageService messageService;

    // API để lấy tin nhắn giữa hai người dùng
    @GetMapping("/{userId1}/{userId2}")
    public ResponseEntity<List<MessageDTO>> getMessagesBetweenUsers(
            @PathVariable Long userId1,
            @PathVariable Long userId2) {
        List<Message> messages = messageService.getMessagesBetweenUsers(userId1, userId2);
        List<MessageDTO> messageDTOs = messages.stream().map(MessageDTO::new).collect(Collectors.toList());
        return ResponseEntity.ok(messageDTOs);
    }

    // API để lấy tin nhắn trong một nhóm
    @GetMapping("/group/{groupId}")
    public ResponseEntity<List<MessageDTO>> getMessagesInGroup(@PathVariable Long groupId) {
        List<Message> messages = messageService.getMessagesInGroup(groupId);
        List<MessageDTO> messageDTOs = messages.stream().map(MessageDTO::new).collect(Collectors.toList());
        return ResponseEntity.ok(messageDTOs);
    }


}

