import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext.jsx'
import { apiGetGuideDashboard } from '../../api/e1.js'
import './E1.css'

export default function GuideDashboard() {
    const { user } = useAuth()
    const [data, setData] = useState(null)
    const [err, setErr] = useState(null)

    useEffect(() => {
        apiGetGuideDashboard()
            .then(setData)
            .catch(e => setErr(e?.response?.data?.message || 'Failed to load dashboard'))
    }, [])

    const initials = user?.name
        ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
        : '?'

    return (
        <div className="e1-page">
            <div className="e1-card e1-card--wide">
                <div className="e1-card__icon">🗺️</div>
                <h1 className="e1-card__title">Guide Dashboard</h1>
                <p className="e1-card__subtitle">Your guide activity at a glance</p>

                {err && <div className="e1-alert e1-alert--error"><span>⚠️</span> {err}</div>}

                {/* Hero */}
                <div className="e1-user-hero">
                    <div className="e1-user-avatar">{initials}</div>
                    <div>
                        <p className="e1-user-hero__name">{data?.name || user?.name}</p>
                        <p className="e1-user-hero__email">{data?.email || user?.email}</p>
                        <span className="e1-badge e1-badge--blue">🗺️ Guide</span>
                    </div>
                </div>

                {/* Stats */}
                <div className="e1-section-label">Booking Stats</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div style={{ background: '#eff6ff', borderRadius: 12, padding: '1rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1d4ed8' }}>
                            {data?.pendingRequests ?? '—'}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, marginTop: 4 }}>
                            PENDING REQUESTS
                        </div>
                    </div>
                    <div style={{ background: '#f0fdf4', borderRadius: 12, padding: '1rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#16a34a' }}>
                            {data?.totalBookings ?? '—'}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, marginTop: 4 }}>
                            TOTAL BOOKINGS
                        </div>
                    </div>
                </div>

                {/* Profile info */}
                <div className="e1-section-label">Profile</div>
                <div className="e1-info-row">
                    <span className="e1-info-row__key">Rating</span>
                    <span className="e1-info-row__value">
                        {'⭐'.repeat(Math.round(data?.ratingAvg || 0))} {data?.ratingAvg?.toFixed(1) ?? '—'}
                        <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}> ({data?.ratingCount ?? 0} reviews)</span>
                    </span>
                </div>
                <div className="e1-info-row">
                    <span className="e1-info-row__key">Price / day</span>
                    <span className="e1-info-row__value">
                        {data?.price ? `$${data.price}` : <span className="e1-badge e1-badge--yellow">Not set</span>}
                    </span>
                </div>
                <div className="e1-info-row">
                    <span className="e1-info-row__key">Location</span>
                    <span className="e1-info-row__value">{data?.location || '—'}</span>
                </div>
                <div className="e1-info-row">
                    <span className="e1-info-row__key">Email Verified</span>
                    <span className="e1-info-row__value">
                        {data?.emailVerified
                            ? <span className="e1-badge e1-badge--green">✓ Verified</span>
                            : <span className="e1-badge e1-badge--red">✗ Not verified</span>}
                    </span>
                </div>

                {data?.bio && (
                    <>
                        <div className="e1-section-label">Bio</div>
                        <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                            {data.bio}
                        </p>
                    </>
                )}

                {/* Quick links */}
                <div className="e1-section-label">Quick Links</div>
                <div className="e1-btn-row">
                    <Link to="/guide/requests"      className="e1-btn e1-btn--secondary" style={{ textDecoration: 'none', flex: 1 }}>📋 Requests</Link>
                    <Link to="/guide/availability"  className="e1-btn e1-btn--secondary" style={{ textDecoration: 'none', flex: 1 }}>📅 Availability</Link>
                </div>
                <div className="e1-btn-row">
                    <Link to="/guides/profile"      className="e1-btn e1-btn--secondary" style={{ textDecoration: 'none', flex: 1 }}>✏️ Edit Profile</Link>
                    {user?.id && (
                        <Link to={`/users/${user.id}`} className="e1-btn e1-btn--secondary" style={{ textDecoration: 'none', flex: 1 }}>👤 My Account</Link>
                    )}
                </div>
            </div>
        </div>
    )
}
