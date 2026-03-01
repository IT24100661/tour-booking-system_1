package com.ISPteam.tour_booking_backend.repo;

import com.ISPteam.tour_booking_backend.entity.GuideBookingRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface GuideBookingRequestRepository extends JpaRepository<GuideBookingRequest, Long> {
    List<GuideBookingRequest> findByGuideIdOrderByCreatedAtDesc(Long guideId);
}
