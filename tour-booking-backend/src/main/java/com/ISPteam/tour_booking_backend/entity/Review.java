package com.ISPteam.tour_booking_backend.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "reviews", indexes = {
        @Index(name = "idx_reviews_target", columnList = "targetType,targetId"),
        @Index(name = "idx_reviews_user", columnList = "touristId")
})
public class Review {

    public enum TargetType { GUIDE, HOTEL, PLACE }
    public enum Status { APPROVED, HIDDEN, REJECTED }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long touristId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TargetType targetType;

    @Column(nullable = false)
    private Long targetId;

    @Column(nullable = false)
    private Integer rating; // 1..5

    @Column(length = 3000)
    private String comment;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.APPROVED;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    @PrePersist
    void prePersist() {
        Instant now = Instant.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    void preUpdate() {
        updatedAt = Instant.now();
    }

    public Long getId() { return id; }
    public Long getTouristId() { return touristId; }
    public void setTouristId(Long touristId) { this.touristId = touristId; }
    public TargetType getTargetType() { return targetType; }
    public void setTargetType(TargetType targetType) { this.targetType = targetType; }
    public Long getTargetId() { return targetId; }
    public void setTargetId(Long targetId) { this.targetId = targetId; }
    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }
    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
