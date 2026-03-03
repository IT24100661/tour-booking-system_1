import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext.jsx'
import {
    apiGetHotelDetails,
    apiCheckHotelAvailability,
    apiCreateHotelReservation,
} from '../../api/e3.js'
import './E3.css'

export default function HotelDetail() {
    const { id } = useParams()
    const hotelId = Number(id)
    const { user } = useAuth()

    const [hotel, setHotel]             = useState(null)
    const [checkIn, setCheckIn]         = useState('')
    const [checkOut, setCheckOut]       = useState('')
    const [availability, setAvailability] = useState(null)
    const [roomTypeId, setRoomTypeId]   = useState('')
    const [rooms, setRooms]             = useState('1')
    const [err, setErr]                 = useState('')
    const [msg, setMsg]                 = useState('')
    const [errors, setErrors]           = useState({})
    const [checkLoading, setCheckLoading] = useState(false)
    const [resLoading, setResLoading]   = useState(false)

    useEffect(() => {
        (async () => {
            setErr('')
            try {
                const data = await apiGetHotelDetails(hotelId)
                setHotel(data)
            } catch (e) {
                setErr(e?.response?.data?.message || e.message)
            }
        })()
    }, [hotelId])

    // ── Validation ──
    const validateDates = () => {
        const e = {}
        if (!checkIn)  e.checkIn  = 'Check-in date is required'
        if (!checkOut) e.checkOut = 'Check-out date is required'
        if (checkIn && checkOut) {
            if (new Date(checkIn) < new Date(new Date().toDateString()))
                e.checkIn = 'Check-in must not be in the past'
            if (new Date(checkOut) <= new Date(checkIn))
                e.checkOut = 'Check-out must be after check-in'
        }
        setErrors(e)
        return Object.keys(e).length === 0
    }

    const validateReservation = () => {
        const e = {}
        if (!user?.id)   e.login    = 'You must be logged in to reserve'
        if (!roomTypeId) e.roomType = 'Please select a room type'
        if (!rooms || isNaN(rooms) || Number(rooms) < 1)
            e.rooms = 'Number of rooms must be at least 1'
        if (!checkIn)  e.checkIn  = 'Check-in date is required'
        if (!checkOut) e.checkOut = 'Check-out date is required'
        if (checkIn && checkOut && new Date(checkOut) <= new Date(checkIn))
            e.checkOut = 'Check-out must be after check-in'
        setErrors(e)
        return Object.keys(e).length === 0
    }

    const check = async () => {
        if (!validateDates()) return
        setErr(''); setMsg(''); setCheckLoading(true)
        try {
            const data = await apiCheckHotelAvailability(hotelId, { checkIn, checkOut })
            setAvailability(data)
        } catch (e) {
            setErr(e?.response?.data?.message || e.message)
        } finally {
            setCheckLoading(false)
        }
    }

    const reserve = async () => {
        if (!validateReservation()) return
        setErr(''); setMsg(''); setResLoading(true)
        try {
            await apiCreateHotelReservation({
                hotelId,
                touristId: user.id,
                roomTypeId: Number(roomTypeId),
                checkIn,
                checkOut,
                rooms: Number(rooms),
            })
            setMsg('Reservation created successfully!')
        } catch (e) {
            setErr(e?.response?.data?.message || e.message)
        } finally {
            setResLoading(false)
        }
    }

    const roomTypes = hotel?.roomTypes || hotel?.rooms || []

    return (
        <div className="e3-page">
            <div className="e3-container">

                {err && <div className="e3-alert e3-alert--error">⚠️ {err}</div>}
                {msg && <div className="e3-alert e3-alert--success">✓ {msg}</div>}

                {/* Hero */}
                {hotel && (
                    <div className="e3-hotel-hero">
                        <h2 className="e3-hotel-hero__name">
                            🏨 {hotel.name || hotel.businessName || `Hotel #${hotelId}`}
                        </h2>
                        <p className="e3-hotel-hero__sub">
                            {hotel.location ? `📍 ${hotel.location}` : ''}
                            {hotel.location && hotel.facilities ? '  ·  ' : ''}
                            {hotel.facilities ? `✨ ${hotel.facilities}` : ''}
                        </p>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <span className="e3-badge e3-badge--purple" style={{ background:'rgba(255,255,255,0.2)', color:'#fff' }}>
                                🏨 {roomTypes.length} room type{roomTypes.length !== 1 ? 's' : ''}
                            </span>
                        </div>
                    </div>
                )}

                {/* Description */}
                {hotel?.description && (
                    <div className="e3-card">
                        <div className="e3-section-label">About</div>
                        <p style={{ fontSize:'0.9rem', color:'#475569', lineHeight:1.7, margin:0 }}>
                            {hotel.description}
                        </p>
                    </div>
                )}

                {/* Check availability */}
                <div className="e3-card">
                    <div className="e3-card__title">📅 Check Availability</div>

                    <div className="e3-form-grid">
                        <div className="e3-field">
                            <label className="e3-label">Check-in Date</label>
                            <input
                                className={`e3-input ${errors.checkIn ? 'e3-input--error' : ''}`}
                                type="date"
                                value={checkIn}
                                onChange={(e) => { setCheckIn(e.target.value); setErrors(p => ({ ...p, checkIn: '' })) }}
                            />
                            {errors.checkIn && <div className="e3-field-error">⚠️ {errors.checkIn}</div>}
                        </div>
                        <div className="e3-field">
                            <label className="e3-label">Check-out Date</label>
                            <input
                                className={`e3-input ${errors.checkOut ? 'e3-input--error' : ''}`}
                                type="date"
                                value={checkOut}
                                onChange={(e) => { setCheckOut(e.target.value); setErrors(p => ({ ...p, checkOut: '' })) }}
                            />
                            {errors.checkOut && <div className="e3-field-error">⚠️ {errors.checkOut}</div>}
                        </div>
                    </div>

                    <button
                        className="e3-btn e3-btn--secondary"
                        onClick={check}
                        disabled={checkLoading}
                    >
                        {checkLoading ? <><span className="e3-spinner" style={{ borderTopColor: '#374151' }} /> Checking...</> : '🔍 Check Availability'}
                    </button>

                    {/* Availability result */}
                    {availability && (
                        <div style={{ marginTop: '1rem' }}>
                            <div className="e3-section-label">Available Rooms</div>
                            {(Array.isArray(availability) ? availability : [availability]).map((a, i) => (
                                <div key={i} className="e3-avail-item">
                                    <span>🏠</span>
                                    <span style={{ fontWeight: 600 }}>{a.roomTypeName || a.name || `Room type #${a.roomTypeId || i + 1}`}</span>
                                    {a.availableRooms !== undefined && (
                                        <span className="e3-badge e3-badge--green">{a.availableRooms} available</span>
                                    )}
                                    {a.price !== undefined && (
                                        <span className="e3-badge e3-badge--purple">${a.price}/night</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Reserve */}
                <div className="e3-card">
                    <div className="e3-card__title">🛎️ Make a Reservation</div>

                    {errors.login && (
                        <div className="e3-alert e3-alert--info">ℹ️ {errors.login}</div>
                    )}

                    <div className="e3-field">
                        <label className="e3-label">Room Type</label>
                        <select
                            className={`e3-select ${errors.roomType ? 'e3-input--error' : ''}`}
                            value={roomTypeId}
                            onChange={(e) => { setRoomTypeId(e.target.value); setErrors(p => ({ ...p, roomType: '' })) }}
                        >
                            <option value="">— Select room type —</option>
                            {roomTypes.map((rt) => (
                                <option key={rt.id} value={rt.id}>
                                    🏠 {rt.name || `RoomType #${rt.id}`}{rt.price ? ` — $${rt.price}/night` : ''}
                                    {rt.capacity ? ` (up to ${rt.capacity} guests)` : ''}
                                </option>
                            ))}
                        </select>
                        {errors.roomType && <div className="e3-field-error">⚠️ {errors.roomType}</div>}
                    </div>

                    <div className="e3-form-grid">
                        <div className="e3-field">
                            <label className="e3-label">Check-in</label>
                            <input
                                className={`e3-input ${errors.checkIn ? 'e3-input--error' : ''}`}
                                type="date"
                                value={checkIn}
                                onChange={(e) => { setCheckIn(e.target.value); setErrors(p => ({ ...p, checkIn: '' })) }}
                            />
                            {errors.checkIn && <div className="e3-field-error">⚠️ {errors.checkIn}</div>}
                        </div>
                        <div className="e3-field">
                            <label className="e3-label">Check-out</label>
                            <input
                                className={`e3-input ${errors.checkOut ? 'e3-input--error' : ''}`}
                                type="date"
                                value={checkOut}
                                onChange={(e) => { setCheckOut(e.target.value); setErrors(p => ({ ...p, checkOut: '' })) }}
                            />
                            {errors.checkOut && <div className="e3-field-error">⚠️ {errors.checkOut}</div>}
                        </div>
                    </div>

                    <div className="e3-field">
                        <label className="e3-label">Number of Rooms</label>
                        <input
                            className={`e3-input ${errors.rooms ? 'e3-input--error' : ''}`}
                            type="number"
                            min="1"
                            value={rooms}
                            onChange={(e) => { setRooms(e.target.value); setErrors(p => ({ ...p, rooms: '' })) }}
                        />
                        {errors.rooms && <div className="e3-field-error">⚠️ {errors.rooms}</div>}
                    </div>

                    <button
                        className="e3-btn e3-btn--primary"
                        onClick={reserve}
                        disabled={resLoading || !user?.id}
                    >
                        {resLoading ? <><span className="e3-spinner" /> Reserving...</> : '🛎️ Reserve Now'}
                    </button>

                    {!user?.id && (
                        <div className="e3-alert e3-alert--info" style={{ marginTop: '1rem' }}>
                            ℹ️ You must be logged in to make a reservation
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
