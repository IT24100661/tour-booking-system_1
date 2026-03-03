import React, { useState } from 'react'
import { apiCreateGuideProfile, apiGetGuideProfile, apiUpdateGuideProfile } from '../../api/e1.js'

const s = {
    page: { minHeight: '100vh', background: '#f0f4f8', padding: '32px 24px' },
    wrap: { maxWidth: '600px', margin: '0 auto' },
    title: { fontSize: '26px', fontWeight: '800', color: '#1e3a5f', marginBottom: '24px' },
    card: { background: '#fff', borderRadius: '16px', padding: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', marginBottom: '20px' },
    sectionTitle: { fontSize: '15px', fontWeight: '700', color: '#1e3a5f', marginBottom: '16px' },
    field: { marginBottom: '16px' },
    label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' },
    input: { width: '100%', padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '15px', outline: 'none', boxSizing: 'border-box', background: '#f8fafc', color: '#0f172a' },
    textarea: { width: '100%', padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '15px', outline: 'none', boxSizing: 'border-box', background: '#f8fafc', color: '#0f172a', resize: 'vertical' },
    row: { display: 'flex', gap: '12px', alignItems: 'center' },
    btn: { padding: '12px 24px', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: 'pointer' },
    btnOutline: { padding: '12px 24px', background: '#fff', color: '#2563eb', border: '2px solid #2563eb', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: 'pointer' },
    btnPrimary: { padding: '12px 24px', background: 'linear-gradient(135deg, #16a34a, #15803d)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: 'pointer' },
    error: { background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px 16px', borderRadius: '10px', fontSize: '14px', marginBottom: '16px' },
    ok: { background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', padding: '12px 16px', borderRadius: '10px', fontSize: '14px', marginBottom: '16px' },
    divider: { border: 'none', borderTop: '2px solid #f1f5f9', margin: '20px 0' },
}

export default function GuideProfile() {
    const [guideId, setGuideId] = useState('')
    const [profile, setProfile] = useState({ experience: '', languages: '', price: '', bio: '' })
    const [msg, setMsg] = useState(null)
    const [err, setErr] = useState(null)

    const create = async (e) => {
        e.preventDefault()
        setErr(null); setMsg(null)
        try {
            const data = await apiCreateGuideProfile(profile)
            setMsg('Guide profile created.')
            setProfile(p => ({ ...p, ...data }))
        } catch (e2) { setErr(e2?.response?.data?.message || 'Create failed') }
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
        } catch (e2) { setErr(e2?.response?.data?.message || 'Load failed') }
    }

    const update = async (e) => {
        e.preventDefault()
        setErr(null); setMsg(null)
        try {
            await apiUpdateGuideProfile(guideId, profile, 'patch')
            setMsg('Updated.')
        } catch (e2) { setErr(e2?.response?.data?.message || 'Update failed') }
    }

    return (
        <div style={s.page}>
            <div style={s.wrap}>
                <div style={s.title}>🗺️ Guide Profile</div>

                {err && <div style={s.error}>⚠️ {err}</div>}
                {msg && <div style={s.ok}>✅ {msg}</div>}

                <div style={s.card}>
                    <div style={s.sectionTitle}>🔍 Load Existing Profile</div>
                    <div style={s.field}>
                        <label style={s.label}>Guide User ID</label>
                        <input style={s.input} value={guideId} onChange={(e) => setGuideId(e.target.value)} placeholder="e.g. 12" />
                    </div>
                    <button style={s.btnOutline} onClick={load}>📂 Load Profile</button>
                </div>

                <div style={s.card}>
                    <div style={s.sectionTitle}>{guideId ? '✏️ Update Profile' : '➕ Create Profile'}</div>
                    <form onSubmit={guideId ? update : create}>
                        <div style={s.field}>
                            <label style={s.label}>Experience</label>
                            <input style={s.input} value={profile.experience} onChange={(e) => setProfile(p => ({ ...p, experience: e.target.value }))} placeholder="e.g. 5 years" />
                        </div>
                        <div style={s.field}>
                            <label style={s.label}>Languages (comma separated)</label>
                            <input style={s.input} value={profile.languages} onChange={(e) => setProfile(p => ({ ...p, languages: e.target.value }))} placeholder="e.g. English, Sinhala" />
                        </div>
                        <div style={s.field}>
                            <label style={s.label}>Price (LKR)</label>
                            <input style={s.input} value={profile.price} onChange={(e) => setProfile(p => ({ ...p, price: e.target.value }))} placeholder="e.g. 5000" />
                        </div>
                        <div style={s.field}>
                            <label style={s.label}>Bio</label>
                            <textarea style={s.textarea} rows="4" value={profile.bio} onChange={(e) => setProfile(p => ({ ...p, bio: e.target.value }))} placeholder="Tell tourists about yourself..." />
                        </div>
                        <button style={guideId ? s.btn : s.btnPrimary}>
                            {guideId ? '💾 Update (PATCH)' : '🚀 Create Profile'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
