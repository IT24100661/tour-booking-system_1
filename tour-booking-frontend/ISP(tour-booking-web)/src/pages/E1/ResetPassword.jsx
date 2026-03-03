import React, { useState } from 'react'
import { apiResetPassword } from '../../api/e1.js'

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
        <div className="card">
            <h2>Reset Password (Set new)</h2>

            {err && <div className="error">{err}</div>}
            {msg && <div className="ok">{msg}</div>}

            <form onSubmit={submit}>
                <div className="field">
                    <label>Reset token</label>
                    <input value={token} onChange={(e) => setToken(e.target.value)} required />
                </div>
                <div className="field">
                    <label>New password</label>
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                </div>
                <button className="primary">Reset</button>
            </form>
        </div>
    )
}
