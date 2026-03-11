import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Phone, Mail, ArrowLeft, Shield, Trash2, Check, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function Profile() {
    const { user, setUser, api, logout } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: user?.name || '',
        phoneNumber: user?.phoneNumber || '',
    });

    const [loading, setLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                phoneNumber: user.phoneNumber || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await api.patch('/users/updateMe', formData);
            setUser(res.data.data.user);
            toast.success('Profile updated successfully!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            await api.delete('/users/deleteMe');
            logout();
            navigate('/register');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete account');
            setShowDeleteModal(false);
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 flex justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-full h-1/3 bg-gradient-to-bl from-brand-600 to-brand-400 -skew-y-3 transform origin-top-right scale-110 z-0 shadow-lg"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl w-full z-10"
            >
                {/* Header Nav */}
                <div className="mb-6 flex justify-between items-center bg-white/50 backdrop-blur rounded-2xl p-4 shadow-sm border border-white/40">
                    <Link to="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-brand-600 font-medium transition-colors">
                        <ArrowLeft size={20} /> Back to Dashboard
                    </Link>
                    <div className="flex items-center gap-2 px-3 py-1 bg-brand-50 text-brand-700 rounded-full text-sm font-semibold">
                        <Shield size={16} /> {user.role} Account
                    </div>
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-sm border border-gray-100 relative">
                    <div className="flex flex-col md:flex-row items-center gap-6 mb-10 pb-8 border-b border-gray-100">
                        <div className="w-24 h-24 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center shadow-inner text-4xl font-bold uppercase">
                            {user.name.charAt(0)}
                        </div>
                        <div className="text-center md:text-left">
                            <h2 className="text-3xl font-bold text-gray-900">{user.name}</h2>
                            <p className="text-gray-500 mt-1 flex items-center justify-center md:justify-start gap-2">
                                <Mail size={16} /> {user.email}
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleUpdate} className="space-y-6 max-w-xl">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Personal Information</h3>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Phone className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="phoneNumber"
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                                    placeholder="+1 234 567 8900"
                                    value={formData.phoneNumber || ''}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Email <span className="text-xs font-normal text-gray-400">(Cannot be changed directly)</span></label>
                            <input
                                type="email"
                                disabled
                                className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                                value={user.email}
                            />
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`bg-brand-600 hover:bg-brand-700 text-white font-medium py-2.5 px-8 rounded-xl transition-all shadow-md shadow-brand-500/20 flex items-center gap-2 ${loading && 'opacity-70 cursor-not-allowed'}`}
                            >
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-12 pt-8 border-t border-gray-100 max-w-xl">
                        <h3 className="text-xl font-bold text-red-600 mb-2 flex items-center gap-2">Danger Zone</h3>
                        <p className="text-sm text-gray-500 mb-4">Once you delete your account, there is no going back. Please be certain.</p>

                        {showDeleteModal ? (
                            <div className="bg-red-50 border border-red-100 p-4 rounded-xl">
                                <p className="text-red-700 font-medium mb-4">Are you absolutely sure you want to delete your account?</p>
                                <div className="flex gap-3">
                                    <button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">Yes, Delete Account</button>
                                    <button onClick={() => setShowDeleteModal(false)} className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowDeleteModal(true)}
                                className="border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors"
                            >
                                <Trash2 size={18} /> Delete Account
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
