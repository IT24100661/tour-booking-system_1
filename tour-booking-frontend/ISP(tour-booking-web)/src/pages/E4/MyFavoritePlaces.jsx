import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext.jsx";
import { apiGetFavoritePlaces, apiRemoveFavoritePlace } from "../../api/e4.js";

export default function MyFavoritePlaces() {
    const { user } = useAuth();
    const userId = user?.id;

    const [rows, setRows] = useState([]);
    const [err, setErr] = useState("");

    const load = async () => {
        if (!userId) return;
        setErr("");
        try {
            const data = await apiGetFavoritePlaces(userId);
            setRows(Array.isArray(data) ? data : (data.items || []));
        } catch (e) {
            setErr(e?.response?.data?.message || e.message);
        }
    };

    useEffect(() => { load(); }, [userId]);

    const remove = async (placeId) => {
        setErr("");
        try {
            await apiRemoveFavoritePlace(userId, placeId);
            await load();
        } catch (e) {
            setErr(e?.response?.data?.message || e.message);
        }
    };

    return (
        <div style={{ padding: 16 }}>
            <h2>My Favorite Places</h2>
            {err ? <p style={{ color: "crimson" }}>{err}</p> : null}

            <ul>
                {rows.map((p) => (
                    <li key={p.id || p.placeId}>
                        <Link to={`/places/${p.id || p.placeId}`}>
                            {p.name || `Place #${p.id || p.placeId}`}
                        </Link>
                        {" "}
                        <button onClick={() => remove(p.id || p.placeId)}>Remove</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
