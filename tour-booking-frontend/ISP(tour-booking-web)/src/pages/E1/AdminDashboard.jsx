import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext.jsx'
import { apiGetAdminDashboard } from '../../api/e1.js'
import './E1.css'

const StatCard = ({ label, value, color, bg, icon }) => (
    <div style={{ background: bg, borderRadius: 14, padding: '1.1rem 1rem', textAlign: 'center', border: `1px solid ${color}22` }}>
        <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>{icon}</div>
        <div style={{ fontSize: '1.7rem', fontWeight: 800, color }}>{value ?? '—'}</div>
        <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {label}
        </div>
    </div>
)

export default function AdminDashboard() {
    const { user } = useAuth()
    const [data, setData] = useState(null)
    const [err, setErr] = useState(null)

    useEffect(() => {
        apiGetAdminDashboard()
            .then(setData)
            .catch(e => setErr(e?.response?.data?.message || 'Failed to load dashboard'))
    }, [])

    const initials = user?.name
        ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
        : '?'

    return (
        <div className="e1-page">
            <div className="e1-card e1-card--wide">
                <div className="e1-card__icon">🛡️</div>
                <h1 className="e1-card__title">Admin Dashboard</h1>
                <p className="e1-card__subtitle">Full system overview</p>

                {err && <div className="e1-alert e1-alert--error"><span>⚠️</span> {err}</div>}

                {/* Hero */}
                <div className="e1-user-hero" style={{ background: 'linear-gradient(135deg, #7c3aed, #dc2626)' }}>
                    <div className="e1-user-avatar">{initials}</div>
                    <div>
                        <p className="e1-user-hero__name">{user?.name}</p>
                        <p className="e1-user-hero__email">{user?.email}</p>
                        <span className="e1-badge e1-badge--red">🛡️ Admin</span>
                    </div>
                </div>

                {/* User stats */}
                <div className="e1-section-label">Users</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.65rem', marginBottom: '1rem' }}>
                    <StatCard label="Total Users"   value={data?.totalUsers}       color="#1d4ed8" bg="#eff6ff" icon="👥" />
                    <StatCard label="Tourists"      value={data?.totalTourists}    color="#16a34a" bg="#f0fdf4" icon="🧳" />
                    <StatCard label="Guides"        value={data?.totalGuides}      color="#0369a1" bg="#f0f9ff" icon="🗺️" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.65rem', marginBottom: '1rem' }}>
                    <StatCard label="Hotel Owners"  value={data?.totalHotelOwners} color="#92400e" bg="#fef9c3" icon="🏨" />
                    <StatCard label="Admins"        value={data?.totalAdmins}      color="#dc2626" bg="#fef2f2" icon="🛡️" />
                    <StatCard label="Reported"      value={data?.pendingReportedReviews} color="#9333ea" bg="#faf5ff" icon="🚨" />
                </div>

                {/* Platform stats */}
                <div className="e1-section-label">Platform</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.65rem', marginBottom: '1rem' }}>
                    <StatCard label="Guide Profiles"   value={data?.totalGuideProfiles}  color="#0369a1" bg="#f0f9ff" icon="🗺️" />
                    <StatCard label="Hotel Profiles"   value={data?.totalHotelProfiles}  color="#92400e" bg="#fef9c3" icon="🏨" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.65rem', marginBottom: '1rem' }}>
                    <StatCard label="Guide Bookings"   value={data?.totalBookings}       color="#16a34a" bg="#f0fdf4" icon="📋" />
                    <StatCard label="Hotel Reservations" value={data?.totalReservations} color="#16a34a" bg="#f0fdf4" icon="🛎️" />
                </div>

                {/* Alerts */}
                {data?.pendingReportedReviews > 0 && (
                    <div className="e1-alert e1-alert--error">
                        <span>🚨</span> {data.pendingReportedReviews} reported reviews need moderation.{' '}
                        <Link to="/admin/reviews/reported" style={{ color: '#dc2626', fontWeight: 700 }}>Review now →</Link>
                    </div>
                )}

                {/* Quick links */}
                <div className="e1-section-label">Admin Actions</div>
                <div className="e1-btn-row">
                    <Link to="/admin/reviews/reported" className="e1-btn e1-btn--danger"     style={{ textDecoration: 'none', flex: 1 }}>🚨 Reported Reviews</Link>
                    <Link to="/admin/payments"         className="e1-btn e1-btn--secondary"  style={{ textDecoration: 'none', flex: 1 }}>💳 Payments</Link>
                </div>
                <div className="e1-btn-row">
                    <Link to="/admin/places/new"       className="e1-btn e1-btn--secondary"  style={{ textDecoration: 'none', flex: 1 }}>📍 Add Place</Link>
                    {user?.id && (
                        <Link to={`/users/${user.id}`} className="e1-btn e1-btn--secondary"  style={{ textDecoration: 'none', flex: 1 }}>👤 My Account</Link>
                    )}
                </div>
            </div>
        </div>
    )
}
