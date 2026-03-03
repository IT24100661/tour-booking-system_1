import React, { useState } from 'react'
import { apiCreateGuideProfile, apiGetGuideProfile, apiUpdateGuideProfile } from '../../api/e1.js'

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
                languages: Array.isArray(data?.languages) ? data.languages.join(',') : (data?.languages || ''),
                price: data?.price ?? '',
                bio: data?.bio || ''
            })
            setMsg('Loaded.')
        } catch (e2) {
            setErr(e2?.response?.data?.message || 'Load failed')
        }
    }

    const update = async (e) => {
        e.preventDefault()
        setErr(null); setMsg(null)
        try {
            await apiUpdateGuideProfile(guideId, profile, 'patch')
            setMsg('Updated.')
        } catch (e2) {
            setErr(e2?.response?.data?.message || 'Update failed')
        }
    }

    return (
        <div className="card">
            <h2>Guide Profile</h2>

            {err && <div className="error">{err}</div>}
            {msg && <div className="ok">{msg}</div>}

            <div className="field">
                <label>Guide User ID (for GET/UPDATE)</label>
                <input value={guideId} onChange={(e) => setGuideId(e.target.value)} placeholder="e.g. 12" />
            </div>

            <div className="row">
                <button onClick={load}>Load Profile</button>
            </div>

            <hr />

            <form onSubmit={guideId ? update : create}>
                <div className="field">
                    <label>Experience</label>
                    <input value={profile.experience} onChange={(e) => setProfile(p => ({ ...p, experience: e.target.value }))} />
                </div>
                <div className="field">
                    <label>Languages (comma separated)</label>
                    <input value={profile.languages} onChange={(e) => setProfile(p => ({ ...p, languages: e.target.value }))} />
                </div>
                <div className="field">
                    <label>Price</label>
                    <input value={profile.price} onChange={(e) => setProfile(p => ({ ...p, price: e.target.value }))} />
                </div>
                <div className="field">
                    <label>Bio</label>
                    <textarea rows="3" value={profile.bio} onChange={(e) => setProfile(p => ({ ...p, bio: e.target.value }))} />
                </div>

                <button className="primary">{guideId ? 'Update (PATCH)' : 'Create'}</button>
            </form>
        </div>
    )
}
