import React, { useState } from 'react'
import { apiCreateGuideProfile, apiGetGuideProfile, apiUpdateGuideProfile } from '../../api/e1.js'
import './E1.css'

export default function GuideProfile() {
    const [guideId, setGuideId] = useState('')
    const [profile, setProfile] = useState({
        experience: '',
        languages: '',
        price: '',
        bio: ''
    })
    const [msg, setMsg] = useState(null)
    const [err, setErr] = useState(null)

    const create = async (e) => {
        e.preventDefault()
        setErr(null); setMsg(null)
        try {
            const data = await apiCreateGuideProfile(profile)
            setMsg('Guide profile created.')
            setProfile(p => ({ ...p, ...data }))
        } catch (e2) {
            setErr(e2?.response?.data?.message || 'Create failed')
        }
    }

    const load = async (e) => {
        e.preventDefault()
        setErr(null); setMsg(null)
        try {
            const data = await apiGetGuideProfile(guideId)
            setProfile({
                experience: data?.experience || '',
                languages: Array.isArray(data?.languages)
                    ? data.languages.join(',')
                    : (data?.languages || ''),
                price: data?.price ?? '',
                bio: data?.bio || ''
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
            await apiUpdateGuideProfile(guideId, profile, 'patch')
            setMsg('Profile updated.')
        } catch (e2) {
            setErr(e2?.response?.data?.message || 'Update failed')
        }
    }

    return (
        <div className="e1-page">
            <div className="e1-card e1-card--wide">
                <div className="e1-card__icon">🗺️</div>
                <h1 className="e1-card__title">Guide Profile</h1>
                <p className="e1-card__subtitle">Create or manage your guide profile</p>

                {err && <div className="e1-alert e1-alert--error"><span>⚠️</span> {err}</div>}
                {msg && <div className="e1-alert e1-alert--success"><span>✓</span> {msg}</div>}

                {/* Load section */}
                <div className="e1-section-label">Load existing profile</div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
                    <div className="e1-field" style={{ flex: 1, marginBottom: 0 }}>
                        <label className="e1-label">Guide User ID</label>
                        <input
                            className="e1-input"
                            value={guideId}
                            onChange={(e) => setGuideId(e.target.value)}
                            placeholder="e.g. 12"
                        />
                    </div>
                    <button className="e1-btn e1-btn--secondary" onClick={load} style={{ flexShrink: 0 }}>
                        🔍 Load
                    </button>
                </div>

                <div className="e1-divider" />

                {/* Create / Update form */}
                <div className="e1-section-label">
                    {guideId ? 'Update Profile' : 'Create Profile'}
                </div>
                <form onSubmit={guideId ? update : create}>
                    <div className="e1-field">
                        <label className="e1-label">Experience</label>
                        <input
                            className="e1-input"
                            placeholder="e.g. 5 years guiding in Colombo"
                            value={profile.experience}
                            onChange={(e) => setProfile(p => ({ ...p, experience: e.target.value }))}
                        />
                    </div>
                    <div className="e1-field">
                        <label className="e1-label">Languages <span style={{ color: '#94a3b8', textTransform: 'none', fontWeight: 400 }}>(comma separated)</span></label>
                        <input
                            className="e1-input"
                            placeholder="English, Sinhala, Tamil"
                            value={profile.languages}
                            onChange={(e) => setProfile(p => ({ ...p, languages: e.target.value }))}
                        />
                    </div>
                    <div className="e1-field">
                        <label className="e1-label">Price per day (USD)</label>
                        <input
                            className="e1-input"
                            type="number"
                            placeholder="e.g. 80"
                            value={profile.price}
                            onChange={(e) => setProfile(p => ({ ...p, price: e.target.value }))}
                        />
                    </div>
                    <div className="e1-field">
                        <label className="e1-label">Bio</label>
                        <textarea
                            className="e1-input e1-textarea"
                            placeholder="Tell tourists about yourself..."
                            value={profile.bio}
                            onChange={(e) => setProfile(p => ({ ...p, bio: e.target.value }))}
                        />
                    </div>

                    <button className="e1-btn e1-btn--primary">
                        {guideId ? '✏️ Update Profile' : '🚀 Create Profile'}
                    </button>
                </form>
            </div>
        </div>
    )
}
