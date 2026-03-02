package com.ISPteam.tour_booking_backend.service;

import com.ISPteam.tour_booking_backend.dto.*;
import com.ISPteam.tour_booking_backend.entity.*;
import com.ISPteam.tour_booking_backend.repo.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@Service
public class E4PlaceService {

    private final PlaceRepository places;
    private final PlaceNearbyServiceRepository services;
    private final FavoritePlaceRepository favorites;
    private final GuideProfileRepository guideProfiles;

    public E4PlaceService(
            PlaceRepository places,
            PlaceNearbyServiceRepository services,
            FavoritePlaceRepository favorites,
            GuideProfileRepository guideProfiles
    ) {
        this.places = places;
        this.services = services;
        this.favorites = favorites;
        this.guideProfiles = guideProfiles;
    }

    private static PlaceCategory parseCategory(String raw) {
        if (raw == null || raw.isBlank()) return null;
        try {
            return PlaceCategory.valueOf(raw.trim().toUpperCase());
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid category");
        }
    }

    // Places
    public Place createPlace(PlaceCreateRequest req) {
        if (req == null || req.name == null || req.name.isBlank())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Name required");

        Place p = new Place();
        p.setName(req.name);
        p.setDescription(req.description);
        p.setLocation(req.location);
        p.setLat(req.lat);
        p.setLng(req.lng);
        p.setImageUrls(req.imageUrls);

        PlaceCategory cat = parseCategory(req.category);
        if (cat != null) p.setCategory(cat);

        return places.save(p);
    }

    public PlaceDetailsResponse getPlaceDetails(Long id) {
        Place p = places.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Place not found"));
        List<PlaceNearbyService> svc = services.findByPlaceId(id);
        return new PlaceDetailsResponse(p, svc);
    }

    public List<Place> searchPlaces(String category) {
        PlaceCategory cat = parseCategory(category);
        if (cat == null) return places.findAll();
        return places.findByCategory(cat);
    }

    public Place updatePlace(Long id, PlaceUpdateRequest req) {
        Place p = places.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Place not found"));

        if (req.name != null) p.setName(req.name);
        if (req.description != null) p.setDescription(req.description);
        if (req.location != null) p.setLocation(req.location);
        if (req.lat != null) p.setLat(req.lat);
        if (req.lng != null) p.setLng(req.lng);
        if (req.imageUrls != null) p.setImageUrls(req.imageUrls);

        if (req.category != null) p.setCategory(parseCategory(req.category));

        return places.save(p);
    }

    public void deletePlace(Long id) {
        if (!places.existsById(id))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Place not found");
        // If you want cascade delete services/favorites, do it here.
        places.deleteById(id);
    }

    // Nearby services
    public PlaceNearbyService createNearbyService(Long placeId, NearbyServiceCreateRequest req) {
        if (!places.existsById(placeId))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Place not found");

        if (req == null || req.name == null || req.name.isBlank())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Service name required");

        PlaceNearbyService s = new PlaceNearbyService();
        s.setPlaceId(placeId);
        s.setName(req.name);
        s.setType(req.type);
        s.setContact(req.contact);
        s.setLat(req.lat);
        s.setLng(req.lng);

        return services.save(s);
    }

    public PlaceNearbyService updateNearbyService(Long placeId, Long serviceId, NearbyServiceUpdateRequest req) {
        PlaceNearbyService s = services.findById(serviceId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found"));
        if (!s.getPlaceId().equals(placeId))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Service does not belong to this place");

        if (req.name != null) s.setName(req.name);
        if (req.type != null) s.setType(req.type);
        if (req.contact != null) s.setContact(req.contact);
        if (req.lat != null) s.setLat(req.lat);
        if (req.lng != null) s.setLng(req.lng);

        return services.save(s);
    }

    public void deleteNearbyService(Long placeId, Long serviceId) {
        PlaceNearbyService s = services.findById(serviceId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found"));
        if (!s.getPlaceId().equals(placeId))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Service does not belong to this place");
        services.delete(s);
    }

    // Nearby (hotels + guides + services)
    public PlaceNearbyResponse getNearby(Long placeId) {
        Place p = places.findById(placeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Place not found"));

        List<PlaceNearbyService> svc = services.findByPlaceId(placeId);

        // Guides: reuse existing repo search() like E2 does
        List<GuideProfile> guides = new ArrayList<>();
        if (p.getLocation() != null && !p.getLocation().isBlank()) {
            guides = guideProfiles.search(p.getLocation(), null, null);
        }

        // Hotels: kept empty to avoid compile issues until your E3 hotel repo/entity is final
        List<Object> hotels = List.of();

        return new PlaceNearbyResponse(placeId, hotels, guides, svc);
    }

    // Map
    public PlaceMapResponse getMap(Long placeId) {
        Place p = places.findById(placeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Place not found"));
        return new PlaceMapResponse(placeId, p.getLat(), p.getLng());
    }

    // Favorites
    public void addFavorite(Long userId, FavoritePlaceCreateRequest req) {
        if (req == null || req.placeId == null)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "placeId required");

        if (!places.existsById(req.placeId))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Place not found");

        if (favorites.existsByUserIdAndPlaceId(userId, req.placeId))
            return; // idempotent

        FavoritePlace f = new FavoritePlace();
        f.setUserId(userId);
        f.setPlaceId(req.placeId);
        favorites.save(f);
    }

    public List<Place> getFavorites(Long userId) {
        List<FavoritePlace> favs = favorites.findByUserIdOrderByCreatedAtDesc(userId);
        List<Place> out = new ArrayList<>();
        for (FavoritePlace f : favs) {
            places.findById(f.getPlaceId()).ifPresent(out::add);
        }
        return out;
    }

    public void removeFavorite(Long userId, Long placeId) {
        favorites.deleteByUserIdAndPlaceId(userId, placeId);
    }
}
