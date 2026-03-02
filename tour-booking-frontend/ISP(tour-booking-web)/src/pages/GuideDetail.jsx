import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    apiGetGuide,
    apiGetAvailability,
    apiCreateBookingRequest,
    apiCreateGuideBooking,
} from "../api/e2";
import { useAuth } from "../auth/AuthContext.jsx";
import ReviewsBlock from "../components/ReviewsBlock.jsx";

export default function GuideDetail() {
    const { id } = useParams();
    const guideId = Number(id);
    const { user } = useAuth();

    const [guide, setGuide] = useState(null);
    const [slots, setSlots] = useState([]);
    const [selectedSlotId, setSelectedSlotId] = useState("");
    const [err, setErr] = useState("");
    const [msg, setMsg] = useState("");

    const load = async () => {
        setErr("");
        setMsg("");
        try {
            const g = await apiGetGuide(guideId);
            setGuide(g);

            const s = await apiGetAvailability(guideId);
            setSlots(Array.isArray(s) ? s : (s.items || []));
        } catch (e) {
            setErr(e?.response?.data?.message || e.message);
        }
    };

    useEffect(() => {
        if (!Number.isFinite(guideId)) return;
        load();
    }, [guideId]);

    const touristId = user?.id;

    const requestBooking = async () => {
        setErr("");
        setMsg("");
        if (!touristId) return setErr("Login as TOURIST first");
        if (!selectedSlotId) return setErr("Select an availability slot first");

        try {
            await apiCreateBookingRequest({
                guideId,
                touristId,
                slotId: Number(selectedSlotId),
            });
            setMsg("Booking request sent");
        } catch (e) {
            setErr(e?.response?.data?.message || e.message);
        }
    };

    const bookDirect = async () => {
        setErr("");
        setMsg("");
        if (!touristId) return setErr("Login as TOURIST first");
        if (!selectedSlotId) return setErr("Select an availability slot first");

        try {
            await apiCreateGuideBooking({
                guideId,
                touristId,
                slotId: Number(selectedSlotId),
            });
            setMsg("Booking created");
        } catch (e) {
            setErr(e?.response?.data?.message || e.message);
        }
    };

    return (
        <div style={{ padding: 16 }}>
            <h2>Guide Detail</h2>

            {err ? <p style={{ color: "crimson" }}>{err}</p> : null}
            {msg ? <p style={{ color: "green" }}>{msg}</p> : null}

            <pre style={{ background: "#111", color: "#ddd", padding: 12, overflow: "auto" }}>
        {JSON.stringify(guide, null, 2)}
      </pre>

            <h3>Availability</h3>
            <select value={selectedSlotId} onChange={(e) => setSelectedSlotId(e.target.value)}>
                <option value="">Select slot</option>
                {slots.map((s) => (
                    <option key={s.id} value={s.id}>
                        {s.dateTime || `${s.start} - ${s.end}` || `Slot #${s.id}`}
                    </option>
                ))}
            </select>

            <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                <button onClick={requestBooking}>Send request</button>
                <button onClick={bookDirect}>Book direct</button>
            </div>

            {/* E6 Reviews */}
            <ReviewsBlock targetType="GUIDE" targetId={guideId} />
        </div>
    );
}
