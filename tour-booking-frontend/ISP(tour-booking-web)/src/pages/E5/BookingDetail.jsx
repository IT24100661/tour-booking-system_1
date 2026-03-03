import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
    apiGetBooking,
    apiUpdateBooking,
    apiDeleteBooking,
    apiCreateInvoice,
    apiDownloadInvoice,
    apiNotifyPayment,
} from '../../api/e5.js'
import './E5.css'

const STATUS_OPTIONS = ['CONFIRMED', 'CANCELLED', 'RESCHEDULED', 'PENDING', 'COMPLETED']

const STATUS_META = {
    CONFIRMED:   { badge: 'e5-badge--green',  label: '✓ Confirmed' },
    PENDING:     { badge: 'e5-badge--yellow', label: '⏳ Pending' },
    CANCELLED:   { badge: 'e5-badge--red',    label: '⊘ Cancelled' },
    RESCHEDULED: { badge: 'e5-badge--blue',   label: '🔄 Rescheduled' },
    COMPLETED:   { badge: 'e5-badge--purple', label: '🏁 Completed' },
}

export default function BookingDetail() {
    const { id } = useParams()
    const bookingId = Number(id)

    const [data, setData]     = useState(null)
    const [status, setStatus] = useState('')
    const [reason, setReason] = useState('')
    const [err, setErr]       = useState('')
    const [msg, setMsg]       = useState('')
    const [errors, setErrors] = useState({})
    const [actionLoading, setActionLoading] = useState(null)

    const load = async () => {
        setErr(''); setMsg('')
        try {
            const b = await apiGetBooking(bookingId)
            setData(b)
            setStatus(b?.status || '')
        } catch (e) {
            setErr(e?.response?.data?.message || e.message)
        }
    }

    useEffect(() => { load() }, [bookingId])

    const validatePatch = () => {
        const e = {}
        if (!status.trim()) e.status = 'Status is required'
        setErrors(e)
        return Object.keys(e).length === 0
    }

    const patch = async () => {
        if (!validatePatch()) return
        setErr(''); setMsg(''); setActionLoading('patch')
        try {
            await apiUpdateBooking(bookingId, { status, reason: reason || undefined })
            setMsg('Booking updated successfully')
            await load()
        } catch (e) {
            setErr(e?.response?.data?.message || e.message)
        } finally {
            setActionLoading(null)
        }
    }

    const remove = async () => {
        if (!window.confirm('Delete this booking? This action cannot be undone.')) return
        setErr(''); setMsg(''); setActionLoading('delete')
        try {
            await apiDeleteBooking(bookingId)
            setMsg('Booking deleted')
            setData(null)
        } catch (e) {
            setErr(e?.response?.data?.message || e.message)
        } finally {
            setActionLoading(null)
        }
    }

    const createInvoice = async () => {
        setErr(''); setMsg(''); setActionLoading('invoice')
        try {
            await apiCreateInvoice(bookingId)
            setMsg('Invoice created')
        } catch (e) {
            setErr(e?.response?.data?.message || e.message)
        } finally {
            setActionLoading(null)
        }
    }

    const downloadInvoice = async () => {
        setErr(''); setMsg(''); setActionLoading('download')
        try {
            const res = await apiDownloadInvoice(bookingId)
            const blob = new Blob([res.data], { type: res.headers['content-type'] || 'application/pdf' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `invoice-booking-${bookingId}.pdf`
            document.body.appendChild(a)
            a.click()
            a.remove()
            URL.revokeObjectURL(url)
            setMsg('Invoice downloaded')
        } catch (e) {
            setErr(e?.response?.data?.message || e.message)
        } finally {
            setActionLoading(null)
        }
    }

    const notify = async () => {
        setErr(''); setMsg(''); setActionLoading('notify')
        try {
            await apiNotifyPayment({ bookingId })
            setMsg('Payment notification triggered')
        } catch (e) {
            setErr(e?.response?.data?.message || e.message)
        } finally {
            setActionLoading(null)
        }
    }

    const currentMeta = STATUS_META[data?.status] || STATUS_META.PENDING

    return (
        <div className="e5-page">
            <div className="e5-container e5-container--sm">
                <div className="e5-header">
                    <div className="e5-header__icon">🎫</div>
                    <h1 className="e5-header__title">Booking #{bookingId}</h1>
                    <p className="e5-header__sub">View and manage booking details</p>
                </div>

                {err && <div className="e5-alert e5-alert--error">⚠️ {err}</div>}
                {msg && <div className="e5-alert e5-alert--success">✓ {msg}</div>}

                {/* Summary card */}
                {data && (
                    <div className="e5-card">
                        <div className="e5-card__title">📋 Booking Summary</div>

                        <div className="e5-info-row">
                            <span className="e5-info-row__key">Booking ID</span>
                            <span className="e5-info-row__val">#{data.id}</span>
                        </div>
                        <div className="e5-info-row">
                            <span className="e5-info-row__key">Status</span>
                            <span className="e5-info-row__val">
                                <span className={`e5-badge ${currentMeta.badge}`}>{currentMeta.label}</span>
                            </span>
                        </div>
                        {data.type && (
                            <div className="e5-info-row">
                                <span className="e5-info-row__key">Type</span>
                                <span className="e5-info-row__val">
                                    {data.type === 'HOTEL' ? '🏨' : '🗺️'} {data.type}
                                </span>
                            </div>
                        )}
                        {data.touristId && (
                            <div className="e5-info-row">
                                <span className="e5-info-row__key">Tourist ID</span>
                                <span className="e5-info-row__val">#{data.touristId}</span>
                            </div>
                        )}
                        {data.referenceId && (
                            <div className="e5-info-row">
                                <span className="e5-info-row__key">Reference ID</span>
                                <span className="e5-info-row__val">#{data.referenceId}</span>
                            </div>
                        )}
                        {data.createdAt && (
                            <div className="e5-info-row">
                                <span className="e5-info-row__key">Created</span>
                                <span className="e5-info-row__val">
                                    {new Date(data.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        )}
                    </div>
                )}

                {/* Invoice & notifications */}
                <div className="e5-card">
                    <div className="e5-card__title">🧾 Invoice & Notifications</div>
                    <div className="e5-btn-row" style={{ marginTop: 0 }}>
                        <button
                            className="e5-btn e5-btn--secondary"
                            onClick={createInvoice}
                            disabled={actionLoading === 'invoice'}
                        >
                            {actionLoading === 'invoice'
                                ? <><span className="e5-spinner" style={{ borderTopColor:'#374151' }} /> Creating</>
                                : '🧾 Create Invoice'}
                        </button>
                        <button
                            className="e5-btn e5-btn--secondary"
                            onClick={downloadInvoice}
                            disabled={actionLoading === 'download'}
                        >
                            {actionLoading === 'download'
                                ? <><span className="e5-spinner" style={{ borderTopColor:'#374151' }} /> Downloading</>
                                : '⬇️ Download Invoice'}
                        </button>
                        <button
                            className="e5-btn e5-btn--ghost"
                            onClick={notify}
                            disabled={actionLoading === 'notify'}
                        >
                            {actionLoading === 'notify'
                                ? <><span className="e5-spinner" style={{ borderTopColor:'#7c3aed' }} /> Notifying</>
                                : '🔔 Notify Payment'}
                        </button>
                    </div>
                </div>

                {/* Update status */}
                <div className="e5-card">
                    <div className="e5-card__title">✏️ Update Status</div>

                    <div className="e5-field">
                        <label className="e5-label">New Status <span style={{ color:'#dc2626' }}>*</span></label>
                        <select
                            className={`e5-select ${errors.status ? 'e5-input--error' : ''}`}
                            value={status}
                            onChange={(e) => { setStatus(e.target.value); setErrors(p => ({ ...p, status:'' })) }}
                        >
                            <option value="">— Select status —</option>
                            {STATUS_OPTIONS.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                        {errors.status && <div className="e5-field-error">⚠️ {errors.status}</div>}
                    </div>

                    <div className="e5-field">
                        <label className="e5-label">Reason <span style={{ color:'#94a3b8', textTransform:'none', fontWeight:400 }}>(optional)</span></label>
                        <input
                            className="e5-input"
                            placeholder="e.g. Customer request, date change..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />
                    </div>

                    <div className="e5-btn-row" style={{ marginTop: 0 }}>
                        <button
                            className="e5-btn e5-btn--primary"
                            onClick={patch}
                            disabled={actionLoading === 'patch'}
                        >
                            {actionLoading === 'patch'
                                ? <><span className="e5-spinner" /> Updating</>
                                : '💾 Update Booking'}
                        </button>
                        <button
                            className="e5-btn e5-btn--danger"
                            onClick={remove}
                            disabled={actionLoading === 'delete'}
                        >
                            {actionLoading === 'delete'
                                ? '...'
                                : '🗑️ Delete'}
                        </button>
                    </div>
                </div>

                {/* Raw data */}
                {data && (
                    <div className="e5-card">
                        <div className="e5-card__title">📦 Raw Data</div>
                        <div className="e5-data-box">
                            {JSON.stringify(data, null, 2)}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
