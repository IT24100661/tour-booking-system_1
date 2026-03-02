package com.ISPteam.tour_booking_backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "place_nearby_services")
public class PlaceNearbyService {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false)
    private Long placeId;

    @Column(nullable=false)
    private String name;

    // restaurant / transport / etc
    private String type;

    private String contact;

    private Double lat;
    private Double lng;

    public Long getId() { return id; }

    public Long getPlaceId() { return placeId; }
    public void setPlaceId(Long placeId) { this.placeId = placeId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getContact() { return contact; }
    public void setContact(String contact) { this.contact = contact; }

    public Double getLat() { return lat; }
    public void setLat(Double lat) { this.lat = lat; }

    public Double getLng() { return lng; }
    public void setLng(Double lng) { this.lng = lng; }
}
