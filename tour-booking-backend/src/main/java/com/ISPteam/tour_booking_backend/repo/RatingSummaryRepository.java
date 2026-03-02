package com.ISPteam.tour_booking_backend.repo;

import com.ISPteam.tour_booking_backend.entity.RatingSummary;
import com.ISPteam.tour_booking_backend.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RatingSummaryRepository extends JpaRepository<RatingSummary, Long> {
    Optional<RatingSummary> findByTargetTypeAndTargetId(Review.TargetType targetType, Long targetId);
}
