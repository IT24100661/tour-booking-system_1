import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CreditCard, Download, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EarningsViewer({ endpoint, title, role }) {
    const { api } = useAuth();
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const res = await api.get(endpoint);
                setPayments(res.data.data.payments);
            } catch (err) {
                console.error("Failed to fetch payments:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPayments();
    }, [api, endpoint]);

    const handleDownloadInvoice = (p) => {
        const content = `
=================================
          INVOICE RECEIPT
=================================

Transaction ID : ${p.id}
Stripe Session : ${p.stripeSessionId || 'N/A'}
Date           : ${new Date(p.createdAt).toLocaleString()}

Paid For       : ${p.targetType} (Ref #${p.targetId})
Amount         : $${p.amount} ${p.currency.toUpperCase()}
Status         : ${p.status.toUpperCase()}

=================================
Thank you for using TravelZone!
        `;
        const blob = new Blob([content.trim()], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Invoice_TZ_${p.id}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    if (loading) {
        return (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mt-6 md:mt-0 flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mt-6 md:mt-0 w-full">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                <CreditCard className={role === 'Tourist' ? 'text-brand-500' : 'text-emerald-500'} /> {title}
            </h3>

            {payments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                    <CreditCard size={48} className="mb-4 opacity-20" />
                    <p>No transaction history found.</p>
                </div>
            ) : (
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                    {payments.map(p => (
                        <motion.div
                            key={p.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gray-50/50 border border-gray-100 p-4 rounded-xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                        >
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-bold text-gray-900 text-sm">
                                        {p.targetType} #{p.targetId}
                                    </h4>
                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md
                                        ${p.status === 'succeeded' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-yellow-100 text-yellow-700 border border-yellow-200'}
                                    `}>
                                        {p.status}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 font-mono mb-2">TXN: {p.stripeSessionId || `PAY-${p.id}`}</p>
                                <p className="text-xs text-gray-500">{new Date(p.createdAt).toLocaleString()}</p>
                            </div>

                            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                                <span className="text-lg font-bold text-gray-900">${p.amount}</span>
                                {role === 'Tourist' && p.status === 'succeeded' && (
                                    <button
                                        onClick={() => handleDownloadInvoice(p)}
                                        className="text-xs font-semibold px-3 py-1.5 bg-white text-brand-600 border border-brand-200 hover:bg-brand-50 rounded-lg shadow-sm transition-colors flex items-center gap-1"
                                    >
                                        <Download size={14} /> Invoice
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
