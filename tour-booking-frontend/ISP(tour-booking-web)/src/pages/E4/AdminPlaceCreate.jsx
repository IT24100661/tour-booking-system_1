import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiCreatePlace } from "../../api/e4.js";

export default function AdminPlaceCreate() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [lat, setLat] = useState("");
    const [lng, setLng] = useState("");
    const [err, setErr] = useState("");

    const create = async () => {
        setErr("");
        try {
            const created = await apiCreatePlace({
                name,
                category,
                description,
                lat: lat ? Number(lat) : null,
                lng: lng ? Number(lng) : null,
            });
            navigate(`/places/${created.id}`);
        } catch (e) {
            setErr(e?.response?.data?.message || e.message);
        }
    };

    return (
        <div style={{ padding: 16 }}>
            <h2>Admin: Create Place</h2>
            {err ? <p style={{ color: "crimson" }}>{err}</p> : null}

            <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} /><br />
            <input placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} /><br />
            <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} /><br />
            <input placeholder="Latitude" value={lat} onChange={(e) => setLat(e.target.value)} /><br />
            <input placeholder="Longitude" value={lng} onChange={(e) => setLng(e.target.value)} /><br />

            <button onClick={create}>Create</button>
        </div>
    );
}
