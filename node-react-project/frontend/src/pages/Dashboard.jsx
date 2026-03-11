import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Map, Building, Compass } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import GuideProfileManager from '../components/guide/GuideProfileManager';
import GuideAvailability from '../components/guide/GuideAvailability';
import GuideBookings from '../components/guide/GuideBookings';
import TouristPlaces from '../components/tourist/TouristPlaces';
import TouristGuides from '../components/tourist/TouristGuides';
import TouristHotels from '../components/tourist/TouristHotels';
import TouristBookings from '../components/tourist/TouristBookings';
import HotelManager from '../components/hotel-owner/HotelManager';
import HotelReservationsManager from '../components/hotel-owner/HotelReservationsManager';
import AdminPlaceManager from '../components/admin/AdminPlaceManager';
import AdminReportedReviews from '../components/admin/AdminReportedReviews';
import AdminTransactionOversight from '../components/admin/AdminTransactionOversight';
import EarningsViewer from '../components/common/EarningsViewer';

export default function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTouristTab, setActiveTouristTab] = useState('places');

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const roleConfig = {
        'Tourist': {
            icon: <Compass className="w-8 h-8 text-brand-500" />,
            color: 'bg-brand-50',
            description: 'Explore the world, book guides, and discover amazing hotels.'
        },
        'Tour Guide': {
            icon: <Map className="w-8 h-8 text-emerald-500" />,
            color: 'bg-emerald-50',
            description: 'Manage your tours, itinerary, and guide enthusiastic travelers.'
        },
        'Hotel Owner': {
            icon: <Building className="w-8 h-8 text-violet-500" />,
            color: 'bg-violet-50',
            description: 'Manage your properties, rooms, and hotel bookings effortlessly.'
        },
        'Admin': {
            icon: <User className="w-8 h-8 text-rose-500" />,
            color: 'bg-rose-50',
            description: 'System administration, user management, and overall analytics.'
        }
    };

    const config = roleConfig[user?.role || 'Tourist'];

    return (
        <div
            className={`min-h-screen flex flex-col ${user?.role === 'Tourist' ? 'bg-cover bg-center bg-fixed' : 'bg-gray-50'}`}
            style={user?.role === 'Tourist' ? { backgroundImage: 'url(/tourist-bg.png)' } : {}}
        >
            {/* Navbar */}
            <nav className={`border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm ${user?.role === 'Tourist' ? 'bg-white/90 backdrop-blur-md' : 'bg-white'}`}>
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-brand-100 text-brand-600 rounded-xl flex items-center justify-center shadow-inner">
                        <Compass size={24} />
                    </div>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-700 to-brand-500">
                        TravelZone
                    </h1>
                </div>

                <div className="flex items-center gap-6">
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-sm font-semibold text-gray-900">{user?.name}</span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full mt-1">
                            {user?.role}
                        </span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50"
                    >
                        <LogOut size={20} />
                        <span className="hidden sm:inline font-medium">Logout</span>
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <div className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100 relative overflow-hidden"
                >
                    {/* Decorative Blob */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-brand-100/50 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none"></div>

                    <div className="flex flex-col md:flex-row gap-6 items-center md:items-start relative z-10">
                        <div className={`p-4 rounded-2xl ${config.color} shadow-inner shrink-0`}>
                            {config.icon}
                        </div>

                        <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-4 text-center md:text-left">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                                    Welcome back, <span className="text-brand-600">{user?.name?.split(' ')[0]}</span>!
                                </h2>
                                <p className="text-sm md:text-base text-gray-500 max-w-2xl mx-auto md:mx-0">
                                    {config.description}
                                </p>
                            </div>

                            <button onClick={() => navigate('/profile')} className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium py-2 px-5 rounded-xl transition-all shadow-md shadow-brand-500/20 hover:shadow-lg hover:-translate-y-0.5 shrink-0 w-full md:w-auto">
                                View My Profile
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Role Specific Dashboard Cards */}
                {user?.role === 'Tour Guide' ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex flex-col gap-6 mt-8"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <GuideProfileManager />
                            <GuideAvailability />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <GuideBookings />
                            <EarningsViewer endpoint="/payments/guide" title="My Earnings" role="Tour Guide" />
                        </div>
                    </motion.div>
                ) : user?.role === 'Tourist' ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex flex-col gap-6 mt-8"
                    >
                        {/* Tabs for Tourist */}
                        <div className="flex bg-white rounded-xl shadow-sm border border-gray-100 p-1 w-full md:w-3/4 lg:w-1/2 mx-auto">
                            <button
                                onClick={() => setActiveTouristTab('places')}
                                className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all ${activeTouristTab === 'places'
                                    ? 'bg-brand-50 text-brand-700 shadow-[0_1px_3px_rgba(0,0,0,0.1)]'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                Explore Destinations
                            </button>
                            <button
                                onClick={() => setActiveTouristTab('guides')}
                                className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all ${activeTouristTab === 'guides'
                                    ? 'bg-brand-50 text-brand-700 shadow-[0_1px_3px_rgba(0,0,0,0.1)]'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                Find Tour Guides
                            </button>
                            <button
                                onClick={() => setActiveTouristTab('hotels')}
                                className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all ${activeTouristTab === 'hotels'
                                    ? 'bg-brand-50 text-brand-700 shadow-[0_1px_3px_rgba(0,0,0,0.1)]'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                Premium Hotels
                            </button>
                            <button
                                onClick={() => setActiveTouristTab('bookings')}
                                className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all ${activeTouristTab === 'bookings'
                                    ? 'bg-brand-50 text-brand-700 shadow-[0_1px_3px_rgba(0,0,0,0.1)]'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                My Bookings
                            </button>
                            <button
                                onClick={() => setActiveTouristTab('transactions')}
                                className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all ${activeTouristTab === 'transactions'
                                    ? 'bg-brand-50 text-brand-700 shadow-[0_1px_3px_rgba(0,0,0,0.1)]'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                Transactions
                            </button>
                        </div>

                        {/* Tab Content */}
                        <motion.div
                            key={activeTouristTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            className="mt-2"
                        >
                            {activeTouristTab === 'places' && <TouristPlaces />}
                            {activeTouristTab === 'guides' && <TouristGuides />}
                            {activeTouristTab === 'hotels' && <TouristHotels />}
                            {activeTouristTab === 'bookings' && <TouristBookings />}
                            {activeTouristTab === 'transactions' && <EarningsViewer endpoint="/payments/tourist" title="Transaction History" role="Tourist" />}
                        </motion.div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex flex-col gap-6 mt-8"
                    >
                        {user?.role === 'Hotel Owner' ? (
                            <>
                                <HotelManager />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                    <HotelReservationsManager />
                                    <EarningsViewer endpoint="/payments/hotel" title="My Earnings" role="Hotel Owner" />
                                </div>
                            </>
                        ) : user?.role === 'Admin' ? (
                            <div className="flex flex-col gap-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <AdminPlaceManager />
                                    <AdminReportedReviews />
                                </div>
                                <AdminTransactionOversight />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                        <div className="w-12 h-12 bg-gray-50 rounded-xl mb-4 flex items-center justify-center border border-gray-100">
                                            <div className="w-6 h-6 bg-gray-200 rounded text-transparent">_</div>
                                        </div>
                                        <div className="h-6 w-1/2 bg-gray-100 rounded mb-2"></div>
                                        <div className="h-4 w-5/6 bg-gray-50 rounded"></div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
