package com.ISPteam.tour_booking_backend.dto;

import java.time.LocalDate;

public class HotelReservationCreateRequest {
    public Long hotelId;
    public Long roomTypeId;
    public Long touristId; // (better: read from JWT, but keeping like your E2 style)
    public LocalDate checkIn;
    public LocalDate checkOut;
    public Integer rooms;
}
