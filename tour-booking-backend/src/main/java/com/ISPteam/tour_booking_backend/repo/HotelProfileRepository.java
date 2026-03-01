package com.ISPteam.tour_booking_backend.repo;

import com.ISPteam.tour_booking_backend.entity.HotelProfile;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HotelProfileRepository extends JpaRepository<HotelProfile, Long> {
    Optional<HotelProfile> findByUser_Id(Long userId);
    boolean existsByUser_Id(Long userId);
}
