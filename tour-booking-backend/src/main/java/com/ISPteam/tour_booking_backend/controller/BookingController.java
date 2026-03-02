package com.ISPteam.tour_booking_backend.controller;

import com.ISPteam.tour_booking_backend.entity.Booking;
import com.ISPteam.tour_booking_backend.entity.Invoice;
import com.ISPteam.tour_booking_backend.service.BookingService;
import com.ISPteam.tour_booking_backend.service.InvoiceService;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api")
public class BookingController {

    private final BookingService bookingService;
    private final InvoiceService invoiceService;

    public BookingController(BookingService bookingService, InvoiceService invoiceService) {
        this.bookingService = bookingService;
        this.invoiceService = invoiceService;
    }

    // POST /api/bookings
    @PostMapping("/bookings")
    public Booking create(@RequestBody Booking body) {
        return bookingService.create(body);
    }

    // GET /api/bookings/{id}
    @GetMapping("/bookings/{id}")
    public Booking get(@PathVariable Long id) {
        return bookingService.get(id);
    }

    // GET /api/bookings?touristId=
    @GetMapping("/bookings")
    public List<Booking> list(@RequestParam(required = false) Long touristId) {
        return bookingService.listByTourist(touristId);
    }

    // PATCH /api/bookings/{id}
    @PatchMapping("/bookings/{id}")
    public Booking update(
            @PathVariable Long id,
            @RequestBody BookingUpdateRequest req
    ) {
        Booking.Status st = req.status != null ? Booking.Status.valueOf(req.status) : null;
        Instant startAt = req.startAt;
        Instant endAt = req.endAt;
        return bookingService.update(id, st, startAt, endAt, req.reason);
    }

    // DELETE /api/bookings/{id} (soft delete)
    @DeleteMapping("/bookings/{id}")
    public void delete(@PathVariable Long id) {
        bookingService.softDelete(id);
    }

    // POST /api/bookings/{id}/invoice
    @PostMapping("/bookings/{id}/invoice")
    public Invoice createInvoice(@PathVariable Long id) {
        return invoiceService.createInvoice(id);
    }

    // GET /api/bookings/{id}/invoice (download)
    @GetMapping("/bookings/{id}/invoice")
    public ResponseEntity<byte[]> downloadInvoice(@PathVariable Long id) {
        Invoice inv = invoiceService.getByBookingId(id);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(inv.getContentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + inv.getFileName() + "\"")
                .body(inv.getFileBytes());
    }

    public static class BookingUpdateRequest {
        public String status;
        public Instant startAt;
        public Instant endAt;
        public String reason;
    }
}
