package com.ISPteam.tour_booking_backend.repo;

import com.ISPteam.tour_booking_backend.entity.HotelReservation;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface HotelReservationRepository extends JpaRepository<HotelReservation, Long> {

    List<HotelReservation> findByTouristIdOrderByCreatedAtDesc(Long touristId);

    @Query("""
      select coalesce(sum(r.rooms), 0) from HotelReservation r
      where r.roomTypeId = :roomTypeId
        and r.status = com.ISPteam.tour_booking_backend.entity.HotelReservation.Status.CONFIRMED
        and r.checkIn < :checkOut
        and r.checkOut > :checkIn
    """)
    long sumReservedRoomsOverlapping(@Param("roomTypeId") Long roomTypeId,
                                     @Param("checkIn") LocalDate checkIn,
                                     @Param("checkOut") LocalDate checkOut);
}
