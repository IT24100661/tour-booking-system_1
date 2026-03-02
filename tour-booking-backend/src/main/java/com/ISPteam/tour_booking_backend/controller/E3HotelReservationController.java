package com.ISPteam.tour_booking_backend.controller;

import com.ISPteam.tour_booking_backend.dto.*;
import com.ISPteam.tour_booking_backend.entity.HotelReservation;
import com.ISPteam.tour_booking_backend.service.E3HotelService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class E3HotelReservationController {

    private final E3HotelService svc;

    public E3HotelReservationController(E3HotelService svc) {
        this.svc = svc;
    }

    @PostMapping("/hotel-reservations")
    public ResponseEntity<HotelReservation> create(@RequestBody HotelReservationCreateRequest req) {
        return ResponseEntity.ok(svc.createReservation(req));
    }

    @GetMapping("/hotel-reservations")
    public ResponseEntity<List<HotelReservation>> getTouristReservations(@RequestParam Long touristId) {
        return ResponseEntity.ok(svc.getTouristReservations(touristId));
    }

    @PatchMapping("/hotel-reservations/{id}")
    public ResponseEntity<HotelReservation> patch(@PathVariable Long id,
                                                  @RequestBody HotelReservationUpdateRequest req) {
        return ResponseEntity.ok(svc.updateReservation(id, req));
    }

    @PutMapping("/hotel-reservations/{id}")
    public ResponseEntity<HotelReservation> put(@PathVariable Long id,
                                                @RequestBody HotelReservationUpdateRequest req) {
        return ResponseEntity.ok(svc.updateReservation(id, req));
    }

    @DeleteMapping("/hotel-reservations/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        svc.deleteReservation(id);
        return ResponseEntity.noContent().build();
    }
}
