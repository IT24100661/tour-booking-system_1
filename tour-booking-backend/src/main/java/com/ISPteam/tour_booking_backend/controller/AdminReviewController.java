package com.ISPteam.tour_booking_backend.controller;

import com.ISPteam.tour_booking_backend.entity.Review;
import com.ISPteam.tour_booking_backend.service.ReviewService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminReviewController {

    private final ReviewService svc;

    public AdminReviewController(ReviewService svc) {
        this.svc = svc;
    }

    // GET /api/admin/reviews/reported (US44/US45)
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/reviews/reported")
    public List<ReviewService.ReportedReviewDto> reported() {
        return svc.adminReported();
    }

    // PATCH /api/admin/reviews/{id} (US44)
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/reviews/{id}")
    public Review moderate(@PathVariable Long id, @RequestBody ModerateRequest req) {
        return svc.adminModerate(id, Review.Status.valueOf(req.status));
    }

    public static class ModerateRequest {
        public String status; // APPROVED / REJECTED / HIDDEN
    }
}
