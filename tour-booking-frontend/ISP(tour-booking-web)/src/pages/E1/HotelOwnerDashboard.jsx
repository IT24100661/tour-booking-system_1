import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext.jsx'
import { apiGetHotelDashboard } from '../../api/e1.js'
import './E1.css'

export default function HotelOwnerDashboard() {
    const { user } = useAuth()
    const [data, setData] = useState(null)
    const [err, setErr] = useState(null)

    useEffect(() => {
        apiGetHotelDashboard()
            .then(setData)
            .catch(e => setErr(e?.response?.data?.message || 'Failed to load dashboard'))
    }, [])

    const initials = user?.name
        ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
        : '?'

    return (
        <div className="e1-page">
            <div className="e1-card e1-card--wide">
                <div className="e1-card__icon">🏨</div>
                <h1 className="e1-card__title">Hotel Owner Dashboard</h1>
                <p className="e1-card__subtitle">Manage your hotel and reservations</p>

                {err && <div className="e1-alert e1-alert--error"><span>⚠️</span> {err}</div>}

                {/* Hero */}
                <div className="e1-user-hero">
                    <div className="e1-user-avatar">{initials}</div>
                    <div>
                        <p className="e1-user-hero__name">{data?.name || user?.name}</p>
                        <p className="e1-user-hero__email">{data?.email || user?.email}</p>
                        <span className="e1-badge e1-badge--yellow">🏨 Hotel Owner</span>
                    </div>
                </div>

                {/* Stats */}
                <div className="e1-section-label">Reservation Stats</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div style={{ background: '#fef9c3', borderRadius: 12, padding: '1rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#92400e' }}>
                            {data?.pendingReservations ?? '—'}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, marginTop: 4 }}>
                            PENDING
                        </div>
                    </div>
                    <div style={{ background: '#f0fdf4', borderRadius: 12, padding: '1rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#16a34a' }}>
                            {data?.totalReservations ?? '—'}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, marginTop: 4 }}>
                            TOTAL
                        </div>
                    </div>
                </div>

                {/* Hotel info */}
                {data?.businessName && (
                    <>
                        <div className="e1-section-label">Hotel Details</div>
                        <div className="e1-info-row">
                            <span className="e1-info-row__key">Business Name</span>
                            <span className="e1-info-row__value">{data.businessName}</span>
                        </div>
                        <div className="e1-info-row">
                            <span className="e1-info-row__key">Address</span>
                            <span className="e1-info-row__value">{data.address || '—'}</span>
                        </div>
                        <div className="e1-info-row">
                            <span className="e1-info-row__key">Phone</span>
                            <span className="e1-info-row__value">{data.phone || '—'}</span>
                        </div>
                    </>
                )}

                {!data?.businessName && !err && (
                    <div className="e1-alert e1-alert--error" style={{ marginTop: '0.5rem' }}>
                        <span>⚠️</span> You haven't created a hotel profile yet.{' '}
                        <Link to="/hotels/profile" style={{ color: '#dc2626', fontWeight: 700 }}>Create one →</Link>
                    </div>
                )}

                <div className="e1-info-row">
                    <span className="e1-info-row__key">Email Verified</span>
                    <span className="e1-info-row__value">
                        {data?.emailVerified
                            ? <span className="e1-badge e1-badge--green">✓ Verified</span>
                            : <span className="e1-badge e1-badge--red">✗ Not verified</span>}
                    </span>
                </div>

                {/* Quick links */}
                <div className="e1-section-label">Quick Links</div>
                <div className="e1-btn-row">
                    <Link to="/my-reservations/hotels" className="e1-btn e1-btn--secondary" style={{ textDecoration: 'none', flex: 1 }}>🛎️ Reservations</Link>
                    <Link to="/hotels/profile"         className="e1-btn e1-btn--secondary" style={{ textDecoration: 'none', flex: 1 }}>✏️ Edit Profile</Link>
                </div>
                <div className="e1-btn-row">
                    <Link to="/owner/hotels/new" className="e1-btn e1-btn--secondary" style={{ textDecoration: 'none', flex: 1 }}>➕ New Hotel</Link>
                    {user?.id && (
                        <Link to={`/users/${user.id}`} className="e1-btn e1-btn--secondary" style={{ textDecoration: 'none', flex: 1 }}>👤 My Account</Link>
                    )}
                </div>
            </div>
        </div>
    )
}
