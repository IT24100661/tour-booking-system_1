import React, { useState } from 'react'
import { apiRegisterUser } from '../../api/e1.js'
import { useNavigate } from 'react-router-dom'

const s = {
    page: { minHeight: '100vh', background: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' },
    card: { background: '#fff', borderRadius: '20px', padding: '48px 40px', width: '100%', maxWidth: '460px', boxShadow: '0 25px 60px rgba(0,0,0,0.2)' },
    logo: { textAlign: 'center', marginBottom: '32px' },
    logoIcon: { fontSize: '40px', display: 'block', marginBottom: '8px' },
    logoText: { fontSize: '26px', fontWeight: '800', color: '#1e3a5f' },
    subtitle: { fontSize: '14px', color: '#64748b', marginTop: '4px' },
    field: { marginBottom: '16px' },
    label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' },
    input: { width: '100%', padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '15px', outline: 'none', boxSizing: 'border-box', background: '#f8fafc', color: '#0f172a' },
    select: { width: '100%', padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '15px', outline: 'none', boxSizing: 'border-box', background: '#f8fafc', color: '#0f172a', cursor: 'pointer' },
    roleGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginTop: '6px' },
    roleBtn: (active) => ({ padding: '10px 8px', border: `2px solid ${active ? '#2563eb' : '#e2e8f0'}`, borderRadius: '10px', background: active ? '#eff6ff' : '#f8fafc', color: active ? '#2563eb' : '#64748b', fontWeight: active ? '700' : '500', fontSize: '13px', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' }),
    btn: { width: '100%', padding: '14px', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', marginTop: '8px' },
    btnDisabled: { opacity: 0.6, cursor: 'not-allowed' },
    error: { background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px 16px', borderRadius: '10px', fontSize: '14px', marginBottom: '16px' },
    ok: { background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', padding: '12px 16px', borderRadius: '10px', fontSize: '14px', marginBottom: '16px' },
    footer: { textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#64748b' },
    link: { color: '#2563eb', fontWeight: '600', textDecoration: 'none' },
}

const ROLES = [
    { value: 'TOURIST', label: '🧳 Tourist' },
    { value: 'GUIDE', label: '🗺️ Guide' },
    { value: 'HOTEL_OWNER', label: '🏨 Hotel Owner' },
]

export default function Register() {
    const nav = useNavigate()
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'TOURIST', phone: '' })
    const [msg, setMsg] = useState(null)
    const [err, setErr] = useState(null)
    const [loading, setLoading] = useState(false)

    const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

    const submit = async (e) => {
        e.preventDefault()
        setErr(null); setMsg(null)
        setLoading(true)
        try {
            await apiRegisterUser(form)
            setMsg('Registered successfully. Now login.')
            nav('/login')
        } catch (e2) {
            setErr(e2?.response?.data?.message || 'Register failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={s.page}>
            <div style={s.card}>
                <div style={s.logo}>
                    <span style={s.logoIcon}>✈️</span>
                    <div style={s.logoText}>TravelZone</div>
                    <div style={s.subtitle}>Create your account to get started.</div>
                </div>

                {err && <div style={s.error}>⚠️ {err}</div>}
                {msg && <div style={s.ok}>✅ {msg}</div>}

                <form onSubmit={submit}>
                    <div style={s.field}>
                        <label style={s.label}>Full Name</label>
                        <input style={s.input} name="name" value={form.name} onChange={onChange} placeholder="John Silva" required />
                    </div>
                    <div style={s.field}>
                        <label style={s.label}>Email address</label>
                        <input style={s.input} name="email" type="email" value={form.email} onChange={onChange} placeholder="you@example.com" required />
                    </div>
                    <div style={s.field}>
                        <label style={s.label}>Password</label>
                        <input style={s.input} name="password" type="password" value={form.password} onChange={onChange} placeholder="••••••••" required />
                    </div>
                    <div style={s.field}>
                        <label style={s.label}>I am a...</label>
                        <div style={s.roleGrid}>
                            {ROLES.map((r) => (
                                <button key={r.value} type="button" style={s.roleBtn(form.role === r.value)}
                                        onClick={() => setForm((f) => ({ ...f, role: r.value }))}>
                                    {r.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div style={s.field}>
                        <label style={s.label}>Phone (optional)</label>
                        <input style={s.input} name="phone" value={form.phone} onChange={onChange} placeholder="+94 77 123 4567" />
                    </div>
                    <button style={{ ...s.btn, ...(loading ? s.btnDisabled : {}) }} disabled={loading}>
                        {loading ? '⏳ Creating account...' : '🚀 Create Account'}
                    </button>
                </form>

                <div style={s.footer}>
                    Already have an account? <a href="/login" style={s.link}>Sign in</a>
                </div>
            </div>
        </div>
    )
}
