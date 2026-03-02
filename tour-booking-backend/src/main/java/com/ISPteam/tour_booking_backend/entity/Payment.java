package com.ISPteam.tour_booking_backend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "payments")
public class Payment {

    public enum Status { INITIATED, SUCCESS, FAILED, REFUNDED }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long bookingId;

    @Column(nullable = false)
    private Long providerId;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false)
    private String currency = "LKR";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.INITIATED;

    private String gatewayRef;

    // Admin flags
    @Column(nullable = false)
    private boolean suspicious = false;

    @Column(nullable = false)
    private boolean locked = false;

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

    // getters/setters
    public Long getId() { return id; }
    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }
    public Long getProviderId() { return providerId; }
    public void setProviderId(Long providerId) { this.providerId = providerId; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    public String getGatewayRef() { return gatewayRef; }
    public void setGatewayRef(String gatewayRef) { this.gatewayRef = gatewayRef; }
    public boolean isSuspicious() { return suspicious; }
    public void setSuspicious(boolean suspicious) { this.suspicious = suspicious; }
    public boolean isLocked() { return locked; }
    public void setLocked(boolean locked) { this.locked = locked; }
    public Instant getCreatedAt() { return createdAt; }
}
