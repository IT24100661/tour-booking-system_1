package com.ISPteam.tour_booking_backend.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(
        name = "rating_summary",
        uniqueConstraints = @UniqueConstraint(name = "uk_rating_target", columnNames = {"targetType", "targetId"})
)
public class RatingSummary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Review.TargetType targetType;

    @Column(nullable = false)
    private Long targetId;

    @Column(nullable = false)
    private Double avgRating = 0.0;

    @Column(nullable = false)
    private Long ratingCount = 0L;

    @Column(nullable = false)
    private Instant updatedAt;

    @PrePersist
    void prePersist() {
        updatedAt = Instant.now();
    }

    @PreUpdate
    void preUpdate() {
        updatedAt = Instant.now();
    }

    public Long getId() { return id; }
    public Review.TargetType getTargetType() { return targetType; }
    public void setTargetType(Review.TargetType targetType) { this.targetType = targetType; }
    public Long getTargetId() { return targetId; }
    public void setTargetId(Long targetId) { this.targetId = targetId; }
    public Double getAvgRating() { return avgRating; }
    public void setAvgRating(Double avgRating) { this.avgRating = avgRating; }
    public Long getRatingCount() { return ratingCount; }
    public void setRatingCount(Long ratingCount) { this.ratingCount = ratingCount; }
    public Instant getUpdatedAt() { return updatedAt; }
}
