import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { apiDeleteUser, apiGetUser, apiUpdateUser } from '../api/e1'

export default function UserProfile() {
    const { id } = useParams()
    const [user, setUser] = useState(null)
    const [patch, setPatch] = useState({ name: '', phone: '' })
    const [msg, setMsg] = useState(null)
    const [err, setErr] = useState(null)

    const load = async () => {
        setErr(null); setMsg(null)
        try {
            const data = await apiGetUser(id)
            setUser(data)
            setPatch({
                name: data?.name || '',
                phone: data?.phone || ''
            })
        } catch (e) {
            setErr(e?.response?.data?.message || 'Failed to load user')
        }
    }

    useEffect(() => { load() }, [id])

    const update = async (e) => {
        e.preventDefault()
        setErr(null); setMsg(null)
        try {
            const updated = await apiUpdateUser(id, patch, 'patch')
            setUser(updated)
            setMsg('Updated')
        } catch (e2) {
            setErr(e2?.response?.data?.message || 'Update failed')
        }
    }

    const del = async () => {
        if (!confirm('Delete this user?')) return
        setErr(null); setMsg(null)
        try {
            await apiDeleteUser(id)
            setMsg('Deleted (backend responded OK)')
            setUser(null)
        } catch (e2) {
            setErr(e2?.response?.data?.message || 'Delete failed')
        }
    }

    return (
        <div className="card">
            <h2>User Profile (ID: {id})</h2>

            {err && <div className="error">{err}</div>}
            {msg && <div className="ok">{msg}</div>}

            <div className="small">Loaded:</div>
            <pre className="small" style={{ whiteSpace: 'pre-wrap' }}>
        {JSON.stringify(user, null, 2)}
      </pre>

            <hr />

            <h3>Update User</h3>
            <form onSubmit={update}>
                <div className="field">
                    <label>Name</label>
                    <input value={patch.name} onChange={(e) => setPatch(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div className="field">
                    <label>Phone</label>
                    <input value={patch.phone} onChange={(e) => setPatch(p => ({ ...p, phone: e.target.value }))} />
                </div>
                <button className="primary">Save</button>
                <button type="button" onClick={del} style={{ marginLeft: 8 }}>Delete</button>
            </form>
        </div>
    )
}
