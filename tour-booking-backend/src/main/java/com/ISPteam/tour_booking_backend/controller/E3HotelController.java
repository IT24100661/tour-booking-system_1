package com.ISPteam.tour_booking_backend.controller;

import com.ISPteam.tour_booking_backend.dto.*;
import com.ISPteam.tour_booking_backend.entity.*;
import com.ISPteam.tour_booking_backend.service.E3HotelService;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api")
public class E3HotelController {

    private final E3HotelService svc;

    public E3HotelController(E3HotelService svc) {
        this.svc = svc;
    }

    // Create Hotel (owner)
    @PostMapping("/hotels")
    public ResponseEntity<Hotel> createHotel(JwtAuthenticationToken auth, @RequestBody HotelCreateRequest req) {
        Number uidNum = auth.getToken().getClaim("uid");
        Long ownerId = uidNum == null ? null : uidNum.longValue();
        return ResponseEntity.ok(svc.createHotel(ownerId, req));
    }

    // Search Hotels (public)
    @GetMapping("/hotels")
    public ResponseEntity<List<Hotel>> searchHotels(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) String facilities
    ) {
        return ResponseEntity.ok(svc.searchHotels(location, minPrice, maxPrice, facilities));
    }

    // Hotel Details + Images (+ room types too)
    @GetMapping("/hotels/{id}")
    public ResponseEntity<HotelDetailsResponse> getHotel(@PathVariable Long id) {
        return ResponseEntity.ok(svc.getHotelDetails(id));
    }

    // Update Hotel Info (owner)
    @PatchMapping("/hotels/{id}")
    public ResponseEntity<Hotel> updateHotel(JwtAuthenticationToken auth,
                                             @PathVariable Long id,
                                             @RequestBody HotelUpdateRequest req) {
        Number uidNum = auth.getToken().getClaim("uid");
        Long ownerId = uidNum == null ? null : uidNum.longValue();
        return ResponseEntity.ok(svc.updateHotel(ownerId, id, req));
    }

    @PutMapping("/hotels/{id}")
    public ResponseEntity<Hotel> replaceHotel(JwtAuthenticationToken auth,
                                              @PathVariable Long id,
                                              @RequestBody HotelUpdateRequest req) {
        Number uidNum = auth.getToken().getClaim("uid");
        Long ownerId = uidNum == null ? null : uidNum.longValue();
        return ResponseEntity.ok(svc.updateHotel(ownerId, id, req));
    }

    // Delete Hotel (owner)
    @DeleteMapping("/hotels/{id}")
    public ResponseEntity<Void> deleteHotel(JwtAuthenticationToken auth, @PathVariable Long id) {
        Number uidNum = auth.getToken().getClaim("uid");
        Long ownerId = uidNum == null ? null : uidNum.longValue();
        svc.deleteHotel(ownerId, id);
        return ResponseEntity.noContent().build();
    }

    // Create Room Type (owner)
    @PostMapping("/hotels/{id}/room-types")
    public ResponseEntity<RoomType> createRoomType(JwtAuthenticationToken auth,
                                                   @PathVariable("id") Long hotelId,
                                                   @RequestBody RoomTypeRequest req) {
        Number uidNum = auth.getToken().getClaim("uid");
        Long ownerId = uidNum == null ? null : uidNum.longValue();
        return ResponseEntity.ok(svc.createRoomType(ownerId, hotelId, req));
    }

    // Update Room Type (owner)
    @PatchMapping("/hotels/{id}/room-types/{roomTypeId}")
    public ResponseEntity<RoomType> updateRoomType(JwtAuthenticationToken auth,
                                                   @PathVariable("id") Long hotelId,
                                                   @PathVariable Long roomTypeId,
                                                   @RequestBody RoomTypeRequest req) {
        Number uidNum = auth.getToken().getClaim("uid");
        Long ownerId = uidNum == null ? null : uidNum.longValue();
        return ResponseEntity.ok(svc.updateRoomType(ownerId, hotelId, roomTypeId, req));
    }

    @PutMapping("/hotels/{id}/room-types/{roomTypeId}")
    public ResponseEntity<RoomType> replaceRoomType(JwtAuthenticationToken auth,
                                                    @PathVariable("id") Long hotelId,
                                                    @PathVariable Long roomTypeId,
                                                    @RequestBody RoomTypeRequest req) {
        Number uidNum = auth.getToken().getClaim("uid");
        Long ownerId = uidNum == null ? null : uidNum.longValue();
        return ResponseEntity.ok(svc.updateRoomType(ownerId, hotelId, roomTypeId, req));
    }

    // Delete Room Type (owner)
    @DeleteMapping("/hotels/{id}/room-types/{roomTypeId}")
    public ResponseEntity<Void> deleteRoomType(JwtAuthenticationToken auth,
                                               @PathVariable("id") Long hotelId,
                                               @PathVariable Long roomTypeId) {
        Number uidNum = auth.getToken().getClaim("uid");
        Long ownerId = uidNum == null ? null : uidNum.longValue();
        svc.deleteRoomType(ownerId, hotelId, roomTypeId);
        return ResponseEntity.noContent().build();
    }

    // Check Availability for Date Range (public)
    @GetMapping("/hotels/{id}/availability")
    public ResponseEntity<HotelAvailabilityResponse> checkAvailability(
            @PathVariable("id") Long hotelId,
            @RequestParam LocalDate checkIn,
            @RequestParam LocalDate checkOut
    ) {
        return ResponseEntity.ok(svc.checkAvailability(hotelId, checkIn, checkOut));
    }

    // Upload Hotel Image (owner) - multipart/form-data
    @PostMapping(value = "/hotels/{id}/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<HotelImage> uploadImage(JwtAuthenticationToken auth,
                                                  @PathVariable("id") Long hotelId,
                                                  @RequestParam("file") MultipartFile file) throws Exception {
        Number uidNum = auth.getToken().getClaim("uid");
        Long ownerId = uidNum == null ? null : uidNum.longValue();

        String stored = svc.storeFileToUploads(hotelId, file.getOriginalFilename(), file.getBytes());
        return ResponseEntity.ok(svc.saveHotelImage(ownerId, hotelId, stored));
    }
}
