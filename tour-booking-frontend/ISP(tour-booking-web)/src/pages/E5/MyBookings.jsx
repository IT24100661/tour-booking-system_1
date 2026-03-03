import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext.jsx'
import { apiSearchBookings } from '../../api/e5.js'
import './E5.css'

const STATUS_META = {
    CONFIRMED:   { badge: 'e5-badge--green',  label: '✓ Confirmed' },
    PENDING:     { badge: 'e5-badge--yellow', label: '⏳ Pending' },
    CANCELLED:   { badge: 'e5-badge--red',    label: '⊘ Cancelled' },
    RESCHEDULED: { badge: 'e5-badge--blue',   label: '🔄 Rescheduled' },
    COMPLETED:   { badge: 'e5-badge--purple', label: '🏁 Completed' },
}

export default function MyBookings() {
    const { user } = useAuth()
    const [rows, setRows] = useState([])
    const [err, setErr]   = useState('')

    const load = async () => {
        if (!user?.id) return
        setErr('')
        try {
            const data = await apiSearchBookings({ touristId: user.id })
            setRows(Array.isArray(data) ? data : (data.items || []))
        } catch (e) {
            setErr(e?.response?.data?.message || e.message)
        }
    }

    useEffect(() => { load() }, [user?.id])

    const active  = rows.filter(b => b.status !== 'COMPLETED' && b.status !== 'CANCELLED')
    const history = rows.filter(b => b.status === 'COMPLETED' || b.status === 'CANCELLED')

    return (
        <div className="e5-page">
            <div className="e5-container e5-container--sm">
                <div className="e5-header">
                    <div className="e5-header__icon">📖</div>
                    <h1 className="e5-header__title">My Bookings</h1>
                    <p className="e5-header__sub">Track all your travel bookings</p>
                </div>

                {!user?.id && (
                    <div className="e5-alert e5-alert--info">ℹ️ Login to view your bookings</div>
                )}
                {err && <div className="e5-alert e5-alert--error">⚠️ {err}</div>}

                {/* Stats */}
                {rows.length > 0 && (
                    <div className="e5-stats">
                        <div className="e5-stat">
                            <div className="e5-stat__val">{rows.length}</div>
                            <div className="e5-stat__key">Total</div>
                        </div>
                        <div className="e5-stat">
                            <div className="e5-stat__val">{active.length}</div>
                            <div className="e5-stat__key">Active</div>
                        </div>
                        <div className="e5-stat">
                            <div className="e5-stat__val">{history.length}</div>
                            <div className="e5-stat__key">Past</div>
                        </div>
                    </div>
                )}

                {/* Active bookings */}
                <div className="e5-card">
                    <div className="e5-card__title">🗓️ Active Bookings ({active.length})</div>

                    {active.length === 0 ? (
                        <div className="e5-empty">
                            <div className="e5-empty__icon">🎫</div>
                            <div className="e5-empty__text">
                                No active bookings.{' '}
                                <Link to="/guides" style={{ color:'#7c3aed', fontWeight:700 }}>Browse guides</Link>
                                {' '}or{' '}
                                <Link to="/hotels" style={{ color:'#7c3aed', fontWeight:700 }}>hotels</Link>
                            </div>
                        </div>
                    ) : (
                        active.map((b) => {
                            const meta = STATUS_META[b.status] || STATUS_META.PENDING
                            return (
                                <Link key={b.id} to={`/bookings/${b.id}`} className="e5-booking-card">
                                    <div>
                                        <div className="e5-booking-card__title">
                                            {b.type === 'HOTEL' ? '🏨' : '🗺️'} Booking #{b.id}
                                        </div>
                                        <div className="e5-booking-card__meta">
                                            {b.type        && <span>📦 {b.type}</span>}
                                            {b.referenceId && <span>🔗 Ref #{b.referenceId}</span>}
                                            {b.createdAt   && <span>🕐 {new Date(b.createdAt).toLocaleDateString()}</span>}
                                        </div>
                                    </div>
                                    <span className={`e5-badge ${meta.badge}`}>{meta.label}</span>
                                </Link>
                            )
                        })
                    )}
                </div>

                {/* History */}
                {history.length > 0 && (
                    <div className="e5-card">
                        <div className="e5-card__title">📜 Past Bookings ({history.length})</div>
                        {history.map((b) => {
                            const meta = STATUS_META[b.status] || STATUS_META.COMPLETED
                            return (
                                <Link key={b.id} to={`/bookings/${b.id}`} className="e5-booking-card" style={{ opacity:0.75 }}>
                                    <div>
                                        <div className="e5-booking-card__title">
                                            {b.type === 'HOTEL' ? '🏨' : '🗺️'} Booking #{b.id}
                                        </div>
                                        <div className="e5-booking-card__meta">
                                            {b.type      && <span>📦 {b.type}</span>}
                                            {b.createdAt && <span>🕐 {new Date(b.createdAt).toLocaleDateString()}</span>}
                                        </div>
                                    </div>
                                    <span className={`e5-badge ${meta.badge}`}>{meta.label}</span>
                                </Link>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
