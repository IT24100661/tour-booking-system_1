package com.ISPteam.tour_booking_backend.repo;

import com.ISPteam.tour_booking_backend.entity.Hotel;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface HotelRepository extends JpaRepository<Hotel, Long> {

    @Query("""
      select h from Hotel h
      where (:location is null or :location = '' or lower(h.location) like lower(concat('%', :location, '%')))
        and (:facilities is null or :facilities = '' or lower(h.facilities) like lower(concat('%', :facilities, '%')))
    """)
    List<Hotel> searchBase(@Param("location") String location,
                           @Param("facilities") String facilities);

    List<Hotel> findByOwnerId(Long ownerId);
}
