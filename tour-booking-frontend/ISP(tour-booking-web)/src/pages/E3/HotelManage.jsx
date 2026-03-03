import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
    apiGetHotelDetails,
    apiUpdateHotel,
    apiDeleteHotel,
    apiCreateRoomType,
    apiUpdateRoomType,
    apiDeleteRoomType,
    apiCreateRoomAvailability,
    apiUpdateRoomAvailability,
    apiUploadHotelImage,
} from '../../api/e3.js'
import './E3.css'

export default function HotelManage() {
    const { id } = useParams()
    const hotelId = Number(id)

    const [hotel, setHotel]           = useState(null)
    const [err, setErr]               = useState('')
    const [msg, setMsg]               = useState('')

    // Hotel fields
    const [description, setDescription] = useState('')
    const [facilities, setFacilities]   = useState('')

    // Room type fields
    const [rtName, setRtName]       = useState('')
    const [rtPrice, setRtPrice]     = useState('')
    const [rtCapacity, setRtCapacity] = useState('')

    // Availability fields
    const [availRoomTypeId, setAvailRoomTypeId] = useState('')
    const [availFrom, setAvailFrom]             = useState('')
    const [availTo, setAvailTo]                 = useState('')
    const [availRooms, setAvailRooms]           = useState('')

    // Image
    const [file, setFile] = useState(null)

    // Validation errors
    const [rtErrors, setRtErrors]     = useState({})
    const [avErrors, setAvErrors]     = useState({})
    const [imgError, setImgError]     = useState('')
    const [hotelErrors, setHotelErrors] = useState({})

    const load = async () => {
        setErr(''); setMsg('')
        try {
            const data = await apiGetHotelDetails(hotelId)
            setHotel(data)
            setDescription(data.description || '')
            setFacilities(data.facilities || '')
        } catch (e) {
            setErr(e?.response?.data?.message || e.message)
        }
    }

    useEffect(() => { load() }, [hotelId])

    // ── Validators ──
    const validateHotel = () => {
        const e = {}
        if (!description.trim() && !facilities.trim())
            e.general = 'Provide at least one field to update'
        setHotelErrors(e)
        return Object.keys(e).length === 0
    }

    const validateRoomType = () => {
        const e = {}
        if (!rtName.trim()) e.rtName = 'Room type name is required'
        if (!rtPrice || isNaN(rtPrice) || Number(rtPrice) <= 0)
            e.rtPrice = 'Valid price is required (> 0)'
        if (!rtCapacity || isNaN(rtCapacity) || Number(rtCapacity) < 1)
            e.rtCapacity = 'Capacity must be at least 1'
        setRtErrors(e)
        return Object.keys(e).length === 0
    }

    const validateAvailability = () => {
        const e = {}
        if (!availRoomTypeId) e.availRoomTypeId = 'Room type is required'
        if (!availFrom)       e.availFrom = 'Start date is required'
        if (!availTo)         e.availTo   = 'End date is required'
        if (availFrom && availTo && new Date(availTo) <= new Date(availFrom))
            e.availTo = 'End date must be after start date'
        if (!availRooms || isNaN(availRooms) || Number(availRooms) < 1)
            e.availRooms = 'Available rooms must be at least 1'
        setAvErrors(e)
        return Object.keys(e).length === 0
    }

    // ── Handlers ──
    const saveHotel = async () => {
        if (!validateHotel()) return
        setErr(''); setMsg('')
        try {
            await apiUpdateHotel(hotelId, { description, facilities })
            setMsg('Hotel updated successfully')
            await load()
        } catch (e) {
            setErr(e?.response?.data?.message || e.message)
        }
    }

    const removeHotel = async () => {
        if (!window.confirm('Permanently delete this hotel? This cannot be undone.')) return
        setErr(''); setMsg('')
        try {
            await apiDeleteHotel(hotelId)
            setMsg('Hotel deleted')
        } catch (e) {
            setErr(e?.response?.data?.message || e.message)
        }
    }

    const addRoomType = async () => {
        if (!validateRoomType()) return
        setErr(''); setMsg('')
        try {
            await apiCreateRoomType(hotelId, {
                name: rtName,
                price: Number(rtPrice),
                capacity: Number(rtCapacity),
            })
            setRtName(''); setRtPrice(''); setRtCapacity('')
            setRtErrors({})
            setMsg('Room type created')
            await load()
        } catch (e) {
            setErr(e?.response?.data?.message || e.message)
        }
    }

    const patchRoomType = async (roomTypeId) => {
        setErr(''); setMsg('')
        try {
            await apiUpdateRoomType(hotelId, roomTypeId, {
                price: Number(rtPrice || 0) || undefined,
            })
            setMsg('Room type updated')
            await load()
        } catch (e) {
            setErr(e?.response?.data?.message || e.message)
        }
    }

    const deleteRoomType = async (roomTypeId) => {
        if (!window.confirm('Delete this room type?')) return
        setErr(''); setMsg('')
        try {
            await apiDeleteRoomType(hotelId, roomTypeId)
            setMsg('Room type deleted')
            await load()
        } catch (e) {
            setErr(e?.response?.data?.message || e.message)
        }
    }

    const addAvailability = async () => {
        if (!validateAvailability()) return
        setErr(''); setMsg('')
        try {
            await apiCreateRoomAvailability({
                roomTypeId: Number(availRoomTypeId),
                from: availFrom,
                to: availTo,
                availableRooms: Number(availRooms),
            })
            setAvailRoomTypeId(''); setAvailFrom(''); setAvailTo(''); setAvailRooms('')
            setAvErrors({})
            setMsg('Availability created')
        } catch (e) {
            setErr(e?.response?.data?.message || e.message)
        }
    }

    const upload = async () => {
        if (!file) { setImgError('Please select an image file first'); return }
        const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
        if (!allowed.includes(file.type)) { setImgError('Only JPG, PNG, WEBP or GIF allowed'); return }
        if (file.size > 5 * 1024 * 1024) { setImgError('File must be under 5 MB'); return }
        setImgError(''); setErr(''); setMsg('')
        try {
            await apiUploadHotelImage(hotelId, file)
            setMsg('Image uploaded')
            setFile(null)
            await load()
        } catch (e) {
            setErr(e?.response?.data?.message || e.message)
        }
    }

    const roomTypes = hotel?.roomTypes || []
    const images    = hotel?.images    || []

    return (
        <div className="e3-page">
            <div className="e3-container">
                <div className="e3-header">
                    <div className="e3-header__icon">⚙️</div>
                    <h1 className="e3-header__title">Manage Hotel</h1>
                    <p className="e3-header__sub">
                        {hotel?.name || hotel?.businessName || `Hotel #${hotelId}`}
                    </p>
                </div>

                {err && <div className="e3-alert e3-alert--error">⚠️ {err}</div>}
                {msg && <div className="e3-alert e3-alert--success">✓ {msg}</div>}

                {/* ── Hotel Info ── */}
                <div className="e3-card">
                    <div className="e3-card__title">✏️ Update Hotel Info</div>

                    {hotelErrors.general && (
                        <div className="e3-alert e3-alert--error">⚠️ {hotelErrors.general}</div>
                    )}

                    <div className="e3-field">
                        <label className="e3-label">Facilities</label>
                        <input
                            className="e3-input"
                            placeholder="pool, wifi, parking"
                            value={facilities}
                            onChange={(e) => setFacilities(e.target.value)}
                        />
                    </div>
                    <div className="e3-field">
                        <label className="e3-label">Description</label>
                        <textarea
                            className="e3-textarea"
                            placeholder="Describe your hotel..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                        />
                    </div>

                    <div className="e3-btn-row">
                        <button className="e3-btn e3-btn--primary" onClick={saveHotel}>
                            💾 Save Changes
                        </button>
                        <button className="e3-btn e3-btn--danger" onClick={removeHotel}>
                            🗑️ Delete Hotel
                        </button>
                    </div>
                </div>

                {/* ── Room Types ── */}
                <div className="e3-card">
                    <div className="e3-card__title">🏠 Room Types</div>

                    {/* Existing rooms */}
                    {roomTypes.length === 0 ? (
                        <div className="e3-empty" style={{ padding: '1.5rem' }}>
                            <div className="e3-empty__icon">🏠</div>
                            <div className="e3-empty__text">No room types yet</div>
                        </div>
                    ) : (
                        roomTypes.map((rt) => (
                            <div key={rt.id} className="e3-room-item">
                                <div className="e3-room-item__info">
                                    <div className="e3-room-item__name">{rt.name || `RoomType #${rt.id}`}</div>
                                    <div className="e3-room-item__meta">
                                        {rt.price    && <span>💰 ${rt.price}/night</span>}
                                        {rt.capacity && <span>👥 Up to {rt.capacity} guests</span>}
                                    </div>
                                </div>
                                <div className="e3-room-item__actions">
                                    <button
                                        className="e3-btn e3-btn--warn e3-btn--sm"
                                        onClick={() => patchRoomType(rt.id)}
                                    >
                                        ✏️ Patch
                                    </button>
                                    <button
                                        className="e3-btn e3-btn--danger e3-btn--sm"
                                        onClick={() => deleteRoomType(rt.id)}
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))
                    )}

                    <div className="e3-divider" />
                    <div className="e3-section-label">Add new room type</div>

                    <div className="e3-form-grid--3">
                        <div className="e3-field">
                            <label className="e3-label">Name</label>
                            <input
                                className={`e3-input ${rtErrors.rtName ? 'e3-input--error' : ''}`}
                                placeholder="e.g. Deluxe Suite"
                                value={rtName}
                                onChange={(e) => { setRtName(e.target.value); setRtErrors(p => ({ ...p, rtName: '' })) }}
                            />
                            {rtErrors.rtName && <div className="e3-field-error">⚠️ {rtErrors.rtName}</div>}
                        </div>
                        <div className="e3-field">
                            <label className="e3-label">Price / night</label>
                            <input
                                className={`e3-input ${rtErrors.rtPrice ? 'e3-input--error' : ''}`}
                                type="number" min="0" placeholder="e.g. 150"
                                value={rtPrice}
                                onChange={(e) => { setRtPrice(e.target.value); setRtErrors(p => ({ ...p, rtPrice: '' })) }}
                            />
                            {rtErrors.rtPrice && <div className="e3-field-error">⚠️ {rtErrors.rtPrice}</div>}
                        </div>
                        <div className="e3-field">
                            <label className="e3-label">Capacity</label>
                            <input
                                className={`e3-input ${rtErrors.rtCapacity ? 'e3-input--error' : ''}`}
                                type="number" min="1" placeholder="e.g. 2"
                                value={rtCapacity}
                                onChange={(e) => { setRtCapacity(e.target.value); setRtErrors(p => ({ ...p, rtCapacity: '' })) }}
                            />
                            {rtErrors.rtCapacity && <div className="e3-field-error">⚠️ {rtErrors.rtCapacity}</div>}
                        </div>
                    </div>

                    <button className="e3-btn e3-btn--success" onClick={addRoomType}>
                        ➕ Add Room Type
                    </button>
                </div>

                {/* ── Room Availability ── */}
                <div className="e3-card">
                    <div className="e3-card__title">📅 Room Availability</div>

                    <div className="e3-field">
                        <label className="e3-label">Room Type</label>
                        <select
                            className={`e3-select ${avErrors.availRoomTypeId ? 'e3-input--error' : ''}`}
                            value={availRoomTypeId}
                            onChange={(e) => { setAvailRoomTypeId(e.target.value); setAvErrors(p => ({ ...p, availRoomTypeId: '' })) }}
                        >
                            <option value="">— Select room type —</option>
                            {roomTypes.map((rt) => (
                                <option key={rt.id} value={rt.id}>
                                    {rt.name || `RoomType #${rt.id}`}
                                </option>
                            ))}
                        </select>
                        {avErrors.availRoomTypeId && <div className="e3-field-error">⚠️ {avErrors.availRoomTypeId}</div>}
                    </div>

                    <div className="e3-form-grid--3">
                        <div className="e3-field">
                            <label className="e3-label">From</label>
                            <input
                                className={`e3-input ${avErrors.availFrom ? 'e3-input--error' : ''}`}
                                type="date" value={availFrom}
                                onChange={(e) => { setAvailFrom(e.target.value); setAvErrors(p => ({ ...p, availFrom: '' })) }}
                            />
                            {avErrors.availFrom && <div className="e3-field-error">⚠️ {avErrors.availFrom}</div>}
                        </div>
                        <div className="e3-field">
                            <label className="e3-label">To</label>
                            <input
                                className={`e3-input ${avErrors.availTo ? 'e3-input--error' : ''}`}
                                type="date" value={availTo}
                                onChange={(e) => { setAvailTo(e.target.value); setAvErrors(p => ({ ...p, availTo: '' })) }}
                            />
                            {avErrors.availTo && <div className="e3-field-error">⚠️ {avErrors.availTo}</div>}
                        </div>
                        <div className="e3-field">
                            <label className="e3-label">Available Rooms</label>
                            <input
                                className={`e3-input ${avErrors.availRooms ? 'e3-input--error' : ''}`}
                                type="number" min="1" placeholder="e.g. 5"
                                value={availRooms}
                                onChange={(e) => { setAvailRooms(e.target.value); setAvErrors(p => ({ ...p, availRooms: '' })) }}
                            />
                            {avErrors.availRooms && <div className="e3-field-error">⚠️ {avErrors.availRooms}</div>}
                        </div>
                    </div>

                    <button className="e3-btn e3-btn--primary" onClick={addAvailability}>
                        📅 Create Availability
                    </button>
                </div>

                {/* ── Images ── */}
                <div className="e3-card">
                    <div className="e3-card__title">🖼️ Hotel Images</div>

                    <div className="e3-upload-zone" onClick={() => document.getElementById('hotel-img-input').click()}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📁</div>
                        <div className="e3-upload-zone__text">
                            {file ? `✓ Selected: ${file.name}` : 'Click to select an image (JPG, PNG, WEBP — max 5 MB)'}
                        </div>
                        <input
                            id="hotel-img-input"
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={(e) => { setFile(e.target.files?.[0] || null); setImgError('') }}
                        />
                    </div>

                    {imgError && (
                        <div className="e3-alert e3-alert--error" style={{ marginTop: '0.75rem' }}>
                            ⚠️ {imgError}
                        </div>
                    )}

                    <button
                        className="e3-btn e3-btn--primary"
                        onClick={upload}
                        style={{ marginTop: '0.75rem' }}
                    >
                        📤 Upload Image
                    </button>

                    {images.length > 0 && (
                        <>
                            <div className="e3-section-label">Uploaded Images ({images.length})</div>
                            <div className="e3-image-grid">
                                {images.map((img) => (
                                    img.url
                                        ? <img key={img.id} src={img.url} alt="hotel" className="e3-image-thumb" />
                                        : <div key={img.id} className="e3-image-thumb" style={{ background:'#f1f5f9', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem' }}>🖼️</div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
