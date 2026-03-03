import React, { useState } from 'react'
import { apiCreateHotelProfile, apiGetHotelProfile, apiUpdateHotelProfile } from '../../api/e1.js'

export default function HotelProfile() {
    const [ownerId, setOwnerId] = useState('')
    const [profile, setProfile] = useState({
        businessName: '',
        address: '',
        phone: '',
        description: ''
    })
    const [msg, setMsg] = useState(null)
    const [err, setErr] = useState(null)

    const create = async (e) => {
        e.preventDefault()
        setErr(null); setMsg(null)
        try {
            const data = await apiCreateHotelProfile(profile)
            setMsg('Hotel profile created.')
            setProfile(p => ({ ...p, ...data }))
        } catch (e2) {
            setErr(e2?.response?.data?.message || 'Create failed')
        }
    }

    const load = async (e) => {
        e.preventDefault()
        setErr(null); setMsg(null)
        try {
            const data = await apiGetHotelProfile(ownerId)
            setProfile({
                businessName: data?.businessName || '',
                address: data?.address || '',
                phone: data?.phone || '',
                description: data?.description || ''
            })
            setMsg('Loaded.')
        } catch (e2) {
            setErr(e2?.response?.data?.message || 'Load failed')
        }
    }

    const update = async (e) => {
        e.preventDefault()
        setErr(null); setMsg(null)
        try {
            await apiUpdateHotelProfile(ownerId, profile, 'patch')
            setMsg('Updated.')
        } catch (e2) {
            setErr(e2?.response?.data?.message || 'Update failed')
        }
    }

    return (
        <div className="card">
            <h2>Hotel Profile</h2>

            {err && <div className="error">{err}</div>}
            {msg && <div className="ok">{msg}</div>}

            <div className="field">
                <label>Hotel Owner User ID (for GET/UPDATE)</label>
                <input value={ownerId} onChange={(e) => setOwnerId(e.target.value)} placeholder="e.g. 20" />
            </div>

            <div className="row">
                <button onClick={load}>Load Profile</button>
            </div>

            <hr />

            <form onSubmit={ownerId ? update : create}>
                <div className="field">
                    <label>Business name</label>
                    <input value={profile.businessName} onChange={(e) => setProfile(p => ({ ...p, businessName: e.target.value }))} />
                </div>
                <div className="field">
                    <label>Address</label>
                    <input value={profile.address} onChange={(e) => setProfile(p => ({ ...p, address: e.target.value }))} />
                </div>
                <div className="field">
                    <label>Phone</label>
                    <input value={profile.phone} onChange={(e) => setProfile(p => ({ ...p, phone: e.target.value }))} />
                </div>
                <div className="field">
                    <label>Description</label>
                    <textarea rows="3" value={profile.description} onChange={(e) => setProfile(p => ({ ...p, description: e.target.value }))} />
                </div>

                <button className="primary">{ownerId ? 'Update (PATCH)' : 'Create'}</button>
            </form>
        </div>
    )
}
