import React from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "./App.jsx";

import Home from "./pages/Home.jsx";

// E1 pages
import Register from "./pages/E1/Register.jsx";
import Login from "./pages/E1/Login.jsx";
import VerifyEmail from "./pages/E1/VerifyEmail.jsx";
import ResetPassword from "./pages/E1/ResetPassword.jsx";
import Dashboard from "./pages/E1/Dashboard.jsx";
import UserProfile from "./pages/E1/UserProfile.jsx";
import GuideProfile from "./pages/E1/GuideProfile.jsx";
import HotelProfile from "./pages/E1/HotelProfile.jsx";

// E2 pages
import Guides from "./pages/E2/Guides.jsx";
import GuideDetail from "./pages/E2/GuideDetail.jsx";
import GuideAvailability from "./pages/E2/GuideAvailability.jsx";
import GuideRequests from "./pages/E2/GuideRequests.jsx";
import MyGuideBookings from "./pages/E2/MyGuideBookings.jsx";

// E3 pages
import Hotels from "./pages/E3/Hotels.jsx";
import HotelDetail from "./pages/E3/HotelDetail.jsx";
import HotelCreate from "./pages/E3/HotelCreate.jsx";
import HotelManage from "./pages/E3/HotelManage.jsx";
import MyHotelReservations from "./pages/E3/MyHotelReservations.jsx";

// E4 pages
import Places from "./pages/E4/Places.jsx";
import PlaceDetail from "./pages/E4/PlaceDetail.jsx";
import AdminPlaceCreate from "./pages/E4/AdminPlaceCreate.jsx";
import AdminPlaceEdit from "./pages/E4/AdminPlaceEdit.jsx";
import MyFavoritePlaces from "./pages/E4/MyFavoritePlaces.jsx";

// E5 pages
import BookingCreate from "./pages/E5/BookingCreate.jsx";
import BookingDetail from "./pages/E5/BookingDetail.jsx";
import MyBookings from "./pages/E5/MyBookings.jsx";
import ProviderPayments from "./pages/E5/ProviderPayments.jsx";
import AdminPayments from "./pages/E5/AdminPayments.jsx";

// E6 pages
import AdminReportedReviews from "./pages/E6/AdminReportedReviews.jsx";

import RequireAuth from "./auth/RequireAuth.jsx";
import RequireRole from "./auth/RequireRole.jsx";

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

            // E1 protected (common)
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
            { path: "admin/places/new", element: <RequireRole roles={["ADMIN"]}><AdminPlaceCreate /></RequireRole> },
            { path: "admin/places/:id/edit", element: <RequireRole roles={["ADMIN"]}><AdminPlaceEdit /></RequireRole> },

            // E5 protected
            { path: "bookings/new", element: <RequireAuth><BookingCreate /></RequireAuth> },
            { path: "bookings/:id", element: <RequireAuth><BookingDetail /></RequireAuth> },
            { path: "my-bookings", element: <RequireAuth><MyBookings /></RequireAuth> },
            { path: "my-payments", element: <RequireAuth><ProviderPayments /></RequireAuth> },

            // E5 admin
            { path: "admin/payments", element: <RequireRole roles={["ADMIN"]}><AdminPayments /></RequireRole> },

            // E6 admin moderation
            { path: "admin/reviews/reported", element: <RequireRole roles={["ADMIN"]}><AdminReportedReviews /></RequireRole> },
        ],
    },
]);
