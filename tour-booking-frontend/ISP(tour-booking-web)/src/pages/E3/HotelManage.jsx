import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    apiGetHotelDetails,
    apiUpdateHotel,
    apiDeleteHotel,
    apiCreateRoomType,
    apiUpdateRoomType,
    apiDeleteRoomType,
    apiCreateRoomAvailability,
    apiUpdateRoomAvailability,
    apiUploadHotelImage,
} from "../../api/e3.js";

export default function HotelManage() {
    const { id } = useParams();
    const hotelId = Number(id);

    const [hotel, setHotel] = useState(null);
    const [err, setErr] = useState("");
    const [msg, setMsg] = useState("");

    // hotel update fields
    const [description, setDescription] = useState("");
    const [facilities, setFacilities] = useState("");

    // room type create fields
    const [rtName, setRtName] = useState("");
    const [rtPrice, setRtPrice] = useState("");
    const [rtCapacity, setRtCapacity] = useState("");

    // availability create fields
    const [availRoomTypeId, setAvailRoomTypeId] = useState("");
    const [availFrom, setAvailFrom] = useState("");
    const [availTo, setAvailTo] = useState("");
    const [availRooms, setAvailRooms] = useState("");

    // image upload
    const [file, setFile] = useState(null);

    const load = async () => {
        setErr(""); setMsg("");
        try {
            const data = await apiGetHotelDetails(hotelId);
            setHotel(data);
            setDescription(data.description || "");
            setFacilities(data.facilities || "");
        } catch (e) {
            setErr(e?.response?.data?.message || e.message);
        }
    };

    useEffect(() => { load(); }, [hotelId]);

    const saveHotel = async () => {
        setErr(""); setMsg("");
        try {
            await apiUpdateHotel(hotelId, { description, facilities });
            setMsg("Hotel updated");
            await load();
        } catch (e) {
            setErr(e?.response?.data?.message || e.message);
        }
    };

    const removeHotel = async () => {
        setErr(""); setMsg("");
        try {
            await apiDeleteHotel(hotelId);
            setMsg("Hotel deleted");
        } catch (e) {
            setErr(e?.response?.data?.message || e.message);
        }
    };

    const addRoomType = async () => {
        setErr(""); setMsg("");
        try {
            await apiCreateRoomType(hotelId, {
                name: rtName,
                price: Number(rtPrice),
                capacity: Number(rtCapacity),
            });
            setRtName(""); setRtPrice(""); setRtCapacity("");
            setMsg("Room type created");
            await load();
        } catch (e) {
            setErr(e?.response?.data?.message || e.message);
        }
    };

    const patchRoomType = async (roomTypeId) => {
        setErr(""); setMsg("");
        try {
            await apiUpdateRoomType(hotelId, roomTypeId, {
                price: Number(rtPrice || 0) || undefined,
            });
            setMsg("Room type updated");
            await load();
        } catch (e) {
            setErr(e?.response?.data?.message || e.message);
        }
    };

    const deleteRoomType = async (roomTypeId) => {
        setErr(""); setMsg("");
        try {
            await apiDeleteRoomType(hotelId, roomTypeId);
            setMsg("Room type deleted");
            await load();
        } catch (e) {
            setErr(e?.response?.data?.message || e.message);
        }
    };

    const addAvailability = async () => {
        setErr(""); setMsg("");
        try {
            await apiCreateRoomAvailability({
                roomTypeId: Number(availRoomTypeId),
                from: availFrom,
                to: availTo,
                availableRooms: Number(availRooms),
            });
            setMsg("Availability created");
        } catch (e) {
            setErr(e?.response?.data?.message || e.message);
        }
    };

    const updateAvailability = async (availabilityId) => {
        setErr(""); setMsg("");
        try {
            await apiUpdateRoomAvailability(availabilityId, {
                availableRooms: Number(availRooms),
            });
            setMsg("Availability updated");
        } catch (e) {
            setErr(e?.response?.data?.message || e.message);
        }
    };

    const upload = async () => {
        setErr(""); setMsg("");
        if (!file) return setErr("Select an image first");
        try {
            await apiUploadHotelImage(hotelId, file);
            setMsg("Image uploaded");
            await load();
        } catch (e) {
            setErr(e?.response?.data?.message || e.message);
        }
    };

    const roomTypes = hotel?.roomTypes || [];
    const images = hotel?.images || [];

    return (
        <div style={{ padding: 16 }}>
            <h2>Manage Hotel (Owner)</h2>
            {err ? <p style={{ color: "crimson" }}>{err}</p> : null}
            {msg ? <p style={{ color: "green" }}>{msg}</p> : null}

            <h3>Update hotel info</h3>
            <input placeholder="Facilities" value={facilities} onChange={(e) => setFacilities(e.target.value)} /><br />
            <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} /><br />
            <button onClick={saveHotel}>Save</button>
            <button onClick={removeHotel} style={{ marginLeft: 8 }}>Delete hotel</button>

            <h3>Room types</h3>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <input placeholder="Name" value={rtName} onChange={(e) => setRtName(e.target.value)} />
                <input placeholder="Price" value={rtPrice} onChange={(e) => setRtPrice(e.target.value)} />
                <input placeholder="Capacity" value={rtCapacity} onChange={(e) => setRtCapacity(e.target.value)} />
                <button onClick={addRoomType}>Add room type</button>
            </div>

            <ul>
                {roomTypes.map((rt) => (
                    <li key={rt.id}>
                        <code>{JSON.stringify(rt)}</code>{" "}
                        <button onClick={() => patchRoomType(rt.id)}>Patch</button>{" "}
                        <button onClick={() => deleteRoomType(rt.id)}>Delete</button>
                    </li>
                ))}
            </ul>

            <h3>Room availability</h3>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <input placeholder="roomTypeId" value={availRoomTypeId} onChange={(e) => setAvailRoomTypeId(e.target.value)} />
                <input placeholder="from (YYYY-MM-DD)" value={availFrom} onChange={(e) => setAvailFrom(e.target.value)} />
                <input placeholder="to (YYYY-MM-DD)" value={availTo} onChange={(e) => setAvailTo(e.target.value)} />
                <input placeholder="availableRooms" value={availRooms} onChange={(e) => setAvailRooms(e.target.value)} />
                <button onClick={addAvailability}>Create availability</button>
            </div>

            <p style={{ fontSize: 12 }}>
                To update availability, call apiUpdateRoomAvailability(availabilityId) from your list UI (not shown because backend response shape varies).
            </p>

            <h3>Images</h3>
            <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <button onClick={upload}>Upload</button>

            <ul>
                {images.map((img) => (
                    <li key={img.id}><code>{JSON.stringify(img)}</code></li>
                ))}
            </ul>
        </div>
    );
}
