import React, { useState } from "react";
import { Link } from "react-router-dom";
import { apiSearchPlaces } from "../../api/e4.js";

export default function Places() {
    const [category, setCategory] = useState("");
    const [rows, setRows] = useState([]);
    const [err, setErr] = useState("");

    const search = async () => {
        setErr("");
        try {
            const data = await apiSearchPlaces({ category: category || undefined });
            setRows(Array.isArray(data) ? data : (data.items || []));
        } catch (e) {
            setErr(e?.response?.data?.message || e.message);
        }
    };

    return (
        <div style={{ padding: 16 }}>
            <h2>Places</h2>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <input
                    placeholder="Category (beach,historical,wildlife)"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                />
                <button onClick={search}>Search</button>
            </div>

            {err ? <p style={{ color: "crimson" }}>{err}</p> : null}

            <ul>
                {rows.map((p) => (
                    <li key={p.id}>
                        <Link to={`/places/${p.id}`}>{p.name || `Place #${p.id}`}</Link>
                        {" "}
                        <small>{p.category ? `| ${p.category}` : ""}</small>
                    </li>
                ))}
            </ul>
        </div>
    );
}
