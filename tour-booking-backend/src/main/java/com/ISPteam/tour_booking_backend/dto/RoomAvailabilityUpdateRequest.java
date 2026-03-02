package com.ISPteam.tour_booking_backend.dto;

import java.time.LocalDate;

public class RoomAvailabilityUpdateRequest {
    public LocalDate fromDate;
    public LocalDate toDate;
    public Integer availableRooms;
}
