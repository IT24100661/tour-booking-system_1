import React, { useState } from 'react'
import { apiRequestVerifyEmail, apiVerifyEmail } from '../../api/e1.js'
import './E1.css'

export default function VerifyEmail() {
    const [email, setEmail] = useState('')
    const [token, setToken] = useState('')
    const [msg, setMsg] = useState(null)
    const [err, setErr] = useState(null)

    const request = async (e) => {
        e.preventDefault()
        setErr(null); setMsg(null)
        try {
            await apiRequestVerifyEmail({ email })
            setMsg('Verification email requested. Check your inbox for token/link.')
        } catch (e2) {
            setErr(e2?.response?.data?.message || 'Request failed')
        }
    }

    const verify = async (e) => {
        e.preventDefault()
        setErr(null); setMsg(null)
        try {
            await apiVerifyEmail({ token })
            setMsg('Email verified successfully.')
        } catch (e2) {
            setErr(e2?.response?.data?.message || 'Verify failed')
        }
    }

    return (
        <div className="e1-page">
            <div className="e1-card">
                <div className="e1-card__icon">✉️</div>
                <h1 className="e1-card__title">Email Verification</h1>
                <p className="e1-card__subtitle">Verify your TravelZone account email</p>

                {err && <div className="e1-alert e1-alert--error"><span>⚠️</span> {err}</div>}
                {msg && <div className="e1-alert e1-alert--success"><span>✓</span> {msg}</div>}

                {/* Step 1 */}
                <div className="e1-step">
                    <div className="e1-step__num">1</div>
                    <span className="e1-step__label">Request a verification token</span>
                </div>
                <form onSubmit={request}>
                    <div className="e1-field">
                        <label className="e1-label">Email address</label>
                        <input
                            className="e1-input"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button className="e1-btn e1-btn--primary">📨 Request Verification</button>
                </form>

                <div className="e1-divider" />

                {/* Step 2 */}
                <div className="e1-step">
                    <div className="e1-step__num">2</div>
                    <span className="e1-step__label">Enter your token to verify</span>
                </div>
                <form onSubmit={verify}>
                    <div className="e1-field">
                        <label className="e1-label">Verification Token</label>
                        <input
                            className="e1-input"
                            placeholder="Paste token from your email"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            required
                        />
                    </div>
                    <button className="e1-btn e1-btn--primary">✅ Verify Email</button>
                </form>
            </div>
        </div>
    )
}
