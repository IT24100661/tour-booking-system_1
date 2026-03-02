package com.ISPteam.tour_booking_backend.repo;

import com.ISPteam.tour_booking_backend.entity.TransactionHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionHistoryRepository extends JpaRepository<TransactionHistory, Long> {
    List<TransactionHistory> findByProviderIdOrderByCreatedAtDesc(Long providerId);
    boolean existsByPaymentId(Long paymentId);
}
