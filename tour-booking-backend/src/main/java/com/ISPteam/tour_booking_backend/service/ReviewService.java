package com.ISPteam.tour_booking_backend.service;

import com.ISPteam.tour_booking_backend.entity.*;
import com.ISPteam.tour_booking_backend.repo.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    private final ReviewRepository reviews;
    private final ReviewReportRepository reports;
    private final ReviewResponseRepository responses;
    private final RatingSummaryRepository summaries;

    public ReviewService(
            ReviewRepository reviews,
            ReviewReportRepository reports,
            ReviewResponseRepository responses,
            RatingSummaryRepository summaries
    ) {
        this.reviews = reviews;
        this.reports = reports;
        this.responses = responses;
        this.summaries = summaries;
    }

    // US41
    public Review createReview(CreateReviewRequest req) {
        if (req.touristId == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "touristId required");
        if (req.targetType == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "targetType required");
        if (req.targetId == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "targetId required");
        if (req.rating == null || req.rating < 1 || req.rating > 5)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "rating must be 1..5");

        Review r = new Review();
        r.setTouristId(req.touristId);
        r.setTargetType(req.targetType);
        r.setTargetId(req.targetId);
        r.setRating(req.rating);
        r.setComment(req.comment);
        r.setStatus(Review.Status.APPROVED);

        Review saved = reviews.save(r);
        recalcSummary(saved.getTargetType(), saved.getTargetId());
        return saved;
    }

    // US40
    public ReviewsListResponse listForTarget(Review.TargetType type, Long targetId) {
        if (type == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "targetType required");
        if (targetId == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "targetId required");

        List<Review> items = reviews.findByTargetTypeAndTargetIdAndStatusOrderByCreatedAtDesc(type, targetId, Review.Status.APPROVED);

        RatingSummary s = summaries.findByTargetTypeAndTargetId(type, targetId).orElse(null);
        Double avg = (s == null) ? (reviews.avgApproved(type, targetId)) : s.getAvgRating();
        Long count = (s == null) ? (reviews.countApproved(type, targetId)) : s.getRatingCount();

        ReviewsListResponse res = new ReviewsListResponse();
        res.items = items;
        res.avgRating = (avg == null) ? 0.0 : avg;
        res.count = (count == null) ? 0L : count;
        return res;
    }

    public ReviewDetailResponse getOne(Long id) {
        Review r = reviews.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Review not found"));

        ReviewDetailResponse out = new ReviewDetailResponse();
        out.review = r;
        out.responses = responses.findByReviewIdOrderByCreatedAtAsc(id);
        out.reports = reports.findByReviewIdOrderByCreatedAtDesc(id);
        return out;
    }

    // US42
    public Review updateReview(Long id, Long touristId, Integer rating, String comment) {
        Review r = reviews.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Review not found"));

        if (touristId == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "touristId required");
        if (!touristId.equals(r.getTouristId()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your review");

        if (rating != null) {
            if (rating < 1 || rating > 5) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "rating must be 1..5");
            r.setRating(rating);
        }
        if (comment != null) r.setComment(comment);

        Review saved = reviews.save(r);
        recalcSummary(saved.getTargetType(), saved.getTargetId());
        return saved;
    }

    // US44
    public Review adminModerate(Long id, Review.Status status) {
        Review r = reviews.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Review not found"));

        if (status == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "status required");
        r.setStatus(status);

        Review saved = reviews.save(r);
        recalcSummary(saved.getTargetType(), saved.getTargetId());
        return saved;
    }

    // US44
    public void deleteReview(Long id, Long requesterId, boolean isAdmin) {
        Review r = reviews.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Review not found"));

        if (!isAdmin) {
            if (requesterId == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "requesterId required");
            if (!requesterId.equals(r.getTouristId()))
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not allowed");
        }

        reviews.delete(r);
        recalcSummary(r.getTargetType(), r.getTargetId());
    }

    // US45
    public ReviewReport createReport(Long reviewId, Long reporterId, String reason) {
        if (reporterId == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "reporterId required");
        if (reason == null || reason.isBlank()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "reason required");

        Review r = reviews.findById(reviewId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Review not found"));

        ReviewReport rr = new ReviewReport();
        rr.setReviewId(r.getId());
        rr.setReporterId(reporterId);
        rr.setReason(reason);
        return reports.save(rr);
    }

    // US43
    public ReviewResponse createProviderResponse(Long reviewId, Long providerId, String message) {
        if (providerId == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "providerId required");
        if (message == null || message.isBlank()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "message required");

        reviews.findById(reviewId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Review not found"));

        ReviewResponse resp = new ReviewResponse();
        resp.setReviewId(reviewId);
        resp.setProviderId(providerId);
        resp.setMessage(message);
        return responses.save(resp);
    }

    public void deleteProviderResponse(Long reviewId, Long responseId) {
        ReviewResponse rr = responses.findById(responseId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Response not found"));

        if (!reviewId.equals(rr.getReviewId()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Response not for this review");

        responses.delete(rr);
    }

    // US44/US45 admin view
    public List<ReportedReviewDto> adminReported() {
        List<Long> reviewIds = reports.findDistinctReportedReviewIds();
        if (reviewIds.isEmpty()) return List.of();

        List<Review> rs = reviews.findAllById(reviewIds);
        Map<Long, Review> byId = rs.stream().collect(Collectors.toMap(Review::getId, x -> x));

        List<ReviewReport> allReports = reports.findAll();
        Map<Long, List<ReviewReport>> grouped = allReports.stream()
                .collect(Collectors.groupingBy(ReviewReport::getReviewId));

        List<ReportedReviewDto> out = new ArrayList<>();
        for (Long id : reviewIds) {
            Review r = byId.get(id);
            if (r == null) continue;

            List<ReviewReport> rep = grouped.getOrDefault(id, List.of());

            ReportedReviewDto dto = new ReportedReviewDto();
            dto.review = r;
            dto.reportCount = (long) rep.size();
            dto.latestReasons = rep.stream().limit(5).map(ReviewReport::getReason).toList();
            out.add(dto);
        }

        out.sort(Comparator.comparingLong((ReportedReviewDto x) -> x.reportCount).reversed());
        return out;
    }

    private void recalcSummary(Review.TargetType type, Long targetId) {
        Double avg = reviews.avgApproved(type, targetId);
        Long count = reviews.countApproved(type, targetId);

        RatingSummary s = summaries.findByTargetTypeAndTargetId(type, targetId).orElseGet(() -> {
            RatingSummary ns = new RatingSummary();
            ns.setTargetType(type);
            ns.setTargetId(targetId);
            return ns;
        });

        s.setAvgRating(avg == null ? 0.0 : avg);
        s.setRatingCount(count == null ? 0L : count);
        summaries.save(s);
    }

    // DTOs
    public static class CreateReviewRequest {
        public Long touristId;
        public Review.TargetType targetType;
        public Long targetId;
        public Integer rating;
        public String comment;
    }

    public static class ReviewsListResponse {
        public List<Review> items;
        public Double avgRating;
        public Long count;
    }

    public static class ReviewDetailResponse {
        public Review review;
        public List<ReviewResponse> responses;
        public List<ReviewReport> reports; // optional; remove if you don’t want to expose
    }

    public static class ReportedReviewDto {
        public Review review;
        public Long reportCount;
        public List<String> latestReasons;
    }
}
