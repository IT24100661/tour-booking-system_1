package com.ISPteam.tour_booking_backend.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "bookings")
public class Booking {

    public enum BookingType { GUIDE, HOTEL }
    public enum Status { PENDING, CONFIRMED, CANCELLED, RESCHEDULED, DELETED }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingType type;

    // Reference to guideBookingId or hotelReservationId (your choice)
    private Long referenceId;

    @Column(nullable = false)
    private Long touristId;

    // Optional but useful for provider transaction history
    private Long providerId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.PENDING;

    private Instant startAt;
    private Instant endAt;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    private Instant deletedAt;

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

    // getters/setters
    public Long getId() { return id; }
    public BookingType getType() { return type; }
    public void setType(BookingType type) { this.type = type; }
    public Long getReferenceId() { return referenceId; }
    public void setReferenceId(Long referenceId) { this.referenceId = referenceId; }
    public Long getTouristId() { return touristId; }
    public void setTouristId(Long touristId) { this.touristId = touristId; }
    public Long getProviderId() { return providerId; }
    public void setProviderId(Long providerId) { this.providerId = providerId; }
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    public Instant getStartAt() { return startAt; }
    public void setStartAt(Instant startAt) { this.startAt = startAt; }
    public Instant getEndAt() { return endAt; }
    public void setEndAt(Instant endAt) { this.endAt = endAt; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public Instant getDeletedAt() { return deletedAt; }
    public void setDeletedAt(Instant deletedAt) { this.deletedAt = deletedAt; }
}
