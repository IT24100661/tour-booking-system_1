package com.ISPteam.tour_booking_backend.dto;

public class AuthResponse {
    public String token;
    public com.ISPteam.tour_booking_backend.dto.UserResponse user;

    public AuthResponse(String token, com.ISPteam.tour_booking_backend.dto.UserResponse user) {
        this.token = token;
        this.user = user;
    }
}
