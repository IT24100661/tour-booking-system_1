import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { apiSearchHotels } from '../../api/e3.js'
import './E3.css'

export default function Hotels() {
    const [location, setLocation]   = useState('')
    const [minPrice, setMinPrice]   = useState('')
    const [maxPrice, setMaxPrice]   = useState('')
    const [facilities, setFacilities] = useState('')
    const [rows, setRows]           = useState([])
    const [err, setErr]             = useState('')
    const [searched, setSearched]   = useState(false)
    const [loading, setLoading]     = useState(false)
    const [errors, setErrors]       = useState({})

    const validate = () => {
        const e = {}
        if (minPrice !== '' && (isNaN(minPrice) || Number(minPrice) < 0))
            e.minPrice = 'Min price must be a positive number'
        if (maxPrice !== '' && (isNaN(maxPrice) || Number(maxPrice) < 0))
            e.maxPrice = 'Max price must be a positive number'
        if (minPrice !== '' && maxPrice !== '' && Number(minPrice) > Number(maxPrice))
            e.maxPrice = 'Max price must be greater than min price'
        setErrors(e)
        return Object.keys(e).length === 0
    }

    const search = async () => {
        if (!validate()) return
        setErr(''); setLoading(true)
        try {
            const data = await apiSearchHotels({
                location,
                minPrice: minPrice || undefined,
                maxPrice: maxPrice || undefined,
                facilities,
            })
            setRows(Array.isArray(data) ? data : (data.items || []))
            setSearched(true)
        } catch (e) {
            setErr(e?.response?.data?.message || e.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="e3-page">
            <div className="e3-container">
                <div className="e3-header">
                    <div className="e3-header__icon">🏨</div>
                    <h1 className="e3-header__title">Find Hotels</h1>
                    <p className="e3-header__sub">Search and book from our curated hotel listings</p>
                </div>

                {/* Search card */}
                <div className="e3-card">
                    <div className="e3-search-bar">
                        <div className="e3-field" style={{ marginBottom: 0 }}>
                            <label className="e3-label">Location</label>
                            <input
                                className="e3-input"
                                placeholder="e.g. Colombo"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>

                        <div className="e3-field" style={{ marginBottom: 0 }}>
                            <label className="e3-label">Min Price</label>
                            <input
                                className={`e3-input ${errors.minPrice ? 'e3-input--error' : ''}`}
                                placeholder="e.g. 50"
                                value={minPrice}
                                onChange={(e) => { setMinPrice(e.target.value); setErrors(p => ({ ...p, minPrice: '' })) }}
                            />
                            {errors.minPrice && <div className="e3-field-error">⚠️ {errors.minPrice}</div>}
                        </div>

                        <div className="e3-field" style={{ marginBottom: 0 }}>
                            <label className="e3-label">Max Price</label>
                            <input
                                className={`e3-input ${errors.maxPrice ? 'e3-input--error' : ''}`}
                                placeholder="e.g. 300"
                                value={maxPrice}
                                onChange={(e) => { setMaxPrice(e.target.value); setErrors(p => ({ ...p, maxPrice: '' })) }}
                            />
                            {errors.maxPrice && <div className="e3-field-error">⚠️ {errors.maxPrice}</div>}
                        </div>

                        <div className="e3-field" style={{ marginBottom: 0 }}>
                            <label className="e3-label">Facilities</label>
                            <input
                                className="e3-input"
                                placeholder="pool, wifi"
                                value={facilities}
                                onChange={(e) => setFacilities(e.target.value)}
                            />
                        </div>

                        <button
                            className="e3-btn e3-btn--primary"
                            onClick={search}
                            disabled={loading}
                            style={{ alignSelf: 'flex-end' }}
                        >
                            {loading ? <><span className="e3-spinner" /> Searching</> : '🔍 Search'}
                        </button>
                    </div>
                </div>

                {err && <div className="e3-alert e3-alert--error">⚠️ {err}</div>}

                {/* Empty state */}
                {searched && rows.length === 0 && !err && (
                    <div className="e3-card">
                        <div className="e3-empty">
                            <div className="e3-empty__icon">🔍</div>
                            <div className="e3-empty__text">No hotels found. Try different filters.</div>
                        </div>
                    </div>
                )}

                {/* Results grid */}
                {rows.length > 0 && (
                    <>
                        <div className="e3-section-label">{rows.length} hotel{rows.length !== 1 ? 's' : ''} found</div>
                        <div className="e3-hotel-grid">
                            {rows.map((h) => (
                                <Link key={h.id} to={`/hotels/${h.id}`} className="e3-hotel-card">
                                    <div className="e3-hotel-card__icon">🏨</div>
                                    <div className="e3-hotel-card__name">
                                        {h.name || h.businessName || `Hotel #${h.id}`}
                                    </div>
                                    <div className="e3-hotel-card__meta">
                                        {h.location   && <span>📍 {h.location}</span>}
                                        {h.facilities && <span>✨ {h.facilities}</span>}
                                    </div>
                                    <div className="e3-hotel-card__footer">
                                        {h.minPrice
                                            ? <span className="e3-badge e3-badge--purple">From ${h.minPrice}</span>
                                            : <span className="e3-badge e3-badge--gray">See prices</span>}
                                        <span className="e3-badge e3-badge--green">Available</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
