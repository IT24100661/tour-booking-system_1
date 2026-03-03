import React, { useState } from 'react'
import { apiAdminGetPayments, apiAdminUpdatePayment } from '../../api/e5.js'
import './E5.css'

const STATUS_OPTIONS = ['SUCCESS', 'FAILED', 'PENDING', 'INITIATED', 'REFUNDED']

const STATUS_META = {
    SUCCESS:   { badge: 'e5-badge--green',  label: '✓ Success' },
    INITIATED: { badge: 'e5-badge--blue',   label: '⚡ Initiated' },
    FAILED:    { badge: 'e5-badge--red',    label: '✗ Failed' },
    PENDING:   { badge: 'e5-badge--yellow', label: '⏳ Pending' },
    REFUNDED:  { badge: 'e5-badge--purple', label: '↩️ Refunded' },
}

export default function AdminPayments() {
    const [from, setFrom]     = useState('')
    const [to, setTo]         = useState('')
    const [status, setStatus] = useState('')
    const [rows, setRows]     = useState([])
    const [err, setErr]       = useState('')
    const [msg, setMsg]       = useState('')
    const [loading, setLoading]   = useState(false)
    const [errors, setErrors]     = useState({})
    const [marking, setMarking]   = useState(null)
    const [searched, setSearched] = useState(false)

    const validate = () => {
        const e = {}
        if (from && to && new Date(from) > new Date(to))
            e.to = '"To" date must be after "From" date'
        if (from && isNaN(new Date(from).getTime()))
            e.from = 'Invalid date format'
        if (to && isNaN(new Date(to).getTime()))
            e.to = 'Invalid date format'
        setErrors(e)
        return Object.keys(e).length === 0
    }

    const search = async () => {
        if (!validate()) return
        setErr(''); setMsg(''); setLoading(true)
        try {
            const data = await apiAdminGetPayments({
                from: from || undefined,
                to:   to   || undefined,
                status: status || undefined,
            })
            setRows(Array.isArray(data) ? data : (data.items || []))
            setSearched(true)
        } catch (e) {
            setErr(e?.response?.data?.message || e.message)
        } finally {
            setLoading(false)
        }
    }

    const markSuspicious = async (paymentId) => {
        if (!window.confirm(`Mark Payment #${paymentId} as suspicious?`)) return
        setErr(''); setMsg(''); setMarking(paymentId)
        try {
            await apiAdminUpdatePayment(paymentId, { suspicious: true })
            setMsg(`Payment #${paymentId} marked as suspicious`)
            await search()
        } catch (e) {
            setErr(e?.response?.data?.message || e.message)
        } finally {
            setMarking(null)
        }
    }

    const totalAmount = rows.reduce((sum, p) => sum + (Number(p.amount) || 0), 0)
    const suspicious  = rows.filter(p => p.suspicious).length

    return (
        <div className="e5-page">
            <div className="e5-container">
                <div className="e5-header">
                    <div className="e5-header__icon">🛡️</div>
                    <h1 className="e5-header__title">Admin: Payments</h1>
                    <p className="e5-header__sub">Monitor and manage all platform payments</p>
                </div>

                {err && <div className="e5-alert e5-alert--error">⚠️ {err}</div>}
                {msg && <div className="e5-alert e5-alert--success">✓ {msg}</div>}

                {/* Filters */}
                <div className="e5-card">
                    <div className="e5-card__title">🔍 Filter Payments</div>

                    <div className="e5-form-grid--3">
                        <div className="e5-field">
                            <label className="e5-label">From Date</label>
                            <input
                                className={`e5-input ${errors.from ? 'e5-input--error' : ''}`}
                                type="date"
                                value={from}
                                onChange={(e) => { setFrom(e.target.value); setErrors(p => ({ ...p, from:'' })) }}
                            />
                            {errors.from && <div className="e5-field-error">⚠️ {errors.from}</div>}
                        </div>
                        <div className="e5-field">
                            <label className="e5-label">To Date</label>
                            <input
                                className={`e5-input ${errors.to ? 'e5-input--error' : ''}`}
                                type="date"
                                value={to}
                                onChange={(e) => { setTo(e.target.value); setErrors(p => ({ ...p, to:'' })) }}
                            />
                            {errors.to && <div className="e5-field-error">⚠️ {errors.to}</div>}
                        </div>
                        <div className="e5-field">
                            <label className="e5-label">Status</label>
                            <select
                                className="e5-select"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="">All statuses</option>
                                {STATUS_OPTIONS.map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button
                        className="e5-btn e5-btn--primary"
                        onClick={search}
                        disabled={loading}
                    >
                        {loading ? <><span className="e5-spinner" /> Searching...</> : '🔍 Search Payments'}
                    </button>
                </div>

                {/* Stats row */}
                {searched && rows.length > 0 && (
                    <div className="e5-stats">
                        <div className="e5-stat">
                            <div className="e5-stat__val">{rows.length}</div>
                            <div className="e5-stat__key">Results</div>
                        </div>
                        <div className="e5-stat">
                            <div className="e5-stat__val">
                                {rows.filter(r => r.status === 'SUCCESS').length}
                            </div>
                            <div className="e5-stat__key">Successful</div>
                        </div>
                        <div className="e5-stat" style={{ background: suspicious > 0 ? '#fef2f2' : '#f8fafc', borderColor: suspicious > 0 ? '#fecaca' : '#e2e8f0' }}>
                            <div className="e5-stat__val" style={{ color: suspicious > 0 ? '#dc2626' : '#1e293b' }}>
                                {suspicious}
                            </div>
                            <div className="e5-stat__key">Suspicious</div>
                        </div>
                    </div>
                )}

                {/* Results */}
                {searched && (
                    <div className="e5-card">
                        <div className="e5-card__title">💳 Payment Results ({rows.length})</div>

                        {rows.length === 0 ? (
                            <div className="e5-empty">
                                <div className="e5-empty__icon">🔍</div>
                                <div className="e5-empty__text">No payments found for these filters</div>
                            </div>
                        ) : (
                            rows.map((p) => {
                                const meta = STATUS_META[p.status] || STATUS_META.PENDING
                                return (
                                    <div
                                        key={p.id}
                                        className="e5-payment-row"
                                        style={p.suspicious ? { borderColor:'#f87171', background:'#fff5f5' } : {}}
                                    >
                                        <div>
                                            <div className="e5-payment-row__title">
                                                Payment #{p.id}
                                                {p.suspicious && (
                                                    <span className="e5-badge e5-badge--red" style={{ marginLeft:'0.5rem' }}>
                                                        🚨 Suspicious
                                                    </span>
                                                )}
                                            </div>
                                            <div className="e5-payment-row__meta">
                                                {p.bookingId  && <span>🎫 Booking #{p.bookingId}</span>}
                                                {p.amount     && <span>💰 {p.currency || 'LKR'} {Number(p.amount).toLocaleString()}</span>}
                                                {p.createdAt  && <span>🕐 {new Date(p.createdAt).toLocaleDateString()}</span>}
                                                {p.providerId && <span>👤 Provider #{p.providerId}</span>}
                                            </div>
                                        </div>
                                        <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', flexWrap:'wrap' }}>
                                            <span className={`e5-badge ${meta.badge}`}>{meta.label}</span>
                                            {!p.suspicious && (
                                                <button
                                                    className="e5-btn e5-btn--danger e5-btn--sm"
                                                    onClick={() => markSuspicious(p.id)}
                                                    disabled={marking === p.id}
                                                >
                                                    {marking === p.id ? '...' : '🚨 Flag'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
