import React, { useEffect, useState } from 'react'
import { useAuth } from '../../auth/AuthContext.jsx'
import { apiGetTouristGuideBookings } from '../../api/e2.js'
import './E2.css'

const STATUS_META = {
    PENDING:   { badge: 'e2-badge--yellow', label: '⏳ Pending' },
    ACCEPTED:  { badge: 'e2-badge--green',  label: '✓ Accepted' },
    REJECTED:  { badge: 'e2-badge--red',    label: '✗ Rejected' },
    COMPLETED: { badge: 'e2-badge--blue',   label: '🏁 Completed' },
    CANCELLED: { badge: 'e2-badge--gray',   label: '⊘ Cancelled' },
}

export default function MyGuideBookings() {
    const { user } = useAuth()
    const touristId = user?.id

    const [rows, setRows] = useState([])
    const [err, setErr] = useState('')

    const load = async () => {
        if (!touristId) return
        setErr('')
        try {
            const data = await apiGetTouristGuideBookings(touristId)
            setRows(Array.isArray(data) ? data : (data.items || []))
        } catch (e) {
            setErr(e?.response?.data?.message || e.message)
        }
    }

    useEffect(() => { load() }, [touristId])

    return (
        <div className="e2-page">
            <div className="e2-container e2-container--sm">
                <div className="e2-header">
                    <div className="e2-header__icon">📖</div>
                    <h1 className="e2-header__title">My Guide Bookings</h1>
                    <p className="e2-header__sub">All your guide booking history</p>
                </div>

                {!touristId && (
                    <div className="e2-alert e2-alert--info">ℹ️ Login as TOURIST to see bookings</div>
                )}
                {err && <div className="e2-alert e2-alert--error">⚠️ {err}</div>}

                <div className="e2-card">
                    <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                        All Bookings ({rows.length})
                    </h3>

                    {rows.length === 0 && !err ? (
                        <div className="e2-empty">
                            <div className="e2-empty__icon">🗺️</div>
                            <div className="e2-empty__text">No guide bookings yet. Browse guides to get started.</div>
                        </div>
                    ) : (
                        rows.map((b) => {
                            const meta = STATUS_META[b.status] || STATUS_META.PENDING
                            return (
                                <div key={b.id} className="e2-booking-card">
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a', marginBottom: '0.3rem' }}>
                                            Booking #{b.id}
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                            {b.guideId  && <span>🗺️ Guide #{b.guideId}</span>}
                                            {b.slotId   && <span>📅 Slot #{b.slotId}</span>}
                                            {b.createdAt && <span>🕐 {new Date(b.createdAt).toLocaleDateString()}</span>}
                                        </div>
                                    </div>
                                    <span className={`e2-badge ${meta.badge}`}>{meta.label}</span>
                                </div>
                            )
                        })
                    )}
                </div>
            </div>
        </div>
    )
}
