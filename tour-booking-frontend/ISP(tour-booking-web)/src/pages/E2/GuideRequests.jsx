import React, { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext.jsx";
import { apiGetBookingRequestsForGuide, apiUpdateBookingRequest } from "../../api/e2.js";

export default function GuideRequests() {
    const { user } = useAuth();
    const guideId = user?.id;

    const [rows, setRows] = useState([]);
    const [err, setErr] = useState("");
    const [msg, setMsg] = useState("");

    const load = async () => {
        if (!guideId) return;
        setErr(""); setMsg("");
        try {
            const data = await apiGetBookingRequestsForGuide(guideId);
            setRows(Array.isArray(data) ? data : (data.items || []));
        } catch (e) {
            setErr(e?.response?.data?.message || e.message);
        }
    };

    useEffect(() => { load(); }, [guideId]);

    const setStatus = async (id, status) => {
        setErr(""); setMsg("");
        try {
            await apiUpdateBookingRequest(id, status);
            setMsg(`Request ${status}`);
            await load();
        } catch (e) {
            setErr(e?.response?.data?.message || e.message);
        }
    };

    return (
        <div style={{ padding: 16 }}>
            <h2>Booking Requests (Guide)</h2>
            {!guideId ? <p>Login as GUIDE to see requests</p> : null}

            {err ? <p style={{ color: "crimson" }}>{err}</p> : null}
            {msg ? <p style={{ color: "green" }}>{msg}</p> : null}

            <ul>
                {rows.map((r) => (
                    <li key={r.id}>
                        <code>{JSON.stringify(r)}</code>{" "}
                        <button onClick={() => setStatus(r.id, "ACCEPTED")}>Accept</button>{" "}
                        <button onClick={() => setStatus(r.id, "REJECTED")}>Reject</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
