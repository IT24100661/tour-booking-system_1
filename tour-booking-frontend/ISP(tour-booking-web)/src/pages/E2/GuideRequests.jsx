import React, { useEffect, useState } from 'react'
import { useAuth } from '../../auth/AuthContext.jsx'
import { apiGetBookingRequestsForGuide, apiUpdateBookingRequest } from '../../api/e2.js'
import './E2.css'

const STATUS_META = {
    PENDING:  { badge: 'e2-badge--yellow', label: '⏳ Pending' },
    ACCEPTED: { badge: 'e2-badge--green',  label: '✓ Accepted' },
    REJECTED: { badge: 'e2-badge--red',    label: '✗ Rejected' },
}

export default function GuideRequests() {
    const { user } = useAuth()
    const guideId = user?.id

    const [rows, setRows] = useState([])
    const [err, setErr] = useState('')
    const [msg, setMsg] = useState('')
    const [processing, setProcessing] = useState(null)

    const load = async () => {
        if (!guideId) return
        setErr(''); setMsg('')
        try {
            const data = await apiGetBookingRequestsForGuide(guideId)
            setRows(Array.isArray(data) ? data : (data.items || []))
        } catch (e) {
            setErr(e?.response?.data?.message || e.message)
        }
    }

    useEffect(() => { load() }, [guideId])

    const setStatus = async (id, status) => {
        setErr(''); setMsg('')
        setProcessing(id + status)
        try {
            await apiUpdateBookingRequest(id, status)
            setMsg(`Request ${status.toLowerCase()} successfully`)
            await load()
        } catch (e) {
            setErr(e?.response?.data?.message || e.message)
        } finally {
            setProcessing(null)
        }
    }

    const pending  = rows.filter(r => r.status === 'PENDING')
    const resolved = rows.filter(r => r.status !== 'PENDING')

    return (
        <div className="e2-page">
            <div className="e2-container e2-container--sm">
                <div className="e2-header">
                    <div className="e2-header__icon">📋</div>
                    <h1 className="e2-header__title">Booking Requests</h1>
                    <p className="e2-header__sub">Accept or reject tourist booking requests</p>
                </div>

                {!guideId && (
                    <div className="e2-alert e2-alert--info">ℹ️ Login as GUIDE to see requests</div>
                )}
                {err && <div className="e2-alert e2-alert--error">⚠️ {err}</div>}
                {msg && <div className="e2-alert e2-alert--success">✓ {msg}</div>}

                {/* Pending requests */}
                <div className="e2-card">
                    <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                        ⏳ Pending ({pending.length})
                    </h3>

                    {pending.length === 0 ? (
                        <div className="e2-empty">
                            <div className="e2-empty__icon">🎉</div>
                            <div className="e2-empty__text">No pending requests</div>
                        </div>
                    ) : (
                        pending.map((r) => (
                            <div key={r.id} className="e2-request-card">
                                <div className="e2-request-card__top">
                                    <span className="e2-request-card__title">
                                        Request #{r.id}
                                    </span>
                                    <span className={`e2-badge ${(STATUS_META[r.status] || STATUS_META.PENDING).badge}`}>
                                        {(STATUS_META[r.status] || STATUS_META.PENDING).label}
                                    </span>
                                </div>
                                <div className="e2-request-card__meta">
                                    {r.touristId && <span>👤 Tourist #{r.touristId}</span>}
                                    {r.slotId    && <span>📅 Slot #{r.slotId}</span>}
                                    {r.createdAt && <span>🕐 {new Date(r.createdAt).toLocaleDateString()}</span>}
                                </div>
                                <div className="e2-btn-row" style={{ marginTop: 0 }}>
                                    <button
                                        className="e2-btn e2-btn--success e2-btn--sm"
                                        onClick={() => setStatus(r.id, 'ACCEPTED')}
                                        disabled={processing === r.id + 'ACCEPTED'}
                                    >
                                        ✓ Accept
                                    </button>
                                    <button
                                        className="e2-btn e2-btn--danger e2-btn--sm"
                                        onClick={() => setStatus(r.id, 'REJECTED')}
                                        disabled={processing === r.id + 'REJECTED'}
                                    >
                                        ✗ Reject
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Resolved requests */}
                {resolved.length > 0 && (
                    <div className="e2-card">
                        <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                            ✅ Resolved ({resolved.length})
                        </h3>
                        {resolved.map((r) => (
                            <div key={r.id} className="e2-request-card e2-card--flat">
                                <div className="e2-request-card__top">
                                    <span className="e2-request-card__title">Request #{r.id}</span>
                                    <span className={`e2-badge ${(STATUS_META[r.status] || STATUS_META.PENDING).badge}`}>
                                        {(STATUS_META[r.status] || STATUS_META.PENDING).label}
                                    </span>
                                </div>
                                <div className="e2-request-card__meta">
                                    {r.touristId && <span>👤 Tourist #{r.touristId}</span>}
                                    {r.slotId    && <span>📅 Slot #{r.slotId}</span>}
                                    {r.createdAt && <span>🕐 {new Date(r.createdAt).toLocaleDateString()}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
