import React, { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext.jsx";
import { apiGetTouristReservations, apiDeleteReservation } from "../../api/e3.js";

export default function MyHotelReservations() {
    const { user } = useAuth();
    const touristId = user?.id;

    const [rows, setRows] = useState([]);
    const [err, setErr] = useState("");

    const load = async () => {
        if (!touristId) return;
        setErr("");
        try {
            const data = await apiGetTouristReservations(touristId);
            setRows(Array.isArray(data) ? data : (data.items || []));
        } catch (e) {
            setErr(e?.response?.data?.message || e.message);
        }
    };

    useEffect(() => { load(); }, [touristId]);

    const remove = async (id) => {
        try {
            await apiDeleteReservation(id);
            await load();
        } catch (e) {
            setErr(e?.response?.data?.message || e.message);
        }
    };

    return (
        <div style={{ padding: 16 }}>
            <h2>My Hotel Reservations</h2>
            {!touristId ? <p>Login as TOURIST</p> : null}
            {err ? <p style={{ color: "crimson" }}>{err}</p> : null}

            <ul>
                {rows.map((r) => (
                    <li key={r.id}>
                        <code>{JSON.stringify(r)}</code>{" "}
                        <button onClick={() => remove(r.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
