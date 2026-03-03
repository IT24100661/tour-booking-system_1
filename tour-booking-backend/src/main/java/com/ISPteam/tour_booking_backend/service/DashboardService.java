package com.ISPteam.tour_booking_backend.service;

import com.ISPteam.tour_booking_backend.dto.DashboardDto;
import com.ISPteam.tour_booking_backend.entity.*;
import com.ISPteam.tour_booking_backend.repo.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class DashboardService {

    private final UserRepository users;
    private final GuideProfileRepository guides;
    private final HotelProfileRepository hotels;
    private final GuideBookingRepository guideBookings;
    private final HotelReservationRepository hotelReservations;
    private final ReviewReportRepository reviewReports;

    public DashboardService(
            UserRepository users,
            GuideProfileRepository guides,
            HotelProfileRepository hotels,
            GuideBookingRepository guideBookings,
            HotelReservationRepository hotelReservations,
            ReviewReportRepository reviewReports
    ) {
        this.users = users;
        this.guides = guides;
        this.hotels = hotels;
        this.guideBookings = guideBookings;
        this.hotelReservations = hotelReservations;
        this.reviewReports = reviewReports;
    }

    // ── Guide Dashboard ─────────────────────────────────────────────────────
    public DashboardDto.GuideDashboard guideDashboard(Long userId) {
        User u = users.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        GuideProfile gp = guides.findById(userId).orElse(null);

        long pending = guideBookings.countByGuideIdAndStatus(userId, "PENDING");
        long total   = guideBookings.countByGuideId(userId);

        return new DashboardDto.GuideDashboard(
                u.getId(),
                u.getName(),
                u.getEmail(),
                gp != null ? gp.getLocation()   : null,
                gp != null ? gp.getBio()         : null,
                gp != null ? gp.getRatingAvg()   : 0.0,
                gp != null ? gp.getRatingCount()  : 0L,
                gp != null ? gp.getPrice()        : null,
                pending,
                total,
                u.isEmailVerified()
        );
    }

    // ── Hotel Owner Dashboard ───────────────────────────────────────────────
    public DashboardDto.HotelDashboard hotelDashboard(Long userId) {
        User u = users.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        HotelProfile hp = hotels.findById(userId).orElse(null);

        long pending = hotelReservations.countByOwnerIdAndStatus(userId, "PENDING");
        long total   = hotelReservations.countByOwnerId(userId);

        return new DashboardDto.HotelDashboard(
                u.getId(),
                u.getName(),
                u.getEmail(),
                hp != null ? hp.getBusinessName() : null,
                hp != null ? hp.getAddress()       : null,
                hp != null ? hp.getPhone()         : null,
                hp != null ? hp.getDescription()   : null,
                pending,
                total,
                u.isEmailVerified()
        );
    }

    // ── Admin Dashboard ─────────────────────────────────────────────────────
    public DashboardDto.AdminDashboard adminDashboard() {
        return new DashboardDto.AdminDashboard(
                users.count(),
                users.countByRole(Role.GUIDE),
                users.countByRole(Role.HOTEL_OWNER),
                users.countByRole(Role.TOURIST),
                users.countByRole(Role.ADMIN),
                guides.count(),
                hotels.count(),
                reviewReports.countByResolvedAtIsNull(),
                guideBookings.count(),
                hotelReservations.count()
        );
    }
}
