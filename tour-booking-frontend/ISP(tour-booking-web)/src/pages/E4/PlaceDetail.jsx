import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext.jsx'
import {
    apiGetPlace,
    apiGetPlaceMap,
    apiGetPlaceNearby,
    apiAddFavoritePlace,
    apiRemoveFavoritePlace,
} from '../../api/e4.js'
import './E4.css'

export default function PlaceDetail() {
    const { id } = useParams()
    const placeId = Number(id)
    const { user, token } = useAuth()

    const [place, setPlace]     = useState(null)
    const [mapData, setMapData] = useState(null)
    const [nearby, setNearby]   = useState(null)
    const [err, setErr]         = useState('')
    const [msg, setMsg]         = useState('')
    const [mapLoading, setMapLoading]     = useState(false)
    const [nearbyLoading, setNearbyLoading] = useState(false)

    const load = async () => {
        setErr(''); setMsg('')
        try {
            const p = await apiGetPlace(placeId)
            setPlace(p)
        } catch (e) {
            setErr(e?.response?.data?.message || e.message)
        }
    }

    useEffect(() => { load() }, [placeId])

    const loadMap = async () => {
        setErr(''); setMsg(''); setMapLoading(true)
        try {
            setMapData(await apiGetPlaceMap(placeId))
        } catch (e) {
            setErr(e?.response?.data?.message || e.message)
        } finally {
            setMapLoading(false)
        }
    }

    const loadNearby = async () => {
        setErr(''); setMsg(''); setNearbyLoading(true)
        try {
            setNearby(await apiGetPlaceNearby(placeId))
        } catch (e) {
            setErr(e?.response?.data?.message || e.message)
        } finally {
            setNearbyLoading(false)
        }
    }

    const addFav = async () => {
        setErr(''); setMsg('')
        if (!token || !user?.id) return setErr('Login first to save favorites')
        try {
            await apiAddFavoritePlace(user.id, placeId)
            setMsg('Added to favorites!')
        } catch (e) {
            setErr(e?.response?.data?.message || e.message)
        }
    }

    const removeFav = async () => {
        setErr(''); setMsg('')
        if (!token || !user?.id) return setErr('Login first')
        try {
            await apiRemoveFavoritePlace(user.id, placeId)
            setMsg('Removed from favorites')
        } catch (e) {
            setErr(e?.response?.data?.message || e.message)
        }
    }

    const services = place?.nearbyServices || place?.services || []

    return (
        <div className="e4-page">
            <div className="e4-container">

                {err && <div className="e4-alert e4-alert--error">⚠️ {err}</div>}
                {msg && <div className="e4-alert e4-alert--success">✓ {msg}</div>}

                {/* Hero */}
                {place && (
                    <div className="e4-place-hero">
                        <h2 className="e4-place-hero__name">
                            📍 {place.name || `Place #${placeId}`}
                        </h2>
                        <p className="e4-place-hero__sub">
                            {place.category ? `🏷️ ${place.category}` : ''}
                            {place.category && (place.lat || place.lng) ? '  ·  ' : ''}
                            {place.lat && place.lng ? `🌐 ${place.lat}, ${place.lng}` : ''}
                        </p>
                        <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap' }}>
                            {place.category && (
                                <span className="e4-badge e4-badge--green" style={{ background:'rgba(255,255,255,0.2)', color:'#fff' }}>
                                    {place.category}
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* Description */}
                {place?.description && (
                    <div className="e4-card">
                        <div className="e4-section-label" style={{ marginTop: 0 }}>About this place</div>
                        <p style={{ fontSize:'0.9rem', color:'#475569', lineHeight:1.7, margin:0 }}>
                            {place.description}
                        </p>
                    </div>
                )}

                {/* Place details */}
                {place && (
                    <div className="e4-card">
                        <div className="e4-card__title">📋 Details</div>
                        {place.lat && (
                            <div className="e4-info-row">
                                <span className="e4-info-row__key">Latitude</span>
                                <span className="e4-info-row__val">{place.lat}</span>
                            </div>
                        )}
                        {place.lng && (
                            <div className="e4-info-row">
                                <span className="e4-info-row__key">Longitude</span>
                                <span className="e4-info-row__val">{place.lng}</span>
                            </div>
                        )}
                        {place.category && (
                            <div className="e4-info-row">
                                <span className="e4-info-row__key">Category</span>
                                <span className="e4-info-row__val">
                                    <span className="e4-badge e4-badge--green">{place.category}</span>
                                </span>
                            </div>
                        )}
                    </div>
                )}

                {/* Favorites actions */}
                {token && (
                    <div className="e4-card">
                        <div className="e4-card__title">❤️ Favorites</div>
                        <div className="e4-btn-row" style={{ marginTop: 0 }}>
                            <button className="e4-btn e4-btn--fav" onClick={addFav}>
                                ❤️ Save Favorite
                            </button>
                            <button className="e4-btn e4-btn--secondary" onClick={removeFav}>
                                🗑️ Remove Favorite
                            </button>
                            <Link
                                to="/my-favorites/places"
                                className="e4-btn e4-btn--secondary"
                                style={{ textDecoration:'none' }}
                            >
                                📋 My Favorites
                            </Link>
                        </div>
                    </div>
                )}

                {!token && (
                    <div className="e4-alert e4-alert--info">
                        ℹ️ <Link to="/login" style={{ color:'#059669', fontWeight:700 }}>Log in</Link> to save this place to your favorites
                    </div>
                )}

                {/* Nearby services */}
                <div className="e4-card">
                    <div className="e4-card__title">🏪 Nearby Services</div>
                    {services.length === 0 ? (
                        <div className="e4-empty" style={{ padding:'1.5rem' }}>
                            <div className="e4-empty__icon">🏪</div>
                            <div className="e4-empty__text">No nearby services listed</div>
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
                                {s.type && <span className="e4-badge e4-badge--blue">{s.type}</span>}
                            </div>
                        ))
                    )}
                </div>

                {/* Map */}
                <div className="e4-card">
                    <div className="e4-card__title">🗺️ Map Data</div>
                    <button
                        className="e4-btn e4-btn--secondary"
                        onClick={loadMap}
                        disabled={mapLoading}
                    >
                        {mapLoading
                            ? <><span className="e4-spinner" style={{ borderTopColor:'#374151' }} /> Loading</>
                            : '🗺️ Load Map'}
                    </button>
                    {mapData && (
                        <div className="e4-data-box">
                            {JSON.stringify(mapData, null, 2)}
                        </div>
                    )}
                </div>

                {/* Nearby hotels & guides */}
                <div className="e4-card">
                    <div className="e4-card__title">🏨 Nearby Hotels & Guides</div>
                    <button
                        className="e4-btn e4-btn--secondary"
                        onClick={loadNearby}
                        disabled={nearbyLoading}
                    >
                        {nearbyLoading
                            ? <><span className="e4-spinner" style={{ borderTopColor:'#374151' }} /> Loading</>
                            : '🔍 Load Nearby'}
                    </button>
                    {nearby && (
                        <div className="e4-data-box">
                            {JSON.stringify(nearby, null, 2)}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
