package com.ISPteam.tour_booking_backend.controller;

import com.ISPteam.tour_booking_backend.dto.*;
import com.ISPteam.tour_booking_backend.entity.RoomAvailability;
import com.ISPteam.tour_booking_backend.service.E3HotelService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class E3RoomAvailabilityController {

    private final E3HotelService svc;

    public E3RoomAvailabilityController(E3HotelService svc) {
        this.svc = svc;
    }

    @PostMapping("/room-availability")
    public ResponseEntity<RoomAvailability> create(@RequestBody RoomAvailabilityCreateRequest req) {
        return ResponseEntity.ok(svc.createAvailability(req));
    }

    @PatchMapping("/room-availability/{id}")
    public ResponseEntity<RoomAvailability> patch(@PathVariable Long id,
                                                  @RequestBody RoomAvailabilityUpdateRequest req) {
        return ResponseEntity.ok(svc.updateAvailability(id, req));
    }

    @PutMapping("/room-availability/{id}")
    public ResponseEntity<RoomAvailability> put(@PathVariable Long id,
                                                @RequestBody RoomAvailabilityUpdateRequest req) {
        return ResponseEntity.ok(svc.updateAvailability(id, req));
    }
}
