package com.ISPteam.tour_booking_backend.repo;

import com.ISPteam.tour_booking_backend.entity.RevokedToken;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RevokedTokenRepository extends JpaRepository<RevokedToken, Long> {
    boolean existsByJti(String jti);
    Optional<RevokedToken> findByJti(String jti);
}
