package com.ISPteam.tour_booking_backend.controller;

import com.ISPteam.tour_booking_backend.dto.HotelProfileRequest;
import com.ISPteam.tour_booking_backend.entity.HotelProfile;
import com.ISPteam.tour_booking_backend.service.ProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class HotelProfileController {

    private final ProfileService profiles;

    public HotelProfileController(ProfileService profiles) {
        this.profiles = profiles;
    }

    @PostMapping("/hotels/profile")
    public ResponseEntity<HotelProfile> createHotelProfile(JwtAuthenticationToken auth,
                                                           @RequestBody HotelProfileRequest req) {
        Number uidNum = auth.getToken().getClaim("uid");
        Long uid = uidNum == null ? null : uidNum.longValue();
        return ResponseEntity.ok(profiles.createHotelProfile(uid, req));
    }

    @GetMapping("/hotels/{id}/profile")
    public ResponseEntity<HotelProfile> getHotelProfile(@PathVariable Long id) {
        return ResponseEntity.ok(profiles.getHotelProfile(id));
    }

    @PatchMapping("/hotels/{id}/profile")
    public ResponseEntity<HotelProfile> updateHotelProfile(@PathVariable Long id,
                                                           @RequestBody HotelProfileRequest req) {
        return ResponseEntity.ok(profiles.updateHotelProfile(id, req));
    }

    @PutMapping("/hotels/{id}/profile")
    public ResponseEntity<HotelProfile> replaceHotelProfile(@PathVariable Long id,
                                                            @RequestBody HotelProfileRequest req) {
        return ResponseEntity.ok(profiles.updateHotelProfile(id, req));
    }
}
