import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext.jsx";
import { apiGetTouristGuideBookings } from "../api/e2";

export default function MyGuideBookings() {
    const { user } = useAuth();
    const touristId = user?.id;

    const [rows, setRows] = useState([]);
    const [err, setErr] = useState("");

    const load = async () => {
        if (!touristId) return;
        setErr("");
        try {
            const data = await apiGetTouristGuideBookings(touristId);
            setRows(Array.isArray(data) ? data : (data.items || []));
        } catch (e) {
            setErr(e?.response?.data?.message || e.message);
        }
    };

    useEffect(() => { load(); }, [touristId]);

    return (
        <div style={{ padding: 16 }}>
            <h2>My Guide Bookings (Tourist)</h2>
            {!touristId ? <p>Login as TOURIST</p> : null}
            {err ? <p style={{ color: "crimson" }}>{err}</p> : null}

            <ul>
                {rows.map((b) => (
                    <li key={b.id}><code>{JSON.stringify(b)}</code></li>
                ))}
            </ul>
        </div>
    );
}
