package com.ISPteam.tour_booking_backend.controller;

import com.ISPteam.tour_booking_backend.dto.GuideProfileRequest;
import com.ISPteam.tour_booking_backend.entity.GuideProfile;
import com.ISPteam.tour_booking_backend.service.ProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class GuideProfileController {

    private final ProfileService profiles;

    public GuideProfileController(ProfileService profiles) {
        this.profiles = profiles;
    }

    @PostMapping("/guides/profile")
    public ResponseEntity<GuideProfile> createGuideProfile(JwtAuthenticationToken auth, @RequestBody GuideProfileRequest req) {
        Long uid = auth.getToken().getClaim("uid");
        return ResponseEntity.ok(profiles.createGuideProfile(uid, req));
    }

    @GetMapping("/guides/{id}/profile")
    public ResponseEntity<GuideProfile> getGuideProfile(@PathVariable Long id) {
        return ResponseEntity.ok(profiles.getGuideProfile(id));
    }

    @PatchMapping("/guides/{id}/profile")
    public ResponseEntity<GuideProfile> updateGuideProfile(@PathVariable Long id, @RequestBody GuideProfileRequest req) {
        return ResponseEntity.ok(profiles.updateGuideProfile(id, req));
    }

    @PutMapping("/guides/{id}/profile")
    public ResponseEntity<GuideProfile> replaceGuideProfile(@PathVariable Long id, @RequestBody GuideProfileRequest req) {
        return ResponseEntity.ok(profiles.updateGuideProfile(id, req));
    }
}
