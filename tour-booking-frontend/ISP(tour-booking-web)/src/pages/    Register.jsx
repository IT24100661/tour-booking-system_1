import React, { useState } from 'react'
import { apiRegisterUser } from '../api/e1'
import { useNavigate } from 'react-router-dom'

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
        <div className="card">
            <h2>Create User</h2>
            <form onSubmit={submit}>
                <div className="field">
                    <label>Name</label>
                    <input name="name" value={form.name} onChange={onChange} required />
                </div>
                <div className="field">
                    <label>Email</label>
                    <input name="email" type="email" value={form.email} onChange={onChange} required />
                </div>
                <div className="field">
                    <label>Password</label>
                    <input name="password" type="password" value={form.password} onChange={onChange} required />
                </div>
                <div className="field">
                    <label>Role</label>
                    <select name="role" value={form.role} onChange={onChange}>
                        <option value="TOURIST">TOURIST</option>
                        <option value="GUIDE">GUIDE</option>
                        <option value="HOTEL_OWNER">HOTEL_OWNER</option>
                    </select>
                </div>
                <div className="field">
                    <label>Phone</label>
                    <input name="phone" value={form.phone} onChange={onChange} />
                </div>

                {err && <div className="error">{err}</div>}
                {msg && <div className="ok">{msg}</div>}

                <button className="primary" disabled={loading}>
                    {loading ? 'Creating...' : 'Create'}
                </button>
            </form>
        </div>
    )
}
