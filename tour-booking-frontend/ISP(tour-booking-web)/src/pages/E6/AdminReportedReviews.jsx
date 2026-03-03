import React, { useState } from 'react'
import { apiAdminGetReportedReviews, apiAdminModerateReview } from '../../api/e6.js'
import './E6.css'

const STATUS_META = {
    APPROVED: { badge: 'e6-badge--green',  label: '✓ Approved' },
    HIDDEN:   { badge: 'e6-badge--yellow', label: '👁 Hidden' },
    REJECTED: { badge: 'e6-badge--red',    label: '✗ Rejected' },
    REPORTED: { badge: 'e6-badge--orange', label: '🚨 Reported' },
    PENDING:  { badge: 'e6-badge--gray',   label: '⏳ Pending' },
}

const FILTER_OPTIONS = ['ALL', 'REPORTED', 'PENDING', 'APPROVED', 'HIDDEN', 'REJECTED']

const renderStars = (rating) => {
    if (!rating) return null
    const stars = Math.round(Number(rating))
    return (
        <span className="e6-stars">
            {[1,2,3,4,5].map(i => (
                <span key={i} style={{ color: i <= stars ? '#f59e0b' : '#d1d5db' }}>★</span>
            ))}
        </span>
    )
}

export default function AdminReportedReviews() {
    const [rows, setRows]         = useState([])
    const [err, setErr]           = useState('')
    const [msg, setMsg]           = useState('')
    const [loading, setLoading]   = useState(false)
    const [moderating, setModerating] = useState(null)
    const [filter, setFilter]     = useState('ALL')
    const [loaded, setLoaded]     = useState(false)

    const load = async () => {
        setErr(''); setMsg(''); setLoading(true)
        try {
            const data = await apiAdminGetReportedReviews()
            setRows(Array.isArray(data) ? data : (data.items || []))
            setLoaded(true)
        } catch (e) {
            setErr(e?.response?.data?.message || e.message)
        } finally {
            setLoading(false)
        }
    }

    const moderate = async (reviewId, status) => {
        if (!window.confirm(`Set review #${reviewId} to "${status}"?`)) return
        setErr(''); setMsg(''); setModerating(`${reviewId}-${status}`)
        try {
            await apiAdminModerateReview(reviewId, { status })
            setMsg(`✓ Review #${reviewId} → ${status}`)
            await load()
        } catch (e) {
            setErr(e?.response?.data?.message || e.message)
        } finally {
            setModerating(null)
        }
    }

    const filteredRows = filter === 'ALL'
        ? rows
        : rows.filter(r => (r.status || 'REPORTED') === filter)

    const countByStatus = (s) => rows.filter(r => (r.status || 'REPORTED') === s).length

    return (
        <div className="e6-page">
            <div className="e6-container">
                <div className="e6-header">
                    <div className="e6-header__icon">🛡️</div>
                    <h1 className="e6-header__title">Reported Reviews</h1>
                    <p className="e6-header__sub">Review reports requiring admin moderation</p>
                </div>

                {err && <div className="e6-alert e6-alert--error">⚠️ {err}</div>}
                {msg && <div className="e6-alert e6-alert--success">{msg}</div>}

                {/* Load button */}
                {!loaded ? (
                    <div className="e6-card" style={{ textAlign: 'center', padding: '2rem' }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🚨</div>
                        <p style={{ color: '#64748b', marginBottom: '1.25rem', fontSize: '0.95rem' }}>
                            Load all reported reviews awaiting moderation
                        </p>
                        <button
                            className="e6-btn e6-btn--primary"
                            onClick={load}
                            disabled={loading}
                        >
                            {loading
                                ? <><span className="e6-spinner" /> Loading...</>
                                : '🚨 Load Reported Reviews'}
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Stats */}
                        <div className="e6-stats">
                            <div className="e6-stat">
                                <div className="e6-stat__val">{rows.length}</div>
                                <div className="e6-stat__key">Total</div>
                            </div>
                            <div className="e6-stat" style={{ background: countByStatus('REPORTED') > 0 ? '#fff7ed' : '#f8fafc', borderColor: countByStatus('REPORTED') > 0 ? '#fed7aa' : '#e2e8f0' }}>
                                <div className="e6-stat__val" style={{ color: countByStatus('REPORTED') > 0 ? '#c2410c' : '#1e293b' }}>
                                    {countByStatus('REPORTED') + countByStatus('PENDING')}
                                </div>
                                <div className="e6-stat__key">Pending</div>
                            </div>
                            <div className="e6-stat">
                                <div className="e6-stat__val">{countByStatus('APPROVED')}</div>
                                <div className="e6-stat__key">Approved</div>
                            </div>
                        </div>

                        {/* Filter chips */}
                        <div className="e6-filter-bar">
                            {FILTER_OPTIONS.map(f => (
                                <button
                                    key={f}
                                    type="button"
                                    className={`e6-filter-chip ${filter === f ? 'e6-filter-chip--active' : ''}`}
                                    onClick={() => setFilter(f)}
                                >
                                    {f === 'ALL' ? `All (${rows.length})` : `${f} (${countByStatus(f)})`}
                                </button>
                            ))}
                        </div>

                        {/* Refresh */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.75rem' }}>
                            <button
                                className="e6-btn e6-btn--secondary e6-btn--sm"
                                onClick={load}
                                disabled={loading}
                            >
                                {loading
                                    ? <><span className="e6-spinner" style={{ borderTopColor:'#374151' }} /> Refreshing</>
                                    : '🔄 Refresh'}
                            </button>
                        </div>

                        {/* Review list */}
                        {filteredRows.length === 0 ? (
                            <div className="e6-card">
                                <div className="e6-empty">
                                    <div className="e6-empty__icon">✅</div>
                                    <div className="e6-empty__text">
                                        {filter === 'ALL'
                                            ? 'No reported reviews found'
                                            : `No reviews with status "${filter}"`}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            filteredRows.map((r) => {
                                const currentStatus = r.status || 'REPORTED'
                                const meta = STATUS_META[currentStatus] || STATUS_META.REPORTED
                                const isApproved = currentStatus === 'APPROVED'
                                const isHidden   = currentStatus === 'HIDDEN'
                                const isRejected = currentStatus === 'REJECTED'

                                return (
                                    <div
                                        key={r.id}
                                        className={`e6-review-card ${isApproved ? 'e6-review-card--approved' : ''} ${isHidden ? 'e6-review-card--hidden' : ''} ${isRejected ? 'e6-review-card--rejected' : ''}`}
                                    >
                                        {/* Card header */}
                                        <div className="e6-review-card__header">
                                            <div className="e6-review-card__id">
                                                💬 Review #{r.id}
                                            </div>
                                            <div className="e6-review-card__meta">
                                                {r.rating && renderStars(r.rating)}
                                                <span className={`e6-badge ${meta.badge}`}>{meta.label}</span>
                                                {r.reportCount > 0 && (
                                                    <span className="e6-badge e6-badge--orange">
                                                        🚨 {r.reportCount} report{r.reportCount !== 1 ? 's' : ''}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Card body */}
                                        <div className="e6-review-card__body">
                                            {r.comment || r.text || r.content ? (
                                                <p className="e6-review-card__text">
                                                    "{r.comment || r.text || r.content}"
                                                </p>
                                            ) : null}

                                            <div className="e6-review-card__info">
                                                {r.userId       && <span>👤 User #{r.userId}</span>}
                                                {r.touristId    && <span>🧳 Tourist #{r.touristId}</span>}
                                                {r.targetId     && <span>🎯 Target #{r.targetId}</span>}
                                                {r.targetType   && <span>📦 {r.targetType}</span>}
                                                {r.createdAt    && <span>🕐 {new Date(r.createdAt).toLocaleDateString()}</span>}
                                                {r.reportReason && <span>⚠️ Reason: {r.reportReason}</span>}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="e6-review-card__actions">
                                            <button
                                                className="e6-btn e6-btn--approve e6-btn--sm"
                                                onClick={() => moderate(r.id, 'APPROVED')}
                                                disabled={!!moderating || isApproved}
                                            >
                                                {moderating === `${r.id}-APPROVED`
                                                    ? '...'
                                                    : '✓ Approve'}
                                            </button>
                                            <button
                                                className="e6-btn e6-btn--hide e6-btn--sm"
                                                onClick={() => moderate(r.id, 'HIDDEN')}
                                                disabled={!!moderating || isHidden}
                                            >
                                                {moderating === `${r.id}-HIDDEN`
                                                    ? '...'
                                                    : '👁 Hide'}
                                            </button>
                                            <button
                                                className="e6-btn e6-btn--reject e6-btn--sm"
                                                onClick={() => moderate(r.id, 'REJECTED')}
                                                disabled={!!moderating || isRejected}
                                            >
                                                {moderating === `${r.id}-REJECTED`
                                                    ? '...'
                                                    : '✗ Reject'}
                                            </button>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
