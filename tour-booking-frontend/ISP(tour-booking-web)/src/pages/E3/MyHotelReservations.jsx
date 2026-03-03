import React, { useEffect, useState } from 'react'
import { useAuth } from '../../auth/AuthContext.jsx'
import { apiGetTouristReservations, apiDeleteReservation } from '../../api/e3.js'
import './E3.css'

const STATUS_META = {
    PENDING:   { badge: 'e3-badge--yellow', label: '⏳ Pending' },
    CONFIRMED: { badge: 'e3-badge--green',  label: '✓ Confirmed' },
    CANCELLED: { badge: 'e3-badge--red',    label: '⊘ Cancelled' },
    COMPLETED: { badge: 'e3-badge--blue',   label: '🏁 Completed' },
}

export default function MyHotelReservations() {
    const { user } = useAuth()
    const touristId = user?.id

    const [rows, setRows]       = useState([])
    const [err, setErr]         = useState('')
    const [msg, setMsg]         = useState('')
    const [deleting, setDeleting] = useState(null)

    const load = async () => {
        if (!touristId) return
        setErr('')
        try {
            const data = await apiGetTouristReservations(touristId)
            setRows(Array.isArray(data) ? data : (data.items || []))
        } catch (e) {
            setErr(e?.response?.data?.message || e.message)
        }
    }

    useEffect(() => { load() }, [touristId])

    const remove = async (id) => {
        if (!window.confirm('Cancel this reservation?')) return
        setErr(''); setMsg(''); setDeleting(id)
        try {
            await apiDeleteReservation(id)
            setMsg('Reservation cancelled')
            await load()
        } catch (e) {
            setErr(e?.response?.data?.message || e.message)
        } finally {
            setDeleting(null)
        }
    }

    const upcoming  = rows.filter(r => r.status !== 'COMPLETED' && r.status !== 'CANCELLED')
    const past      = rows.filter(r => r.status === 'COMPLETED' || r.status === 'CANCELLED')

    return (
        <div className="e3-page">
            <div className="e3-container e3-container--sm">
                <div className="e3-header">
                    <div className="e3-header__icon">🛎️</div>
                    <h1 className="e3-header__title">My Reservations</h1>
                    <p className="e3-header__sub">Your hotel booking history</p>
                </div>

                {!touristId && (
                    <div className="e3-alert e3-alert--info">ℹ️ Login as TOURIST to see reservations</div>
                )}
                {err && <div className="e3-alert e3-alert--error">⚠️ {err}</div>}
                {msg && <div className="e3-alert e3-alert--success">✓ {msg}</div>}

                {/* Upcoming */}
                <div className="e3-card">
                    <div className="e3-card__title">🗓️ Upcoming ({upcoming.length})</div>

                    {upcoming.length === 0 ? (
                        <div className="e3-empty">
                            <div className="e3-empty__icon">🏨</div>
                            <div className="e3-empty__text">No upcoming reservations. Browse hotels to book one!</div>
                        </div>
                    ) : (
                        upcoming.map((r) => {
                            const meta = STATUS_META[r.status] || STATUS_META.PENDING
                            return (
                                <div key={r.id} className="e3-res-card">
                                    <div>
                                        <div className="e3-res-card__title">Reservation #{r.id}</div>
                                        <div className="e3-res-card__meta">
                                            {r.hotelId     && <span>🏨 Hotel #{r.hotelId}</span>}
                                            {r.roomTypeId  && <span>🏠 Room type #{r.roomTypeId}</span>}
                                            {r.checkIn     && <span>📅 In: {r.checkIn}</span>}
                                            {r.checkOut    && <span>📅 Out: {r.checkOut}</span>}
                                            {r.rooms       && <span>🔑 {r.rooms} room{r.rooms !== 1 ? 's' : ''}</span>}
                                        </div>
                                    </div>
                                    <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'0.5rem' }}>
                                        <span className={`e3-badge ${meta.badge}`}>{meta.label}</span>
                                        <button
                                            className="e3-btn e3-btn--danger e3-btn--sm"
                                            onClick={() => remove(r.id)}
                                            disabled={deleting === r.id}
                                        >
                                            {deleting === r.id ? '...' : '🗑️ Cancel'}
                                        </button>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>

                {/* Past */}
                {past.length > 0 && (
                    <div className="e3-card">
                        <div className="e3-card__title">📜 Past Reservations ({past.length})</div>
                        {past.map((r) => {
                            const meta = STATUS_META[r.status] || STATUS_META.COMPLETED
                            return (
                                <div key={r.id} className="e3-res-card" style={{ opacity: 0.75 }}>
                                    <div>
                                        <div className="e3-res-card__title">Reservation #{r.id}</div>
                                        <div className="e3-res-card__meta">
                                            {r.hotelId  && <span>🏨 Hotel #{r.hotelId}</span>}
                                            {r.checkIn  && <span>📅 In: {r.checkIn}</span>}
                                            {r.checkOut && <span>📅 Out: {r.checkOut}</span>}
                                        </div>
                                    </div>
                                    <span className={`e3-badge ${meta.badge}`}>{meta.label}</span>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
