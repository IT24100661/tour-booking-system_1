import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
    apiGetPlace,
    apiUpdatePlace,
    apiDeletePlace,
    apiCreateNearbyService,
    apiUpdateNearbyService,
    apiDeleteNearbyService,
} from '../../api/e4.js'
import './E4.css'

export default function AdminPlaceEdit() {
    const { id } = useParams()
    const placeId = Number(id)
    const navigate = useNavigate()

    const [place, setPlace]           = useState(null)
    const [err, setErr]               = useState('')
    const [msg, setMsg]               = useState('')

    const [name, setName]             = useState('')
    const [category, setCategory]     = useState('')
    const [description, setDescription] = useState('')

    const [svcName, setSvcName]       = useState('')
    const [svcType, setSvcType]       = useState('')
    const [svcContact, setSvcContact] = useState('')

    const [placeErrors, setPlaceErrors] = useState({})
    const [svcErrors, setSvcErrors]     = useState({})

    const load = async () => {
        setErr(''); setMsg('')
        try {
            const p = await apiGetPlace(placeId)
            setPlace(p)
            setName(p.name || '')
            setCategory(p.category || '')
            setDescription(p.description || '')
        } catch (e) {
            setErr(e?.response?.data?.message || e.message)
        }
    }

    useEffect(() => { load() }, [placeId])

    // Validators
    const validatePlace = () => {
        const e = {}
        if (!name.trim())     e.name     = 'Place name is required'
        if (!category.trim()) e.category = 'Category is required'
        setPlaceErrors(e)
        return Object.keys(e).length === 0
    }

    const validateService = () => {
        const e = {}
        if (!svcName.trim()) e.svcName = 'Service name is required'
        if (!svcType.trim()) e.svcType = 'Service type is required'
        setSvcErrors(e)
        return Object.keys(e).length === 0
    }

    const save = async () => {
        if (!validatePlace()) return
        setErr(''); setMsg('')
        try {
            await apiUpdatePlace(placeId, { name, category, description })
            setMsg('Place updated successfully')
            await load()
        } catch (e) {
            setErr(e?.response?.data?.message || e.message)
        }
    }

    const remove = async () => {
        if (!window.confirm('Permanently delete this place? This cannot be undone.')) return
        setErr(''); setMsg('')
        try {
            await apiDeletePlace(placeId)
            navigate('/places')
        } catch (e) {
            setErr(e?.response?.data?.message || e.message)
        }
    }

    const addService = async () => {
        if (!validateService()) return
        setErr(''); setMsg('')
        try {
            await apiCreateNearbyService(placeId, { name: svcName, type: svcType, contact: svcContact })
            setSvcName(''); setSvcType(''); setSvcContact('')
            setSvcErrors({})
            setMsg('Service added')
            await load()
        } catch (e) {
            setErr(e?.response?.data?.message || e.message)
        }
    }

    const patchService = async (serviceId) => {
        setErr(''); setMsg('')
        try {
            await apiUpdateNearbyService(placeId, serviceId, { contact: svcContact || undefined })
            setMsg('Service updated')
            await load()
        } catch (e) {
            setErr(e?.response?.data?.message || e.message)
        }
    }

    const deleteService = async (serviceId) => {
        if (!window.confirm('Delete this service?')) return
        setErr(''); setMsg('')
        try {
            await apiDeleteNearbyService(placeId, serviceId)
            setMsg('Service deleted')
            await load()
        } catch (e) {
            setErr(e?.response?.data?.message || e.message)
        }
    }

    const services = place?.nearbyServices || place?.services || []

    return (
        <div className="e4-page">
            <div className="e4-container">
                <div className="e4-header">
                    <div className="e4-header__icon">🛡️</div>
                    <h1 className="e4-header__title">Edit Place</h1>
                    <p className="e4-header__sub">{place?.name || `Place #${placeId}`}</p>
                </div>

                {err && <div className="e4-alert e4-alert--error">⚠️ {err}</div>}
                {msg && <div className="e4-alert e4-alert--success">✓ {msg}</div>}

                {/* Place info */}
                <div className="e4-card">
                    <div className="e4-card__title">✏️ Place Information</div>

                    <div className="e4-field">
                        <label className="e4-label">Name <span style={{ color:'#dc2626' }}>*</span></label>
                        <input
                            className={`e4-input ${placeErrors.name ? 'e4-input--error' : ''}`}
                            placeholder="Place name"
                            value={name}
                            onChange={(e) => { setName(e.target.value); setPlaceErrors(p => ({ ...p, name:'' })) }}
                        />
                        {placeErrors.name && <div className="e4-field-error">⚠️ {placeErrors.name}</div>}
                    </div>

                    <div className="e4-field">
                        <label className="e4-label">Category <span style={{ color:'#dc2626' }}>*</span></label>
                        <input
                            className={`e4-input ${placeErrors.category ? 'e4-input--error' : ''}`}
                            placeholder="e.g. Historical, Beach"
                            value={category}
                            onChange={(e) => { setCategory(e.target.value); setPlaceErrors(p => ({ ...p, category:'' })) }}
                        />
                        {placeErrors.category && <div className="e4-field-error">⚠️ {placeErrors.category}</div>}
                    </div>

                    <div className="e4-field">
                        <label className="e4-label">Description</label>
                        <textarea
                            className="e4-textarea"
                            placeholder="Description..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                        />
                    </div>

                    <div className="e4-btn-row">
                        <button className="e4-btn e4-btn--primary" onClick={save}>
                            💾 Save Changes
                        </button>
                        <button className="e4-btn e4-btn--danger" onClick={remove}>
                            🗑️ Delete Place
                        </button>
                    </div>
                </div>

                {/* Nearby services */}
                <div className="e4-card">
                    <div className="e4-card__title">🏪 Nearby Services</div>

                    {/* Existing */}
                    {services.length === 0 ? (
                        <div className="e4-empty" style={{ padding:'1.5rem' }}>
                            <div className="e4-empty__icon">🏪</div>
                            <div className="e4-empty__text">No nearby services yet</div>
                        </div>
                    ) : (
                        services.map((s) => (
                            <div key={s.id} className="e4-svc-item">
                                <div className="e4-svc-item__info">
                                    <div className="e4-svc-item__name">{s.name || `Service #${s.id}`}</div>
                                    <div className="e4-svc-item__meta">
                                        {s.type    && <span>🏷️ {s.type}</span>}
                                        {s.contact && <span>📞 {s.contact}</span>}
                                    </div>
                                </div>
                                <div className="e4-svc-item__actions">
                                    <button
                                        className="e4-btn e4-btn--warn e4-btn--sm"
                                        onClick={() => patchService(s.id)}
                                    >
                                        ✏️ Patch
                                    </button>
                                    <button
                                        className="e4-btn e4-btn--danger e4-btn--sm"
                                        onClick={() => deleteService(s.id)}
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))
                    )}

                    <div className="e4-divider" />
                    <div className="e4-section-label">Add new service</div>

                    <div className="e4-form-grid--3">
                        <div className="e4-field">
                            <label className="e4-label">Name <span style={{ color:'#dc2626' }}>*</span></label>
                            <input
                                className={`e4-input ${svcErrors.svcName ? 'e4-input--error' : ''}`}
                                placeholder="e.g. Lakeside Café"
                                value={svcName}
                                onChange={(e) => { setSvcName(e.target.value); setSvcErrors(p => ({ ...p, svcName:'' })) }}
                            />
                            {svcErrors.svcName && <div className="e4-field-error">⚠️ {svcErrors.svcName}</div>}
                        </div>
                        <div className="e4-field">
                            <label className="e4-label">Type <span style={{ color:'#dc2626' }}>*</span></label>
                            <input
                                className={`e4-input ${svcErrors.svcType ? 'e4-input--error' : ''}`}
                                placeholder="restaurant, transport"
                                value={svcType}
                                onChange={(e) => { setSvcType(e.target.value); setSvcErrors(p => ({ ...p, svcType:'' })) }}
                            />
                            {svcErrors.svcType && <div className="e4-field-error">⚠️ {svcErrors.svcType}</div>}
                        </div>
                        <div className="e4-field">
                            <label className="e4-label">Contact</label>
                            <input
                                className="e4-input"
                                placeholder="+94 11 234 5678"
                                value={svcContact}
                                onChange={(e) => setSvcContact(e.target.value)}
                            />
                        </div>
                    </div>

                    <button className="e4-btn e4-btn--primary" onClick={addService}>
                        ➕ Add Service
                    </button>
                </div>
            </div>
        </div>
    )
}
