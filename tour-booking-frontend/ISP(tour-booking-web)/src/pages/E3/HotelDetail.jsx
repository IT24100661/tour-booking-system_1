import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext.jsx";
import {
    apiGetHotelDetails,
    apiCheckHotelAvailability,
    apiCreateHotelReservation,
} from "../../api/e3.js";

export default function HotelDetail() {
    const { id } = useParams();
    const hotelId = Number(id);
    const { user } = useAuth();

    const [hotel, setHotel] = useState(null);
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [availability, setAvailability] = useState(null);
    const [roomTypeId, setRoomTypeId] = useState("");
    const [rooms, setRooms] = useState("1");
    const [err, setErr] = useState("");
    const [msg, setMsg] = useState("");

    useEffect(() => {
        (async () => {
            setErr("");
            try {
                const data = await apiGetHotelDetails(hotelId);
                setHotel(data);
            } catch (e) {
                setErr(e?.response?.data?.message || e.message);
            }
        })();
    }, [hotelId]);

    const check = async () => {
        setErr(""); setMsg("");
        try {
            const data = await apiCheckHotelAvailability(hotelId, { checkIn, checkOut });
            setAvailability(data);
        } catch (e) {
            setErr(e?.response?.data?.message || e.message);
        }
    };

    const reserve = async () => {
        setErr(""); setMsg("");
        if (!user?.id) return setErr("Login as TOURIST first");
        if (!roomTypeId) return setErr("Select a room type");
        try {
            await apiCreateHotelReservation({
                hotelId,
                touristId: user.id,
                roomTypeId: Number(roomTypeId),
                checkIn,
                checkOut,
                rooms: Number(rooms),
            });
            setMsg("Reservation created");
        } catch (e) {
            setErr(e?.response?.data?.message || e.message);
        }
    };

    const roomTypes = hotel?.roomTypes || hotel?.rooms || [];

    return (
        <div style={{ padding: 16 }}>
            <h2>Hotel Detail</h2>
            {err ? <p style={{ color: "crimson" }}>{err}</p> : null}
            {msg ? <p style={{ color: "green" }}>{msg}</p> : null}

            <pre style={{ background: "#111", color: "#ddd", padding: 12, overflow: "auto" }}>
        {JSON.stringify(hotel, null, 2)}
      </pre>

            <h3>Check availability</h3>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <input placeholder="checkIn (YYYY-MM-DD)" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
                <input placeholder="checkOut (YYYY-MM-DD)" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
                <button onClick={check}>Check</button>
            </div>

            {availability ? (
                <pre style={{ background: "#111", color: "#ddd", padding: 12, overflow: "auto" }}>
          {JSON.stringify(availability, null, 2)}
        </pre>
            ) : null}

            <h3>Reserve</h3>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <select value={roomTypeId} onChange={(e) => setRoomTypeId(e.target.value)}>
                    <option value="">Select room type</option>
                    {roomTypes.map((rt) => (
                        <option key={rt.id} value={rt.id}>
                            {rt.name || `RoomType #${rt.id}`} {rt.price ? `- ${rt.price}` : ""}
                        </option>
                    ))}
                </select>

                <input value={rooms} onChange={(e) => setRooms(e.target.value)} />
                <button onClick={reserve}>Reserve</button>
            </div>
        </div>
    );
}
