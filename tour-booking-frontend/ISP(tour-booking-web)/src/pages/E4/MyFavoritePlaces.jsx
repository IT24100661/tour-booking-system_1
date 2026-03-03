import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext.jsx'
import { apiGetFavoritePlaces, apiRemoveFavoritePlace } from '../../api/e4.js'
import './E4.css'

export default function MyFavoritePlaces() {
    const { user } = useAuth()
    const userId = user?.id

    const [rows, setRows]         = useState([])
    const [err, setErr]           = useState('')
    const [msg, setMsg]           = useState('')
    const [removing, setRemoving] = useState(null)

    const load = async () => {
        if (!userId) return
        setErr('')
        try {
            const data = await apiGetFavoritePlaces(userId)
            setRows(Array.isArray(data) ? data : (data.items || []))
        } catch (e) {
            setErr(e?.response?.data?.message || e.message)
        }
    }

    useEffect(() => { load() }, [userId])

    const remove = async (placeId) => {
        if (!window.confirm('Remove this place from favorites?')) return
        setErr(''); setMsg(''); setRemoving(placeId)
        try {
            await apiRemoveFavoritePlace(userId, placeId)
            setMsg('Removed from favorites')
            await load()
        } catch (e) {
            setErr(e?.response?.data?.message || e.message)
        } finally {
            setRemoving(null)
        }
    }

    return (
        <div className="e4-page">
            <div className="e4-container e4-container--sm">
                <div className="e4-header">
                    <div className="e4-header__icon">❤️</div>
                    <h1 className="e4-header__title">My Favourite Places</h1>
                    <p className="e4-header__sub">Places you have saved to revisit</p>
                </div>

                {!userId && (
                    <div className="e4-alert e4-alert--info">ℹ️ Login as TOURIST to see your favourites</div>
                )}
                {err && <div className="e4-alert e4-alert--error">⚠️ {err}</div>}
                {msg && <div className="e4-alert e4-alert--success">✓ {msg}</div>}

                <div className="e4-card">
                    <div className="e4-card__title">
                        ❤️ Saved Places ({rows.length})
                    </div>

                    {rows.length === 0 && !err ? (
                        <div className="e4-empty">
                            <div className="e4-empty__icon">❤️</div>
                            <div className="e4-empty__text">
                                No saved places yet.{' '}
                                <Link to="/places" style={{ color:'#059669', fontWeight:700 }}>Browse places →</Link>
                            </div>
                        </div>
                    ) : (
                        rows.map((p) => {
                            const pid = p.id || p.placeId
                            return (
                                <div key={pid} className="e4-fav-card">
                                    <Link
                                        to={`/places/${pid}`}
                                        style={{ display:'flex', alignItems:'center', gap:'0.85rem', textDecoration:'none', flex:1 }}
                                    >
                                        <div style={{
                                            width:40, height:40, background:'linear-gradient(135deg,#059669,#10b981)',
                                            borderRadius:10, display:'flex', alignItems:'center',
                                            justifyContent:'center', fontSize:'1.1rem', flexShrink:0
                                        }}>
                                            📍
                                        </div>
                                        <div>
                                            <div style={{ fontWeight:700, fontSize:'0.95rem', color:'#0f172a' }}>
                                                {p.name || `Place #${pid}`}
                                            </div>
                                            {p.category && (
                                                <div style={{ marginTop:'0.2rem' }}>
                                                    <span className="e4-badge e4-badge--green" style={{ fontSize:'0.7rem' }}>
                                                        {p.category}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                    <button
                                        className="e4-btn e4-btn--danger e4-btn--sm"
                                        onClick={() => remove(pid)}
                                        disabled={removing === pid}
                                    >
                                        {removing === pid ? '...' : '🗑️ Remove'}
                                    </button>
                                </div>
                            )
                        })
                    )}
                </div>
            </div>
        </div>
    )
}
