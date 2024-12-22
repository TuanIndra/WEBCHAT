package com.example.websiteChat.demo.Service;

import com.example.websiteChat.demo.DTO.UserDTO;
import com.example.websiteChat.demo.Entity.User;
import com.example.websiteChat.demo.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // Đăng ký người dùng mới
    public User registerUser(String username, String password, String email, String fullname) {
        if (userRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("Username already exists");
        }
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already exists");
        }

        User user = User.builder()
                .username(username)
                .password(passwordEncoder.encode(password))
                .email(email)
                .fullName(fullname)
                .avatarUrl("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVuA4Czn2bwWvgSIosgImnqN6ibf4ooRDQ5w&s")
                .build();

        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll(); // Lấy danh sách tất cả người dùng
    }

    // Đăng nhập người dùng
    public User authenticateUser(String username, String password) {
        Optional<User> optionalUser = userRepository.findByUsername(username);

        if (optionalUser.isEmpty()) {
            throw new IllegalArgumentException("Invalid username or password");
        }

        User user = optionalUser.get();
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new IllegalArgumentException("Invalid username or password");
        }

        return user;
    }

    public UserDTO getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Chuyển đổi từ User entity sang UserDTO
        return new UserDTO(
                user.getId(),
                user.getFullName(),
                user.getUsername(),
                user.getAvatarUrl()
        );
    }
}

