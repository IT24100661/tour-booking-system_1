package com.ISPteam.tour_booking_backend.repo;

import com.ISPteam.tour_booking_backend.entity.BookingHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingHistoryRepository extends JpaRepository<BookingHistory, Long> {
    List<BookingHistory> findByBookingIdOrderByCreatedAtDesc(Long bookingId);
}
