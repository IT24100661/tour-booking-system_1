import React, { useEffect, useState } from 'react'
import { useAuth } from '../../auth/AuthContext.jsx'
import {
    apiGetAvailability,
    apiCreateAvailabilitySlot,
    apiUpdateAvailabilitySlot,
    apiDeleteAvailabilitySlot,
} from '../../api/e2.js'
import './E2.css'

export default function GuideAvailability() {
    const { user } = useAuth()
    const guideId = user?.id

    const [rows, setRows] = useState([])
    const [dateTime, setDateTime] = useState('')
    const [err, setErr] = useState('')
    const [msg, setMsg] = useState('')
    const [dtError, setDtError] = useState('')
    const [loading, setLoading] = useState(false)

    const load = async () => {
        if (!guideId) return
        setErr(''); setMsg('')
        try {
            const data = await apiGetAvailability(guideId)
            setRows(Array.isArray(data) ? data : (data.items || []))
        } catch (e) {
            setErr(e?.response?.data?.message || e.message)
        }
    }

    useEffect(() => { load() }, [guideId])

    // Validation
    const validateDateTime = () => {
        if (!dateTime.trim()) {
            setDtError('Date & time is required')
            return false
        }
        const parsed = new Date(dateTime)
        if (isNaN(parsed.getTime())) {
            setDtError('Invalid date format. Use YYYY-MM-DDTHH:MM (e.g. 2026-03-05T10:00)')
            return false
        }
        if (parsed < new Date()) {
            setDtError('Date must be in the future')
            return false
        }
        setDtError('')
        return true
    }

    const createSlot = async () => {
        if (!validateDateTime()) return
        setErr(''); setMsg('')
        setLoading(true)
        try {
            await apiCreateAvailabilitySlot(guideId, { dateTime })
            setDateTime('')
            setMsg('Slot created successfully!')
            await load()
        } catch (e) {
            setErr(e?.response?.data?.message || e.message)
        } finally {
            setLoading(false)
        }
    }

    const disableSlot = async (slotId) => {
        setErr(''); setMsg('')
        try {
            await apiUpdateAvailabilitySlot(guideId, slotId, { active: false })
            setMsg('Slot disabled')
            await load()
        } catch (e) {
            setErr(e?.response?.data?.message || e.message)
        }
    }

    const deleteSlot = async (slotId) => {
        if (!window.confirm('Delete this availability slot?')) return
        setErr(''); setMsg('')
        try {
            await apiDeleteAvailabilitySlot(guideId, slotId)
            setMsg('Slot deleted')
            await load()
        } catch (e) {
            setErr(e?.response?.data?.message || e.message)
        }
    }

    const formatDT = (s) => {
        if (s.dateTime) {
            try {
                return new Date(s.dateTime).toLocaleString('en-LK', {
                    dateStyle: 'medium', timeStyle: 'short'
                })
            } catch { return s.dateTime }
        }
        if (s.start) return `${s.start} – ${s.end}`
        return `Slot #${s.id}`
    }

    return (
        <div className="e2-page">
            <div className="e2-container e2-container--sm">
                <div className="e2-header">
                    <div className="e2-header__icon">📅</div>
                    <h1 className="e2-header__title">My Availability</h1>
                    <p className="e2-header__sub">Manage your available slots for tourist bookings</p>
                </div>

                {!guideId && (
                    <div className="e2-alert e2-alert--info">ℹ️ Login as GUIDE to manage availability</div>
                )}

                {err && <div className="e2-alert e2-alert--error">⚠️ {err}</div>}
                {msg && <div className="e2-alert e2-alert--success">✓ {msg}</div>}

                {/* Add slot */}
                <div className="e2-card">
                    <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                        ➕ Add New Slot
                    </h3>

                    <div className="e2-field">
                        <label className="e2-label">Date & Time</label>
                        <input
                            className={`e2-input ${dtError ? 'e2-input--error' : ''}`}
                            type="datetime-local"
                            value={dateTime}
                            onChange={(e) => { setDateTime(e.target.value); setDtError('') }}
                            disabled={!guideId}
                        />
                        {dtError && <div className="e2-field-error">⚠️ {dtError}</div>}
                        <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.35rem' }}>
                            Select a future date and time for your available slot
                        </div>
                    </div>

                    <button
                        className="e2-btn e2-btn--primary"
                        onClick={createSlot}
                        disabled={!guideId || loading}
                    >
                        {loading ? <><span className="e2-spinner" /> Creating...</> : '➕ Create Slot'}
                    </button>
                </div>

                {/* Slot list */}
                <div className="e2-card">
                    <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                        📋 Your Slots ({rows.length})
                    </h3>

                    {rows.length === 0 ? (
                        <div className="e2-empty">
                            <div className="e2-empty__icon">📅</div>
                            <div className="e2-empty__text">No availability slots yet. Add one above.</div>
                        </div>
                    ) : (
                        <div className="e2-slot-list">
                            {rows.map((s) => (
                                <div key={s.id} className="e2-slot-item">
                                    <div className="e2-slot-item__info">
                                        <span style={{ fontSize: '1.1rem' }}>📅</span>
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1e293b' }}>
                                                {formatDT(s)}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                                                Slot #{s.id}
                                            </div>
                                        </div>
                                        {s.active === false
                                            ? <span className="e2-badge e2-badge--gray">Disabled</span>
                                            : <span className="e2-badge e2-badge--green">Active</span>}
                                    </div>
                                    <div className="e2-slot-item__actions">
                                        {s.active !== false && (
                                            <button
                                                className="e2-btn e2-btn--warn e2-btn--sm"
                                                onClick={() => disableSlot(s.id)}
                                                disabled={!guideId}
                                            >
                                                🚫 Disable
                                            </button>
                                        )}
                                        <button
                                            className="e2-btn e2-btn--danger e2-btn--sm"
                                            onClick={() => deleteSlot(s.id)}
                                            disabled={!guideId}
                                        >
                                            🗑️ Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
