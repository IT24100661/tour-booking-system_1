package com.ISPteam.tour_booking_backend.repo;

import com.ISPteam.tour_booking_backend.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, Long> {}
