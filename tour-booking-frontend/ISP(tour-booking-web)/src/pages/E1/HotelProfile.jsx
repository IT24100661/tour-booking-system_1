import React, { useState } from 'react'
import { apiCreateHotelProfile, apiGetHotelProfile, apiUpdateHotelProfile } from '../../api/e1.js'

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
    btn: { padding: '12px 24px', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: 'pointer' },
    btnOutline: { padding: '12px 24px', background: '#fff', color: '#2563eb', border: '2px solid #2563eb', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: 'pointer' },
    btnPrimary: { padding: '12px 24px', background: 'linear-gradient(135deg, #ea580c, #c2410c)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: 'pointer' },
    error: { background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px 16px', borderRadius: '10px', fontSize: '14px', marginBottom: '16px' },
    ok: { background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', padding: '12px 16px', borderRadius: '10px', fontSize: '14px', marginBottom: '16px' },
}

export default function HotelProfile() {
    const [ownerId, setOwnerId] = useState('')
    const [profile, setProfile] = useState({ businessName: '', address: '', phone: '', description: '' })
    const [msg, setMsg] = useState(null)
    const [err, setErr] = useState(null)

    const create = async (e) => {
        e.preventDefault(); setErr(null); setMsg(null)
        try {
            const data = await apiCreateHotelProfile(profile)
            setMsg('Hotel profile created.')
            setProfile(p => ({ ...p, ...data }))
        } catch (e2) { setErr(e2?.response?.data?.message || 'Create failed') }
    }

    const load = async (e) => {
        e.preventDefault(); setErr(null); setMsg(null)
        try {
            const data = await apiGetHotelProfile(ownerId)
            setProfile({ businessName: data?.businessName || '', address: data?.address || '', phone: data?.phone || '', description: data?.description || '' })
            setMsg('Loaded.')
        } catch (e2) { setErr(e2?.response?.data?.message || 'Load failed') }
    }

    const update = async (e) => {
        e.preventDefault(); setErr(null); setMsg(null)
        try {
            await apiUpdateHotelProfile(ownerId, profile, 'patch')
            setMsg('Updated.')
        } catch (e2) { setErr(e2?.response?.data?.message || 'Update failed') }
    }

    return (
        <div style={s.page}>
            <div style={s.wrap}>
                <div style={s.title}>🏨 Hotel Profile</div>

                {err && <div style={s.error}>⚠️ {err}</div>}
                {msg && <div style={s.ok}>✅ {msg}</div>}

                <div style={s.card}>
                    <div style={s.sectionTitle}>🔍 Load Existing Profile</div>
                    <div style={s.field}>
                        <label style={s.label}>Hotel Owner User ID</label>
                        <input style={s.input} value={ownerId} onChange={(e) => setOwnerId(e.target.value)} placeholder="e.g. 20" />
                    </div>
                    <button style={s.btnOutline} onClick={load}>📂 Load Profile</button>
                </div>

                <div style={s.card}>
                    <div style={s.sectionTitle}>{ownerId ? '✏️ Update Profile' : '➕ Create Profile'}</div>
                    <form onSubmit={ownerId ? update : create}>
                        <div style={s.field}>
                            <label style={s.label}>Business Name</label>
                            <input style={s.input} value={profile.businessName} onChange={(e) => setProfile(p => ({ ...p, businessName: e.target.value }))} placeholder="e.g. Ocean View Hotel" />
                        </div>
                        <div style={s.field}>
                            <label style={s.label}>Address</label>
                            <input style={s.input} value={profile.address} onChange={(e) => setProfile(p => ({ ...p, address: e.target.value }))} placeholder="e.g. Galle Road, Colombo 3" />
                        </div>
                        <div style={s.field}>
                            <label style={s.label}>Phone</label>
                            <input style={s.input} value={profile.phone} onChange={(e) => setProfile(p => ({ ...p, phone: e.target.value }))} placeholder="+94 11 234 5678" />
                        </div>
                        <div style={s.field}>
                            <label style={s.label}>Description</label>
                            <textarea style={s.textarea} rows="4" value={profile.description} onChange={(e) => setProfile(p => ({ ...p, description: e.target.value }))} placeholder="Describe your hotel..." />
                        </div>
                        <button style={ownerId ? s.btn : s.btnPrimary}>
                            {ownerId ? '💾 Update (PATCH)' : '🚀 Create Profile'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
