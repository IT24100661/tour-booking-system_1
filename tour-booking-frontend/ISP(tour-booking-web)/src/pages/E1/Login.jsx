import React, { useState } from 'react'
import { apiLogin } from '../../api/e1.js'
import { useAuth } from '../../auth/AuthContext.jsx'
import { useLocation, useNavigate } from 'react-router-dom'

const s = {
    page: { minHeight: '100vh', background: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' },
    card: { background: '#fff', borderRadius: '20px', padding: '48px 40px', width: '100%', maxWidth: '420px', boxShadow: '0 25px 60px rgba(0,0,0,0.2)' },
    logo: { textAlign: 'center', marginBottom: '32px' },
    logoIcon: { fontSize: '40px', display: 'block', marginBottom: '8px' },
    logoText: { fontSize: '26px', fontWeight: '800', color: '#1e3a5f', letterSpacing: '-0.5px' },
    subtitle: { fontSize: '14px', color: '#64748b', marginTop: '4px' },
    field: { marginBottom: '18px' },
    label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' },
    input: { width: '100%', padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '15px', outline: 'none', transition: 'border 0.2s', boxSizing: 'border-box', background: '#f8fafc', color: '#0f172a' },
    btn: { width: '100%', padding: '14px', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', marginTop: '8px', letterSpacing: '0.3px' },
    btnDisabled: { opacity: 0.6, cursor: 'not-allowed' },
    error: { background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px 16px', borderRadius: '10px', fontSize: '14px', marginBottom: '16px' },
    footer: { textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#64748b' },
    link: { color: '#2563eb', fontWeight: '600', textDecoration: 'none' },
}

export default function Login() {
    const { saveAuth } = useAuth()
    const nav = useNavigate()
    const loc = useLocation()
    const from = loc.state?.from || '/dashboard'

    const [form, setForm] = useState({ email: '', password: '' })
    const [err, setErr] = useState(null)
    const [loading, setLoading] = useState(false)

    const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

    const submit = async (e) => {
        e.preventDefault()
        setErr(null)
        setLoading(true)
        try {
            const res = await apiLogin(form)
            const token = res?.token || res?.accessToken || res?.jwt
            const user = res?.user || (res?.id ? { id: res.id, role: res.role, email: res.email } : null)
            if (!token) throw new Error('Token not found in login response')
            saveAuth({ token, user })
            nav(from, { replace: true })
        } catch (e2) {
            setErr(e2?.response?.data?.message || e2.message || 'Login failed')
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
                    <div style={s.subtitle}>Welcome back! Sign in to continue.</div>
                </div>

                {err && <div style={s.error}>⚠️ {err}</div>}

                <form onSubmit={submit}>
                    <div style={s.field}>
                        <label style={s.label}>Email address</label>
                        <input style={s.input} name="email" type="email" value={form.email} onChange={onChange} placeholder="you@example.com" required />
                    </div>
                    <div style={s.field}>
                        <label style={s.label}>Password</label>
                        <input style={s.input} name="password" type="password" value={form.password} onChange={onChange} placeholder="••••••••" required />
                    </div>
                    <button style={{ ...s.btn, ...(loading ? s.btnDisabled : {}) }} disabled={loading}>
                        {loading ? '⏳ Signing in...' : '🔐 Sign In'}
                    </button>
                </form>

                <div style={s.footer}>
                    Don't have an account? <a href="/register" style={s.link}>Register</a>
                </div>
                <div style={{ ...s.footer, marginTop: '8px' }}>
                    <a href="/password-reset" style={s.link}>Forgot password?</a>
                    &nbsp;&nbsp;|&nbsp;&nbsp;
                    <a href="/verify-email" style={s.link}>Verify email</a>
                </div>
            </div>
        </div>
    )
}
