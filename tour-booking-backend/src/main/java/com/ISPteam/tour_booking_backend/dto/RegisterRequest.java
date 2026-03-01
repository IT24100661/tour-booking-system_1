package com.ISPteam.tour_booking_backend.dto;

import com.ISPteam.tour_booking_backend.entity.Role;
import jakarta.validation.constraints.*;

public class RegisterRequest {
    @NotBlank public String name;
    @Email @NotBlank public String email;
    @Size(min=6) @NotBlank public String password;
    @NotNull public Role role;
    public String phone;
}
