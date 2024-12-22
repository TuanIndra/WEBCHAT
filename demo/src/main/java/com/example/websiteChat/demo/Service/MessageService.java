package com.example.websiteChat.demo.Service;

import com.example.websiteChat.demo.Entity.ChatGroup;
import com.example.websiteChat.demo.Entity.Message;
import com.example.websiteChat.demo.Entity.User;
import com.example.websiteChat.demo.Repository.ChatGroupRepository;
import com.example.websiteChat.demo.Repository.MessageRepository;
import com.example.websiteChat.demo.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class MessageService {

    @Autowired
    private ChatGroupRepository chatGroupRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    public Message saveMessage(Long senderId, Long receiverId, String content) {
        if (senderId == null || content == null) {
            throw new IllegalArgumentException("SenderId and content must not be null");
        }
        Message message = Message.builder()
                .sender(userRepository.findById(senderId).orElseThrow(() -> new IllegalArgumentException("Sender not found")))
                .receiver(receiverId != null ? userRepository.findById(receiverId).orElseThrow(() -> new IllegalArgumentException("Receiver not found")) : null) // Nếu không phải nhóm
                .content(content)
                .timestamp(LocalDateTime.now())
                .build();

        return messageRepository.save(message);
    }



    public List<Message> getMessagesBetweenUsers(Long userId1, Long userId2) {
        return messageRepository.findMessagesBetweenUsers(userId1, userId2);
    }

    public void saveGroupMessage(Long senderId, Long groupId, String content) {
        if (groupId == null) {
            throw new IllegalArgumentException("Group ID must not be null");
        }

        User sender = userRepository.findById(senderId).orElseThrow(() -> new IllegalArgumentException("User not found"));
        ChatGroup group = chatGroupRepository.findById(groupId).orElseThrow(() -> new IllegalArgumentException("Group not found"));

        Message message = Message.builder()
                .sender(sender)
                .chatGroup(group)
                .content(content)
                .timestamp(LocalDateTime.now())
                .build();

        messageRepository.save(message);
    }


    @Transactional
    public Set<Long> getGroupMemberIds(Long groupId) {
        return chatGroupRepository.findMemberIdsByGroupId(groupId);
    }

    // Lấy tin nhắn trong nhóm
    public List<Message> getMessagesInGroup(Long groupId) {
        return messageRepository.findByChatGroupId(groupId);
    }
}

