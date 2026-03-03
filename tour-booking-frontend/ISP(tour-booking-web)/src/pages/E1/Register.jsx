import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiRegisterUser } from '../../api/e1.js'
import './E1.css'

const ROLES = [
    { value: 'TOURIST',     emoji: '🧳', label: 'Tourist' },
    { value: 'GUIDE',       emoji: '🗺️', label: 'Guide' },
    { value: 'HOTEL_OWNER', emoji: '🏨', label: 'Hotel Owner' },
    { value: 'ADMIN',       emoji: '🛡️', label: 'Admin' },
]

export default function Register() {
    const nav = useNavigate()
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        role: 'TOURIST',
        phone: ''
    })
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
        <div className="e1-page">
            <div className="e1-card">
                <div className="e1-card__icon">🌍</div>
                <h1 className="e1-card__title">Create account</h1>
                <p className="e1-card__subtitle">Join TravelZone today</p>

                {err && <div className="e1-alert e1-alert--error"><span>⚠️</span> {err}</div>}
                {msg && <div className="e1-alert e1-alert--success"><span>✓</span> {msg}</div>}

                <form onSubmit={submit}>
                    <div className="e1-field">
                        <label className="e1-label">Full Name</label>
                        <input
                            className="e1-input"
                            name="name"
                            placeholder="John Doe"
                            value={form.name}
                            onChange={onChange}
                            required
                        />
                    </div>

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

                    <div className="e1-field">
                        <label className="e1-label">Select Role</label>
                        <div className="e1-roles">
                            {ROLES.map(r => (
                                <div
                                    key={r.value}
                                    className={`e1-role-card ${form.role === r.value ? 'e1-role-card--active' : ''}`}
                                    onClick={() => setForm(f => ({ ...f, role: r.value }))}
                                >
                                    <div className="e1-role-card__emoji">{r.emoji}</div>
                                    <div className="e1-role-card__label">{r.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="e1-field">
                        <label className="e1-label">
                            Phone <span style={{ color: '#94a3b8', fontWeight: 400, textTransform: 'none' }}>(optional)</span>
                        </label>
                        <input
                            className="e1-input"
                            name="phone"
                            placeholder="+94 77 123 4567"
                            value={form.phone}
                            onChange={onChange}
                        />
                    </div>

                    <button className="e1-btn e1-btn--primary" disabled={loading}>
                        {loading
                            ? <><span className="e1-spinner" /> Creating account...</>
                            : '🚀 Create Account'
                        }
                    </button>
                </form>

                <div className="e1-footer">
                    Already have an account? <Link to="/login">Sign in</Link>
                </div>
            </div>
        </div>
    )
}
