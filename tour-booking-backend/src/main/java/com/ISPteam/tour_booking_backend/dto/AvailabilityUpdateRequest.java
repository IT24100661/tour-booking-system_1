package com.ISPteam.tour_booking_backend.dto;

import java.time.Instant;

public class AvailabilityUpdateRequest {
    public Instant startAt;
    public Instant endAt;
    public Boolean active;
}
