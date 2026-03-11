import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Mail, Lock, KeyRound } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [msg, setMsg] = useState('');
    const { api } = useAuth();
    const navigate = useNavigate();

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError('');
        setMsg('');
        try {
            await api.post('/auth/forgotPassword', { email });
            setOtpSent(true);
            setMsg('A 4-digit passcode has been sent to your email.');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send passcode. Make sure the email exists.');
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setMsg('');
        try {
            const res = await api.post('/auth/resetPassword', { email, otp, password });
            localStorage.setItem('token', res.data.token);
            // Refresh explicitly to update auth context state globally
            window.location.href = '/dashboard';
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password. Check your passcode.');
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center bg-gray-50 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-br from-brand-600 to-brand-400 -skew-y-6 transform origin-top-left scale-110 z-0 shadow-lg"></div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="glassmorphism rounded-2xl p-8 max-w-md w-full z-10 mx-4"
            >
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mb-4 shadow-inner">
                        <KeyRound size={32} />
                    </div>
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                        {otpSent ? 'Reset Password' : 'Forgot Password'}
                    </h2>
                    <p className="text-gray-500 mt-2 text-center text-sm">
                        {otpSent
                            ? 'Enter the 4-digit passcode sent to your email and your new password.'
                            : 'Enter your email address and we will send you a 4-digit passcode.'}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-medium border border-red-100 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                        {error}
                    </div>
                )}
                {msg && (
                    <div className="bg-emerald-50 text-emerald-600 p-3 rounded-lg mb-4 text-sm font-medium border border-emerald-100 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
                        {msg}
                    </div>
                )}

                {!otpSent ? (
                    <form onSubmit={handleSendOtp} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-2.5 rounded-xl transition-colors shadow-md shadow-brand-500/30 flex justify-center items-center gap-2"
                        >
                            Send Passcode
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Passcode (4 Digits)</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Compass className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    maxLength={4}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all tracking-widest font-mono text-center"
                                    placeholder="0000"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    minLength={8}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                                    placeholder="Min. 8 characters"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-2.5 rounded-xl transition-colors shadow-md shadow-brand-500/30 flex justify-center items-center gap-2"
                        >
                            Change Password
                        </button>
                    </form>
                )}

                <p className="mt-8 text-center text-sm text-gray-600">
                    Remember your password?{' '}
                    <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-500 transition-colors">
                        Sign In
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
