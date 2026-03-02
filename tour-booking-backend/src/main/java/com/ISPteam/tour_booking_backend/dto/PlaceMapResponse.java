package com.ISPteam.tour_booking_backend.dto;

public class PlaceMapResponse {
    public Long placeId;
    public Double lat;
    public Double lng;

    public PlaceMapResponse(Long placeId, Double lat, Double lng) {
        this.placeId = placeId;
        this.lat = lat;
        this.lng = lng;
    }
}
