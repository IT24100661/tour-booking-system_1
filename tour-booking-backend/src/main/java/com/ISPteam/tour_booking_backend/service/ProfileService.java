package com.ISPteam.tour_booking_backend.service;

import com.ISPteam.tour_booking_backend.dto.*;
import com.ISPteam.tour_booking_backend.entity.*;
import com.ISPteam.tour_booking_backend.repo.*;
import org.springframework.stereotype.Service;

@Service
public class ProfileService {

    private final UserRepository users;
    private final GuideProfileRepository guides;
    private final HotelProfileRepository hotels;

    public ProfileService(UserRepository users, GuideProfileRepository guides, HotelProfileRepository hotels) {
        this.users = users;
        this.guides = guides;
        this.hotels = hotels;
    }

    public GuideProfile createGuideProfile(Long userId, GuideProfileRequest req) {
        User u = users.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));
        if (u.getRole() != Role.GUIDE) throw new IllegalArgumentException("User is not GUIDE");
        if (guides.existsByUser_Id(userId)) throw new IllegalArgumentException("Guide profile already exists");

        GuideProfile gp = new GuideProfile();
        gp.setUser(u);
        gp.setExperience(req.experience);
        gp.setLanguages(req.languages);
        gp.setPrice(req.price);
        gp.setBio(req.bio);
        return guides.save(gp);
    }

    public GuideProfile getGuideProfile(Long guideUserId) {
        return guides.findByUser_Id(guideUserId).orElseThrow(() -> new IllegalArgumentException("Guide profile not found"));
    }

    public GuideProfile updateGuideProfile(Long guideUserId, GuideProfileRequest req) {
        GuideProfile gp = getGuideProfile(guideUserId);
        if (req.experience != null) gp.setExperience(req.experience);
        if (req.languages != null) gp.setLanguages(req.languages);
        if (req.price != null) gp.setPrice(req.price);
        if (req.bio != null) gp.setBio(req.bio);
        return guides.save(gp);
    }

    public HotelProfile createHotelProfile(Long userId, HotelProfileRequest req) {
        User u = users.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));
        if (u.getRole() != Role.HOTEL_OWNER) throw new IllegalArgumentException("User is not HOTEL_OWNER");
        if (hotels.existsByUser_Id(userId)) throw new IllegalArgumentException("Hotel profile already exists");

        HotelProfile hp = new HotelProfile();
        hp.setUser(u);
        hp.setBusinessName(req.businessName);
        hp.setAddress(req.address);
        hp.setPhone(req.phone);
        hp.setDescription(req.description);
        return hotels.save(hp);
    }

    public HotelProfile getHotelProfile(Long ownerUserId) {
        return hotels.findByUser_Id(ownerUserId).orElseThrow(() -> new IllegalArgumentException("Hotel profile not found"));
    }

    public HotelProfile updateHotelProfile(Long ownerUserId, HotelProfileRequest req) {
        HotelProfile hp = getHotelProfile(ownerUserId);
        if (req.businessName != null) hp.setBusinessName(req.businessName);
        if (req.address != null) hp.setAddress(req.address);
        if (req.phone != null) hp.setPhone(req.phone);
        if (req.description != null) hp.setDescription(req.description);
        return hotels.save(hp);
    }
}
