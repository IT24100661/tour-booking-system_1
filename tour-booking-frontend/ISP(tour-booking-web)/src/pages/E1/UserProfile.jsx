import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { apiDeleteUser, apiGetUser, apiUpdateUser } from '../../api/e1.js'

const s = {
    page: { minHeight: '100vh', background: '#f0f4f8', padding: '32px 24px' },
    wrap: { maxWidth: '600px', margin: '0 auto' },
    title: { fontSize: '26px', fontWeight: '800', color: '#1e3a5f', marginBottom: '24px' },
    card: { background: '#fff', borderRadius: '16px', padding: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', marginBottom: '20px' },
    sectionTitle: { fontSize: '16px', fontWeight: '700', color: '#1e3a5f', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' },
    field: { marginBottom: '16px' },
    label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' },
    input: { width: '100%', padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '15px', outline: 'none', boxSizing: 'border-box', background: '#f8fafc', color: '#0f172a' },
    row: { display: 'flex', gap: '12px', marginTop: '8px' },
    btn: { padding: '12px 24px', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: 'pointer' },
    btnDanger: { padding: '12px 24px', background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: 'pointer' },
    error: { background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px 16px', borderRadius: '10px', fontSize: '14px', marginBottom: '16px' },
    ok: { background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', padding: '12px 16px', borderRadius: '10px', fontSize: '14px', marginBottom: '16px' },
    infoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
    infoItem: { background: '#f8fafc', borderRadius: '10px', padding: '12px 16px' },
    infoLabel: { fontSize: '12px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' },
    infoValue: { fontSize: '15px', color: '#1e3a5f', fontWeight: '700', marginTop: '4px' },
    badge: { display: 'inline-block', background: '#eff6ff', color: '#2563eb', padding: '2px 10px', borderRadius: '20px', fontSize: '13px', fontWeight: '700' },
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
            setMsg('Updated')
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

    return (
        <div style={s.page}>
            <div style={s.wrap}>
                <div style={s.title}>👤 User Profile</div>

                {err && <div style={s.error}>⚠️ {err}</div>}
                {msg && <div style={s.ok}>✅ {msg}</div>}

                {user && (
                    <div style={s.card}>
                        <div style={s.sectionTitle}>📋 Account Info</div>
                        <div style={s.infoGrid}>
                            <div style={s.infoItem}>
                                <div style={s.infoLabel}>Name</div>
                                <div style={s.infoValue}>{user.name || '—'}</div>
                            </div>
                            <div style={s.infoItem}>
                                <div style={s.infoLabel}>Email</div>
                                <div style={s.infoValue}>{user.email || '—'}</div>
                            </div>
                            <div style={s.infoItem}>
                                <div style={s.infoLabel}>Role</div>
                                <div style={s.infoValue}><span style={s.badge}>{user.role || '—'}</span></div>
                            </div>
                            <div style={s.infoItem}>
                                <div style={s.infoLabel}>Phone</div>
                                <div style={s.infoValue}>{user.phone || '—'}</div>
                            </div>
                            <div style={s.infoItem}>
                                <div style={s.infoLabel}>Email Verified</div>
                                <div style={s.infoValue}>{user.emailVerified ? '✅ Yes' : '❌ No'}</div>
                            </div>
                            <div style={s.infoItem}>
                                <div style={s.infoLabel}>User ID</div>
                                <div style={s.infoValue}>#{user.id}</div>
                            </div>
                        </div>
                    </div>
                )}

                <div style={s.card}>
                    <div style={s.sectionTitle}>✏️ Update Profile</div>
                    <form onSubmit={update}>
                        <div style={s.field}>
                            <label style={s.label}>Name</label>
                            <input style={s.input} value={patch.name} onChange={(e) => setPatch(p => ({ ...p, name: e.target.value }))} placeholder="Full name" />
                        </div>
                        <div style={s.field}>
                            <label style={s.label}>Phone</label>
                            <input style={s.input} value={patch.phone} onChange={(e) => setPatch(p => ({ ...p, phone: e.target.value }))} placeholder="+94 77 123 4567" />
                        </div>
                        <div style={s.row}>
                            <button style={s.btn}>💾 Save Changes</button>
                            <button type="button" style={s.btnDanger} onClick={del}>🗑️ Delete User</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
