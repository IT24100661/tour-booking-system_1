import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiCreateHotel } from '../../api/e3.js'
import { useAuth } from '../../auth/AuthContext.jsx'
import './E3.css'

export default function HotelCreate() {
    const { user } = useAuth()
    const navigate = useNavigate()

    const [name, setName]               = useState('')
    const [location, setLocation]       = useState('')
    const [facilities, setFacilities]   = useState('')
    const [description, setDescription] = useState('')
    const [err, setErr]                 = useState('')
    const [loading, setLoading]         = useState(false)
    const [errors, setErrors]           = useState({})

    const validate = () => {
        const e = {}
        if (!name.trim())     e.name     = 'Hotel name is required'
        if (!location.trim()) e.location = 'Location is required'
        if (name.trim().length < 3) e.name = 'Hotel name must be at least 3 characters'
        setErrors(e)
        return Object.keys(e).length === 0
    }

    const create = async () => {
        if (!validate()) return
        setErr(''); setLoading(true)
        try {
            const created = await apiCreateHotel({
                ownerId: user?.id,
                name,
                location,
                facilities,
                description,
            })
            navigate(`/owner/hotels/${created.id}/manage`)
        } catch (e) {
            setErr(e?.response?.data?.message || e.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="e3-page">
            <div className="e3-container--sm" style={{ margin: '0 auto' }}>
                <div className="e3-header">
                    <div className="e3-header__icon">➕</div>
                    <h1 className="e3-header__title">Create Hotel</h1>
                    <p className="e3-header__sub">Add your hotel to TravelZone</p>
                </div>

                {err && <div className="e3-alert e3-alert--error">⚠️ {err}</div>}

                <div className="e3-card">
                    <div className="e3-card__title">🏨 Hotel Details</div>

                    <div className="e3-field">
                        <label className="e3-label">Hotel Name <span style={{ color:'#dc2626' }}>*</span></label>
                        <input
                            className={`e3-input ${errors.name ? 'e3-input--error' : ''}`}
                            placeholder="e.g. Sunset Beach Hotel"
                            value={name}
                            onChange={(e) => { setName(e.target.value); setErrors(p => ({ ...p, name: '' })) }}
                        />
                        {errors.name && <div className="e3-field-error">⚠️ {errors.name}</div>}
                    </div>

                    <div className="e3-field">
                        <label className="e3-label">Location <span style={{ color:'#dc2626' }}>*</span></label>
                        <input
                            className={`e3-input ${errors.location ? 'e3-input--error' : ''}`}
                            placeholder="e.g. Colombo, Sri Lanka"
                            value={location}
                            onChange={(e) => { setLocation(e.target.value); setErrors(p => ({ ...p, location: '' })) }}
                        />
                        {errors.location && <div className="e3-field-error">⚠️ {errors.location}</div>}
                    </div>

                    <div className="e3-field">
                        <label className="e3-label">
                            Facilities <span style={{ color:'#94a3b8', textTransform:'none', fontWeight:400 }}>(comma separated)</span>
                        </label>
                        <input
                            className="e3-input"
                            placeholder="e.g. pool, wifi, parking, gym"
                            value={facilities}
                            onChange={(e) => setFacilities(e.target.value)}
                        />
                        <div className="e3-field-hint">Separate each facility with a comma</div>
                    </div>

                    <div className="e3-field">
                        <label className="e3-label">Description</label>
                        <textarea
                            className="e3-textarea"
                            placeholder="Tell guests what makes your hotel special..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                        />
                    </div>

                    <button
                        className="e3-btn e3-btn--primary e3-btn--full"
                        onClick={create}
                        disabled={loading}
                        style={{ marginTop: '0.5rem' }}
                    >
                        {loading ? <><span className="e3-spinner" /> Creating...</> : '🚀 Create Hotel'}
                    </button>
                </div>
            </div>
        </div>
    )
}
