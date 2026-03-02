import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext.jsx";
import { apiGetPayments } from "../api/e5";

export default function ProviderPayments() {
    const { user } = useAuth();
    const [rows, setRows] = useState([]);
    const [err, setErr] = useState("");

    const load = async () => {
        if (!user?.id) return;
        setErr("");
        try {
            const data = await apiGetPayments({ providerId: user.id });
            setRows(Array.isArray(data) ? data : (data.items || []));
        } catch (e) {
            setErr(e?.response?.data?.message || e.message);
        }
    };

    useEffect(() => { load(); }, [user?.id]);

    return (
        <div style={{ padding: 16 }}>
            <h2>My Earnings / Payments</h2>
            {err ? <p style={{ color: "crimson" }}>{err}</p> : null}

            <pre style={{ background: "#111", color: "#ddd", padding: 12, overflow: "auto" }}>
        {JSON.stringify(rows, null, 2)}
      </pre>
        </div>
    );
}
