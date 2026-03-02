import { api } from "./client";

// CREATE
export const apiCreateReview = (body) =>
    api.post("/api/reviews", body).then((r) => r.data);

export const apiCreateReviewReport = (reviewId, body) =>
    api.post(`/api/reviews/${reviewId}/reports`, body).then((r) => r.data);

export const apiCreateProviderResponse = (reviewId, body) =>
    api.post(`/api/reviews/${reviewId}/responses`, body).then((r) => r.data);

// READ
export const apiGetReviewsForTarget = (params) =>
    api.get("/api/reviews", { params }).then((r) => r.data);

export const apiGetReview = (id) =>
    api.get(`/api/reviews/${id}`).then((r) => r.data);

export const apiAdminGetReportedReviews = () =>
    api.get("/api/admin/reviews/reported").then((r) => r.data);

// UPDATE
export const apiUpdateReview = (id, body) =>
    api.patch(`/api/reviews/${id}`, body).then((r) => r.data);

export const apiAdminModerateReview = (id, body) =>
    api.patch(`/api/admin/reviews/${id}`, body).then((r) => r.data);

// DELETE
export const apiDeleteReview = (id) =>
    api.delete(`/api/reviews/${id}`).then((r) => r.data);

export const apiDeleteProviderResponse = (reviewId, responseId) =>
    api.delete(`/api/reviews/${reviewId}/responses/${responseId}`).then((r) => r.data);
