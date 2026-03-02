package com.ISPteam.tour_booking_backend.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "hotel_images")
public class HotelImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long hotelId;

    @Column(nullable = false, length = 1000)
    private String url; // or file path

    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    public Long getId() { return id; }

    public Long getHotelId() { return hotelId; }
    public void setHotelId(Long hotelId) { this.hotelId = hotelId; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public Instant getCreatedAt() { return createdAt; }
}
