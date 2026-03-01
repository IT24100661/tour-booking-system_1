package com.ISPteam.tour_booking_backend.service;

import com.ISPteam.tour_booking_backend.dto.*;
import com.ISPteam.tour_booking_backend.entity.User;
import com.ISPteam.tour_booking_backend.repo.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository users;
    private final PasswordEncoder encoder;

    public UserService(UserRepository users, PasswordEncoder encoder) {
        this.users = users;
        this.encoder = encoder;
    }

    public UserResponse register(RegisterRequest req) {
        String email = req.email == null ? null : req.email.trim().toLowerCase();

        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email is required");
        }

        if (users.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already used");
        }

        User u = new User();
        u.setName(req.name);
        u.setEmail(email);

        // Correct place to encode password:
        u.setPasswordHash(encoder.encode(req.password)); // BCrypt string should start with $2...

        u.setRole(req.role);
        u.setPhone(req.phone);

        users.save(u);
        return toResponse(u);
    }

    public User getByIdOrThrow(Long id) {
        return users.findById(id).orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    public UserResponse getUser(Long id) {
        return toResponse(getByIdOrThrow(id));
    }

    public UserResponse updateUser(Long id, UpdateUserRequest req) {
        User u = getByIdOrThrow(id);
        if (req.name != null) u.setName(req.name);
        if (req.phone != null) u.setPhone(req.phone);
        users.save(u);
        return toResponse(u);
    }

    public void deleteUser(Long id) {
        users.deleteById(id);
    }

    public static UserResponse toResponse(User u) {
        return new UserResponse(u.getId(), u.getName(), u.getEmail(), u.getRole(), u.getPhone(), u.isEmailVerified());
    }
}
