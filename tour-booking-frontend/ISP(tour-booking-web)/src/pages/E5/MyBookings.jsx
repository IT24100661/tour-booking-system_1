import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext.jsx";
import { apiSearchBookings } from "../../api/e5.js";

export default function MyBookings() {
    const { user } = useAuth();
    const [rows, setRows] = useState([]);
    const [err, setErr] = useState("");

    const load = async () => {
        if (!user?.id) return;
        setErr("");
        try {
            const data = await apiSearchBookings({ touristId: user.id });
            setRows(Array.isArray(data) ? data : (data.items || []));
        } catch (e) {
            setErr(e?.response?.data?.message || e.message);
        }
    };

    useEffect(() => { load(); }, [user?.id]);

    return (
        <div style={{ padding: 16 }}>
            <h2>My Bookings</h2>
            {err ? <p style={{ color: "crimson" }}>{err}</p> : null}

            <ul>
                {rows.map((b) => (
                    <li key={b.id}>
                        <Link to={`/bookings/${b.id}`}>Booking #{b.id}</Link>
                        {" "}
                        <small>{b.status ? `| ${b.status}` : ""}</small>
                    </li>
                ))}
            </ul>
        </div>
    );
}
