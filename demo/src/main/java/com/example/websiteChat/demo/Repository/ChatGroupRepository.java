package com.example.websiteChat.demo.Repository;

import com.example.websiteChat.demo.Entity.ChatGroup;
import com.example.websiteChat.demo.Entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface ChatGroupRepository extends JpaRepository<ChatGroup, Long> {



    // Tìm tất cả nhóm mà một user là thành viên
    @Query("SELECT g FROM ChatGroup g JOIN g.members m WHERE m.id = :userId")
    List<ChatGroup> findGroupsByUserId(@Param("userId") Long userId);

    @Query("SELECT m.id FROM ChatGroup c JOIN c.members m WHERE c.id = :groupId")
    Set<Long> findMemberIdsByGroupId(@Param("groupId") Long groupId);

    @Query("SELECT g FROM ChatGroup g JOIN FETCH g.members WHERE g.id = :groupId")
    Optional<ChatGroup> findGroupWithMembersById(@Param("groupId") Long groupId);
}

