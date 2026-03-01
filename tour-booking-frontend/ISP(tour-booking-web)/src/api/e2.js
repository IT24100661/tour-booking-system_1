import { api } from "./client";

// READ: search guides
export async function apiSearchGuides({ location = "", language = "", ratingMin = "" } = {}) {
    const { data } = await api.get("/api/guides", {
        params: { location, language, ratingMin },
    });
    return data;
}

// READ: guide detail
export async function apiGetGuide(id) {
    const { data } = await api.get(`/api/guides/${id}`);
    return data;
}

// Availability CRUD
export async function apiGetAvailability(guideId) {
    const { data } = await api.get(`/api/guides/${guideId}/availability`);
    return data;
}

export async function apiCreateAvailabilitySlot(guideId, payload) {
    const { data } = await api.post(`/api/guides/${guideId}/availability`, payload);
    return data;
}

export async function apiUpdateAvailabilitySlot(guideId, slotId, payload) {
    const { data } = await api.patch(`/api/guides/${guideId}/availability/${slotId}`, payload);
    return data;
}

export async function apiDeleteAvailabilitySlot(guideId, slotId) {
    const { data } = await api.delete(`/api/guides/${guideId}/availability/${slotId}`);
    return data;
}

// Booking request + accept/reject
export async function apiCreateBookingRequest(payload) {
    const { data } = await api.post("/api/guide-booking-requests", payload);
    return data;
}

export async function apiGetBookingRequestsForGuide(guideId) {
    const { data } = await api.get("/api/guide-booking-requests", { params: { guideId } });
    return data;
}

export async function apiUpdateBookingRequest(requestId, status) {
    const { data } = await api.put(`/api/guide-booking-requests/${requestId}`, { status });
    return data;
}

// Confirmed bookings
export async function apiCreateGuideBooking(payload) {
    const { data } = await api.post("/api/guide-bookings", payload);
    return data;
}

export async function apiGetTouristGuideBookings(touristId) {
    const { data } = await api.get("/api/guide-bookings", { params: { touristId } });
    return data;
}
