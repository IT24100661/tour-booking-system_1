import React, { useState } from 'react'
import { apiCreateHotelProfile, apiGetHotelProfile, apiUpdateHotelProfile } from '../../api/e1.js'
import './E1.css'

export default function HotelProfile() {
    const [ownerId, setOwnerId] = useState('')
    const [profile, setProfile] = useState({
        businessName: '',
        address: '',
        phone: '',
        description: ''
    })
    const [msg, setMsg] = useState(null)
    const [err, setErr] = useState(null)

    const create = async (e) => {
        e.preventDefault()
        setErr(null); setMsg(null)
        try {
            const data = await apiCreateHotelProfile(profile)
            setMsg('Hotel profile created.')
            setProfile(p => ({ ...p, ...data }))
        } catch (e2) {
            setErr(e2?.response?.data?.message || 'Create failed')
        }
    }

    const load = async (e) => {
        e.preventDefault()
        setErr(null); setMsg(null)
        try {
            const data = await apiGetHotelProfile(ownerId)
            setProfile({
                businessName: data?.businessName || '',
                address: data?.address || '',
                phone: data?.phone || '',
                description: data?.description || ''
            })
            setMsg('Profile loaded.')
        } catch (e2) {
            setErr(e2?.response?.data?.message || 'Load failed')
        }
    }

    const update = async (e) => {
        e.preventDefault()
        setErr(null); setMsg(null)
        try {
            await apiUpdateHotelProfile(ownerId, profile, 'patch')
            setMsg('Profile updated.')
        } catch (e2) {
            setErr(e2?.response?.data?.message || 'Update failed')
        }
    }

    return (
        <div className="e1-page">
            <div className="e1-card e1-card--wide">
                <div className="e1-card__icon">🏨</div>
                <h1 className="e1-card__title">Hotel Profile</h1>
                <p className="e1-card__subtitle">Create or manage your hotel listing</p>

                {err && <div className="e1-alert e1-alert--error"><span>⚠️</span> {err}</div>}
                {msg && <div className="e1-alert e1-alert--success"><span>✓</span> {msg}</div>}

                {/* Load section */}
                <div className="e1-section-label">Load existing profile</div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
                    <div className="e1-field" style={{ flex: 1, marginBottom: 0 }}>
                        <label className="e1-label">Hotel Owner User ID</label>
                        <input
                            className="e1-input"
                            value={ownerId}
                            onChange={(e) => setOwnerId(e.target.value)}
                            placeholder="e.g. 20"
                        />
                    </div>
                    <button className="e1-btn e1-btn--secondary" onClick={load} style={{ flexShrink: 0 }}>
                        🔍 Load
                    </button>
                </div>

                <div className="e1-divider" />

                {/* Create / Update form */}
                <div className="e1-section-label">
                    {ownerId ? 'Update Profile' : 'Create Profile'}
                </div>
                <form onSubmit={ownerId ? update : create}>
                    <div className="e1-field">
                        <label className="e1-label">Business Name</label>
                        <input
                            className="e1-input"
                            placeholder="e.g. Sunset Beach Hotel"
                            value={profile.businessName}
                            onChange={(e) => setProfile(p => ({ ...p, businessName: e.target.value }))}
                        />
                    </div>
                    <div className="e1-field">
                        <label className="e1-label">Address</label>
                        <input
                            className="e1-input"
                            placeholder="e.g. 42 Galle Road, Colombo"
                            value={profile.address}
                            onChange={(e) => setProfile(p => ({ ...p, address: e.target.value }))}
                        />
                    </div>
                    <div className="e1-field">
                        <label className="e1-label">Phone</label>
                        <input
                            className="e1-input"
                            placeholder="+94 11 234 5678"
                            value={profile.phone}
                            onChange={(e) => setProfile(p => ({ ...p, phone: e.target.value }))}
                        />
                    </div>
                    <div className="e1-field">
                        <label className="e1-label">Description</label>
                        <textarea
                            className="e1-input e1-textarea"
                            placeholder="Describe your hotel, amenities, services..."
                            value={profile.description}
                            onChange={(e) => setProfile(p => ({ ...p, description: e.target.value }))}
                        />
                    </div>

                    <button className="e1-btn e1-btn--primary">
                        {ownerId ? '✏️ Update Profile' : '🚀 Create Profile'}
                    </button>
                </form>
            </div>
        </div>
    )
}
