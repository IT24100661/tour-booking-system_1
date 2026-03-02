package com.ISPteam.tour_booking_backend.repo;

import com.ISPteam.tour_booking_backend.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByProviderIdOrderByCreatedAtDesc(Long providerId);

    List<Payment> findByCreatedAtBetween(Instant from, Instant to);

    List<Payment> findByCreatedAtBetweenAndStatus(Instant from, Instant to, Payment.Status status);
}
