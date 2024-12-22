package com.example.websiteChat.demo.Service;

import com.example.websiteChat.demo.DTO.ChatGroupDTO;
import com.example.websiteChat.demo.DTO.UserDTO;
import com.example.websiteChat.demo.Entity.ChatGroup;
import com.example.websiteChat.demo.Entity.User;
import com.example.websiteChat.demo.Repository.ChatGroupRepository;
import com.example.websiteChat.demo.Repository.MessageRepository;
import com.example.websiteChat.demo.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class GroupService {

    @Autowired
    private ChatGroupRepository chatGroupRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MessageRepository messageRepository;

    public ChatGroupDTO createGroupWithTwoUsers(Long userId, Long toUserId, String groupName) {
        // Lấy thông tin của hai user từ database
        User user1 = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
        User user2 = userRepository.findById(toUserId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + toUserId));

        // Thêm hai user làm thành viên nhóm
        Set<User> members = new HashSet<>();
        members.add(user1);
        members.add(user2);

        // Tạo nhóm
        ChatGroup chatGroup = ChatGroup.builder()
                .name(groupName)
                .members(members)
                .avatarUrl("https://cdn.tuoitre.vn/471584752817336320/2024/7/23/untitled-design-16-1721752343341236044249.png")
                .build();

        // Lưu nhóm vào database
        chatGroup = chatGroupRepository.save(chatGroup);

        // Chuyển đổi entity thành DTO
        return mapToDTO(chatGroup);
    }

    private ChatGroupDTO mapToDTO(ChatGroup chatGroup) {
        return new ChatGroupDTO(
                chatGroup.getId(),
                chatGroup.getName(),
                chatGroup.getAvatarUrl(),
                chatGroup.getMembers().stream()
                        .map(member -> new UserDTO(
                                member.getId(),
                                member.getFullName(),
                                member.getUsername(),
                                member.getAvatarUrl()
                        ))
                        .collect(Collectors.toSet())
        );
    }

    public List<ChatGroupDTO> getGroupsByUserId(Long userId) {
        List<ChatGroup> groups = chatGroupRepository.findGroupsByUserId(userId);
        return groups.stream()
                .map(ChatGroupDTO::new)
                .collect(Collectors.toList());
    }

    public List<UserDTO> searchUsers(String query) {
        List<User> users = userRepository.findByUsernameContainingIgnoreCaseOrFullNameContainingIgnoreCase(query, query);
        return users.stream().map(UserDTO::new).collect(Collectors.toList());
    }


    @Transactional
    public void addUserToGroup(Long groupId, Long userId, Long requestingUserId) {
        ChatGroup group = chatGroupRepository.findGroupWithMembersById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Group not found"));

        // Kiểm tra xem người yêu cầu có trong nhóm không
        boolean isRequesterMember = group.getMembers().stream()
                .anyMatch(member -> member.getId().equals(requestingUserId));

        if (!isRequesterMember) {
            throw new IllegalArgumentException("Only group members can add new members");
        }

        User userToAdd = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        group.getMembers().add(userToAdd);
        chatGroupRepository.save(group);
    }

    @Transactional
    public ChatGroup getGroupDetails(Long groupId) {
        return chatGroupRepository.findGroupWithMembersById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Group not found"));
    }

    @Transactional
    public List<UserDTO> getGroupMembers(Long groupId) {
        ChatGroup group = chatGroupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Group not found"));

        // Trả về danh sách UserDTO để đảm bảo không lặp dữ liệu
        return group.getMembers().stream()
                .map(UserDTO::new) // Chuyển đổi User sang UserDTO
                .collect(Collectors.toList());
    }

    public int countGroupMembers(Long groupId) {
        ChatGroup group = chatGroupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Group not found"));

        // Đếm số lượng thành viên trong nhóm
        return group.getMembers().size();
    }



}
