import React, { useEffect, useState } from 'react'
import { useAuth } from '../../auth/AuthContext.jsx'
import { apiGetPayments } from '../../api/e5.js'
import './E5.css'

const STATUS_META = {
    SUCCESS:   { badge: 'e5-badge--green',  label: '✓ Success' },
    INITIATED: { badge: 'e5-badge--blue',   label: '⚡ Initiated' },
    FAILED:    { badge: 'e5-badge--red',    label: '✗ Failed' },
    PENDING:   { badge: 'e5-badge--yellow', label: '⏳ Pending' },
    REFUNDED:  { badge: 'e5-badge--purple', label: '↩️ Refunded' },
}

export default function ProviderPayments() {
    const { user } = useAuth()
    const [rows, setRows] = useState([])
    const [err, setErr]   = useState('')

    const load = async () => {
        if (!user?.id) return
        setErr('')
        try {
            const data = await apiGetPayments({ providerId: user.id })
            setRows(Array.isArray(data) ? data : (data.items || []))
        } catch (e) {
            setErr(e?.response?.data?.message || e.message)
        }
    }

    useEffect(() => { load() }, [user?.id])

    const totalEarned = rows
        .filter(r => r.status === 'SUCCESS')
        .reduce((sum, r) => sum + (Number(r.amount) || 0), 0)

    const currency = rows[0]?.currency || 'LKR'

    return (
        <div className="e5-page">
            <div className="e5-container e5-container--sm">
                <div className="e5-header">
                    <div className="e5-header__icon">💳</div>
                    <h1 className="e5-header__title">My Earnings</h1>
                    <p className="e5-header__sub">Payment history for your services</p>
                </div>

                {!user?.id && (
                    <div className="e5-alert e5-alert--info">ℹ️ Login to view your payments</div>
                )}
                {err && <div className="e5-alert e5-alert--error">⚠️ {err}</div>}

                {/* Earnings hero */}
                <div className="e5-earnings-hero">
                    <div className="e5-earnings-hero__icon">💰</div>
                    <div>
                        <p className="e5-earnings-hero__title">
                            Total Earned: {currency} {totalEarned.toLocaleString()}
                        </p>
                        <p className="e5-earnings-hero__sub">
                            From {rows.filter(r => r.status === 'SUCCESS').length} successful payments
                        </p>
                    </div>
                </div>

                {/* Stats */}
                {rows.length > 0 && (
                    <div className="e5-stats">
                        <div className="e5-stat">
                            <div className="e5-stat__val">{rows.length}</div>
                            <div className="e5-stat__key">Total</div>
                        </div>
                        <div className="e5-stat">
                            <div className="e5-stat__val">
                                {rows.filter(r => r.status === 'SUCCESS').length}
                            </div>
                            <div className="e5-stat__key">Successful</div>
                        </div>
                        <div className="e5-stat">
                            <div className="e5-stat__val">
                                {rows.filter(r => r.status === 'PENDING' || r.status === 'INITIATED').length}
                            </div>
                            <div className="e5-stat__key">Pending</div>
                        </div>
                    </div>
                )}

                {/* Payment list */}
                <div className="e5-card">
                    <div className="e5-card__title">📋 All Payments ({rows.length})</div>

                    {rows.length === 0 && !err ? (
                        <div className="e5-empty">
                            <div className="e5-empty__icon">💳</div>
                            <div className="e5-empty__text">No payments found yet</div>
                        </div>
                    ) : (
                        rows.map((p) => {
                            const meta = STATUS_META[p.status] || STATUS_META.PENDING
                            return (
                                <div key={p.id} className="e5-payment-row">
                                    <div>
                                        <div className="e5-payment-row__title">
                                            Payment #{p.id}
                                        </div>
                                        <div className="e5-payment-row__meta">
                                            {p.bookingId && <span>🎫 Booking #{p.bookingId}</span>}
                                            {p.amount    && <span>💰 {p.currency || 'LKR'} {Number(p.amount).toLocaleString()}</span>}
                                            {p.createdAt && <span>🕐 {new Date(p.createdAt).toLocaleDateString()}</span>}
                                        </div>
                                    </div>
                                    <span className={`e5-badge ${meta.badge}`}>{meta.label}</span>
                                </div>
                            )
                        })
                    )}
                </div>
            </div>
        </div>
    )
}
