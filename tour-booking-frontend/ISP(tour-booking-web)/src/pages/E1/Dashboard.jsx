import React from 'react'
import { useAuth } from '../../auth/AuthContext.jsx'
import GuideDashboard from './GuideDashboard.jsx'
import HotelOwnerDashboard from './HotelOwnerDashboard.jsx'
import AdminDashboard from './AdminDashboard.jsx'
import TouristDashboard from './TouristDashboard.jsx'
import './E1.css'

export default function Dashboard() {
    const { user } = useAuth()

    if (!user) {
        return (
            <div className="e1-page">
                <div className="e1-card">
                    <div className="e1-card__icon">⏳</div>
                    <h1 className="e1-card__title">Loading...</h1>
                </div>
            </div>
        )
    }

    switch (user.role) {
        case 'GUIDE':       return <GuideDashboard />
        case 'HOTEL_OWNER': return <HotelOwnerDashboard />
        case 'ADMIN':       return <AdminDashboard />
        default:            return <TouristDashboard />
    }
}
