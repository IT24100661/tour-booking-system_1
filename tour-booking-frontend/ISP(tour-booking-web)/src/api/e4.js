import { api } from "./client";

// PLACES
export const apiCreatePlace = (body) =>
    api.post("/api/places", body).then((r) => r.data);

export const apiGetPlace = (id) =>
    api.get(`/api/places/${id}`).then((r) => r.data);

export const apiSearchPlaces = (params) =>
    api.get("/api/places", { params }).then((r) => r.data);

export const apiUpdatePlace = (id, body) =>
    api.patch(`/api/places/${id}`, body).then((r) => r.data);

export const apiDeletePlace = (id) =>
    api.delete(`/api/places/${id}`).then((r) => r.data);

// NEARBY SERVICES
export const apiCreateNearbyService = (placeId, body) =>
    api.post(`/api/places/${placeId}/nearby-services`, body).then((r) => r.data);

export const apiUpdateNearbyService = (placeId, serviceId, body) =>
    api.patch(`/api/places/${placeId}/nearby-services/${serviceId}`, body).then((r) => r.data);

export const apiDeleteNearbyService = (placeId, serviceId) =>
    api.delete(`/api/places/${placeId}/nearby-services/${serviceId}`).then((r) => r.data);

// NEARBY (hotels + guides)
export const apiGetPlaceNearby = (placeId) =>
    api.get(`/api/places/${placeId}/nearby`).then((r) => r.data);

// MAP DATA
export const apiGetPlaceMap = (placeId) =>
    api.get(`/api/places/${placeId}/map`).then((r) => r.data);

// FAVORITES (tourist)
export const apiAddFavoritePlace = (userId, placeId) =>
    api.post(`/api/users/${userId}/favorites/places`, { placeId }).then((r) => r.data);

export const apiGetFavoritePlaces = (userId) =>
    api.get(`/api/users/${userId}/favorites/places`).then((r) => r.data);

export const apiRemoveFavoritePlace = (userId, placeId) =>
    api.delete(`/api/users/${userId}/favorites/places/${placeId}`).then((r) => r.data);
