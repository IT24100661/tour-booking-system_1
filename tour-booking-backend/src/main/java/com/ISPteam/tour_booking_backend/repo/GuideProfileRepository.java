package com.ISPteam.tour_booking_backend.repo;

import com.ISPteam.tour_booking_backend.entity.GuideProfile;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GuideProfileRepository extends JpaRepository<GuideProfile, Long> {
    Optional<GuideProfile> findByUser_Id(Long userId);
    boolean existsByUser_Id(Long userId);
}
