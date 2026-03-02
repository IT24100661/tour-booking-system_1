package com.ISPteam.tour_booking_backend.controller;

import com.ISPteam.tour_booking_backend.entity.Payment;
import com.ISPteam.tour_booking_backend.service.PaymentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    // POST /api/payments
    @PostMapping("/payments")
    public Payment create(@RequestBody Payment body) {
        return paymentService.create(body);
    }

    // GET /api/payments?providerId=
    @GetMapping("/payments")
    public List<Payment> list(@RequestParam(required = false) Long providerId) {
        return paymentService.listByProvider(providerId);
    }

    // PATCH /api/payments/{id} (status SUCCESS/FAILED/REFUNDED)
    @PatchMapping("/payments/{id}")
    public Payment update(@PathVariable Long id, @RequestBody PaymentUpdateRequest req) {
        Payment.Status st = req.status != null ? Payment.Status.valueOf(req.status) : null;
        return paymentService.updateStatus(id, st);
    }

    // DELETE /api/payments/{id} (rare)
    @DeleteMapping("/payments/{id}")
    public void delete(@PathVariable Long id) {
        paymentService.delete(id);
    }

    public static class PaymentUpdateRequest {
        public String status;
    }
}
