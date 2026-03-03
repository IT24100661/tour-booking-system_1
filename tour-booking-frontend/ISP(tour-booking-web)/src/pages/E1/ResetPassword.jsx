import React, { useState } from 'react'
import { apiResetPassword } from '../../api/e1.js'

const s = {
    page: { minHeight: '100vh', background: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' },
    card: { background: '#fff', borderRadius: '20px', padding: '48px 40px', width: '100%', maxWidth: '420px', boxShadow: '0 25px 60px rgba(0,0,0,0.2)' },
    logo: { textAlign: 'center', marginBottom: '32px' },
    logoIcon: { fontSize: '48px', display: 'block', marginBottom: '8px' },
    logoText: { fontSize: '22px', fontWeight: '800', color: '#1e3a5f' },
    subtitle: { fontSize: '14px', color: '#64748b', marginTop: '4px' },
    field: { marginBottom: '16px' },
    label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' },
    input: { width: '100%', padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '15px', outline: 'none', boxSizing: 'border-box', background: '#f8fafc', color: '#0f172a' },
    btn: { width: '100%', padding: '14px', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', marginTop: '8px' },
    error: { background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px 16px', borderRadius: '10px', fontSize: '14px', marginBottom: '16px' },
    ok: { background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', padding: '12px 16px', borderRadius: '10px', fontSize: '14px', marginBottom: '16px' },
    hint: { background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1d4ed8', padding: '12px 16px', borderRadius: '10px', fontSize: '13px', marginBottom: '20px', lineHeight: '1.5' },
    footer: { textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#64748b' },
    link: { color: '#2563eb', fontWeight: '600', textDecoration: 'none' },
}

export default function ResetPassword() {
    const [token, setToken] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [msg, setMsg] = useState(null)
    const [err, setErr] = useState(null)

    const submit = async (e) => {
        e.preventDefault(); setErr(null); setMsg(null)
        try {
            await apiResetPassword({ token, newPassword })
            setMsg('Password reset successfully. You can now login.')
        } catch (e2) { setErr(e2?.response?.data?.message || 'Reset failed') }
    }

    return (
        <div style={s.page}>
            <div style={s.card}>
                <div style={s.logo}>
                    <span style={s.logoIcon}>🔑</span>
                    <div style={s.logoText}>Reset Password</div>
                    <div style={s.subtitle}>Set a new password for your account</div>
                </div>

                <div style={s.hint}>
                    💡 First request a reset token from the <strong>Login</strong> page ("Forgot password?"), then paste it below.
                </div>

                {err && <div style={s.error}>⚠️ {err}</div>}
                {msg && <div style={s.ok}>✅ {msg}</div>}

                <form onSubmit={submit}>
                    <div style={s.field}>
                        <label style={s.label}>Reset Token</label>
                        <input style={s.input} value={token} onChange={(e) => setToken(e.target.value)} placeholder="Paste your reset token" required />
                    </div>
                    <div style={s.field}>
                        <label style={s.label}>New Password</label>
                        <input style={s.input} type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" required />
                    </div>
                    <button style={s.btn}>🔐 Reset Password</button>
                </form>

                <div style={s.footer}>
                    Remembered it? <a href="/login" style={s.link}>Back to Login</a>
                </div>
            </div>
        </div>
    )
}
