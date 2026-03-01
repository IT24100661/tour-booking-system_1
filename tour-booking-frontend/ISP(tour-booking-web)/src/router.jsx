import React from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "./App.jsx";

import Home from "./pages/Home.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import GuideProfile from "./pages/GuideProfile.jsx";
import HotelProfile from "./pages/HotelProfile.jsx";

import Guides from "./pages/Guides.jsx";
import GuideDetail from "./pages/GuideDetail.jsx";
import GuideAvailability from "./pages/GuideAvailability.jsx";
import GuideRequests from "./pages/GuideRequests.jsx";
import MyGuideBookings from "./pages/MyGuideBookings.jsx";

import RequireAuth from "./auth/RequireAuth.jsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { index: true, element: <Home /> },
            { path: "register", element: <Register /> },
            { path: "login", element: <Login /> },
            { path: "verify-email", element: <VerifyEmail /> },
            { path: "password-reset", element: <ResetPassword /> },

            // E2 public
            { path: "guides", element: <Guides /> },
            { path: "guides/:id", element: <GuideDetail /> },

            // Protected
            { path: "dashboard", element: <RequireAuth><Dashboard /></RequireAuth> },
            { path: "users/:id", element: <RequireAuth><UserProfile /></RequireAuth> },
            { path: "guides/profile", element: <RequireAuth><GuideProfile /></RequireAuth> },
            { path: "hotels/profile", element: <RequireAuth><HotelProfile /></RequireAuth> },

            // E2 protected
            { path: "guide/availability", element: <RequireAuth><GuideAvailability /></RequireAuth> },
            { path: "guide/requests", element: <RequireAuth><GuideRequests /></RequireAuth> },
            { path: "my-bookings/guides", element: <RequireAuth><MyGuideBookings /></RequireAuth> },
        ],
    },
]);
