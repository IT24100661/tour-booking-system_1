import React, { useState } from "react";
import { Link } from "react-router-dom";
import { apiSearchGuides } from "../api/e2";

export default function Guides() {
    const [location, setLocation] = useState("");
    const [language, setLanguage] = useState("");
    const [ratingMin, setRatingMin] = useState("");
    const [rows, setRows] = useState([]);
    const [err, setErr] = useState("");

    const onSearch = async () => {
        setErr("");
        try {
            const data = await apiSearchGuides({ location, language, ratingMin });
            setRows(Array.isArray(data) ? data : (data.items || []));
        } catch (e) {
            setErr(e?.response?.data?.message || e.message);
        }
    };

    return (
        <div style={{ padding: 16 }}>
            <h2>Search Guides</h2>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
                <input placeholder="Language" value={language} onChange={(e) => setLanguage(e.target.value)} />
                <input placeholder="Rating min" value={ratingMin} onChange={(e) => setRatingMin(e.target.value)} />
                <button onClick={onSearch}>Search</button>
            </div>

            {err ? <p style={{ color: "crimson" }}>{err}</p> : null}

            <ul>
                {rows.map((g) => (
                    <li key={g.id}>
                        <Link to={`/guides/${g.id}`}>{g.name || g.user?.name || `Guide #${g.id}`}</Link>
                        {"  "}
                        <small>
                            {g.location ? `| ${g.location} ` : ""}
                            {g.languages ? `| ${g.languages}` : ""}
                        </small>
                    </li>
                ))}
            </ul>
        </div>
    );
}
