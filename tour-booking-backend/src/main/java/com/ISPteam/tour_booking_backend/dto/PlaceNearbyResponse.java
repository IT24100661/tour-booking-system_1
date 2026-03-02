package com.ISPteam.tour_booking_backend.dto;

import com.ISPteam.tour_booking_backend.entity.PlaceNearbyService;
import com.ISPteam.tour_booking_backend.entity.GuideProfile;
import java.util.List;

public class PlaceNearbyResponse {
    public Long placeId;

    // If you later add Hotel entity/repo, replace Object with a Hotel DTO/list.
    public List<Object> hotels;
    public List<GuideProfile> guides;
    public List<PlaceNearbyService> services;

    public PlaceNearbyResponse(Long placeId, List<Object> hotels, List<GuideProfile> guides, List<PlaceNearbyService> services) {
        this.placeId = placeId;
        this.hotels = hotels;
        this.guides = guides;
        this.services = services;
    }
}
