import { api } from "./client";

// HOTEL CRUD
export const apiCreateHotel = (body) =>
    api.post("/api/hotels", body).then((r) => r.data);

export const apiSearchHotels = (params) =>
    api.get("/api/hotels", { params }).then((r) => r.data);

export const apiGetHotelDetails = (id) =>
    api.get(`/api/hotels/${id}`).then((r) => r.data);

export const apiUpdateHotel = (id, body) =>
    api.patch(`/api/hotels/${id}`, body).then((r) => r.data);

export const apiDeleteHotel = (id) =>
    api.delete(`/api/hotels/${id}`).then((r) => r.data);

// ROOM TYPES
export const apiCreateRoomType = (hotelId, body) =>
    api.post(`/api/hotels/${hotelId}/room-types`, body).then((r) => r.data);

export const apiUpdateRoomType = (hotelId, roomTypeId, body) =>
    api.patch(`/api/hotels/${hotelId}/room-types/${roomTypeId}`, body).then((r) => r.data);

export const apiDeleteRoomType = (hotelId, roomTypeId) =>
    api.delete(`/api/hotels/${hotelId}/room-types/${roomTypeId}`).then((r) => r.data);

// ROOM AVAILABILITY
export const apiCreateRoomAvailability = (body) =>
    api.post("/api/room-availability", body).then((r) => r.data);

export const apiUpdateRoomAvailability = (id, body) =>
    api.patch(`/api/room-availability/${id}`, body).then((r) => r.data);

// SEARCH availability by date range (per hotel)
export const apiCheckHotelAvailability = (hotelId, params) =>
    api.get(`/api/hotels/${hotelId}/availability`, { params }).then((r) => r.data);

// RESERVATIONS
export const apiCreateHotelReservation = (body) =>
    api.post("/api/hotel-reservations", body).then((r) => r.data);

export const apiGetTouristReservations = (touristId) =>
    api.get("/api/hotel-reservations", { params: { touristId } }).then((r) => r.data);

export const apiUpdateReservation = (id, body) =>
    api.patch(`/api/hotel-reservations/${id}`, body).then((r) => r.data);

export const apiDeleteReservation = (id) =>
    api.delete(`/api/hotel-reservations/${id}`).then((r) => r.data);

// IMAGE UPLOAD (multipart/form-data)
export const apiUploadHotelImage = async (hotelId, file) => {
    const form = new FormData();
    form.append("file", file);

    const { data } = await api.post(`/api/hotels/${hotelId}/images`, form, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
};
