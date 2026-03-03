import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    apiGetPlace,
    apiUpdatePlace,
    apiDeletePlace,
    apiCreateNearbyService,
    apiUpdateNearbyService,
    apiDeleteNearbyService,
} from "../../api/e4.js";

export default function AdminPlaceEdit() {
    const { id } = useParams();
    const placeId = Number(id);
    const navigate = useNavigate();

    const [place, setPlace] = useState(null);
    const [err, setErr] = useState("");
    const [msg, setMsg] = useState("");

    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");

    const [svcName, setSvcName] = useState("");
    const [svcType, setSvcType] = useState("");
    const [svcContact, setSvcContact] = useState("");

    const load = async () => {
        setErr(""); setMsg("");
        try {
            const p = await apiGetPlace(placeId);
            setPlace(p);
            setName(p.name || "");
            setCategory(p.category || "");
            setDescription(p.description || "");
        } catch (e) {
            setErr(e?.response?.data?.message || e.message);
        }
    };

    useEffect(() => { load(); }, [placeId]);

    const save = async () => {
        setErr(""); setMsg("");
        try {
            await apiUpdatePlace(placeId, { name, category, description });
            setMsg("Updated");
            await load();
        } catch (e) {
            setErr(e?.response?.data?.message || e.message);
        }
    };

    const remove = async () => {
        setErr(""); setMsg("");
        try {
            await apiDeletePlace(placeId);
            navigate("/places");
        } catch (e) {
            setErr(e?.response?.data?.message || e.message);
        }
    };

    const addService = async () => {
        setErr(""); setMsg("");
        try {
            await apiCreateNearbyService(placeId, { name: svcName, type: svcType, contact: svcContact });
            setSvcName(""); setSvcType(""); setSvcContact("");
            setMsg("Service added");
            await load();
        } catch (e) {
            setErr(e?.response?.data?.message || e.message);
        }
    };

    const patchService = async (serviceId) => {
        setErr(""); setMsg("");
        try {
            await apiUpdateNearbyService(placeId, serviceId, { contact: svcContact || undefined });
            setMsg("Service updated");
            await load();
        } catch (e) {
            setErr(e?.response?.data?.message || e.message);
        }
    };

    const deleteService = async (serviceId) => {
        setErr(""); setMsg("");
        try {
            await apiDeleteNearbyService(placeId, serviceId);
            setMsg("Service deleted");
            await load();
        } catch (e) {
            setErr(e?.response?.data?.message || e.message);
        }
    };

    const services = place?.nearbyServices || place?.services || [];

    return (
        <div style={{ padding: 16 }}>
            <h2>Admin: Edit Place</h2>
            {err ? <p style={{ color: "crimson" }}>{err}</p> : null}
            {msg ? <p style={{ color: "green" }}>{msg}</p> : null}

            <h3>Place info</h3>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" /><br />
            <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" /><br />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" /><br />
            <button onClick={save}>Save</button>
            <button onClick={remove} style={{ marginLeft: 8 }}>Delete place</button>

            <h3>Nearby services</h3>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <input placeholder="Service name" value={svcName} onChange={(e) => setSvcName(e.target.value)} />
                <input placeholder="Type (restaurant,transport)" value={svcType} onChange={(e) => setSvcType(e.target.value)} />
                <input placeholder="Contact" value={svcContact} onChange={(e) => setSvcContact(e.target.value)} />
                <button onClick={addService}>Add service</button>
            </div>

            <ul>
                {services.map((s) => (
                    <li key={s.id}>
                        <code>{JSON.stringify(s)}</code>{" "}
                        <button onClick={() => patchService(s.id)}>Patch</button>{" "}
                        <button onClick={() => deleteService(s.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
