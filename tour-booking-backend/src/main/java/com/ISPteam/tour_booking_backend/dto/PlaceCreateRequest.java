package com.ISPteam.tour_booking_backend.dto;

public class PlaceCreateRequest {
    public String name;
    public String description;
    public String category; // BEACH/HISTORICAL/WILDLIFE/OTHER (case-insensitive)
    public String location;
    public Double lat;
    public Double lng;
    public String imageUrls;
}
