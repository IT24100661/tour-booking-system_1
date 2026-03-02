package com.ISPteam.tour_booking_backend.repo;

import com.ISPteam.tour_booking_backend.entity.RoomAvailability;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface RoomAvailabilityRepository extends JpaRepository<RoomAvailability, Long> {
    List<RoomAvailability> findByRoomTypeIdAndFromDateLessThanEqualAndToDateGreaterThanEqual(
            Long roomTypeId, LocalDate checkIn, LocalDate checkOut
    );
}
