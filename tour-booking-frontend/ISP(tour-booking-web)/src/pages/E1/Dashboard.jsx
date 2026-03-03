import React from 'react'
import { useAuth } from '../../auth/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'

const s = {
    page: { minHeight: '100vh', background: '#f0f4f8', padding: '32px 24px' },
    header: { maxWidth: '860px', margin: '0 auto 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' },
    greeting: { fontSize: '26px', fontWeight: '800', color: '#1e3a5f' },
    sub: { fontSize: '14px', color: '#64748b', marginTop: '4px' },
    grid: { maxWidth: '860px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' },
    card: { background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' },
    cardTitle: { fontSize: '13px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' },
    cardValue: { fontSize: '20px', fontWeight: '800', color: '#1e3a5f' },
    badge: (role) => {
        const colors = { TOURIST: ['#eff6ff', '#2563eb'], GUIDE: ['#f0fdf4', '#16a34a'], HOTEL_OWNER: ['#fff7ed', '#ea580c'], ADMIN: ['#fdf4ff', '#9333ea'] }
        const [bg, text] = colors[role] || ['#f1f5f9', '#475569']
        return { display: 'inline-block', background: bg, color: text, padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '700' }
    },
    tokenCard: { background: '#1e3a5f', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', gridColumn: '1 / -1' },
    tokenTitle: { fontSize: '13px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '12px' },
    pre: { background: '#0f172a', color: '#7dd3fc', padding: '16px', borderRadius: '10px', fontSize: '13px', overflowX: 'auto', whiteSpace: 'pre-wrap', margin: 0 },
    statusDot: { display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e', marginRight: '8px' },
}

export default function Dashboard() {
    const { user, token } = useAuth()
    const navigate = useNavigate()

    return (
        <div style={s.page}>
            <div style={s.header}>
                <div>
                    <div style={s.greeting}>👋 Welcome back, {user?.name || 'Traveler'}!</div>
                    <div style={s.sub}>Here's your account overview.</div>
                </div>
            </div>

            <div style={s.grid}>
                <div style={s.card}>
                    <div style={s.cardTitle}>👤 Account</div>
                    <div style={s.cardValue}>{user?.name || '—'}</div>
                    <div style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>{user?.email || '—'}</div>
                </div>

                <div style={s.card}>
                    <div style={s.cardTitle}>🎭 Role</div>
                    <div style={{ marginTop: '4px' }}>
                        <span style={s.badge(user?.role)}>{user?.role || '—'}</span>
                    </div>
                </div>

                <div style={s.card}>
                    <div style={s.cardTitle}>🔒 Session</div>
                    <div style={s.cardValue}>
                        <span style={s.statusDot} />
                        Active
                    </div>
                    <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>Token is valid</div>
                </div>

                <div style={s.tokenCard}>
                    <div style={s.tokenTitle}>🗂️ Session Data (debug)</div>
                    <pre style={s.pre}>
            {JSON.stringify({ user, tokenPreview: token ? token.slice(0, 20) + '...' : null }, null, 2)}
          </pre>
                </div>
            </div>
        </div>
    )
}
