package com.example.websiteChat.demo.Controller;

import com.example.websiteChat.demo.DTO.LoginRequest;
import com.example.websiteChat.demo.DTO.LoginResponse;
import com.example.websiteChat.demo.DTO.RegisterRequest;
import com.example.websiteChat.demo.Entity.User;
import com.example.websiteChat.demo.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    // API đăng ký
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest request) {
        try {
            User user = userService.registerUser(request.getUsername(), request.getPassword(), request.getEmail(), request.getFullName());
            return ResponseEntity.ok(user);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // API đăng nhập
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest request) {
        try {
            User user = userService.authenticateUser(request.getUsername(), request.getPassword());

            // Tạo LoginResponse từ User
            LoginResponse response = new LoginResponse(
                    user.getId(),
                    user.getFullName(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getAvatarUrl()
            );

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}

