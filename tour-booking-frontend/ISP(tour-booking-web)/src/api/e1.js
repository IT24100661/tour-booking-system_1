import { api } from './client'

export async function apiRegisterUser(payload) {
    // POST /api/users [file:1]
    const { data } = await api.post('/api/users', payload)
    return data
}

export async function apiLogin(payload) {
    // POST /api/auth/login [file:1]
    const { data } = await api.post('/api/auth/login', payload)
    return data
}

export async function apiLogout() {
    // DELETE /api/auth/logout [file:1]
    const { data } = await api.delete('/api/auth/logout')
    return data
}

export async function apiGetUser(id) {
    // GET /api/users/{id} [file:1]
    const { data } = await api.get(`/api/users/${id}`)
    return data
}

export async function apiUpdateUser(id, payload, method = 'patch') {
    // PUT/PATCH /api/users/{id} [file:1]
    const fn = method.toLowerCase() === 'put' ? api.put : api.patch
    const { data } = await fn(`/api/users/${id}`, payload)
    return data
}

export async function apiDeleteUser(id) {
    // DELETE /api/users/{id} [file:1]
    const { data } = await api.delete(`/api/users/${id}`)
    return data
}

export async function apiRequestVerifyEmail(payload) {
    // POST /api/auth/verify-email/request [file:1]
    const { data } = await api.post('/api/auth/verify-email/request', payload)
    return data
}

export async function apiVerifyEmail(payload) {
    // PUT /api/auth/verify-email [file:1]
    const { data } = await api.put('/api/auth/verify-email', payload)
    return data
}

export async function apiResetPassword(payload) {
    // PUT /api/auth/password/reset [file:1]
    const { data } = await api.put('/api/auth/password/reset', payload)
    return data
}

export async function apiCreateGuideProfile(payload) {
    // POST /api/guides/profile [file:1]
    const { data } = await api.post('/api/guides/profile', payload)
    return data
}

export async function apiGetGuideProfile(guideId) {
    // GET /api/guides/{id}/profile [file:1]
    const { data } = await api.get(`/api/guides/${guideId}/profile`)
    return data
}

export async function apiUpdateGuideProfile(guideId, payload, method = 'patch') {
    // PUT/PATCH /api/guides/{id}/profile [file:1]
    const fn = method.toLowerCase() === 'put' ? api.put : api.patch
    const { data } = await fn(`/api/guides/${guideId}/profile`, payload)
    return data
}

export async function apiCreateHotelProfile(payload) {
    // POST /api/hotels/profile [file:1]
    const { data } = await api.post('/api/hotels/profile', payload)
    return data
}

export async function apiGetHotelProfile(hotelOwnerId) {
    // GET /api/hotels/{id}/profile [file:1]
    const { data } = await api.get(`/api/hotels/${hotelOwnerId}/profile`)
    return data
}

export async function apiUpdateHotelProfile(hotelOwnerId, payload, method = 'patch') {
    // PUT/PATCH /api/hotels/{id}/profile [file:1]
    const fn = method.toLowerCase() === 'put' ? api.put : api.patch
    const { data } = await fn(`/api/hotels/${hotelOwnerId}/profile`, payload)
    return data
}
export async function apiGetGuideDashboard() {
    const { data } = await api.get('/api/dashboard/guide');
    return data;
}

export async function apiGetHotelDashboard() {
    const { data } = await api.get('/api/dashboard/hotel');
    return data;
}

export async function apiGetAdminDashboard() {
    const { data } = await api.get('/api/dashboard/admin');
    return data;
}
