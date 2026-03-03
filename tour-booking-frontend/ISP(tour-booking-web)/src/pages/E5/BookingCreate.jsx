import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext.jsx";
import { apiCreateBooking, apiCreatePayment } from "../../api/e5.js";

export default function BookingCreate() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [type, setType] = useState("HOTEL"); // HOTEL or GUIDE
    const [refId, setRefId] = useState("");   // hotelReservationId OR guideBookingId (your backend decides)
    const [amount, setAmount] = useState("");
    const [currency, setCurrency] = useState("LKR");
    const [err, setErr] = useState("");

    const create = async () => {
        setErr("");
        try {
            const booking = await apiCreateBooking({
                touristId: user?.id,     // or omit if backend reads from JWT
                type,                   // "HOTEL" | "GUIDE"
                referenceId: refId ? Number(refId) : null,
                status: "PENDING",
            });

            // Optional: start payment right after booking creation
            await apiCreatePayment({
                bookingId: booking.id,
                amount: amount ? Number(amount) : null,
                currency,
                status: "INITIATED",
            });

            navigate(`/bookings/${booking.id}`);
        } catch (e) {
            setErr(e?.response?.data?.message || e.message);
        }
    };

    return (
        <div style={{ padding: 16 }}>
            <h2>Create Booking + Start Payment</h2>
            {err ? <p style={{ color: "crimson" }}>{err}</p> : null}

            <div style={{ display: "grid", gap: 8, maxWidth: 420 }}>
                <label>
                    Type
                    <select value={type} onChange={(e) => setType(e.target.value)}>
                        <option value="HOTEL">HOTEL</option>
                        <option value="GUIDE">GUIDE</option>
                    </select>
                </label>

                <input
                    placeholder="Reference ID (guide booking / hotel reservation)"
                    value={refId}
                    onChange={(e) => setRefId(e.target.value)}
                />

                <input
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />

                <input
                    placeholder="Currency (LKR)"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                />

                <button onClick={create}>Create</button>
            </div>
        </div>
    );
}
