import React from 'react'
import { useAuth } from '../../auth/AuthContext.jsx'

export default function Dashboard() {
    const { user, token } = useAuth()

    return (
        <div className="card">
            <h2>Dashboard</h2>
            <div className="small">You are logged in.</div>
            <pre className="small" style={{ whiteSpace: 'pre-wrap' }}>
{JSON.stringify({ user, tokenPreview: token ? token.slice(0, 20) + '...' : null }, null, 2)}
      </pre>
        </div>
    )
}
