package com.ISPteam.tour_booking_backend.controller;

import com.ISPteam.tour_booking_backend.dto.DashboardDto;
import com.ISPteam.tour_booking_backend.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService svc;

    public DashboardController(DashboardService svc) {
        this.svc = svc;
    }

    // Guide: only ROLE_GUIDE can call this
    @GetMapping("/guide")
    @PreAuthorize("hasRole('GUIDE')")
    public ResponseEntity<DashboardDto.GuideDashboard> guideDashboard(
            @AuthenticationPrincipal Jwt jwt) {
        Long uid = ((Number) jwt.getClaim("uid")).longValue();
        return ResponseEntity.ok(svc.guideDashboard(uid));
    }

    // Hotel owner: only ROLE_HOTEL_OWNER can call this
    @GetMapping("/hotel")
    @PreAuthorize("hasRole('HOTEL_OWNER')")
    public ResponseEntity<DashboardDto.HotelDashboard> hotelDashboard(
            @AuthenticationPrincipal Jwt jwt) {
        Long uid = ((Number) jwt.getClaim("uid")).longValue();
        return ResponseEntity.ok(svc.hotelDashboard(uid));
    }

    // Admin: only ROLE_ADMIN can call this
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DashboardDto.AdminDashboard> adminDashboard() {
        return ResponseEntity.ok(svc.adminDashboard());
    }
}
