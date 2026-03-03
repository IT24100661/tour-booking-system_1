import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { apiSearchGuides } from '../../api/e2.js'
import './E2.css'

export default function Guides() {
    const [location, setLocation] = useState('')
    const [language, setLanguage] = useState('')
    const [ratingMin, setRatingMin] = useState('')
    const [rows, setRows] = useState([])
    const [err, setErr] = useState('')
    const [searched, setSearched] = useState(false)
    const [loading, setLoading] = useState(false)

    // Validation
    const [errors, setErrors] = useState({})

    const validate = () => {
        const e = {}
        if (ratingMin !== '' && (isNaN(ratingMin) || Number(ratingMin) < 1 || Number(ratingMin) > 5)) {
            e.ratingMin = 'Rating must be between 1 and 5'
        }
        setErrors(e)
        return Object.keys(e).length === 0
    }

    const onSearch = async () => {
        if (!validate()) return
        setErr('')
        setLoading(true)
        try {
            const data = await apiSearchGuides({ location, language, ratingMin })
            setRows(Array.isArray(data) ? data : (data.items || []))
            setSearched(true)
        } catch (e) {
            setErr(e?.response?.data?.message || e.message)
        } finally {
            setLoading(false)
        }
    }

    const getInitials = (name) => name
        ? name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
        : '?'

    return (
        <div className="e2-page">
            <div className="e2-container">
                <div className="e2-header">
                    <div className="e2-header__icon">🗺️</div>
                    <h1 className="e2-header__title">Find a Guide</h1>
                    <p className="e2-header__sub">Browse and book experienced local guides</p>
                </div>

                {/* Search card */}
                <div className="e2-card">
                    <div className="e2-search-bar">
                        <div className="e2-field" style={{ marginBottom: 0 }}>
                            <label className="e2-label">Location</label>
                            <input
                                className="e2-input"
                                placeholder="e.g. Colombo"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>
                        <div className="e2-field" style={{ marginBottom: 0 }}>
                            <label className="e2-label">Language</label>
                            <input
                                className="e2-input"
                                placeholder="e.g. English"
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                            />
                        </div>
                        <div className="e2-field" style={{ marginBottom: 0 }}>
                            <label className="e2-label">Min Rating (1–5)</label>
                            <input
                                className={`e2-input ${errors.ratingMin ? 'e2-input--error' : ''}`}
                                placeholder="e.g. 4"
                                value={ratingMin}
                                onChange={(e) => setRatingMin(e.target.value)}
                            />
                            {errors.ratingMin && (
                                <div className="e2-field-error">⚠️ {errors.ratingMin}</div>
                            )}
                        </div>
                        <button
                            className="e2-btn e2-btn--primary"
                            onClick={onSearch}
                            disabled={loading}
                            style={{ alignSelf: 'flex-end' }}
                        >
                            {loading ? <><span className="e2-spinner" /> Searching</> : '🔍 Search'}
                        </button>
                    </div>
                </div>

                {err && <div className="e2-alert e2-alert--error">⚠️ {err}</div>}

                {/* Results */}
                {searched && rows.length === 0 && !err && (
                    <div className="e2-card">
                        <div className="e2-empty">
                            <div className="e2-empty__icon">🔍</div>
                            <div className="e2-empty__text">No guides found. Try different filters.</div>
                        </div>
                    </div>
                )}

                {rows.length > 0 && (
                    <>
                        <div className="e2-section-label">{rows.length} guide{rows.length !== 1 ? 's' : ''} found</div>
                        <div className="e2-guide-grid">
                            {rows.map((g) => (
                                <Link
                                    key={g.id}
                                    to={`/guides/${g.id}`}
                                    className="e2-guide-card"
                                >
                                    <div className="e2-guide-card__avatar">
                                        {getInitials(g.name || g.user?.name)}
                                    </div>
                                    <div className="e2-guide-card__name">
                                        {g.name || g.user?.name || `Guide #${g.id}`}
                                    </div>
                                    <div className="e2-guide-card__meta">
                                        {g.location && <span>📍 {g.location}</span>}
                                        {g.languages && <span>🌐 {Array.isArray(g.languages) ? g.languages.join(', ') : g.languages}</span>}
                                    </div>
                                    <div className="e2-guide-card__footer">
                                        {g.ratingAvg
                                            ? <span className="e2-badge e2-badge--yellow">⭐ {Number(g.ratingAvg).toFixed(1)}</span>
                                            : <span className="e2-badge e2-badge--gray">No rating</span>}
                                        {g.price && <span className="e2-badge e2-badge--blue">${g.price}/day</span>}
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
