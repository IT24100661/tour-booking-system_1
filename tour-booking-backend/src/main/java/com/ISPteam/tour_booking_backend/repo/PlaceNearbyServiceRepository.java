package com.ISPteam.tour_booking_backend.repo;

import com.ISPteam.tour_booking_backend.entity.PlaceNearbyService;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PlaceNearbyServiceRepository extends JpaRepository<PlaceNearbyService, Long> {
    List<PlaceNearbyService> findByPlaceId(Long placeId);
}
