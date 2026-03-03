import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiCreatePlace } from '../../api/e4.js'
import './E4.css'

export default function AdminPlaceCreate() {
    const navigate = useNavigate()

    const [name, setName]               = useState('')
    const [category, setCategory]       = useState('')
    const [description, setDescription] = useState('')
    const [lat, setLat]                 = useState('')
    const [lng, setLng]                 = useState('')
    const [err, setErr]                 = useState('')
    const [loading, setLoading]         = useState(false)
    const [errors, setErrors]           = useState({})

    const validate = () => {
        const e = {}
        if (!name.trim())      e.name = 'Place name is required'
        if (name.trim().length < 2) e.name = 'Name must be at least 2 characters'
        if (!category.trim())  e.category = 'Category is required'
        if (lat !== '' && (isNaN(lat) || Number(lat) < -90 || Number(lat) > 90))
            e.lat = 'Latitude must be between -90 and 90'
        if (lng !== '' && (isNaN(lng) || Number(lng) < -180 || Number(lng) > 180))
            e.lng = 'Longitude must be between -180 and 180'
        setErrors(e)
        return Object.keys(e).length === 0
    }

    const create = async () => {
        if (!validate()) return
        setErr(''); setLoading(true)
        try {
            const created = await apiCreatePlace({
                name,
                category,
                description,
                lat: lat ? Number(lat) : null,
                lng: lng ? Number(lng) : null,
            })
            navigate(`/places/${created.id}`)
        } catch (e) {
            setErr(e?.response?.data?.message || e.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="e4-page">
            <div className="e4-container--sm" style={{ margin:'0 auto' }}>
                <div className="e4-header">
                    <div className="e4-header__icon">🛡️</div>
                    <h1 className="e4-header__title">Create Place</h1>
                    <p className="e4-header__sub">Add a new destination to TravelZone</p>
                </div>

                {err && <div className="e4-alert e4-alert--error">⚠️ {err}</div>}

                <div className="e4-card">
                    <div className="e4-card__title">📍 Place Details</div>

                    <div className="e4-field">
                        <label className="e4-label">Place Name <span style={{ color:'#dc2626' }}>*</span></label>
                        <input
                            className={`e4-input ${errors.name ? 'e4-input--error' : ''}`}
                            placeholder="e.g. Sigiriya Rock Fortress"
                            value={name}
                            onChange={(e) => { setName(e.target.value); setErrors(p => ({ ...p, name:'' })) }}
                        />
                        {errors.name && <div className="e4-field-error">⚠️ {errors.name}</div>}
                    </div>

                    <div className="e4-field">
                        <label className="e4-label">Category <span style={{ color:'#dc2626' }}>*</span></label>
                        <input
                            className={`e4-input ${errors.category ? 'e4-input--error' : ''}`}
                            placeholder="e.g. Historical, Beach, Wildlife"
                            value={category}
                            onChange={(e) => { setCategory(e.target.value); setErrors(p => ({ ...p, category:'' })) }}
                        />
                        {errors.category && <div className="e4-field-error">⚠️ {errors.category}</div>}
                    </div>

                    <div className="e4-field">
                        <label className="e4-label">Description</label>
                        <textarea
                            className="e4-textarea"
                            placeholder="Describe this place for tourists..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                        />
                    </div>

                    <div className="e4-form-grid">
                        <div className="e4-field">
                            <label className="e4-label">Latitude <span style={{ color:'#94a3b8', textTransform:'none', fontWeight:400 }}>(optional)</span></label>
                            <input
                                className={`e4-input ${errors.lat ? 'e4-input--error' : ''}`}
                                type="number"
                                placeholder="e.g. 7.9570"
                                value={lat}
                                onChange={(e) => { setLat(e.target.value); setErrors(p => ({ ...p, lat:'' })) }}
                            />
                            {errors.lat && <div className="e4-field-error">⚠️ {errors.lat}</div>}
                            <div className="e4-field-hint">-90 to 90</div>
                        </div>
                        <div className="e4-field">
                            <label className="e4-label">Longitude <span style={{ color:'#94a3b8', textTransform:'none', fontWeight:400 }}>(optional)</span></label>
                            <input
                                className={`e4-input ${errors.lng ? 'e4-input--error' : ''}`}
                                type="number"
                                placeholder="e.g. 80.7603"
                                value={lng}
                                onChange={(e) => { setLng(e.target.value); setErrors(p => ({ ...p, lng:'' })) }}
                            />
                            {errors.lng && <div className="e4-field-error">⚠️ {errors.lng}</div>}
                            <div className="e4-field-hint">-180 to 180</div>
                        </div>
                    </div>

                    <button
                        className="e4-btn e4-btn--primary e4-btn--full"
                        onClick={create}
                        disabled={loading}
                        style={{ marginTop:'0.5rem' }}
                    >
                        {loading ? <><span className="e4-spinner" /> Creating...</> : '🚀 Create Place'}
                    </button>
                </div>
            </div>
        </div>
    )
}
