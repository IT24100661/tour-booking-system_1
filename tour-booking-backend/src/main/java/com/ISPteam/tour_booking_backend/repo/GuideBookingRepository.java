package com.ISPteam.tour_booking_backend.repo;

import com.ISPteam.tour_booking_backend.entity.GuideBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface GuideBookingRepository extends JpaRepository<GuideBooking, Long> {
    List<GuideBooking> findByTouristIdOrderByCreatedAtDesc(Long touristId);
}
