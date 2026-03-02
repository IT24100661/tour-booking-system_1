package com.ISPteam.tour_booking_backend.repo;

import com.ISPteam.tour_booking_backend.entity.Review;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByTargetTypeAndTargetIdOrderByCreatedAtDesc(Review.TargetType targetType, Long targetId);

    List<Review> findByTargetTypeAndTargetIdAndStatusOrderByCreatedAtDesc(
            Review.TargetType targetType, Long targetId, Review.Status status);

    @Query("select avg(r.rating) from Review r where r.targetType=:t and r.targetId=:id and r.status='APPROVED'")
    Double avgApproved(@Param("t") Review.TargetType targetType, @Param("id") Long targetId);

    @Query("select count(r) from Review r where r.targetType=:t and r.targetId=:id and r.status='APPROVED'")
    Long countApproved(@Param("t") Review.TargetType targetType, @Param("id") Long targetId);
}
