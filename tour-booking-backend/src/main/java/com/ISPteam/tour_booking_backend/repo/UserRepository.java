package com.ISPteam.tour_booking_backend.repo;

import com.ISPteam.tour_booking_backend.entity.Role;
import com.ISPteam.tour_booking_backend.entity.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    long countByRole(Role role);
}
