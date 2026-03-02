package com.ISPteam.tour_booking_backend.dto;

import com.ISPteam.tour_booking_backend.entity.Place;
import com.ISPteam.tour_booking_backend.entity.PlaceNearbyService;
import java.util.List;

public class PlaceDetailsResponse {
    public Place place;
    public List<PlaceNearbyService> nearbyServices;

    public PlaceDetailsResponse(Place place, List<PlaceNearbyService> nearbyServices) {
        this.place = place;
        this.nearbyServices = nearbyServices;
    }
}
