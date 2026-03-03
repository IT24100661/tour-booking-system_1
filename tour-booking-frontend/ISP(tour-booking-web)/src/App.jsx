import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "./auth/AuthContext.jsx";
import { apiLogout } from "./api/e1";
import "./App.css";

/* ══════════════════════════════════════════
   ROLE CONFIG — Add/remove links here only
══════════════════════════════════════════ */
const ROLE_DISPLAY = {
    TOURIST: {
        label: "Tourist",
        icon: "🧳",
        color: "#0ea5e9",
        bg: "#e0f2fe",
    },
    GUIDE: {
        label: "Guide",
        icon: "🗺️",
        color: "#16a34a",
        bg: "#dcfce7",
    },
    OWNER: {
        label: "Hotel Owner",
        icon: "🏨",
        color: "#7c3aed",
        bg: "#ede9fe",
    },
    HOTEL_OWNER: {
        label: "Hotel Owner",
        icon: "🏨",
        color: "#7c3aed",
        bg: "#ede9fe",
    },
    ADMIN: {
        label: "Admin",
        icon: "🛡️",
        color: "#dc2626",
        bg: "#fee2e2",
    },
};

/**
 * Each role entry is an array of groups.
 * Each group has a label and a list of { to, label } items.
 * These are the ONLY links the logged-in user sees beyond
 * the public browse links (Home / Guides / Hotels / Places).
 */
