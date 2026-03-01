package com.ISPteam.tour_booking_backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "guide_profiles")
public class GuideProfile {
    @Id
    private Long id; // same as userId (GUIDE user)

    @Column(nullable = false)
    private String name;

    private String location;
    private String languages; // CSV: "English,Sinhala"
    private Double ratingAvg;
    private Integer ratingCount;
    private Double price;

    @Column(length = 2000)
    private String bio;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getLanguages() { return languages; }
    public void setLanguages(String languages) { this.languages = languages; }

    public Double getRatingAvg() { return ratingAvg; }
    public void setRatingAvg(Double ratingAvg) { this.ratingAvg = ratingAvg; }

    public Integer getRatingCount() { return ratingCount; }
    public void setRatingCount(Integer ratingCount) { this.ratingCount = ratingCount; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
}
