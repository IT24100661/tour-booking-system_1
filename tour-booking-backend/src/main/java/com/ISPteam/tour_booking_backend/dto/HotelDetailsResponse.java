package com.ISPteam.tour_booking_backend.dto;

import com.ISPteam.tour_booking_backend.entity.Hotel;
import com.ISPteam.tour_booking_backend.entity.HotelImage;
import com.ISPteam.tour_booking_backend.entity.RoomType;

import java.util.List;

public class HotelDetailsResponse {
    public Hotel hotel;
    public List<RoomType> roomTypes;
    public List<HotelImage> images;

    public HotelDetailsResponse(Hotel hotel, List<RoomType> roomTypes, List<HotelImage> images) {
        this.hotel = hotel;
        this.roomTypes = roomTypes;
        this.images = images;
    }
}
