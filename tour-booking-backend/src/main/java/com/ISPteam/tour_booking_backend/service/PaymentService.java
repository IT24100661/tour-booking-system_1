package com.ISPteam.tour_booking_backend.service;

import com.ISPteam.tour_booking_backend.entity.Booking;
import com.ISPteam.tour_booking_backend.entity.Payment;
import com.ISPteam.tour_booking_backend.entity.TransactionHistory;
import com.ISPteam.tour_booking_backend.repo.BookingRepository;
import com.ISPteam.tour_booking_backend.repo.PaymentRepository;
import com.ISPteam.tour_booking_backend.repo.TransactionHistoryRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class PaymentService {

    private final PaymentRepository payments;
    private final BookingRepository bookings;
    private final TransactionHistoryRepository txRepo;

    public PaymentService(PaymentRepository payments, BookingRepository bookings, TransactionHistoryRepository txRepo) {
        this.payments = payments;
        this.bookings = bookings;
        this.txRepo = txRepo;
    }

    public Payment create(Payment p) {
        if (p.getBookingId() == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "bookingId is required");
        if (p.getProviderId() == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "providerId is required");
        if (p.getAmount() == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "amount is required");
        if (p.getCurrency() == null) p.setCurrency("LKR");

        Booking b = bookings.findById(p.getBookingId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));

        if (b.getDeletedAt() != null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Booking deleted");

        // optional: bind booking.providerId automatically
        if (b.getProviderId() == null) {
            b.setProviderId(p.getProviderId());
            bookings.save(b);
        }

        p.setStatus(p.getStatus() == null ? Payment.Status.INITIATED : p.getStatus());
        return payments.save(p);
    }

    public Payment updateStatus(Long paymentId, Payment.Status status) {
        Payment p = payments.findById(paymentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Payment not found"));

        if (p.isLocked()) throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Payment locked");

        if (status != null) p.setStatus(status);
        Payment saved = payments.save(p);

        if (saved.getStatus() == Payment.Status.SUCCESS) {
            // Create transaction history once
            if (!txRepo.existsByPaymentId(saved.getId())) {
                TransactionHistory tx = new TransactionHistory();
                tx.setProviderId(saved.getProviderId());
                tx.setPaymentId(saved.getId());
                tx.setBookingId(saved.getBookingId());
                tx.setCurrency(saved.getCurrency());
                tx.setAmount(saved.getAmount());
                txRepo.save(tx);
            }

            // Optional: auto-confirm booking on payment success
            Booking b = bookings.findById(saved.getBookingId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));
            if (b.getDeletedAt() == null && b.getStatus() == Booking.Status.PENDING) {
                b.setStatus(Booking.Status.CONFIRMED);
                bookings.save(b);
            }
        }

        return saved;
    }

    public java.util.List<Payment> listByProvider(Long providerId) {
        if (providerId == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "providerId is required");
        return payments.findByProviderIdOrderByCreatedAtDesc(providerId);
    }

    public java.util.List<Payment> adminSearch(java.time.Instant from, java.time.Instant to, Payment.Status status) {
        if (from == null || to == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "from/to required");
        return (status == null)
                ? payments.findByCreatedAtBetween(from, to)
                : payments.findByCreatedAtBetweenAndStatus(from, to, status);
    }

    public Payment adminUpdateFlags(Long id, Boolean suspicious, Boolean locked) {
        Payment p = payments.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Payment not found"));

        if (suspicious != null) p.setSuspicious(suspicious);
        if (locked != null) p.setLocked(locked);

        return payments.save(p);
    }

    public void delete(Long id) {
        payments.deleteById(id);
    }
}
