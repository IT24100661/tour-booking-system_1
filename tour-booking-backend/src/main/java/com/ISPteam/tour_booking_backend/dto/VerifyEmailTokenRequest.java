package com.ISPteam.tour_booking_backend.dto;

import jakarta.validation.constraints.NotBlank;

public class VerifyEmailTokenRequest {
    @NotBlank public String token;
}