const ROLE_NAV = {
    TOURIST: [
        {
            group: "My Travel",
            items: [
                { to: "/dashboard",              label: "📊 Dashboard" },
                { to: "/bookings/new",           label: "🎫 New Booking" },
                { to: "/my-bookings",            label: "📖 My Bookings" },
                { to: "/my-reservations/hotels", label: "🏨 Hotel Reservations" },
                { to: "/my-bookings/guides",     label: "🗺️ Guide Bookings" },
                { to: "/my-favorites/places",    label: "❤️ Favourite Places" },
            ],
        },
    ],
    GUIDE: [
        {
            group: "My Work",
            items: [
                { to: "/dashboard",          label: "📊 Dashboard" },
                { to: "/guides/profile",     label: "🗺️ Guide Profile" },
                { to: "/guide/availability", label: "📅 My Availability" },
                { to: "/guide/requests",     label: "📋 Booking Requests" },
                { to: "/my-payments",        label: "💳 My Earnings" },
            ],
        },
    ],
    OWNER: [
        {
            group: "My Hotel",
            items: [
                { to: "/dashboard",        label: "📊 Dashboard" },
                { to: "/hotels/profile",   label: "🏨 Hotel Profile" },
                { to: "/owner/hotels/new", label: "➕ Create Hotel" },
                { to: "/my-payments",      label: "💳 My Earnings" },
            ],
        },
    ],
    HOTEL_OWNER: [
        {
            group: "My Hotel",
            items: [
                { to: "/dashboard",        label: "📊 Dashboard" },
                { to: "/hotels/profile",   label: "🏨 Hotel Profile" },
                { to: "/owner/hotels/new", label: "➕ Create Hotel" },
                { to: "/my-payments",      label: "💳 My Earnings" },
            ],
        },
    ],
    ADMIN: [
        {
            group: "Admin Panel",
            items: [
                { to: "/dashboard",                label: "📊 Dashboard" },
                { to: "/admin/places/new",         label: "📍 Add Place" },
                { to: "/admin/payments",           label: "💳 Payments" },
                { to: "/admin/reviews/reported",   label: "🚨 Reported Reviews" },
            ],
        },
    ],
};

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
export default function App() {
    const { token, user, clearAuth } = useAuth();
    const navigate    = useNavigate();
    const dropRef     = useRef(null);

    const [menuOpen, setMenuOpen] = useState(false);
    const [dropOpen, setDropOpen] = useState(false);

    // Normalise role to uppercase key
    const role        = user?.role?.toUpperCase();
    const roleDisplay = ROLE_DISPLAY[role] ?? {
        label: role ?? "User",
        icon: "👤",
        color: "#64748b",
        bg: "#f1f5f9",
    };
    const roleGroups = ROLE_NAV[role] ?? [];

    // Close dropdown when clicking outside
    useEffect(() => {
        const handler = (e) => {
            if (dropRef.current && !dropRef.current.contains(e.target))
                setDropOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // Close mobile menu on route change
    const closeMenu = () => { setMenuOpen(false); setDropOpen(false); };

    const handleLogout = async () => {
        try { await apiLogout(); } catch { /* ignore network errors */ }
        finally { clearAuth(); navigate("/login"); closeMenu(); }
    };

    const displayName =
        user?.name ||
        user?.username ||
        user?.email?.split("@")[0] ||
        "Account";

    return (
        <div className="tz-layout">
            {/* ══════════ TOP NAVBAR ══════════ */}
            <header className="tz-navbar">
                <div className="tz-navbar__inner">

                    {/* Brand */}
                    <Link to="/" className="tz-brand" onClick={closeMenu}>
                        ✈️ TravelZone
                    </Link>

                    {/* Desktop – public browse links (always visible) */}
                    <nav className="tz-nav-public">
                        <NavLink to="/" end
                                 className={({ isActive }) =>
                                     "tz-navlink" + (isActive ? " tz-navlink--active" : "")}>
                            Home
                        </NavLink>
                        <NavLink to="/guides"
                                 className={({ isActive }) =>
                                     "tz-navlink" + (isActive ? " tz-navlink--active" : "")}>
                            Guides
                        </NavLink>
                        <NavLink to="/hotels"
                                 className={({ isActive }) =>
                                     "tz-navlink" + (isActive ? " tz-navlink--active" : "")}>
                            Hotels
                        </NavLink>
                        <NavLink to="/places"
                                 className={({ isActive }) =>
                                     "tz-navlink" + (isActive ? " tz-navlink--active" : "")}>
                            Places
                        </NavLink>
                    </nav>

                    {/* Desktop – right side */}
                    <div className="tz-nav-right">
                        {!token ? (
                            /* ── Guest ── */
                            <>
                                <Link to="/login"    className="tz-btn tz-btn--ghost">Login</Link>
                                <Link to="/register" className="tz-btn tz-btn--primary">Register</Link>
                            </>
                        ) : (
                            /* ── Logged-in user dropdown ── */
                            <div className="tz-user-menu" ref={dropRef}>
                                <button
                                    className="tz-user-btn"
                                    onClick={() => setDropOpen((p) => !p)}
                                    aria-haspopup="true"
                                    aria-expanded={dropOpen}
                                >
                                    <span
                                        className="tz-user-btn__avatar"
                                        style={{ background: roleDisplay.bg }}
                                    >
                                        {roleDisplay.icon}
                                    </span>
                                    <span className="tz-user-btn__name">{displayName}</span>
                                    <span
                                        className="tz-user-btn__badge"
                                        style={{
                                            background: roleDisplay.bg,
                                            color: roleDisplay.color,
                                        }}
                                    >
                                        {roleDisplay.label}
                                    </span>
                                    <span className={`tz-user-btn__caret ${dropOpen ? "tz-user-btn__caret--open" : ""}`}>
                                        ▾
                                    </span>
                                </button>

                                {dropOpen && (
                                    <div className="tz-dropdown" role="menu">
                                        {/* Dropdown header – identity */}
                                        <div className="tz-dropdown__header">
                                            <div
                                                className="tz-dropdown__avatar"
                                                style={{ background: roleDisplay.bg }}
                                            >
                                                {roleDisplay.icon}
                                            </div>
                                            <div>
                                                <div className="tz-dropdown__name">{displayName}</div>
                                                <span
                                                    className="tz-dropdown__role"
                                                    style={{
                                                        background: roleDisplay.bg,
                                                        color: roleDisplay.color,
                                                    }}
                                                >
                                                    {roleDisplay.label}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Common: My Profile */}
                                        {user?.id && (
                                            <Link
                                                to={`/users/${user.id}`}
                                                className="tz-dropdown__item"
                                                onClick={closeMenu}
                                            >
                                                👤 My Profile
                                            </Link>
                                        )}

                                        {/* Role-specific groups */}
                                        {roleGroups.map((group) => (
                                            <div key={group.group}>
                                                <div className="tz-dropdown__group-label">
                                                    {group.group}
                                                </div>
                                                {group.items.map((item) => (
                                                    <Link
                                                        key={item.to}
                                                        to={item.to}
                                                        className="tz-dropdown__item"
                                                        onClick={closeMenu}
                                                    >
                                                        {item.label}
                                                    </Link>
                                                ))}
                                            </div>
                                        ))}

                                        {/* Account utilities */}
                                        <div className="tz-dropdown__divider" />
                                        <Link
                                            to="/verify-email"
                                            className="tz-dropdown__item"
                                            onClick={closeMenu}
                                        >
                                            ✉️ Verify Email
                                        </Link>
                                        <Link
                                            to="/password-reset"
                                            className="tz-dropdown__item"
                                            onClick={closeMenu}
                                        >
                                            🔑 Reset Password
                                        </Link>

                                        {/* Logout */}
                                        <div className="tz-dropdown__divider" />
                                        <button
                                            className="tz-dropdown__item tz-dropdown__item--danger"
                                            onClick={handleLogout}
                                        >
                                            🚪 Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        className="tz-hamburger"
                        onClick={() => setMenuOpen((p) => !p)}
                        aria-label="Toggle navigation"
                    >
                        <span className={`tz-hamburger__bar tz-hamburger__bar--top ${menuOpen ? "open" : ""}`} />
                        <span className={`tz-hamburger__bar tz-hamburger__bar--mid ${menuOpen ? "open" : ""}`} />
                        <span className={`tz-hamburger__bar tz-hamburger__bar--bot ${menuOpen ? "open" : ""}`} />
                    </button>
                </div>
            </header>

            {/* ══════════ MOBILE FULL-SCREEN MENU ══════════ */}
            {menuOpen && (
                <div className="tz-mobile-menu" role="navigation" aria-label="Mobile menu">

                    {/* Browse section — always visible */}
                    <div className="tz-mobile-menu__section">
                        <div className="tz-mobile-menu__label">Browse</div>
                        <Link to="/"       className="tz-mobile-menu__item" onClick={closeMenu}>🏠 Home</Link>
                        <Link to="/guides" className="tz-mobile-menu__item" onClick={closeMenu}>🗺️ Guides</Link>
                        <Link to="/hotels" className="tz-mobile-menu__item" onClick={closeMenu}>🏨 Hotels</Link>
                        <Link to="/places" className="tz-mobile-menu__item" onClick={closeMenu}>📍 Places</Link>
                    </div>

                    <div className="tz-mobile-menu__divider" />

                    {token ? (
                        <>
                            {/* Role identity bar */}
                            <div
                                className="tz-mobile-menu__role-bar"
                                style={{
                                    background: roleDisplay.bg,
                                    color: roleDisplay.color,
                                }}
                            >
                                {roleDisplay.icon} {displayName} — {roleDisplay.label}
                            </div>

                            {/* Common: My Profile */}
                            {user?.id && (
                                <div className="tz-mobile-menu__section">
                                    <Link
                                        to={`/users/${user.id}`}
                                        className="tz-mobile-menu__item"
                                        onClick={closeMenu}
                                    >
                                        👤 My Profile
                                    </Link>
                                </div>
                            )}

                            {/* Role-specific groups */}
                            {roleGroups.map((group) => (
                                <div className="tz-mobile-menu__section" key={group.group}>
                                    <div className="tz-mobile-menu__label">{group.group}</div>
                                    {group.items.map((item) => (
                                        <Link
                                            key={item.to}
                                            to={item.to}
                                            className="tz-mobile-menu__item"
                                            onClick={closeMenu}
                                        >
                                            {item.label}
                                        </Link>
                                    ))}
                                </div>
                            ))}

                            <div className="tz-mobile-menu__divider" />

                            {/* Account utilities */}
                            <div className="tz-mobile-menu__section">
                                <div className="tz-mobile-menu__label">Account</div>
                                <Link to="/verify-email"  className="tz-mobile-menu__item" onClick={closeMenu}>✉️ Verify Email</Link>
                                <Link to="/password-reset" className="tz-mobile-menu__item" onClick={closeMenu}>🔑 Reset Password</Link>
                                <button
                                    className="tz-mobile-menu__item tz-mobile-menu__item--danger"
                                    onClick={handleLogout}
                                >
                                    🚪 Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        /* Guest mobile links */
                        <div className="tz-mobile-menu__section">
                            <div className="tz-mobile-menu__label">Account</div>
                            <Link to="/login"         className="tz-mobile-menu__item" onClick={closeMenu}>🔑 Login</Link>
                            <Link to="/register"      className="tz-mobile-menu__item" onClick={closeMenu}>📝 Register</Link>
                            <Link to="/verify-email"  className="tz-mobile-menu__item" onClick={closeMenu}>✉️ Verify Email</Link>
                            <Link to="/password-reset" className="tz-mobile-menu__item" onClick={closeMenu}>🔐 Reset Password</Link>
                        </div>
                    )}
                </div>
            )}

            {/* ══════════ PAGE CONTENT ══════════ */}
            <main className="tz-main">
                <Outlet />
            </main>
        </div>
    );
}
