package com.ISPteam.tour_booking_backend.dto;

public class DashboardDto {

    // ── Guide ──────────────────────────────────────
    public record GuideDashboard(
            Long userId,
            String name,
            String email,
            String location,
            String bio,
            Double ratingAvg,
            Long ratingCount,
            Double price,
            long pendingRequests,
            long totalBookings,
            boolean emailVerified
    ) {}

    // ── Hotel Owner ────────────────────────────────
    public record HotelDashboard(
            Long userId,
            String name,
            String email,
            String businessName,
            String address,
            String phone,
            String description,
            long pendingReservations,
            long totalReservations,
            boolean emailVerified
    ) {}

    // ── Admin ──────────────────────────────────────
    public record AdminDashboard(
            long totalUsers,
            long totalGuides,
            long totalHotelOwners,
            long totalTourists,
            long totalAdmins,
            long totalGuideProfiles,
            long totalHotelProfiles,
            long pendingReportedReviews,
            long totalBookings,
            long totalReservations
    ) {}
}
