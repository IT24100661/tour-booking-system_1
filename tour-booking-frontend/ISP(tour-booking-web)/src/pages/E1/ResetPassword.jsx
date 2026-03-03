import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { apiResetPassword } from '../../api/e1.js'
import './E1.css'

export default function ResetPassword() {
    const [token, setToken] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [msg, setMsg] = useState(null)
    const [err, setErr] = useState(null)

    const submit = async (e) => {
        e.preventDefault()
        setErr(null); setMsg(null)
        try {
            await apiResetPassword({ token, newPassword })
            setMsg('Password reset successfully. Now you can login.')
        } catch (e2) {
            setErr(e2?.response?.data?.message || 'Reset failed')
        }
    }

    return (
        <div className="e1-page">
            <div className="e1-card">
                <div className="e1-card__icon">🔑</div>
                <h1 className="e1-card__title">Reset Password</h1>
                <p className="e1-card__subtitle">Enter your reset token and choose a new password</p>

                {err && <div className="e1-alert e1-alert--error"><span>⚠️</span> {err}</div>}
                {msg && <div className="e1-alert e1-alert--success"><span>✓</span> {msg}</div>}

                <form onSubmit={submit}>
                    <div className="e1-field">
                        <label className="e1-label">Reset Token</label>
                        <input
                            className="e1-input"
                            placeholder="Paste token from your email"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            required
                        />
                    </div>

                    <div className="e1-field">
                        <label className="e1-label">New Password</label>
                        <input
                            className="e1-input"
                            type="password"
                            placeholder="••••••••"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button className="e1-btn e1-btn--primary">🔒 Set New Password</button>
                </form>

                <div className="e1-footer">
                    Remembered it? <Link to="/login">Back to Login</Link>
                </div>
            </div>
        </div>
    )
}
