package com.ISPteam.tour_booking_backend.service;

import com.ISPteam.tour_booking_backend.entity.Booking;
import com.ISPteam.tour_booking_backend.entity.Invoice;
import com.ISPteam.tour_booking_backend.repo.BookingRepository;
import com.ISPteam.tour_booking_backend.repo.InvoiceRepository;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.io.ByteArrayOutputStream;
import java.time.Instant;
import java.util.UUID;

@Service
public class InvoiceService {

    private final InvoiceRepository invoices;
    private final BookingRepository bookings;

    public InvoiceService(InvoiceRepository invoices, BookingRepository bookings) {
        this.invoices = invoices;
        this.bookings = bookings;
    }

    public Invoice createInvoice(Long bookingId) {
        if (bookingId == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "bookingId required");
        if (invoices.existsByBookingId(bookingId)) {
            return invoices.findByBookingId(bookingId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Invoice missing"));
        }

        Booking b = bookings.findById(bookingId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));
        if (b.getDeletedAt() != null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Booking deleted");

        byte[] pdf = generateSimplePdf(bookingId, b.getTouristId(), b.getProviderId(), b.getStatus().name());

        Invoice inv = new Invoice();
        inv.setBookingId(bookingId);
        inv.setInvoiceNumber("INV-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        inv.setContentType("application/pdf");
        inv.setFileName("invoice-booking-" + bookingId + ".pdf");
        inv.setFileBytes(pdf);

        return invoices.save(inv);
    }

    public Invoice getByBookingId(Long bookingId) {
        return invoices.findByBookingId(bookingId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Invoice not found"));
    }

    private byte[] generateSimplePdf(Long bookingId, Long touristId, Long providerId, String status) {
        try (PDDocument doc = new PDDocument(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            PDPage page = new PDPage();
            doc.addPage(page);

            try (PDPageContentStream cs = new PDPageContentStream(doc, page)) {
                cs.beginText();
                cs.setFont(PDType1Font.HELVETICA_BOLD, 16);
                cs.newLineAtOffset(50, 750);
                cs.showText("Booking Invoice");
                cs.endText();

                cs.beginText();
                cs.setFont(PDType1Font.HELVETICA, 12);
                cs.newLineAtOffset(50, 720);
                cs.showText("Booking ID: " + bookingId);
                cs.newLineAtOffset(0, -16);
                cs.showText("Tourist ID: " + touristId);
                cs.newLineAtOffset(0, -16);
                cs.showText("Provider ID: " + providerId);
                cs.newLineAtOffset(0, -16);
                cs.showText("Status: " + status);
                cs.newLineAtOffset(0, -16);
                cs.showText("Issued: " + Instant.now());
                cs.endText();
            }

            doc.save(out);
            return out.toByteArray();
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Invoice PDF generation failed");
        }
    }
}
