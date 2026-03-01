package com.ISPteam.tour_booking_backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class PasswordResetRequestStart {
    @Email @NotBlank public String email;
}
