package com.ISPteam.tour_booking_backend.dto;

import java.util.List;

public class HotelAvailabilityResponse {

    public static class Item {
        public Long roomTypeId;
        public String roomTypeName;
        public Double price;
        public Integer availableRooms;

        public Item(Long roomTypeId, String roomTypeName, Double price, Integer availableRooms) {
            this.roomTypeId = roomTypeId;
            this.roomTypeName = roomTypeName;
            this.price = price;
            this.availableRooms = availableRooms;
        }
    }

    public Long hotelId;
    public String checkIn;
    public String checkOut;
    public List<Item> items;

    public HotelAvailabilityResponse(Long hotelId, String checkIn, String checkOut, List<Item> items) {
        this.hotelId = hotelId;
        this.checkIn = checkIn;
        this.checkOut = checkOut;
        this.items = items;
    }
}
