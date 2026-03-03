import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext.jsx'
import { apiCreateBooking, apiCreatePayment } from '../../api/e5.js'
import './E5.css'

const CURRENCIES = ['LKR', 'USD', 'EUR', 'GBP', 'AUD']

export default function BookingCreate() {
    const navigate = useNavigate()
    const { user } = useAuth()

    const [type, setType]         = useState('HOTEL')
    const [refId, setRefId]       = useState('')
    const [amount, setAmount]     = useState('')
    const [currency, setCurrency] = useState('LKR')
    const [err, setErr]           = useState('')
    const [loading, setLoading]   = useState(false)
    const [errors, setErrors]     = useState({})

    const validate = () => {
        const e = {}
        if (!refId.trim())
            e.refId = 'Reference ID is required'
        else if (isNaN(refId) || Number(refId) < 1)
            e.refId = 'Reference ID must be a valid positive number'
        if (!amount.trim())
            e.amount = 'Amount is required'
        else if (isNaN(amount) || Number(amount) <= 0)
            e.amount = 'Amount must be greater than 0'
        if (!currency.trim())
            e.currency = 'Currency is required'
        setErrors(e)
        return Object.keys(e).length === 0
    }

    const create = async () => {
        if (!validate()) return
        setErr(''); setLoading(true)
        try {
            const booking = await apiCreateBooking({
                touristId: user?.id,
                type,
                referenceId: refId ? Number(refId) : null,
                status: 'PENDING',
            })

            await apiCreatePayment({
                bookingId: booking.id,
                amount: amount ? Number(amount) : null,
                currency,
                status: 'INITIATED',
            })

            navigate(`/bookings/${booking.id}`)
        } catch (e) {
            setErr(e?.response?.data?.message || e.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="e5-page">
            <div className="e5-container--sm" style={{ margin: '0 auto' }}>
                <div className="e5-header">
                    <div className="e5-header__icon">🎫</div>
                    <h1 className="e5-header__title">Create Booking</h1>
                    <p className="e5-header__sub">Book a hotel or guide and start payment</p>
                </div>

                {err && <div className="e5-alert e5-alert--error">⚠️ {err}</div>}

                <div className="e5-card">
                    {/* Type toggle */}
                    <div className="e5-section-label" style={{ marginTop: 0 }}>Booking Type</div>
                    <div className="e5-type-toggle">
                        <button
                            type="button"
                            className={`e5-type-btn ${type === 'HOTEL' ? 'e5-type-btn--active' : ''}`}
                            onClick={() => setType('HOTEL')}
                        >
                            🏨 Hotel
                        </button>
                        <button
                            type="button"
                            className={`e5-type-btn ${type === 'GUIDE' ? 'e5-type-btn--active' : ''}`}
                            onClick={() => setType('GUIDE')}
                        >
                            🗺️ Guide
                        </button>
                    </div>

                    <div className="e5-field">
                        <label className="e5-label">
                            Reference ID <span style={{ color:'#dc2626' }}>*</span>
                        </label>
                        <input
                            className={`e5-input ${errors.refId ? 'e5-input--error' : ''}`}
                            placeholder={type === 'HOTEL' ? 'Hotel Reservation ID' : 'Guide Booking ID'}
                            value={refId}
                            onChange={(e) => { setRefId(e.target.value); setErrors(p => ({ ...p, refId: '' })) }}
                        />
                        {errors.refId
                            ? <div className="e5-field-error">⚠️ {errors.refId}</div>
                            : <div className="e5-field-hint">
                                {type === 'HOTEL' ? 'Enter the hotel reservation ID' : 'Enter the guide booking ID'}
                            </div>
                        }
                    </div>

                    <div className="e5-form-grid">
                        <div className="e5-field">
                            <label className="e5-label">Amount <span style={{ color:'#dc2626' }}>*</span></label>
                            <input
                                className={`e5-input ${errors.amount ? 'e5-input--error' : ''}`}
                                type="number"
                                min="0"
                                placeholder="e.g. 15000"
                                value={amount}
                                onChange={(e) => { setAmount(e.target.value); setErrors(p => ({ ...p, amount: '' })) }}
                            />
                            {errors.amount && <div className="e5-field-error">⚠️ {errors.amount}</div>}
                        </div>

                        <div className="e5-field">
                            <label className="e5-label">Currency <span style={{ color:'#dc2626' }}>*</span></label>
                            <select
                                className={`e5-select ${errors.currency ? 'e5-input--error' : ''}`}
                                value={currency}
                                onChange={(e) => { setCurrency(e.target.value); setErrors(p => ({ ...p, currency: '' })) }}
                            >
                                {CURRENCIES.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                            {errors.currency && <div className="e5-field-error">⚠️ {errors.currency}</div>}
                        </div>
                    </div>

                    {!user?.id && (
                        <div className="e5-alert e5-alert--info">
                            ℹ️ You must be logged in to create a booking
                        </div>
                    )}

                    <button
                        className="e5-btn e5-btn--primary e5-btn--full"
                        onClick={create}
                        disabled={loading || !user?.id}
                        style={{ marginTop: '0.5rem' }}
                    >
                        {loading ? <><span className="e5-spinner" /> Creating...</> : '🎫 Create Booking & Start Payment'}
                    </button>
                </div>
            </div>
        </div>
    )
}
