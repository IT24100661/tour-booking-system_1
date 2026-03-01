import React, { createContext, useContext, useMemo, useState } from 'react'
import { clearToken, clearUser, getToken, getUser, setToken, setUser } from './authStorage.js'

const AuthCtx = createContext(null)

export function AuthProvider({ children }) {
    const [token, setTokenState] = useState(getToken())
    const [user, setUserState] = useState(getUser())

    const saveAuth = ({ token, user }) => {
        if (token) {
            setToken(token)
            setTokenState(token)
        }
        if (user) {
            setUser(user)
            setUserState(user)
        }
    }

    const clearAuth = () => {
        clearToken()
        clearUser()
        setTokenState(null)
        setUserState(null)
    }

    const value = useMemo(() => ({ token, user, saveAuth, clearAuth }), [token, user])
    return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}

export function useAuth() {
    return useContext(AuthCtx)
}
