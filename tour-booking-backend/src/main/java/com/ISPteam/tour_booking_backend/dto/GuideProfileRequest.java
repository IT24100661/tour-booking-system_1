package com.ISPteam.tour_booking_backend.dto;

public class GuideProfileRequest {
    public String name;
    public String location;
    public String languages;
    public Double ratingAvg;
    public Integer ratingCount;
    public Double price;   // keep Double to match entity
    public String bio;
}
