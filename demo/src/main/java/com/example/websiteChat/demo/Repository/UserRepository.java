package com.example.websiteChat.demo.Repository;

import com.example.websiteChat.demo.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Tìm user theo username
    Optional<User> findByUsername(String username);

    List<User> findByUsernameContainingIgnoreCaseOrFullNameContainingIgnoreCase(String username, String fullName);

    // Kiểm tra xem username đã tồn tại chưa
    boolean existsByUsername(String username);

    // Kiểm tra xem email đã tồn tại chưa
    boolean existsByEmail(String email);
}

