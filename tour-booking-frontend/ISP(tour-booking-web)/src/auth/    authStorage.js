const TOKEN_KEY = 'tb_token'
const USER_KEY = 'tb_user'

export function getToken() {
    return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
    if (!token) return
    localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
    localStorage.removeItem(TOKEN_KEY)
}

export function getUser() {
    const raw = localStorage.getItem(USER_KEY)
    if (!raw) return null
    try { return JSON.parse(raw) } catch { return null }
}

export function setUser(user) {
    if (!user) return
    localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearUser() {
    localStorage.removeItem(USER_KEY)
}
