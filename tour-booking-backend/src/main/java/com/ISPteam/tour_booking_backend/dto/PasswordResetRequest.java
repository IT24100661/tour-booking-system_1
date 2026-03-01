package com.ISPteam.tour_booking_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class PasswordResetRequest {
    @NotBlank public String token;
    @NotBlank @Size(min=6) public String newPassword;
}
