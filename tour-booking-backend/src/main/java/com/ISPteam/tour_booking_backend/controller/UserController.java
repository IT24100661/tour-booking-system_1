package com.ISPteam.tour_booking_backend.controller;

import com.ISPteam.tour_booking_backend.dto.*;
import com.ISPteam.tour_booking_backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService users;

    public UserController(UserService users) {
        this.users = users;
    }

    @PostMapping
    public ResponseEntity<com.ISPteam.tour_booking_backend.dto.UserResponse> createUser(@Valid @RequestBody RegisterRequest req) {
        return ResponseEntity.ok(users.register(req));
    }

    @GetMapping("/{id}")
    public ResponseEntity<com.ISPteam.tour_booking_backend.dto.UserResponse> getUser(@PathVariable Long id) {
        return ResponseEntity.ok(users.getUser(id));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<com.ISPteam.tour_booking_backend.dto.UserResponse> updateUser(@PathVariable Long id, @RequestBody UpdateUserRequest req) {
        return ResponseEntity.ok(users.updateUser(id, req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<com.ISPteam.tour_booking_backend.dto.UserResponse> replaceUser(@PathVariable Long id, @RequestBody UpdateUserRequest req) {
        return ResponseEntity.ok(users.updateUser(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        users.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
