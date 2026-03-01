package com.ISPteam.tour_booking_backend.repo;

import com.ISPteam.tour_booking_backend.entity.HotelProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface HotelProfileRepository extends JpaRepository<HotelProfile, Long> {
    boolean existsByUser_Id(Long userId);
    Optional<HotelProfile> findByUser_Id(Long userId);
}
