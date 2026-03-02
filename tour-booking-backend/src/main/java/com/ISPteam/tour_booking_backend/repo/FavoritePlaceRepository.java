package com.ISPteam.tour_booking_backend.repo;

import com.ISPteam.tour_booking_backend.entity.FavoritePlace;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FavoritePlaceRepository extends JpaRepository<FavoritePlace, Long> {
    boolean existsByUserIdAndPlaceId(Long userId, Long placeId);
    List<FavoritePlace> findByUserIdOrderByCreatedAtDesc(Long userId);
    void deleteByUserIdAndPlaceId(Long userId, Long placeId);
}
