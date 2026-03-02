import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiCreateHotel } from "../api/e3";
import { useAuth } from "../auth/AuthContext.jsx";

export default function HotelCreate() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [facilities, setFacilities] = useState("");
    const [description, setDescription] = useState("");
    const [err, setErr] = useState("");

    const create = async () => {
        setErr("");
        try {
            const created = await apiCreateHotel({
                ownerId: user?.id, // if backend reads owner from JWT, remove this field
                name,
                location,
                facilities,
                description,
            });
            navigate(`/owner/hotels/${created.id}/manage`);
        } catch (e) {
            setErr(e?.response?.data?.message || e.message);
        }
    };

    return (
        <div style={{ padding: 16 }}>
            <h2>Create Hotel (Owner)</h2>
            {err ? <p style={{ color: "crimson" }}>{err}</p> : null}

            <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} /><br />
            <input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} /><br />
            <input placeholder="Facilities (pool,wifi)" value={facilities} onChange={(e) => setFacilities(e.target.value)} /><br />
            <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} /><br />

            <button onClick={create}>Create</button>
        </div>
    );
}
