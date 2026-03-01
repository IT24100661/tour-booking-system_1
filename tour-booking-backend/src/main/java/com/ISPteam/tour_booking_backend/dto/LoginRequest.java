package com.ISPteam.tour_booking_backend.dto;

import jakarta.validation.constraints.*;

public class LoginRequest {
    @Email @NotBlank public String email;
    @NotBlank public String password;
}
