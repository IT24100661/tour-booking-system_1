package com.ISPteam.tour_booking_backend.service;

import com.ISPteam.tour_booking_backend.dto.*;
import com.ISPteam.tour_booking_backend.entity.*;
import com.ISPteam.tour_booking_backend.repo.*;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class E2GuideService {

    private final GuideProfileRepository guideProfiles;
    private final GuideAvailabilityRepository availabilityRepo;
    private final GuideBookingRequestRepository requestRepo;
    private final GuideBookingRepository bookingRepo;
    private final NotificationRepository notificationRepo;

    public E2GuideService(GuideProfileRepository guideProfiles,
                          GuideAvailabilityRepository availabilityRepo,
                          GuideBookingRequestRepository requestRepo,
                          GuideBookingRepository bookingRepo,
                          NotificationRepository notificationRepo) {
        this.guideProfiles = guideProfiles;
        this.availabilityRepo = availabilityRepo;
        this.requestRepo = requestRepo;
        this.bookingRepo = bookingRepo;
        this.notificationRepo = notificationRepo;
    }

    public List<GuideProfile> searchGuides(String location, String language, Double ratingMin) {
        return guideProfiles.search(location, language, ratingMin);
    }

    public GuideProfile getGuide(Long id) {
        return guideProfiles.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Guide not found"));
    }

    public List<GuideAvailability> getAvailability(Long guideId) {
        return availabilityRepo.findByGuideIdOrderByStartAtAsc(guideId);
    }

    public GuideAvailability createSlot(Long guideId, AvailabilityCreateRequest req) {
        if (req.startAt == null || req.endAt == null || !req.endAt.isAfter(req.startAt)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid start/end");
        }
        GuideAvailability s = new GuideAvailability();
        s.setGuideId(guideId);
        s.setStartAt(req.startAt);
        s.setEndAt(req.endAt);
        s.setActive(true);
        return availabilityRepo.save(s);
    }

    public GuideAvailability updateSlot(Long guideId, Long slotId, AvailabilityUpdateRequest req) {
        GuideAvailability s = availabilityRepo.findById(slotId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Slot not found"));
        if (!s.getGuideId().equals(guideId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Slot not owned by this guide");
        }
        if (req.startAt != null) s.setStartAt(req.startAt);
        if (req.endAt != null) s.setEndAt(req.endAt);
        if (req.active != null) s.setActive(req.active);
        return availabilityRepo.save(s);
    }

    public void deleteSlot(Long guideId, Long slotId) {
        GuideAvailability s = availabilityRepo.findById(slotId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Slot not found"));
        if (!s.getGuideId().equals(guideId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Slot not owned by this guide");
        }
        availabilityRepo.delete(s);
    }

    public GuideBooking createConfirmedBooking(GuideBookingCreateRequest req) {
        if (req.guideId == null || req.touristId == null || req.slotId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Missing fields");
        }
        GuideAvailability slot = availabilityRepo.findById(req.slotId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Slot not found"));
        if (!slot.isActive()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Slot not active");
        if (!slot.getGuideId().equals(req.guideId)) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Slot mismatch");

        GuideBooking b = new GuideBooking();
        b.setGuideId(req.guideId);
        b.setTouristId(req.touristId);
        b.setSlotId(req.slotId);

        // optional: mark slot inactive after booking
        slot.setActive(false);
        availabilityRepo.save(slot);

        GuideBooking saved = bookingRepo.save(b);

        Notification n = new Notification();
        n.setUserId(req.touristId);
        n.setMessage("Your guide booking is confirmed. BookingId=" + saved.getId());
        notificationRepo.save(n);

        return saved;
    }

    public GuideBookingRequest createBookingRequest(GuideBookingRequestCreateRequest req) {
        if (req.guideId == null || req.touristId == null || req.slotId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Missing fields");
        }
        GuideBookingRequest r = new GuideBookingRequest();
        r.setGuideId(req.guideId);
        r.setTouristId(req.touristId);
        r.setSlotId(req.slotId);
        r.setStatus(GuideBookingRequest.Status.PENDING);
        return requestRepo.save(r);
    }

    public List<GuideBookingRequest> getRequestsForGuide(Long guideId) {
        return requestRepo.findByGuideIdOrderByCreatedAtDesc(guideId);
    }

    public GuideBookingRequest acceptReject(Long requestId, String status) {
        GuideBookingRequest r = requestRepo.findById(requestId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Request not found"));

        GuideBookingRequest.Status newStatus;
        try {
            newStatus = GuideBookingRequest.Status.valueOf(status);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid status");
        }

        if (r.getStatus() != GuideBookingRequest.Status.PENDING) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Request already processed");
        }

        r.setStatus(newStatus);
        GuideBookingRequest saved = requestRepo.save(r);

        if (newStatus == GuideBookingRequest.Status.ACCEPTED) {
            GuideBookingCreateRequest cb = new GuideBookingCreateRequest();
            cb.guideId = r.getGuideId();
            cb.touristId = r.getTouristId();
            cb.slotId = r.getSlotId();
            createConfirmedBooking(cb);
        }

        return saved;
    }

    public List<GuideBooking> getTouristBookings(Long touristId) {
        return bookingRepo.findByTouristIdOrderByCreatedAtDesc(touristId);
    }
}
