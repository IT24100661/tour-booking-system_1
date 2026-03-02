package com.ISPteam.tour_booking_backend.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(
        name = "favorite_places",
        uniqueConstraints = @UniqueConstraint(columnNames = {"userId","placeId"})
)
public class FavoritePlace {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false)
    private Long userId;

    @Column(nullable=false)
    private Long placeId;

    @Column(nullable=false)
    private Instant createdAt = Instant.now();

    public Long getId() { return id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getPlaceId() { return placeId; }
    public void setPlaceId(Long placeId) { this.placeId = placeId; }

    public Instant getCreatedAt() { return createdAt; }
}
