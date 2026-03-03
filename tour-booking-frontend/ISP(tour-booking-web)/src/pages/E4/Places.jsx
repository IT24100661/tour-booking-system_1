import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { apiSearchPlaces } from '../../api/e4.js'
import './E4.css'

const QUICK_CATEGORIES = ['Beach', 'Historical', 'Wildlife', 'Mountain', 'Temple', 'Waterfall']

export default function Places() {
    const [category, setCategory] = useState('')
    const [rows, setRows]         = useState([])
    const [err, setErr]           = useState('')
    const [searched, setSearched] = useState(false)
    const [loading, setLoading]   = useState(false)

    const search = async () => {
        setErr(''); setLoading(true)
        try {
            const data = await apiSearchPlaces({ category: category || undefined })
            setRows(Array.isArray(data) ? data : (data.items || []))
            setSearched(true)
        } catch (e) {
            setErr(e?.response?.data?.message || e.message)
        } finally {
            setLoading(false)
        }
    }

    const selectCategory = (cat) => {
        setCategory(prev => prev === cat ? '' : cat)
    }

    const getCategoryIcon = (cat) => {
        const icons = { Beach:'🏖️', Historical:'🏛️', Wildlife:'🦁', Mountain:'⛰️', Temple:'🛕', Waterfall:'💧' }
        return icons[cat] || '📍'
    }

    return (
        <div className="e4-page">
            <div className="e4-container">
                <div className="e4-header">
                    <div className="e4-header__icon">📍</div>
                    <h1 className="e4-header__title">Explore Places</h1>
                    <p className="e4-header__sub">Discover amazing destinations across Sri Lanka</p>
                </div>

                <div className="e4-card">
                    {/* Quick category chips */}
                    <div className="e4-section-label" style={{ marginTop: 0 }}>Quick Filter</div>
                    <div className="e4-categories">
                        {QUICK_CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                className={`e4-cat-chip ${category === cat ? 'e4-cat-chip--active' : ''}`}
                                onClick={() => selectCategory(cat)}
                                type="button"
                            >
                                {getCategoryIcon(cat)} {cat}
                            </button>
                        ))}
                    </div>

                    <div className="e4-search-bar">
                        <div className="e4-field" style={{ marginBottom: 0 }}>
                            <label className="e4-label">Category</label>
                            <input
                                className="e4-input"
                                placeholder="e.g. beach, historical, wildlife"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            />
                        </div>
                        <button
                            className="e4-btn e4-btn--primary"
                            onClick={search}
                            disabled={loading}
                            style={{ alignSelf: 'flex-end' }}
                        >
                            {loading ? <><span className="e4-spinner" /> Searching</> : '🔍 Search'}
                        </button>
                    </div>
                </div>

                {err && <div className="e4-alert e4-alert--error">⚠️ {err}</div>}

                {searched && rows.length === 0 && !err && (
                    <div className="e4-card">
                        <div className="e4-empty">
                            <div className="e4-empty__icon">🔍</div>
                            <div className="e4-empty__text">No places found. Try a different category.</div>
                        </div>
                    </div>
                )}

                {rows.length > 0 && (
                    <>
                        <div className="e4-section-label">{rows.length} place{rows.length !== 1 ? 's' : ''} found</div>
                        <div className="e4-place-grid">
                            {rows.map((p) => (
                                <Link key={p.id} to={`/places/${p.id}`} className="e4-place-card">
                                    <div className="e4-place-card__icon">
                                        {getCategoryIcon(p.category)}
                                    </div>
                                    <div className="e4-place-card__name">
                                        {p.name || `Place #${p.id}`}
                                    </div>
                                    <div className="e4-place-card__meta">
                                        {p.description && (
                                            <span style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:'100%', display:'block' }}>
                                                {p.description.slice(0, 60)}{p.description.length > 60 ? '…' : ''}
                                            </span>
                                        )}
                                    </div>
                                    <div className="e4-place-card__footer">
                                        {p.category
                                            ? <span className="e4-badge e4-badge--green">{p.category}</span>
                                            : <span className="e4-badge e4-badge--gray">Uncategorised</span>}
                                        <span style={{ fontSize:'0.8rem', color:'#94a3b8' }}>View →</span>
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
