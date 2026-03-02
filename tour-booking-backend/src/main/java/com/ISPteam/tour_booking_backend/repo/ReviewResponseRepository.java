package com.ISPteam.tour_booking_backend.repo;

import com.ISPteam.tour_booking_backend.entity.ReviewResponse;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewResponseRepository extends JpaRepository<ReviewResponse, Long> {
    List<ReviewResponse> findByReviewIdOrderByCreatedAtAsc(Long reviewId);
}
