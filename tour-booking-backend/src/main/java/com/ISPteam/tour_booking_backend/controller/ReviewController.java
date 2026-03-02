package com.ISPteam.tour_booking_backend.controller;

import com.ISPteam.tour_booking_backend.entity.Review;
import com.ISPteam.tour_booking_backend.entity.ReviewReport;
import com.ISPteam.tour_booking_backend.entity.ReviewResponse;
import com.ISPteam.tour_booking_backend.service.ReviewService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class ReviewController {

    private final ReviewService svc;

    public ReviewController(ReviewService svc) {
        this.svc = svc;
    }

    // POST /api/reviews (US41)
    @PostMapping("/reviews")
    public Review create(@RequestBody ReviewService.CreateReviewRequest req) {
        return svc.createReview(req);
    }

    // GET /api/reviews?targetType=&targetId= (US40)
    @GetMapping("/reviews")
    public ReviewService.ReviewsListResponse list(
            @RequestParam String targetType,
            @RequestParam Long targetId
    ) {
        Review.TargetType tt = Review.TargetType.valueOf(targetType);
        return svc.listForTarget(tt, targetId);
    }

    // GET /api/reviews/{id}
    @GetMapping("/reviews/{id}")
    public ReviewService.ReviewDetailResponse one(@PathVariable Long id) {
        return svc.getOne(id);
    }

    // PATCH /api/reviews/{id} (US42)
    @PatchMapping("/reviews/{id}")
    public Review update(@PathVariable Long id, @RequestBody UpdateReviewRequest req) {
        return svc.updateReview(id, req.touristId, req.rating, req.comment);
    }

    // DELETE /api/reviews/{id}
    @DeleteMapping("/reviews/{id}")
    public void delete(@PathVariable Long id, @RequestParam(required = false) Long requesterId) {
        // If you want real admin detection, wire roles/principal; for now caller can pass requesterId like other modules.
        svc.deleteReview(id, requesterId, false);
    }

    // POST /api/reviews/{id}/reports (US45)
    @PostMapping("/reviews/{id}/reports")
    public ReviewReport report(@PathVariable Long id, @RequestBody CreateReportRequest req) {
        return svc.createReport(id, req.reporterId, req.reason);
    }

    // POST /api/reviews/{id}/responses (US43)
    @PostMapping("/reviews/{id}/responses")
    public ReviewResponse respond(@PathVariable Long id, @RequestBody CreateResponseRequest req) {
        return svc.createProviderResponse(id, req.providerId, req.message);
    }

    // DELETE /api/reviews/{id}/responses/{responseId}
    @DeleteMapping("/reviews/{id}/responses/{responseId}")
    public void deleteResponse(@PathVariable Long id, @PathVariable Long responseId) {
        svc.deleteProviderResponse(id, responseId);
    }

    public static class UpdateReviewRequest {
        public Long touristId;
        public Integer rating;
        public String comment;
    }

    public static class CreateReportRequest {
        public Long reporterId;
        public String reason;
    }

    public static class CreateResponseRequest {
        public Long providerId;
        public String message;
    }
}
