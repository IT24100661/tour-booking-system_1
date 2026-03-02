package com.ISPteam.tour_booking_backend.repo;

import com.ISPteam.tour_booking_backend.entity.Place;
import com.ISPteam.tour_booking_backend.entity.PlaceCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PlaceRepository extends JpaRepository<Place, Long> {
    List<Place> findByCategory(PlaceCategory category);
    List<Place> findByLocationIgnoreCase(String location);
}
