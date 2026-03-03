import React, { useState } from 'react'
import { apiRequestVerifyEmail, apiVerifyEmail } from '../../api/e1.js'

const s = {
    page: { minHeight: '100vh', background: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' },
    card: { background: '#fff', borderRadius: '20px', padding: '48px 40px', width: '100%', maxWidth: '440px', boxShadow: '0 25px 60px rgba(0,0,0,0.2)' },
    logo: { textAlign: 'center', marginBottom: '32px' },
    logoIcon: { fontSize: '48px', display: 'block', marginBottom: '8px' },
    logoText: { fontSize: '22px', fontWeight: '800', color: '#1e3a5f' },
    subtitle: { fontSize: '14px', color: '#64748b', marginTop: '4px' },
    sectionTitle: { fontSize: '15px', fontWeight: '700', color: '#1e3a5f', marginBottom: '14px' },
    field: { marginBottom: '16px' },
    label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' },
    input: { width: '100%', padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '15px', outline: 'none', boxSizing: 'border-box', background: '#f8fafc', color: '#0f172a' },
    btn: { width: '100%', padding: '13px', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: 'pointer' },
    btnSecondary: { width: '100%', padding: '13px', background: 'linear-gradient(135deg, #16a34a, #15803d)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', marginTop: '4px' },
    divider: { display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0', color: '#94a3b8', fontSize: '13px' },
    line: { flex: 1, height: '1px', background: '#e2e8f0' },
    error: { background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px 16px', borderRadius: '10px', fontSize: '14px', marginBottom: '16px' },
    ok: { background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', padding: '12px 16px', borderRadius: '10px', fontSize: '14px', marginBottom: '16px' },
}

export default function VerifyEmail() {
    const [email, setEmail] = useState('')
    const [token, setToken] = useState('')
    const [msg, setMsg] = useState(null)
    const [err, setErr] = useState(null)

    const request = async (e) => {
        e.preventDefault(); setErr(null); setMsg(null)
        try {
            await apiRequestVerifyEmail({ email })
            setMsg('Verification email requested. Check your inbox for the token.')
        } catch (e2) { setErr(e2?.response?.data?.message || 'Request failed') }
    }

    const verify = async (e) => {
        e.preventDefault(); setErr(null); setMsg(null)
        try {
            await apiVerifyEmail({ token })
            setMsg('Email verified successfully. ✅')
        } catch (e2) { setErr(e2?.response?.data?.message || 'Verify failed') }
    }

    return (
        <div style={s.page}>
            <div style={s.card}>
                <div style={s.logo}>
                    <span style={s.logoIcon}>📧</span>
                    <div style={s.logoText}>Email Verification</div>
                    <div style={s.subtitle}>Verify your TravelZone account email</div>
                </div>

                {err && <div style={s.error}>⚠️ {err}</div>}
                {msg && <div style={s.ok}>✅ {msg}</div>}

                <div style={s.sectionTitle}>Step 1 — Request Token</div>
                <form onSubmit={request}>
                    <div style={s.field}>
                        <label style={s.label}>Email address</label>
                        <input style={s.input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
                    </div>
                    <button style={s.btn}>📨 Send Verification Email</button>
                </form>

                <div style={s.divider}>
                    <div style={s.line} /><span>then</span><div style={s.line} />
                </div>

                <div style={s.sectionTitle}>Step 2 — Enter Token</div>
                <form onSubmit={verify}>
                    <div style={s.field}>
                        <label style={s.label}>Verification Token</label>
                        <input style={s.input} value={token} onChange={(e) => setToken(e.target.value)} placeholder="Paste your token here" required />
                    </div>
                    <button style={s.btnSecondary}>✅ Verify Email</button>
                </form>
            </div>
        </div>
    )
}
