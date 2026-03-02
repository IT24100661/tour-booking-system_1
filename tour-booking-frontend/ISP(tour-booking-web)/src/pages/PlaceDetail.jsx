import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import {
    apiGetPlace,
    apiGetPlaceMap,
    apiGetPlaceNearby,
    apiAddFavoritePlace,
    apiRemoveFavoritePlace,
} from "../api/e4";

export default function PlaceDetail() {
    const { id } = useParams();
    const placeId = Number(id);
    const { user, token } = useAuth();

    const [place, setPlace] = useState(null);
    const [mapData, setMapData] = useState(null);
    const [nearby, setNearby] = useState(null);
    const [err, setErr] = useState("");
    const [msg, setMsg] = useState("");

    const load = async () => {
        setErr(""); setMsg("");
        try {
            const p = await apiGetPlace(placeId);
            setPlace(p);
        } catch (e) {
            setErr(e?.response?.data?.message || e.message);
        }
    };

    useEffect(() => { load(); }, [placeId]); // refetch when URL param changes [web:570]

    const loadMap = async () => {
        setErr(""); setMsg("");
        try {
            setMapData(await apiGetPlaceMap(placeId));
        } catch (e) {
            setErr(e?.response?.data?.message || e.message);
        }
    };

    const loadNearby = async () => {
        setErr(""); setMsg("");
        try {
            setNearby(await apiGetPlaceNearby(placeId));
        } catch (e) {
            setErr(e?.response?.data?.message || e.message);
        }
    };

    const addFav = async () => {
        setErr(""); setMsg("");
        if (!token || !user?.id) return setErr("Login first");
        try {
            await apiAddFavoritePlace(user.id, placeId);
            setMsg("Added to favorites");
        } catch (e) {
            setErr(e?.response?.data?.message || e.message);
        }
    };

    const removeFav = async () => {
        setErr(""); setMsg("");
        if (!token || !user?.id) return setErr("Login first");
        try {
            await apiRemoveFavoritePlace(user.id, placeId);
            setMsg("Removed from favorites");
        } catch (e) {
            setErr(e?.response?.data?.message || e.message);
        }
    };

    const services = place?.nearbyServices || place?.services || [];

    return (
        <div style={{ padding: 16 }}>
            <h2>Place Detail</h2>
            {err ? <p style={{ color: "crimson" }}>{err}</p> : null}
            {msg ? <p style={{ color: "green" }}>{msg}</p> : null}

            {token && (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button onClick={addFav}>Save favorite</button>
                    <button onClick={removeFav}>Remove favorite</button>
                    <Link to="/my-favorites/places">My favorites</Link>
                </div>
            )}

            <pre style={{ background: "#111", color: "#ddd", padding: 12, overflow: "auto" }}>
        {JSON.stringify(place, null, 2)}
      </pre>

            <h3>Nearby services</h3>
            <ul>
                {services.map((s) => (
                    <li key={s.id}>
                        <code>{JSON.stringify(s)}</code>
                    </li>
                ))}
            </ul>

            <h3>Map data</h3>
            <button onClick={loadMap}>Load map</button>
            {mapData ? (
                <pre style={{ background: "#111", color: "#ddd", padding: 12, overflow: "auto" }}>
          {JSON.stringify(mapData, null, 2)}
        </pre>
            ) : null}

            <h3>Nearby hotels & guides</h3>
            <button onClick={loadNearby}>Load nearby</button>
            {nearby ? (
                <pre style={{ background: "#111", color: "#ddd", padding: 12, overflow: "auto" }}>
          {JSON.stringify(nearby, null, 2)}
        </pre>
            ) : null}
        </div>
    );
}
