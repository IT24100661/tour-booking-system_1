import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { apiLogin } from '../../api/e1.js'
import { useAuth } from '../../auth/AuthContext.jsx'
import './E1.css'

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
        <div className="e1-page">
            <div className="e1-card">
                <div className="e1-card__icon">✈️</div>
                <h1 className="e1-card__title">Welcome back</h1>
                <p className="e1-card__subtitle">Sign in to your TravelZone account</p>

                {err && (
                    <div className="e1-alert e1-alert--error">
                        <span>⚠️</span> {err}
                    </div>
                )}

                <form onSubmit={submit}>
                    <div className="e1-field">
                        <label className="e1-label">Email address</label>
                        <input
                            className="e1-input"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={onChange}
                            required
                        />
                    </div>

                    <div className="e1-field">
                        <label className="e1-label">Password</label>
                        <input
                            className="e1-input"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={onChange}
                            required
                        />
                    </div>

                    <button className="e1-btn e1-btn--primary" disabled={loading}>
                        {loading ? <><span className="e1-spinner" /> Signing in...</> : '🔐 Sign In'}
                    </button>
                </form>

                <div className="e1-footer">
                    Don't have an account?{' '}
                    <Link to="/register">Create one</Link>
                </div>
                <div className="e1-footer" style={{ marginTop: '0.5rem' }}>
                    <Link to="/password-reset">Forgot password?</Link>
                </div>
            </div>
        </div>
    )
}
