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

// E2 pages
import Guides from "./pages/Guides.jsx";
import GuideDetail from "./pages/GuideDetail.jsx";
import GuideAvailability from "./pages/GuideAvailability.jsx";
import GuideRequests from "./pages/GuideRequests.jsx";
import MyGuideBookings from "./pages/MyGuideBookings.jsx";

// E3 pages
import Hotels from "./pages/Hotels.jsx";
import HotelDetail from "./pages/HotelDetail.jsx";
import HotelCreate from "./pages/HotelCreate.jsx";
import HotelManage from "./pages/HotelManage.jsx";
import MyHotelReservations from "./pages/MyHotelReservations.jsx";

// E4 pages
import Places from "./pages/Places.jsx";
import PlaceDetail from "./pages/PlaceDetail.jsx";
import AdminPlaceCreate from "./pages/AdminPlaceCreate.jsx";
import AdminPlaceEdit from "./pages/AdminPlaceEdit.jsx";
import MyFavoritePlaces from "./pages/MyFavoritePlaces.jsx";

// E5 pages
import BookingCreate from "./pages/BookingCreate.jsx";
import BookingDetail from "./pages/BookingDetail.jsx";
import MyBookings from "./pages/MyBookings.jsx";
import ProviderPayments from "./pages/ProviderPayments.jsx";
import AdminPayments from "./pages/AdminPayments.jsx";

// E6 pages
import AdminReportedReviews from "./pages/AdminReportedReviews.jsx";

import RequireAuth from "./auth/RequireAuth.jsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            // Public
            { index: true, element: <Home /> },
            { path: "register", element: <Register /> },
            { path: "login", element: <Login /> },
            { path: "verify-email", element: <VerifyEmail /> },
            { path: "password-reset", element: <ResetPassword /> },

            // E2 public
            { path: "guides", element: <Guides /> },
            { path: "guides/:id", element: <GuideDetail /> },

            // E3 public
            { path: "hotels", element: <Hotels /> },
            { path: "hotels/:id", element: <HotelDetail /> },

            // E4 public
            { path: "places", element: <Places /> },
            { path: "places/:id", element: <PlaceDetail /> },

            // Protected (common)
            { path: "dashboard", element: <RequireAuth><Dashboard /></RequireAuth> },
            { path: "users/:id", element: <RequireAuth><UserProfile /></RequireAuth> },
            { path: "guides/profile", element: <RequireAuth><GuideProfile /></RequireAuth> },
            { path: "hotels/profile", element: <RequireAuth><HotelProfile /></RequireAuth> },

            // E2 protected
            { path: "guide/availability", element: <RequireAuth><GuideAvailability /></RequireAuth> },
            { path: "guide/requests", element: <RequireAuth><GuideRequests /></RequireAuth> },
            { path: "my-bookings/guides", element: <RequireAuth><MyGuideBookings /></RequireAuth> },

            // E3 protected (owner)
            { path: "owner/hotels/new", element: <RequireAuth><HotelCreate /></RequireAuth> },
            { path: "owner/hotels/:id/manage", element: <RequireAuth><HotelManage /></RequireAuth> },

            // E3 protected (tourist)
            { path: "my-reservations/hotels", element: <RequireAuth><MyHotelReservations /></RequireAuth> },

            // E4 protected (tourist)
            { path: "my-favorites/places", element: <RequireAuth><MyFavoritePlaces /></RequireAuth> },

            // E4 protected (admin)
            { path: "admin/places/new", element: <RequireAuth><AdminPlaceCreate /></RequireAuth> },
            { path: "admin/places/:id/edit", element: <RequireAuth><AdminPlaceEdit /></RequireAuth> },

            // E5 protected
            { path: "bookings/new", element: <RequireAuth><BookingCreate /></RequireAuth> },
            { path: "bookings/:id", element: <RequireAuth><BookingDetail /></RequireAuth> },
            { path: "my-bookings", element: <RequireAuth><MyBookings /></RequireAuth> },
            { path: "my-payments", element: <RequireAuth><ProviderPayments /></RequireAuth> },
            { path: "admin/payments", element: <RequireAuth><AdminPayments /></RequireAuth> },

            // E6 protected (admin moderation)
            { path: "admin/reviews/reported", element: <RequireAuth><AdminReportedReviews /></RequireAuth> },
        ],
    },
]);
