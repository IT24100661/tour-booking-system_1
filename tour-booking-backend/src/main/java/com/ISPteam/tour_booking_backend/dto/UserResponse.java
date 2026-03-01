package com.ISPteam.tour_booking_backend.dto;

import com.ISPteam.tour_booking_backend.entity.Role;

public class UserResponse {
    public Long id;
    public String name;
    public String email;
    public Role role;
    public String phone;
    public boolean emailVerified;

    public UserResponse(Long id, String name, String email, Role role, String phone, boolean emailVerified) {
        this.id = id; this.name = name; this.email = email; this.role = role; this.phone = phone; this.emailVerified = emailVerified;
    }
}
