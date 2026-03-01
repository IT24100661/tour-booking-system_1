package com.ISPteam.tour_booking_backend.controller;

import com.ISPteam.tour_booking_backend.dto.*;
import com.ISPteam.tour_booking_backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService auth;

    public AuthController(AuthService auth) {
        this.auth = auth;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
        return ResponseEntity.ok(auth.login(req));
    }

    @DeleteMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request) {
        auth.logout(request.getHeader("Authorization"));
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/verify-email/request")
    public ResponseEntity<Void> requestVerifyEmail(@Valid @RequestBody VerifyEmailRequest req) {
        auth.requestEmailVerification(req.email);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/verify-email")
    public ResponseEntity<Void> verifyEmail(@Valid @RequestBody VerifyEmailTokenRequest req) {
        auth.verifyEmail(req.token);
        return ResponseEntity.noContent().build();
    }

    // Optional but practical: request reset token
    @PostMapping("/password/reset/request")
    public ResponseEntity<Void> requestPasswordReset(@Valid @RequestBody PasswordResetRequestStart req) {
        auth.requestPasswordReset(req.email);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/password/reset")
    public ResponseEntity<Void> resetPassword(@Valid @RequestBody PasswordResetRequest req) {
        auth.resetPassword(req.token, req.newPassword);
        return ResponseEntity.noContent().build();
    }
}
