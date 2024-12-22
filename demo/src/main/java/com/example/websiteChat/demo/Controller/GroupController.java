package com.example.websiteChat.demo.Controller;

import com.example.websiteChat.demo.DTO.ChatGroupDTO;
import com.example.websiteChat.demo.DTO.UserDTO;
import com.example.websiteChat.demo.Entity.ChatGroup;
import com.example.websiteChat.demo.Service.GroupService;
import com.example.websiteChat.demo.Service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat-groups")
public class GroupController {

    @Autowired
    private GroupService groupService;

    @Autowired
    private MessageService messageService;

    @PostMapping("/create")
    public ResponseEntity<ChatGroupDTO> createGroup(
            @RequestParam Long userId,
            @RequestParam Long toUserId,
            @RequestParam String groupName) {
        ChatGroupDTO chatGroupDTO = groupService.createGroupWithTwoUsers(userId, toUserId, groupName);
        return ResponseEntity.ok(chatGroupDTO);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ChatGroupDTO>> getGroupsByUserId(@PathVariable Long userId) {
        List<ChatGroupDTO> groups = groupService.getGroupsByUserId(userId);
        return ResponseEntity.ok(groups);
    }

    // Tìm kiếm người dùng
    @GetMapping("/search-users")
    public ResponseEntity<List<UserDTO>> searchUsers(@RequestParam String query) {
        List<UserDTO> userDTOs = groupService.searchUsers(query);
        return ResponseEntity.ok(userDTOs);
    }


    // Lấy thông tin nhóm theo ID
    @GetMapping("/{groupId}")
    public ResponseEntity<ChatGroup> getGroupDetails(@PathVariable Long groupId) {
        ChatGroup group = groupService.getGroupDetails(groupId);
        return ResponseEntity.ok(group);
    }

    // Thêm người dùng vào nhóm
    @PostMapping("/{groupId}/add-user")
    public ResponseEntity<String> addUserToGroup(
            @PathVariable Long groupId,
            @RequestParam Long userId,
            @RequestParam Long requestingUserId) {
        groupService.addUserToGroup(groupId, userId, requestingUserId);
        return ResponseEntity.ok("User added to group successfully");
    }

    @GetMapping("/groups/{groupId}/members")
    public ResponseEntity<List<UserDTO>> getGroupMembers(@PathVariable Long groupId) {
        List<UserDTO> members = groupService.getGroupMembers(groupId);
        return ResponseEntity.ok(members);
    }

    @GetMapping("/groups/{groupId}/member-count")
    public ResponseEntity<Integer> getGroupMemberCount(@PathVariable Long groupId) {
        int memberCount = groupService.countGroupMembers(groupId);
        return ResponseEntity.ok(memberCount);
    }

}
