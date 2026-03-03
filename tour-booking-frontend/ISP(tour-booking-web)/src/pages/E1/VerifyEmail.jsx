import React, { useState } from 'react'
import { apiRequestVerifyEmail, apiVerifyEmail } from '../../api/e1.js'

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
        <div className="card">
            <h2>Email Verification</h2>

            {err && <div className="error">{err}</div>}
            {msg && <div className="ok">{msg}</div>}

            <h3>Request token</h3>
            <form onSubmit={request}>
                <div className="field">
                    <label>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <button className="primary">Request Verification</button>
            </form>

            <hr />

            <h3>Verify using token</h3>
            <form onSubmit={verify}>
                <div className="field">
                    <label>Token</label>
                    <input value={token} onChange={(e) => setToken(e.target.value)} required />
                </div>
                <button className="primary">Verify</button>
            </form>
        </div>
    )
}
