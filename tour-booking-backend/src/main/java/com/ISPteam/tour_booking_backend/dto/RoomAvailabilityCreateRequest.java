package com.ISPteam.tour_booking_backend.dto;

import java.time.LocalDate;

public class RoomAvailabilityCreateRequest {
    public Long roomTypeId;
    public LocalDate fromDate;
    public LocalDate toDate;
    public Integer availableRooms;
}
