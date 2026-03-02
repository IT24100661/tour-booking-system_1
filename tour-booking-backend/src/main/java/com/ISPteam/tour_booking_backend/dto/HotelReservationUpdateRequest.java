package com.ISPteam.tour_booking_backend.dto;

import java.time.LocalDate;

public class HotelReservationUpdateRequest {
    public String status;     // CONFIRMED / CANCELLED
    public LocalDate checkIn;
    public LocalDate checkOut;
    public Integer rooms;
}
