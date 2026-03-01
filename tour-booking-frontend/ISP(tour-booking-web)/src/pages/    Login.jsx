import React, { useState } from 'react'
import { apiLogin } from '../api/e1'
import { useAuth } from '../auth/    AuthContext.jsx'
import { useLocation, useNavigate } from 'react-router-dom'

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

            // Adjust if your backend uses different keys:
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
        <div className="card">
            <h2>Login</h2>
            <form onSubmit={submit}>
                <div className="field">
                    <label>Email</label>
                    <input name="email" type="email" value={form.email} onChange={onChange} required />
                </div>
                <div className="field">
                    <label>Password</label>
                    <input name="password" type="password" value={form.password} onChange={onChange} required />
                </div>

                {err && <div className="error">{err}</div>}

                <button className="primary" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    )
}
