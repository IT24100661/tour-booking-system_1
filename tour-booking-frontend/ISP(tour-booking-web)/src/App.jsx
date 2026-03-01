import React from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from './/auth/    AuthContext.jsx'
import { apiLogout } from './api/e1'

export default function App() {
    const { token, user, clearAuth } = useAuth()
    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            await apiLogout()
        } catch (e) {
            // ignore network errors on logout
        } finally {
            clearAuth()
            navigate('/login')
        }
    }

    return (
        <div className="container">
            <header className="topbar">
                <div className="brand">TravelZone</div>
                <nav className="nav">
                    <Link to="/">Home</Link>
                    {!token && <Link to="/register">Register</Link>}
                    {!token && <Link to="/login">Login</Link>}
                    <Link to="/verify-email">Verify Email</Link>
                    <Link to="/password-reset">Reset Password</Link>
                    {token && <Link to="/dashboard">Dashboard</Link>}
                    {token && user?.id && <Link to={`/users/${user.id}`}>My Profile</Link>}
                    {token && <Link to="/guides/profile">Guide Profile</Link>}
                    {token && <Link to="/hotels/profile">Hotel Profile</Link>}
                    {token && (
                        <button className="linkBtn" onClick={handleLogout}>
                            Logout
                        </button>
                    )}
                </nav>
            </header>

            <main className="main">
                <Outlet />
            </main>
        </div>
    )
}
