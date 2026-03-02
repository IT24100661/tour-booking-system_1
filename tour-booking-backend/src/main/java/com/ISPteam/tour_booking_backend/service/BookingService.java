package com.ISPteam.tour_booking_backend.service;

import com.ISPteam.tour_booking_backend.entity.Booking;
import com.ISPteam.tour_booking_backend.entity.BookingHistory;
import com.ISPteam.tour_booking_backend.repo.BookingHistoryRepository;
import com.ISPteam.tour_booking_backend.repo.BookingRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookings;
    private final BookingHistoryRepository history;

    public BookingService(BookingRepository bookings, BookingHistoryRepository history) {
        this.bookings = bookings;
        this.history = history;
    }

    public Booking create(Booking b) {
        if (b.getType() == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "type is required");
        if (b.getTouristId() == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "touristId is required");
        b.setStatus(b.getStatus() == null ? Booking.Status.PENDING : b.getStatus());

        Booking saved = bookings.save(b);
        writeHistory(saved.getId(), "CREATED", null);
        return saved;
    }

    public Booking get(Long id) {
        Booking b = bookings.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));
        if (b.getDeletedAt() != null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking deleted");
        return b;
    }

    public List<Booking> listByTourist(Long touristId) {
        if (touristId == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "touristId is required");
        return bookings.findByTouristIdAndDeletedAtIsNullOrderByCreatedAtDesc(touristId);
    }

    public Booking update(Long id, Booking.Status status, Instant startAt, Instant endAt, String reason) {
        Booking b = get(id);

        if (status != null) b.setStatus(status);
        if (startAt != null) b.setStartAt(startAt);
        if (endAt != null) b.setEndAt(endAt);

        Booking saved = bookings.save(b);
        writeHistory(saved.getId(), "UPDATED", reason);
        return saved;
    }

    public void softDelete(Long id) {
        Booking b = get(id);
        b.setStatus(Booking.Status.DELETED);
        b.setDeletedAt(Instant.now());
        bookings.save(b);
        writeHistory(id, "DELETED", null);
    }

    private void writeHistory(Long bookingId, String action, String note) {
        BookingHistory h = new BookingHistory();
        h.setBookingId(bookingId);
        h.setAction(action);
        h.setNote(note);
        history.save(h);
    }
}
