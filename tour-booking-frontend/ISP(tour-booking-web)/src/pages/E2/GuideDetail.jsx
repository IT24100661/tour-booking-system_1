import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
    apiGetGuide,
    apiGetAvailability,
    apiCreateBookingRequest,
    apiCreateGuideBooking,
} from '../../api/e2.js'
import { useAuth } from '../../auth/AuthContext.jsx'
import ReviewsBlock from '../../components/ReviewsBlock.jsx'
import './E2.css'

export default function GuideDetail() {
    const { id } = useParams()
    const guideId = Number(id)
    const { user } = useAuth()

    const [guide, setGuide] = useState(null)
    const [slots, setSlots] = useState([])
    const [selectedSlotId, setSelectedSlotId] = useState('')
    const [err, setErr] = useState('')
    const [msg, setMsg] = useState('')
    const [bookingErr, setBookingErr] = useState('')

    const load = async () => {
        setErr(''); setMsg('')
        try {
            const g = await apiGetGuide(guideId)
            setGuide(g)
            const s = await apiGetAvailability(guideId)
            setSlots(Array.isArray(s) ? s : (s.items || []))
        } catch (e) {
            setErr(e?.response?.data?.message || e.message)
        }
    }

    useEffect(() => {
        if (!Number.isFinite(guideId)) return
        load()
    }, [guideId])

    const touristId = user?.id

    // Validation
    const validateBooking = () => {
        if (!touristId) { setBookingErr('You must be logged in to book'); return false }
        if (!selectedSlotId) { setBookingErr('Please select an availability slot'); return false }
        setBookingErr('')
        return true
    }

    const requestBooking = async () => {
        if (!validateBooking()) return
        setErr(''); setMsg('')
        try {
            await apiCreateBookingRequest({ guideId, touristId, slotId: Number(selectedSlotId) })
            setMsg('Booking request sent successfully!')
            setSelectedSlotId('')
        } catch (e) {
            setErr(e?.response?.data?.message || e.message)
        }
    }

    const bookDirect = async () => {
        if (!validateBooking()) return
        setErr(''); setMsg('')
        try {
            await apiCreateGuideBooking({ guideId, touristId, slotId: Number(selectedSlotId) })
            setMsg('Booking created successfully!')
            setSelectedSlotId('')
        } catch (e) {
            setErr(e?.response?.data?.message || e.message)
        }
    }

    const initials = guide?.name
        ? guide.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
        : '?'

    return (
        <div className="e2-page">
            <div className="e2-container">

                {err && <div className="e2-alert e2-alert--error">⚠️ {err}</div>}
                {msg && <div className="e2-alert e2-alert--success">✓ {msg}</div>}

                {/* Hero */}
                {guide && (
                    <div className="e2-guide-hero">
                        <div className="e2-guide-hero__avatar">{initials}</div>
                        <div>
                            <p className="e2-guide-hero__name">{guide.name || `Guide #${guideId}`}</p>
                            <p className="e2-guide-hero__sub">
                                {guide.location ? `📍 ${guide.location}` : ''}
                                {guide.location && guide.languages ? '  ·  ' : ''}
                                {guide.languages ? `🌐 ${Array.isArray(guide.languages) ? guide.languages.join(', ') : guide.languages}` : ''}
                            </p>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                {guide.ratingAvg && (
                                    <span className="e2-badge e2-badge--yellow">⭐ {Number(guide.ratingAvg).toFixed(1)} ({guide.ratingCount || 0})</span>
                                )}
                                {guide.price && (
                                    <span className="e2-badge e2-badge--blue" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}>${guide.price}/day</span>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Bio */}
                {guide?.bio && (
                    <div className="e2-card">
                        <div className="e2-section-label">About this guide</div>
                        <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.7, margin: 0 }}>
                            {guide.bio}
                        </p>
                    </div>
                )}

                {/* Booking */}
                <div className="e2-card">
                    <div className="e2-header__icon" style={{ marginBottom: '0.75rem' }}>📅</div>
                    <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                        Book this Guide
                    </h3>
                    <p style={{ margin: '0 0 1.25rem', fontSize: '0.875rem', color: '#64748b' }}>
                        Select an available slot and request or book directly
                    </p>

                    {bookingErr && (
                        <div className="e2-alert e2-alert--error" style={{ marginBottom: '1rem' }}>
                            ⚠️ {bookingErr}
                        </div>
                    )}

                    <div className="e2-field">
                        <label className="e2-label">Select Availability Slot</label>
                        <select
                            className={`e2-select ${bookingErr && !selectedSlotId ? 'e2-input--error' : ''}`}
                            value={selectedSlotId}
                            onChange={(e) => { setSelectedSlotId(e.target.value); setBookingErr('') }}
                        >
                            <option value="">— Choose a slot —</option>
                            {slots.map((s) => (
                                <option key={s.id} value={s.id}>
                                    📅 {s.dateTime || `${s.start} – ${s.end}` || `Slot #${s.id}`}
                                    {s.active === false ? ' (unavailable)' : ''}
                                </option>
                            ))}
                        </select>
                        {slots.length === 0 && (
                            <div className="e2-field-error">ℹ️ No availability slots listed yet</div>
                        )}
                    </div>

                    <div className="e2-btn-row">
                        <button className="e2-btn e2-btn--secondary" onClick={requestBooking} disabled={!touristId}>
                            📨 Send Request
                        </button>
                        <button className="e2-btn e2-btn--primary" onClick={bookDirect} disabled={!touristId}>
                            ⚡ Book Direct
                        </button>
                    </div>

                    {!touristId && (
                        <div className="e2-alert e2-alert--info" style={{ marginTop: '1rem' }}>
                            ℹ️ You must be logged in to book a guide
                        </div>
                    )}
                </div>

                {/* Reviews */}
                <ReviewsBlock targetType="GUIDE" targetId={guideId} />
            </div>
        </div>
    )
}
