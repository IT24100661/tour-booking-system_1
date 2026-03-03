import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { apiDeleteUser, apiGetUser, apiUpdateUser } from '../../api/e1.js'
import './E1.css'

const ROLE_META = {
    ADMIN:       { badge: 'e1-badge--red',    icon: '🛡️' },
    GUIDE:       { badge: 'e1-badge--blue',   icon: '🗺️' },
    HOTEL_OWNER: { badge: 'e1-badge--yellow', icon: '🏨' },
    TOURIST:     { badge: 'e1-badge--green',  icon: '🧳' },
}

export default function UserProfile() {
    const { id } = useParams()
    const [user, setUser] = useState(null)
    const [patch, setPatch] = useState({ name: '', phone: '' })
    const [msg, setMsg] = useState(null)
    const [err, setErr] = useState(null)

    const load = async () => {
        setErr(null); setMsg(null)
        try {
            const data = await apiGetUser(id)
            setUser(data)
            setPatch({ name: data?.name || '', phone: data?.phone || '' })
        } catch (e) {
            setErr(e?.response?.data?.message || 'Failed to load user')
        }
    }

    useEffect(() => { load() }, [id])

    const update = async (e) => {
        e.preventDefault()
        setErr(null); setMsg(null)
        try {
            const updated = await apiUpdateUser(id, patch, 'patch')
            setUser(updated)
            setMsg('Profile updated successfully.')
        } catch (e2) {
            setErr(e2?.response?.data?.message || 'Update failed')
        }
    }

    const del = async () => {
        if (!confirm('Delete this user?')) return
        setErr(null); setMsg(null)
        try {
            await apiDeleteUser(id)
            setMsg('Deleted (backend responded OK)')
            setUser(null)
        } catch (e2) {
            setErr(e2?.response?.data?.message || 'Delete failed')
        }
    }

    const meta = ROLE_META[user?.role] || { badge: 'e1-badge--blue', icon: '👤' }
    const initials = user?.name
        ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
        : '?'

    return (
        <div className="e1-page">
            <div className="e1-card e1-card--wide">
                <div className="e1-card__icon">👤</div>
                <h1 className="e1-card__title">User Profile</h1>
                <p className="e1-card__subtitle">ID: #{id}</p>

                {err && <div className="e1-alert e1-alert--error"><span>⚠️</span> {err}</div>}
                {msg && <div className="e1-alert e1-alert--success"><span>✓</span> {msg}</div>}

                {/* Profile card */}
                {user && (
                    <>
                        <div className="e1-user-hero">
                            <div className="e1-user-avatar">{initials}</div>
                            <div>
                                <p className="e1-user-hero__name">{user.name}</p>
                                <p className="e1-user-hero__email">{user.email}</p>
                                <span className={`e1-badge ${meta.badge}`}>
                                    {meta.icon} {user.role}
                                </span>
                            </div>
                        </div>

                        <div className="e1-section-label">Details</div>
                        <div className="e1-info-row">
                            <span className="e1-info-row__key">Phone</span>
                            <span className="e1-info-row__value">{user.phone || '—'}</span>
                        </div>
                        <div className="e1-info-row">
                            <span className="e1-info-row__key">Email Verified</span>
                            <span className="e1-info-row__value">
                                {user.emailVerified
                                    ? <span className="e1-badge e1-badge--green">✓ Verified</span>
                                    : <span className="e1-badge e1-badge--red">✗ Not verified</span>}
                            </span>
                        </div>
                    </>
                )}

                <div className="e1-divider" />

                {/* Update form */}
                <div className="e1-section-label">Edit Profile</div>
                <form onSubmit={update}>
                    <div className="e1-field">
                        <label className="e1-label">Name</label>
                        <input
                            className="e1-input"
                            placeholder="Full name"
                            value={patch.name}
                            onChange={(e) => setPatch(p => ({ ...p, name: e.target.value }))}
                        />
                    </div>
                    <div className="e1-field">
                        <label className="e1-label">Phone</label>
                        <input
                            className="e1-input"
                            placeholder="+1 234 567 8900"
                            value={patch.phone}
                            onChange={(e) => setPatch(p => ({ ...p, phone: e.target.value }))}
                        />
                    </div>

                    <div className="e1-btn-row">
                        <button type="submit" className="e1-btn e1-btn--primary" style={{ flex: 2, marginTop: 0 }}>
                            💾 Save Changes
                        </button>
                        <button type="button" className="e1-btn e1-btn--danger" style={{ flex: 1 }} onClick={del}>
                            🗑️ Delete
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
