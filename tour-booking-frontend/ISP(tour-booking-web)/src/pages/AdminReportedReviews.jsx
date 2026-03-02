import React, { useState } from "react";
import { apiAdminGetReportedReviews, apiAdminModerateReview } from "../api/e6";

export default function AdminReportedReviews() {
    const [rows, setRows] = useState([]);
    const [err, setErr] = useState("");
    const [msg, setMsg] = useState("");

    const load = async () => {
        setErr(""); setMsg("");
        try {
            const data = await apiAdminGetReportedReviews();
            setRows(Array.isArray(data) ? data : (data.items || []));
        } catch (e) {
            setErr(e?.response?.data?.message || e.message);
        }
    };

    const moderate = async (reviewId, status) => {
        setErr(""); setMsg("");
        try {
            await apiAdminModerateReview(reviewId, { status }); // APPROVED/REJECTED/HIDDEN
            setMsg(`Review ${reviewId} -> ${status}`);
            await load();
        } catch (e) {
            setErr(e?.response?.data?.message || e.message);
        }
    };

    return (
        <div style={{ padding: 16 }}>
            <h2>Admin: Reported Reviews</h2>
            {err ? <p style={{ color: "crimson" }}>{err}</p> : null}
            {msg ? <p style={{ color: "green" }}>{msg}</p> : null}

            <button onClick={load}>Load reported reviews</button>

            <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
                {rows.map((r) => (
                    <div key={r.id} style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: 12 }}>
            <pre style={{ background: "#111", color: "#ddd", padding: 12, overflow: "auto" }}>
              {JSON.stringify(r, null, 2)}
            </pre>

                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            <button onClick={() => moderate(r.id, "APPROVED")}>Approve</button>
                            <button onClick={() => moderate(r.id, "HIDDEN")}>Hide</button>
                            <button onClick={() => moderate(r.id, "REJECTED")}>Reject</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
