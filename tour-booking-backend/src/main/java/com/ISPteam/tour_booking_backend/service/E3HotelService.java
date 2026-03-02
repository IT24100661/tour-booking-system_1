package com.ISPteam.tour_booking_backend.service;

import com.ISPteam.tour_booking_backend.dto.*;
import com.ISPteam.tour_booking_backend.entity.*;
import com.ISPteam.tour_booking_backend.repo.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.nio.file.*;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class E3HotelService {

    private final HotelRepository hotels;
    private final RoomTypeRepository roomTypes;
    private final RoomAvailabilityRepository availability;
    private final HotelReservationRepository reservations;
    private final HotelImageRepository images;

    public E3HotelService(HotelRepository hotels,
                          RoomTypeRepository roomTypes,
                          RoomAvailabilityRepository availability,
                          HotelReservationRepository reservations,
                          HotelImageRepository images) {
        this.hotels = hotels;
        this.roomTypes = roomTypes;
        this.availability = availability;
        this.reservations = reservations;
        this.images = images;
    }

    // CREATE HOTEL
    public Hotel createHotel(Long ownerId, HotelCreateRequest req) {
        if (ownerId == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        if (req == null || req.name == null || req.name.isBlank())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Hotel name required");

        Hotel h = new Hotel();
        h.setOwnerId(ownerId);
        h.setName(req.name);
        h.setLocation(req.location);
        h.setDescription(req.description);
        h.setFacilities(req.facilities);
        h.setPhone(req.phone);
        h.setAddress(req.address);
        return hotels.save(h);
    }

    // SEARCH HOTELS
    public List<Hotel> searchHotels(String location, Double minPrice, Double maxPrice, String facilities) {
        List<Hotel> base = hotels.searchBase(location, facilities);

        if (minPrice == null && maxPrice == null) return base;

        // filter by "any room type price in range"
        return base.stream().filter(h -> {
            List<RoomType> rts = roomTypes.findByHotelId(h.getId());
            return rts.stream().anyMatch(rt -> {
                if (rt.getPrice() == null) return false;
                if (minPrice != null && rt.getPrice() < minPrice) return false;
                if (maxPrice != null && rt.getPrice() > maxPrice) return false;
                return true;
            });
        }).collect(Collectors.toList());
    }

    // DETAILS + IMAGES
    public HotelDetailsResponse getHotelDetails(Long hotelId) {
        Hotel h = hotels.findById(hotelId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Hotel not found"));
        return new HotelDetailsResponse(
                h,
                roomTypes.findByHotelId(hotelId),
                images.findByHotelId(hotelId)
        );
    }

    // UPDATE HOTEL
    public Hotel updateHotel(Long ownerId, Long hotelId, HotelUpdateRequest req) {
        Hotel h = hotels.findById(hotelId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Hotel not found"));
        if (!Objects.equals(h.getOwnerId(), ownerId))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your hotel");

        if (req.name != null) h.setName(req.name);
        if (req.location != null) h.setLocation(req.location);
        if (req.description != null) h.setDescription(req.description);
        if (req.facilities != null) h.setFacilities(req.facilities);
        if (req.phone != null) h.setPhone(req.phone);
        if (req.address != null) h.setAddress(req.address);

        return hotels.save(h);
    }

    public void deleteHotel(Long ownerId, Long hotelId) {
        Hotel h = hotels.findById(hotelId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Hotel not found"));
        if (!Objects.equals(h.getOwnerId(), ownerId))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your hotel");
        hotels.delete(h);
    }

    // ROOM TYPES CRUD
    public RoomType createRoomType(Long ownerId, Long hotelId, RoomTypeRequest req) {
        Hotel h = hotels.findById(hotelId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Hotel not found"));
        if (!Objects.equals(h.getOwnerId(), ownerId))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your hotel");

        if (req.name == null || req.name.isBlank())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Room type name required");
        if (req.price == null || req.price < 0)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid price");
        if (req.capacity == null || req.capacity < 1)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid capacity");

        RoomType rt = new RoomType();
        rt.setHotelId(hotelId);
        rt.setName(req.name);
        rt.setPrice(req.price);
        rt.setCapacity(req.capacity);
        return roomTypes.save(rt);
    }

    public RoomType updateRoomType(Long ownerId, Long hotelId, Long roomTypeId, RoomTypeRequest req) {
        Hotel h = hotels.findById(hotelId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Hotel not found"));
        if (!Objects.equals(h.getOwnerId(), ownerId))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your hotel");

        RoomType rt = roomTypes.findById(roomTypeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Room type not found"));
        if (!Objects.equals(rt.getHotelId(), hotelId))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Room type not in this hotel");

        if (req.name != null) rt.setName(req.name);
        if (req.price != null) rt.setPrice(req.price);
        if (req.capacity != null) rt.setCapacity(req.capacity);

        return roomTypes.save(rt);
    }

    public void deleteRoomType(Long ownerId, Long hotelId, Long roomTypeId) {
        Hotel h = hotels.findById(hotelId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Hotel not found"));
        if (!Objects.equals(h.getOwnerId(), ownerId))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your hotel");

        RoomType rt = roomTypes.findById(roomTypeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Room type not found"));
        if (!Objects.equals(rt.getHotelId(), hotelId))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Room type not in this hotel");

        roomTypes.delete(rt);
    }

    // ROOM AVAILABILITY CRUD
    public RoomAvailability createAvailability(RoomAvailabilityCreateRequest req) {
        if (req.roomTypeId == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "roomTypeId required");
        if (req.fromDate == null || req.toDate == null || !req.toDate.isAfter(req.fromDate))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid from/to");
        if (req.availableRooms == null || req.availableRooms < 0)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid availableRooms");

        roomTypes.findById(req.roomTypeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Room type not found"));

        RoomAvailability a = new RoomAvailability();
        a.setRoomTypeId(req.roomTypeId);
        a.setFromDate(req.fromDate);
        a.setToDate(req.toDate);
        a.setAvailableRooms(req.availableRooms);
        return availability.save(a);
    }

    public RoomAvailability updateAvailability(Long id, RoomAvailabilityUpdateRequest req) {
        RoomAvailability a = availability.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Availability not found"));

        if (req.fromDate != null) a.setFromDate(req.fromDate);
        if (req.toDate != null) a.setToDate(req.toDate);
        if (req.availableRooms != null) a.setAvailableRooms(req.availableRooms);

        return availability.save(a);
    }

    // RESERVATIONS CRUD
    public HotelReservation createReservation(HotelReservationCreateRequest req) {
        if (req.hotelId == null || req.roomTypeId == null || req.touristId == null)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Missing fields");
        if (req.checkIn == null || req.checkOut == null || !req.checkOut.isAfter(req.checkIn))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid dates");
        if (req.rooms == null || req.rooms < 1)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid rooms");

        Hotel h = hotels.findById(req.hotelId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Hotel not found"));

        RoomType rt = roomTypes.findById(req.roomTypeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Room type not found"));
        if (!Objects.equals(rt.getHotelId(), h.getId()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Room type not in this hotel");

        int free = computeAvailableRooms(req.roomTypeId, req.checkIn, req.checkOut);
        if (req.rooms > free)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Not enough rooms available");

        HotelReservation r = new HotelReservation();
        r.setHotelId(req.hotelId);
        r.setRoomTypeId(req.roomTypeId);
        r.setTouristId(req.touristId);
        r.setCheckIn(req.checkIn);
        r.setCheckOut(req.checkOut);
        r.setRooms(req.rooms);
        r.setStatus(HotelReservation.Status.CONFIRMED);
        return reservations.save(r);
    }

    public List<HotelReservation> getTouristReservations(Long touristId) {
        return reservations.findByTouristIdOrderByCreatedAtDesc(touristId);
    }

    public HotelReservation updateReservation(Long id, HotelReservationUpdateRequest req) {
        HotelReservation r = reservations.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Reservation not found"));

        if (req.checkIn != null) r.setCheckIn(req.checkIn);
        if (req.checkOut != null) r.setCheckOut(req.checkOut);
        if (req.rooms != null) r.setRooms(req.rooms);

        if (req.status != null) {
            try {
                r.setStatus(HotelReservation.Status.valueOf(req.status));
            } catch (Exception e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid status");
            }
        }

        return reservations.save(r);
    }

    public void deleteReservation(Long id) {
        reservations.deleteById(id);
    }

    // AVAILABILITY CHECK ENDPOINT
    public HotelAvailabilityResponse checkAvailability(Long hotelId, LocalDate checkIn, LocalDate checkOut) {
        hotels.findById(hotelId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Hotel not found"));
        if (checkIn == null || checkOut == null || !checkOut.isAfter(checkIn))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid dates");

        List<RoomType> rts = roomTypes.findByHotelId(hotelId);
        List<HotelAvailabilityResponse.Item> items = new ArrayList<>();

        for (RoomType rt : rts) {
            int free = computeAvailableRooms(rt.getId(), checkIn, checkOut);
            items.add(new HotelAvailabilityResponse.Item(rt.getId(), rt.getName(), rt.getPrice(), free));
        }

        return new HotelAvailabilityResponse(hotelId, checkIn.toString(), checkOut.toString(), items);
    }

    private int computeAvailableRooms(Long roomTypeId, LocalDate checkIn, LocalDate checkOut) {
        // Find availability records that fully cover the date range
        List<RoomAvailability> aList =
                availability.findByRoomTypeIdAndFromDateLessThanEqualAndToDateGreaterThanEqual(roomTypeId, checkIn, checkOut);

        int base = aList.stream()
                .map(RoomAvailability::getAvailableRooms)
                .max(Integer::compareTo)
                .orElse(0);

        long reserved = reservations.sumReservedRoomsOverlapping(roomTypeId, checkIn, checkOut);

        int free = (int) (base - reserved);
        return Math.max(free, 0);
    }

    // IMAGE UPLOAD (store file + create row)
    public HotelImage saveHotelImage(Long ownerId, Long hotelId, String storedUrlOrPath) {
        Hotel h = hotels.findById(hotelId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Hotel not found"));
        if (!Objects.equals(h.getOwnerId(), ownerId))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your hotel");

        HotelImage img = new HotelImage();
        img.setHotelId(hotelId);
        img.setUrl(storedUrlOrPath);
        return images.save(img);
    }

    public String storeFileToUploads(Long hotelId, String originalFilename, byte[] bytes) {
        try {
            String safeName = UUID.randomUUID() + "_" + (originalFilename == null ? "image" : originalFilename.replaceAll("[^a-zA-Z0-9._-]", "_"));
            Path dir = Paths.get("uploads", "hotels", String.valueOf(hotelId));
            Files.createDirectories(dir);
            Path filePath = dir.resolve(safeName);
            Files.write(filePath, bytes, StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);
            return "/uploads/hotels/" + hotelId + "/" + safeName; // you can serve this via static mapping later
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "File save failed");
        }
    }
}
