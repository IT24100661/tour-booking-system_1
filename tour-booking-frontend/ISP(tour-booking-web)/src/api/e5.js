import { api } from "./client";

// BOOKINGS
export const apiCreateBooking = (body) =>
    api.post("/api/bookings", body).then((r) => r.data);

export const apiGetBooking = (id) =>
    api.get(`/api/bookings/${id}`).then((r) => r.data);

export const apiSearchBookings = (params) =>
    api.get("/api/bookings", { params }).then((r) => r.data);

export const apiUpdateBooking = (id, body) =>
    api.patch(`/api/bookings/${id}`, body).then((r) => r.data);

export const apiDeleteBooking = (id) =>
    api.delete(`/api/bookings/${id}`).then((r) => r.data);

// PAYMENTS
export const apiCreatePayment = (body) =>
    api.post("/api/payments", body).then((r) => r.data);

export const apiGetPayments = (params) =>
    api.get("/api/payments", { params }).then((r) => r.data);

export const apiUpdatePayment = (id, body) =>
    api.patch(`/api/payments/${id}`, body).then((r) => r.data);

export const apiDeletePayment = (id) =>
    api.delete(`/api/payments/${id}`).then((r) => r.data);

// ADMIN PAYMENTS (monitoring)
export const apiAdminGetPayments = (params) =>
    api.get("/api/admin/payments", { params }).then((r) => r.data);

export const apiAdminUpdatePayment = (id, body) =>
    api.patch(`/api/admin/payments/${id}`, body).then((r) => r.data);

// NOTIFICATIONS (payments)
export const apiNotifyPayment = (body) =>
    api.post("/api/notifications/payments", body).then((r) => r.data);

// INVOICE
export const apiCreateInvoice = (bookingId) =>
    api.post(`/api/bookings/${bookingId}/invoice`).then((r) => r.data);

// Download (PDF or file)
export const apiDownloadInvoice = (bookingId) =>
    api.get(`/api/bookings/${bookingId}/invoice`, { responseType: "blob" }).then((r) => r);
