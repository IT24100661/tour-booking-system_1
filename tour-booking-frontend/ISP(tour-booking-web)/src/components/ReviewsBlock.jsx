import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext.jsx";
import {
    apiCreateReview,
    apiGetReviewsForTarget,
    apiUpdateReview,
    apiDeleteReview,
    apiCreateReviewReport,
    apiCreateProviderResponse,
    apiDeleteProviderResponse,
} from "../api/e6";

export default function ReviewsBlock({ targetType, targetId }) {
    const { token, user } = useAuth();

    const [rows, setRows] = useState([]);
    const [avg, setAvg] = useState(null);

    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");

    const [err, setErr] = useState("");
    const [msg, setMsg] = useState("");

    const load = async () => {
        setErr(""); setMsg("");
        try {
            const data = await apiGetReviewsForTarget({ targetType, targetId });
            // backend may return array OR { items, avgRating }
            const list = Array.isArray(data) ? data : (data.items || []);
            setRows(list);
            setAvg(Array.isArray(data) ? null : (data.avgRating ?? null));
        } catch (e) {
            setErr(e?.response?.data?.message || e.message);
        }
    };

    useEffect(() => { load(); }, [targetType, targetId]);

    const create = async () => {
        setErr(""); setMsg("");
        try {
            await apiCreateReview({
                targetType,
                targetId: Number(targetId),
                rating: Number(rating),
                comment,
            });
            setComment("");
            setMsg("Review added");
            await load();
        } catch (e) {
            setErr(e?.response?.data?.message || e.message);
        }
    };

    const edit = async (reviewId, nextRating, nextComment) => {
        setErr(""); setMsg("");
        try {
            await apiUpdateReview(reviewId, {
                rating: Number(nextRating),
                comment: nextComment,
            });
            setMsg("Review updated");
            await load();
        } catch (e) {
            setErr(e?.response?.data?.message || e.message);
        }
    };

    const remove = async (reviewId) => {
        setErr(""); setMsg("");
        try {
            await apiDeleteReview(reviewId);
            setMsg("Review deleted");
            await load();
        } catch (e) {
            setErr(e?.response?.data?.message || e.message);
        }
    };

    const report = async (reviewId) => {
        const reason = window.prompt("Report reason (fake/inappropriate/etc):");
        if (!reason) return;
        setErr(""); setMsg("");
        try {
            await apiCreateReviewReport(reviewId, { reason });
            setMsg("Reported");
        } catch (e) {
            setErr(e?.response?.data?.message || e.message);
        }
    };

    const respond = async (reviewId) => {
        const text = window.prompt("Provider response:");
        if (!text) return;
        setErr(""); setMsg("");
        try {
            await apiCreateProviderResponse(reviewId, { message: text });
            setMsg("Response added");
            await load();
        } catch (e) {
            setErr(e?.response?.data?.message || e.message);
        }
    };

    const deleteResponse = async (reviewId, responseId) => {
        setErr(""); setMsg("");
        try {
            await apiDeleteProviderResponse(reviewId, responseId);
            setMsg("Response removed");
            await load();
        } catch (e) {
            setErr(e?.response?.data?.message || e.message);
        }
    };

    return (
        <div style={{ marginTop: 18 }}>
            <h3>Reviews</h3>

            {avg !== null ? <p>Average rating: {avg}</p> : null}
            {err ? <p style={{ color: "crimson" }}>{err}</p> : null}
            {msg ? <p style={{ color: "green" }}>{msg}</p> : null}

            {token && (
                <div style={{ display: "grid", gap: 8, maxWidth: 520 }}>
                    <select value={rating} onChange={(e) => setRating(e.target.value)}>
                        {[5, 4, 3, 2, 1].map((x) => (
                            <option key={x} value={x}>{x}</option>
                        ))}
                    </select>

                    <textarea
                        rows={3}
                        placeholder="Write your review..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />

                    <button onClick={create}>Add review</button>
                </div>
            )}

            <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
                {rows.map((r) => (
                    <ReviewItem
                        key={r.id}
                        review={r}
                        currentUserId={user?.id}
                        onEdit={edit}
                        onDelete={remove}
                        onReport={report}
                        onRespond={respond}
                        onDeleteResponse={deleteResponse}
                        canUseActions={!!token}
                    />
                ))}
            </div>
        </div>
    );
}

function ReviewItem({
                        review,
                        currentUserId,
                        onEdit,
                        onDelete,
                        onReport,
                        onRespond,
                        onDeleteResponse,
                        canUseActions,
                    }) {
    const isOwner = currentUserId && (review.userId === currentUserId || review.touristId === currentUserId);

    const [editing, setEditing] = useState(false);
    const [nextRating, setNextRating] = useState(review.rating ?? 5);
    const [nextComment, setNextComment] = useState(review.comment ?? "");

    const save = async () => {
        await onEdit(review.id, nextRating, nextComment);
        setEditing(false);
    };

    return (
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: 12 }}>
            <div style={{ display: "flex", gap: 12, justifyContent: "space-between" }}>
                <div>
                    <div><strong>Rating:</strong> {review.rating}</div>
                    {!editing ? (
                        <div style={{ whiteSpace: "pre-wrap" }}>{review.comment}</div>
                    ) : (
                        <div style={{ display: "grid", gap: 6 }}>
                            <select value={nextRating} onChange={(e) => setNextRating(e.target.value)}>
                                {[5, 4, 3, 2, 1].map((x) => (
                                    <option key={x} value={x}>{x}</option>
                                ))}
                            </select>
                            <textarea rows={3} value={nextComment} onChange={(e) => setNextComment(e.target.value)} />
                            <button onClick={save}>Save</button>
                        </div>
                    )}
                </div>

                {canUseActions && (
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", height: "fit-content" }}>
                        <button onClick={() => onReport(review.id)}>Report</button>
                        <button onClick={() => onRespond(review.id)}>Provider reply</button>

                        {isOwner && !editing && <button onClick={() => setEditing(true)}>Edit</button>}
                        {isOwner && <button onClick={() => onDelete(review.id)} style={{ background: "#ef4444", color: "#fff" }}>Delete</button>}
                    </div>
                )}
            </div>

            {/* Provider responses (backend shape may differ) */}
            {Array.isArray(review.responses) && review.responses.length > 0 && (
                <div style={{ marginTop: 10 }}>
                    <strong>Responses</strong>
                    <ul>
                        {review.responses.map((resp) => (
                            <li key={resp.id}>
                                {resp.message}
                                {canUseActions && (
                                    <button
                                        style={{ marginLeft: 8 }}
                                        onClick={() => onDeleteResponse(review.id, resp.id)}
                                    >
                                        Delete response
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
