package com.ISPteam.tour_booking_backend.controller;

import com.ISPteam.tour_booking_backend.entity.Payment;
import com.ISPteam.tour_booking_backend.service.PaymentService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminPaymentController {

    private final PaymentService paymentService;

    public AdminPaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    // GET /api/admin/payments?from=YYYY-MM-DD&to=YYYY-MM-DD&status=
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/payments")
    public List<Payment> search(
            @RequestParam String from,
            @RequestParam String to,
            @RequestParam(required = false) String status
    ) {
        Instant fromI = LocalDate.parse(from).atStartOfDay(ZoneId.systemDefault()).toInstant();
        Instant toI = LocalDate.parse(to).plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant();

        Payment.Status st = (status == null || status.isBlank()) ? null : Payment.Status.valueOf(status);
        return paymentService.adminSearch(fromI, toI, st);
    }

    // PATCH /api/admin/payments/{id} (flags)
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/payments/{id}")
    public Payment updateFlags(@PathVariable Long id, @RequestBody AdminPaymentUpdateRequest req) {
        return paymentService.adminUpdateFlags(id, req.suspicious, req.locked);
    }

    public static class AdminPaymentUpdateRequest {
        public Boolean suspicious;
        public Boolean locked;
    }
}
