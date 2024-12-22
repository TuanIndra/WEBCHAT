package com.example.websiteChat.demo.Handler;

import com.example.websiteChat.demo.Service.MessageService;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class ChatHandler extends TextWebSocketHandler {

    private final ConcurrentHashMap<Long, WebSocketSession> userSessions = new ConcurrentHashMap<>();
    private final ObjectMapper objectMapper;

    @Autowired
    private MessageService messageService;

    @Autowired
    public ChatHandler(MessageService messageService) {
        this.messageService = messageService;
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule()); // Đăng ký module
        this.objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        System.out.println("WebSocket session started: " + session.getId());
        Long userId = getUserIdFromSession(session);
        System.out.println("Attempting connection for userId: " + userId);

        if (userId == null) {
            try {
                session.close(CloseStatus.BAD_DATA);
                System.out.println("Connection closed: userId is null");
            } catch (Exception e) {
                e.printStackTrace();
            }
            return;
        }

        userSessions.put(userId, session);
        System.out.println("Connection established for userId: " + userId);
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
        System.err.println("Transport error: " + exception.getMessage());
        exception.printStackTrace();
    }

    private void handleDirectMessage(WebSocketSession session, ChatMessage chatMessage) throws Exception {
        if (chatMessage.getReceiverId() == null) {
            throw new IllegalArgumentException("Receiver ID must not be null for direct messages");
        }

        chatMessage.setTimestamp(LocalDateTime.now()); // Gắn timestamp hiện tại

        // Lưu tin nhắn vào cơ sở dữ liệu
        messageService.saveMessage(
                chatMessage.getSenderId(),
                chatMessage.getReceiverId(),
                chatMessage.getContent()
        );

        // Gửi tin nhắn tới người nhận
        WebSocketSession receiverSession = userSessions.get(chatMessage.getReceiverId());
        if (receiverSession != null && receiverSession.isOpen()) {
            receiverSession.sendMessage(new TextMessage(objectMapper.writeValueAsString(chatMessage)));
        }

        // Gửi phản hồi tới chính người gửi để cập nhật giao diện
        session.sendMessage(new TextMessage(objectMapper.writeValueAsString(chatMessage)));
    }



    private void handleGroupMessage(WebSocketSession session, ChatMessage chatMessage) throws Exception {
        if (chatMessage.getGroupId() == null) {
            throw new IllegalArgumentException("Group ID must not be null for group messages");
        }

        chatMessage.setTimestamp(LocalDateTime.now()); // Gắn timestamp hiện tại

        // Lưu tin nhắn vào cơ sở dữ liệu
        messageService.saveGroupMessage(chatMessage.getSenderId(), chatMessage.getGroupId(), chatMessage.getContent());

        // Lấy tất cả thành viên trong nhóm
        Set<Long> groupMemberIds = messageService.getGroupMemberIds(chatMessage.getGroupId());

        for (Long memberId : groupMemberIds) {
            // Bỏ qua người gửi
            if (!memberId.equals(chatMessage.getSenderId())) {
                WebSocketSession memberSession = userSessions.get(memberId);
                if (memberSession != null && memberSession.isOpen()) {
                    memberSession.sendMessage(new TextMessage(objectMapper.writeValueAsString(chatMessage)));
                }
            }
        }

        // Gửi phản hồi tới chính người gửi
        session.sendMessage(new TextMessage(objectMapper.writeValueAsString(chatMessage)));
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        try {
            // Deserialize payload
            ChatMessage chatMessage = objectMapper.readValue(message.getPayload(), ChatMessage.class);

            if (chatMessage.getGroupId() != null) {
                // Tin nhắn nhóm
                handleGroupMessage(session, chatMessage);
            } else if (chatMessage.getReceiverId() != null) {
                // Tin nhắn cá nhân
                handleDirectMessage(session, chatMessage);
            } else {
                throw new IllegalArgumentException("Invalid message format: Missing receiverId or groupId");
            }
        } catch (Exception e) {
            e.printStackTrace();
            session.close(CloseStatus.SERVER_ERROR);
        }
    }


    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        Long userId = getUserIdFromSession(session);
        if (userId != null) {
            userSessions.remove(userId);
            System.out.println("Connection closed for user: " + userId);
        }
    }

    private Long getUserIdFromSession(WebSocketSession session) {
        try {
            URI uri = session.getUri();
            if (uri != null && uri.getQuery() != null) {
                String query = uri.getQuery();
                if (query.startsWith("userId=")) {
                    return Long.parseLong(query.split("=")[1]);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public static class ChatMessage {
        private Long senderId;
        private Long receiverId;
        private Long groupId;
        private String content;
        private LocalDateTime timestamp;

        // Constructor mặc định (cần thiết để Jackson deserialize)
        public ChatMessage() {
        }

        public ChatMessage(Long senderId, Long receiverId, String content, LocalDateTime timestamp) {
            this.senderId = senderId;
            this.receiverId = receiverId;
            this.content = content;
            this.timestamp = timestamp;
        }

        public Long getSenderId() {
            return senderId;
        }

        public void setSenderId(Long senderId) {
            this.senderId = senderId;
        }

        public Long getReceiverId() {
            return receiverId;
        }

        public Long getGroupId() {
            return groupId;
        }

        public void setGroupId(Long groupId) {
            this.groupId = groupId;
        }

        public void setReceiverId(Long receiverId) {
            this.receiverId = receiverId;
        }

        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
        }

        public LocalDateTime getTimestamp() {
            return timestamp;
        }

        public void setTimestamp(LocalDateTime timestamp) {
            this.timestamp = timestamp;
        }


        @Override
        public String toString() {
            return "ChatMessage{" +
                    "senderId=" + senderId +
                    ", receiverId=" + receiverId +
                    ", groupId=" + groupId +
                    ", content='" + content + '\'' +
                    ", timestamp=" + timestamp +
                    '}';
        }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class GroupChatMessage {
        private Long senderId;
        private Long groupId;
        private String content;
        private LocalDateTime timestamp;

        // Constructor, Getter và Setter
        public GroupChatMessage() {}

        public GroupChatMessage(Long senderId, Long groupId, String content, LocalDateTime timestamp) {
            this.senderId = senderId;
            this.groupId = groupId;
            this.content = content;
            this.timestamp = timestamp;
        }

        public Long getSenderId() {
            return senderId;
        }

        public void setSenderId(Long senderId) {
            this.senderId = senderId;
        }

        public Long getGroupId() {
            return groupId;
        }

        public void setGroupId(Long groupId) {
            this.groupId = groupId;
        }

        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
        }

        public LocalDateTime getTimestamp() {
            return timestamp;
        }

        public void setTimestamp(LocalDateTime timestamp) {
            this.timestamp = timestamp;
        }

        @Override
        public String toString() {
            return "GroupChatMessage{" +
                    "senderId=" + senderId +
                    ", groupId=" + groupId +
                    ", content='" + content + '\'' +
                    ", timestamp=" + timestamp +
                    '}';
        }
    }


}