package com.ISPteam.tour_booking_backend.controller;

import com.ISPteam.tour_booking_backend.dto.*;
import com.ISPteam.tour_booking_backend.entity.*;
import com.ISPteam.tour_booking_backend.service.E2GuideService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class E2GuideController {

    private final E2GuideService svc;

    public E2GuideController(E2GuideService svc) {
        this.svc = svc;
    }

    // Search Tour Guides
    @GetMapping("/guides")
    public List<GuideProfile> searchGuides(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String language,
            @RequestParam(required = false) Double ratingMin
    ) {
        return svc.searchGuides(location, language, ratingMin);
    }

    // View Detailed Guide Profile
    @GetMapping("/guides/{id}")
    public GuideProfile getGuide(@PathVariable Long id) {
        return svc.getGuide(id);
    }

    // Get Guide Availability
    @GetMapping("/guides/{id}/availability")
    public List<GuideAvailability> getAvailability(@PathVariable("id") Long guideId) {
        return svc.getAvailability(guideId);
    }

    // Create Guide Availability Slot
    @PostMapping("/guides/{id}/availability")
    public GuideAvailability createSlot(@PathVariable("id") Long guideId,
                                        @RequestBody AvailabilityCreateRequest req) {
        return svc.createSlot(guideId, req);
    }

    // Update Guide Availability
    @PatchMapping("/guides/{id}/availability/{slotId}")
    public GuideAvailability updateSlot(@PathVariable("id") Long guideId,
                                        @PathVariable Long slotId,
                                        @RequestBody AvailabilityUpdateRequest req) {
        return svc.updateSlot(guideId, slotId, req);
    }

    // Delete Availability Slot
    @DeleteMapping("/guides/{id}/availability/{slotId}")
    public void deleteSlot(@PathVariable("id") Long guideId,
                           @PathVariable Long slotId) {
        svc.deleteSlot(guideId, slotId);
    }

    // Create Tour Guide Booking (confirmed)
    @PostMapping("/guide-bookings")
    public GuideBooking createConfirmedBooking(@RequestBody GuideBookingCreateRequest req) {
        return svc.createConfirmedBooking(req);
    }

    // Get Tourist’s Guide Bookings
    @GetMapping("/guide-bookings")
    public List<GuideBooking> getTouristBookings(@RequestParam Long touristId) {
        return svc.getTouristBookings(touristId);
    }

    // Create Booking Request
    @PostMapping("/guide-booking-requests")
    public GuideBookingRequest createBookingRequest(@RequestBody GuideBookingRequestCreateRequest req) {
        return svc.createBookingRequest(req);
    }

    // Get Booking Requests for Guide
    @GetMapping("/guide-booking-requests")
    public List<GuideBookingRequest> getRequestsForGuide(@RequestParam Long guideId) {
        return svc.getRequestsForGuide(guideId);
    }

    // Accept/Reject Booking Request
    @PutMapping("/guide-booking-requests/{id}")
    public GuideBookingRequest acceptReject(@PathVariable("id") Long id,
                                            @RequestBody GuideBookingRequestStatusUpdate req) {
        return svc.acceptReject(id, req.status);
    }
}
