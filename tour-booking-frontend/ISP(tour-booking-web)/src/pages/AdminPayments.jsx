import React, { useState } from "react";
import { apiAdminGetPayments, apiAdminUpdatePayment } from "../api/e5";

export default function AdminPayments() {
    const [from, setFrom] = useState("");   // "2026-03-01"
    const [to, setTo] = useState("");       // "2026-03-31"
    const [status, setStatus] = useState(""); // SUCCESS/FAILED/...
    const [rows, setRows] = useState([]);
    const [err, setErr] = useState("");

    const search = async () => {
        setErr("");
        try {
            const data = await apiAdminGetPayments({
                from: from || undefined,
                to: to || undefined,
                status: status || undefined,
            });
            setRows(Array.isArray(data) ? data : (data.items || []));
        } catch (e) {
            setErr(e?.response?.data?.message || e.message);
        }
    };

    const markSuspicious = async (paymentId) => {
        setErr("");
        try {
            await apiAdminUpdatePayment(paymentId, { suspicious: true });
            await search();
        } catch (e) {
            setErr(e?.response?.data?.message || e.message);
        }
    };

    return (
        <div style={{ padding: 16 }}>
            <h2>Admin: Payments</h2>
            {err ? <p style={{ color: "crimson" }}>{err}</p> : null}

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <input placeholder="from (YYYY-MM-DD)" value={from} onChange={(e) => setFrom(e.target.value)} />
                <input placeholder="to (YYYY-MM-DD)" value={to} onChange={(e) => setTo(e.target.value)} />
                <input placeholder="status" value={status} onChange={(e) => setStatus(e.target.value)} />
                <button onClick={search}>Search</button>
            </div>

            <ul>
                {rows.map((p) => (
                    <li key={p.id}>
                        <code>{JSON.stringify(p)}</code>{" "}
                        <button onClick={() => markSuspicious(p.id)}>Mark suspicious</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
