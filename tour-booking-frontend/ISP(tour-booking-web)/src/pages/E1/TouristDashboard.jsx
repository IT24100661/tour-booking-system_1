import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext.jsx'
import './E1.css'

export default function TouristDashboard() {
    const { user, token } = useAuth()

    const initials = user?.name
        ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
        : '?'

    return (
        <div className="e1-page">
            <div className="e1-card e1-card--wide">
                <div className="e1-card__icon">🧳</div>
                <h1 className="e1-card__title">Tourist Dashboard</h1>
                <p className="e1-card__subtitle">Explore guides, hotels and places</p>

                <div className="e1-user-hero">
                    <div className="e1-user-avatar">{initials}</div>
                    <div>
                        <p className="e1-user-hero__name">{user?.name}</p>
                        <p className="e1-user-hero__email">{user?.email}</p>
                        <span className="e1-badge e1-badge--green">🧳 Tourist</span>
                    </div>
                </div>

                <div className="e1-section-label">Account</div>
                <div className="e1-info-row">
                    <span className="e1-info-row__key">User ID</span>
                    <span className="e1-info-row__value">#{user?.id}</span>
                </div>
                <div className="e1-info-row">
                    <span className="e1-info-row__key">Phone</span>
                    <span className="e1-info-row__value">{user?.phone || '—'}</span>
                </div>
                <div className="e1-info-row">
                    <span className="e1-info-row__key">Email Verified</span>
                    <span className="e1-info-row__value">
                        {user?.emailVerified
                            ? <span className="e1-badge e1-badge--green">✓ Verified</span>
                            : <span className="e1-badge e1-badge--red">✗ Not verified</span>}
                    </span>
                </div>

                <div className="e1-section-label">Quick Links</div>
                <div className="e1-btn-row">
                    <Link to="/guides" className="e1-btn e1-btn--secondary" style={{ textDecoration: 'none', flex: 1 }}>🗺️ Browse Guides</Link>
                    <Link to="/hotels" className="e1-btn e1-btn--secondary" style={{ textDecoration: 'none', flex: 1 }}>🏨 Browse Hotels</Link>
                </div>
                <div className="e1-btn-row">
                    <Link to="/places" className="e1-btn e1-btn--secondary" style={{ textDecoration: 'none', flex: 1 }}>📍 Places</Link>
                    <Link to="/my-bookings/guides" className="e1-btn e1-btn--secondary" style={{ textDecoration: 'none', flex: 1 }}>📋 My Bookings</Link>
                </div>
                <div className="e1-btn-row">
                    <Link to="/my-reservations/hotels" className="e1-btn e1-btn--secondary" style={{ textDecoration: 'none', flex: 1 }}>🛎️ My Reservations</Link>
                    <Link to="/my-favorites/places" className="e1-btn e1-btn--secondary" style={{ textDecoration: 'none', flex: 1 }}>❤️ Favourites</Link>
                </div>

                <div className="e1-section-label">Session Token</div>
                <div className="e1-token-box">
                    {token ? `${token.slice(0, 40)}...` : 'No active token'}
                </div>
            </div>
        </div>
    )
}
