package com.ISPteam.tour_booking_backend.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
public class PaymentNotificationController {

    // POST /api/notifications/payments
    @PostMapping("/payments")
    public void notifyPayment(@RequestBody PaymentNotificationRequest req) {
        // TODO: integrate with your EmailService/Notification table
        // For now: keep as a "hook" endpoint so frontend can call it.
    }

    public static class PaymentNotificationRequest {
        public Long bookingId;
        public Long paymentId;
        public Long touristId;
        public Long providerId;
        public String message;
    }
}
