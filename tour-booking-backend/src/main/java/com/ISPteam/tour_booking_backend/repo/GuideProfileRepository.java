package com.ISPteam.tour_booking_backend.repo;

import com.ISPteam.tour_booking_backend.entity.GuideProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface GuideProfileRepository extends JpaRepository<GuideProfile, Long> {

    @Query("""
      select g from GuideProfile g
      where (:location is null or :location = '' or lower(g.location) like lower(concat('%', :location, '%')))
        and (:language is null or :language = '' or lower(g.languages) like lower(concat('%', :language, '%')))
        and (:ratingMin is null or g.ratingAvg >= :ratingMin)
    """)
    List<GuideProfile> search(@Param("location") String location,
                              @Param("language") String language,
                              @Param("ratingMin") Double ratingMin);
}
