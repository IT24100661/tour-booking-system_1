import React, { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext.jsx";
import {
    apiGetAvailability,
    apiCreateAvailabilitySlot,
    apiUpdateAvailabilitySlot,
    apiDeleteAvailabilitySlot,
} from "../../api/e2.js";

export default function GuideAvailability() {
    const { user } = useAuth();
    const guideId = user?.id;

    const [rows, setRows] = useState([]);
    const [dateTime, setDateTime] = useState("");
    const [err, setErr] = useState("");
    const [msg, setMsg] = useState("");

    const load = async () => {
        if (!guideId) return;
        setErr(""); setMsg("");
        try {
            const data = await apiGetAvailability(guideId);
            setRows(Array.isArray(data) ? data : (data.items || []));
        } catch (e) {
            setErr(e?.response?.data?.message || e.message);
        }
    };

    useEffect(() => { load(); }, [guideId]);

    const createSlot = async () => {
        setErr(""); setMsg("");
        try {
            // Adjust payload fields to match your backend DTO (common: start/end or dateTime)
            await apiCreateAvailabilitySlot(guideId, { dateTime });
            setDateTime("");
            setMsg("Slot created");
            await load();
        } catch (e) {
            setErr(e?.response?.data?.message || e.message);
        }
    };

    const disableSlot = async (slotId) => {
        setErr(""); setMsg("");
        try {
            await apiUpdateAvailabilitySlot(guideId, slotId, { active: false });
            setMsg("Slot updated");
            await load();
        } catch (e) {
            setErr(e?.response?.data?.message || e.message);
        }
    };

    const deleteSlot = async (slotId) => {
        setErr(""); setMsg("");
        try {
            await apiDeleteAvailabilitySlot(guideId, slotId);
            setMsg("Slot deleted");
            await load();
        } catch (e) {
            setErr(e?.response?.data?.message || e.message);
        }
    };

    return (
        <div style={{ padding: 16 }}>
            <h2>My Availability (Guide)</h2>
            {!guideId ? <p>Login as GUIDE to manage availability</p> : null}

            {err ? <p style={{ color: "crimson" }}>{err}</p> : null}
            {msg ? <p style={{ color: "green" }}>{msg}</p> : null}

            <div style={{ display: "flex", gap: 8 }}>
                <input
                    placeholder="dateTime (e.g. 2026-03-05T10:00)"
                    value={dateTime}
                    onChange={(e) => setDateTime(e.target.value)}
                />
                <button onClick={createSlot} disabled={!guideId}>Create slot</button>
            </div>

            <ul>
                {rows.map((s) => (
                    <li key={s.id}>
                        <code>{JSON.stringify(s)}</code>{" "}
                        <button onClick={() => disableSlot(s.id)} disabled={!guideId}>Disable</button>{" "}
                        <button onClick={() => deleteSlot(s.id)} disabled={!guideId}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
