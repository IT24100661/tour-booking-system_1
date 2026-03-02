package com.ISPteam.tour_booking_backend.controller;

import com.ISPteam.tour_booking_backend.dto.*;
import com.ISPteam.tour_booking_backend.entity.Place;
import com.ISPteam.tour_booking_backend.entity.PlaceNearbyService;
import com.ISPteam.tour_booking_backend.service.E4PlaceService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api")
public class E4PlaceController {

    private final E4PlaceService svc;

    public E4PlaceController(E4PlaceService svc) {
        this.svc = svc;
    }

    // Create Tourist Place (Admin)
    @PostMapping("places")
    public Place createPlace(@RequestBody PlaceCreateRequest req) {
        return svc.createPlace(req);
    }

    // Create Nearby Service
    @PostMapping("places/{id}/nearby-services")
    public PlaceNearbyService createNearbyService(@PathVariable Long id, @RequestBody NearbyServiceCreateRequest req) {
        return svc.createNearbyService(id, req);
    }

    // Save Favorite Place
    @PostMapping("users/{id}/favorites/places")
    public void saveFavorite(@PathVariable Long id, @RequestBody FavoritePlaceCreateRequest req) {
        svc.addFavorite(id, req);
    }

    // Get Place Details
    @GetMapping("places/{id}")
    public PlaceDetailsResponse getPlaceDetails(@PathVariable Long id) {
        return svc.getPlaceDetails(id);
    }

    // Search Places by Category
    @GetMapping("places")
    public List<Place> searchPlaces(@RequestParam(required = false) String category) {
        return svc.searchPlaces(category);
    }

    // Get Nearby Hotels & Guides
    @GetMapping("places/{id}/nearby")
    public PlaceNearbyResponse getNearby(@PathVariable Long id) {
        return svc.getNearby(id);
    }

    // Get Map Data for Place
    @GetMapping("places/{id}/map")
    public PlaceMapResponse getMap(@PathVariable Long id) {
        return svc.getMap(id);
    }

    // Get User Favorite Places
    @GetMapping("users/{id}/favorites/places")
    public List<Place> getFavorites(@PathVariable Long id) {
        return svc.getFavorites(id);
    }

    // Update Place Information
    @PatchMapping("places/{id}")
    public Place updatePlace(@PathVariable Long id, @RequestBody PlaceUpdateRequest req) {
        return svc.updatePlace(id, req);
    }

    // Update Nearby Service
    @PatchMapping("places/{id}/nearby-services/{serviceId}")
    public PlaceNearbyService updateNearbyService(
            @PathVariable Long id,
            @PathVariable Long serviceId,
            @RequestBody NearbyServiceUpdateRequest req
    ) {
        return svc.updateNearbyService(id, serviceId, req);
    }

    // Delete Place
    @DeleteMapping("places/{id}")
    public void deletePlace(@PathVariable Long id) {
        svc.deletePlace(id);
    }

    // Delete Nearby Service
    @DeleteMapping("places/{id}/nearby-services/{serviceId}")
    public void deleteNearbyService(@PathVariable Long id, @PathVariable Long serviceId) {
        svc.deleteNearbyService(id, serviceId);
    }

    // Remove Favorite Place
    @DeleteMapping("users/{id}/favorites/places/{placeId}")
    public void removeFavorite(@PathVariable Long id, @PathVariable Long placeId) {
        svc.removeFavorite(id, placeId);
    }
}
