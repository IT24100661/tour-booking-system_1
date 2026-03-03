import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";

export default function RequireRole({ roles = [], children }) {
    const { token, user } = useAuth();
    const loc = useLocation();

    if (!token) return <Navigate to="/login" replace state={{ from: loc.pathname }} />;

    const ok = roles.length === 0 || roles.includes(user?.role);
    if (!ok) return <Navigate to="/dashboard" replace />;

    return children;
}
