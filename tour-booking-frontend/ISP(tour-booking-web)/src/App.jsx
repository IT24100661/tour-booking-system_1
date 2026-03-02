import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "./auth/AuthContext.jsx";
import { apiLogout } from "./api/e1";

export default function App() {
    const { token, user, clearAuth } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await apiLogout();
        } catch (e) {
            // ignore network errors on logout
        } finally {
            clearAuth();
            navigate("/login");
        }
    };

    return (
        <div className="container">
            <header className="topbar">
                <div className="brand">TravelZone</div>

                <nav className="nav">
                    {/* Public */}
                    <Link to="/">Home</Link>
                    {!token && <Link to="/register">Register</Link>}
                    {!token && <Link to="/login">Login</Link>}
                    <Link to="/verify-email">Verify Email</Link>
                    <Link to="/password-reset">Reset Password</Link>

                    {/* E2 Public */}
                    <Link to="/guides">Guides</Link>

                    {/* E3 Public */}
                    <Link to="/hotels">Hotels</Link>

                    {/* E4 Public */}
                    <Link to="/places">Places</Link>

                    {/* Protected */}
                    {token && <Link to="/dashboard">Dashboard</Link>}
                    {token && user?.id && <Link to={`/users/${user.id}`}>My Profile</Link>}

                    {/* Profiles (protected in your router) */}
                    {token && <Link to="/guides/profile">Guide Profile</Link>}
                    {token && <Link to="/hotels/profile">Hotel Profile</Link>}

                    {/* E2 Protected */}
                    {token && <Link to="/guide/availability">My Availability</Link>}
                    {token && <Link to="/guide/requests">Requests</Link>}
                    {token && <Link to="/my-bookings/guides">My Guide Bookings</Link>}

                    {/* E3 Protected */}
                    {token && <Link to="/owner/hotels/new">Create Hotel</Link>}
                    {token && <Link to="/my-reservations/hotels">My Reservations</Link>}

                    {/* E4 Protected */}
                    {token && <Link to="/my-favorites/places">My Favorite Places</Link>}
                    {token && <Link to="/admin/places/new">Admin: Add Place</Link>}

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
    );
}
