import React, { useState } from "react";
import { Link } from "react-router-dom";
import { apiSearchHotels } from "../../api/e3.js";

export default function Hotels() {
    const [location, setLocation] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [facilities, setFacilities] = useState("");
    const [rows, setRows] = useState([]);
    const [err, setErr] = useState("");

    const search = async () => {
        setErr("");
        try {
            const data = await apiSearchHotels({
                location,
                minPrice: minPrice || undefined,
                maxPrice: maxPrice || undefined,
                facilities,
            });
            setRows(Array.isArray(data) ? data : (data.items || []));
        } catch (e) {
            setErr(e?.response?.data?.message || e.message);
        }
    };

    return (
        <div style={{ padding: 16 }}>
            <h2>Search Hotels</h2>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
                <input placeholder="Min price" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
                <input placeholder="Max price" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
                <input placeholder="Facilities (pool,wifi)" value={facilities} onChange={(e) => setFacilities(e.target.value)} />
                <button onClick={search}>Search</button>
            </div>

            {err ? <p style={{ color: "crimson" }}>{err}</p> : null}

            <ul>
                {rows.map((h) => (
                    <li key={h.id}>
                        <Link to={`/hotels/${h.id}`}>{h.name || h.businessName || `Hotel #${h.id}`}</Link>
                        {" "}
                        <small>{h.location ? `| ${h.location}` : ""}</small>
                    </li>
                ))}
            </ul>
        </div>
    );
}
