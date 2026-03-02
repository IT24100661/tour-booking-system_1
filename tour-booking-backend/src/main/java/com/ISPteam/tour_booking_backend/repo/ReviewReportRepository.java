package com.ISPteam.tour_booking_backend.repo;

import com.ISPteam.tour_booking_backend.entity.ReviewReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReviewReportRepository extends JpaRepository<ReviewReport, Long> {
    List<ReviewReport> findByReviewIdOrderByCreatedAtDesc(Long reviewId);

    @Query("select distinct rr.reviewId from ReviewReport rr")
    List<Long> findDistinctReportedReviewIds();
}
