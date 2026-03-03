import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    apiGetBooking,
    apiUpdateBooking,
    apiDeleteBooking,
    apiCreateInvoice,
    apiDownloadInvoice,
    apiNotifyPayment,
} from "../../api/e5.js";

export default function BookingDetail() {
    const { id } = useParams();
    const bookingId = Number(id);

    const [data, setData] = useState(null);
    const [status, setStatus] = useState("");
    const [reason, setReason] = useState("");
    const [err, setErr] = useState("");
    const [msg, setMsg] = useState("");

    const load = async () => {
        setErr(""); setMsg("");
        try {
            const b = await apiGetBooking(bookingId);
            setData(b);
            setStatus(b?.status || "");
        } catch (e) {
            setErr(e?.response?.data?.message || e.message);
        }
    };

    useEffect(() => { load(); }, [bookingId]);

    const patch = async () => {
        setErr(""); setMsg("");
        try {
            await apiUpdateBooking(bookingId, { status, reason: reason || undefined });
            setMsg("Booking updated");
            await load();
        } catch (e) {
            setErr(e?.response?.data?.message || e.message);
        }
    };

    const remove = async () => {
        setErr(""); setMsg("");
        try {
            await apiDeleteBooking(bookingId); // soft delete on backend
            setMsg("Booking deleted");
        } catch (e) {
            setErr(e?.response?.data?.message || e.message);
        }
    };

    const createInvoice = async () => {
        setErr(""); setMsg("");
        try {
            await apiCreateInvoice(bookingId);
            setMsg("Invoice created");
        } catch (e) {
            setErr(e?.response?.data?.message || e.message);
        }
    };

    const downloadInvoice = async () => {
        setErr(""); setMsg("");
        try {
            const res = await apiDownloadInvoice(bookingId);
            const blob = new Blob([res.data], { type: res.headers["content-type"] || "application/pdf" });
            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `invoice-booking-${bookingId}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();

            URL.revokeObjectURL(url);
            setMsg("Invoice downloaded");
        } catch (e) {
            setErr(e?.response?.data?.message || e.message);
        }
    };

    const notify = async () => {
        setErr(""); setMsg("");
        try {
            await apiNotifyPayment({ bookingId });
            setMsg("Payment notification triggered");
        } catch (e) {
            setErr(e?.response?.data?.message || e.message);
        }
    };

    return (
        <div style={{ padding: 16 }}>
            <h2>Booking #{bookingId}</h2>
            {err ? <p style={{ color: "crimson" }}>{err}</p> : null}
            {msg ? <p style={{ color: "green" }}>{msg}</p> : null}

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button onClick={createInvoice}>Create invoice</button>
                <button onClick={downloadInvoice}>Download invoice</button>
                <button onClick={notify}>Notify payment</button>
            </div>

            <h3>Update status</h3>
            <div style={{ display: "grid", gap: 8, maxWidth: 420 }}>
                <input
                    placeholder="Status (CONFIRMED/CANCELLED/RESCHEDULED...)"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                />
                <input
                    placeholder="Reason (optional)"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                />
                <button onClick={patch}>Update booking</button>
                <button onClick={remove} style={{ background: "#ef4444", color: "#fff" }}>
                    Delete booking
                </button>
            </div>

            <h3>Raw</h3>
            <pre style={{ background: "#111", color: "#ddd", padding: 12, overflow: "auto" }}>
        {JSON.stringify(data, null, 2)}
      </pre>
        </div>
    );
}
