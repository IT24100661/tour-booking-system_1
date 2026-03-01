package com.ISPteam.tour_booking_backend.repo;

import com.ISPteam.tour_booking_backend.entity.GuideAvailability;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface GuideAvailabilityRepository extends JpaRepository<GuideAvailability, Long> {
    List<GuideAvailability> findByGuideIdOrderByStartAtAsc(Long guideId);
}
