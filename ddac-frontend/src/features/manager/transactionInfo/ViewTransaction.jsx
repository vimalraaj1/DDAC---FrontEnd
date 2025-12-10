import '../../../index.css';
import Layout from '../../../components/Layout.jsx';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaFileInvoiceDollar, FaCreditCard, FaMoneyCheckAlt, FaCalendarAlt, FaClock, FaReceipt, FaUser, FaUserMd, FaHospital } from 'react-icons/fa';
import { FaTimesCircle, FaCheckCircle } from 'react-icons/fa';
import {useEffect, useState} from "react";
import {getStaffById} from "../../../services/staffManagementService.js";
import {averageStaffRating} from "../../../services/commentManagementService.js";
import {GetAppointmentWithDetailsById} from "../../../services/appointmentManagementService.js";
import {exportTransactionsToCsvAsync, getTransactionById} from "../../../services/transactionManagementService.js";
import {toast} from "sonner";

export default function ViewTransaction() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [transaction, setTransaction] = useState(null);
    const [appointment, setAppointment] = useState(null);

    useEffect(() => {
        getTransactionInfo();
    }, []);

    const getTransactionInfo = async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await getTransactionById(id);
            console.log('Fetched doctor:', data);
            if (data && typeof data === 'object') {
                setTransaction(data);
            } else {
                throw new Error('Transaction not found or invalid data format.');
            }
            const appointmentId = data.appointmentId;
            if (appointmentId) {
                const appointmentData = await GetAppointmentWithDetailsById(appointmentId);
                if (appointmentData && typeof appointmentData === 'object') {
                    setAppointment(appointmentData);
                } else {
                    console.warn('Appointment not found or invalid data format.');
                    setAppointment(null);
                }
            } else {
                console.warn('Transaction has no associated appointment ID.');
                setAppointment(null);
            }
        }
        catch (err) {
            console.error('Error fetching transaction:', err);
            setError(err.message || 'Failed to fetch transaction');
            setTransaction(null);
        } finally {
            setLoading(false);
        }
    }

    const formatCurrency = (amount, currency) => `${currency} ${amount.toFixed(2)}`;
    const formatDateTime = (dateTime) => {
        const d = new Date(dateTime);
        return d.toLocaleString('en-MY', {
            year: 'numeric', month: 'short', day: '2-digit',
            hour: '2-digit', minute: '2-digit', hour12: true
        });
    };

    const statusBadge = (status) => {
        switch(status) {
            case 'successful':
            case 'success':
            case'succeeded':
            case 'succeed':
            case 'succeede':
                return { label: 'Success', color: 'bg-accent-success bg-opacity-10 text-ondark', icon: FaCheckCircle };
            case 'pending':
                return { label: 'Pending', color: 'bg-accent-warning bg-opacity-10 text-ondark', icon: FaClock };
            case 'failed':
            case 'error':
                return { label: 'Failed', color: 'bg-accent-danger bg-opacity-10 text-ondark', icon: FaTimesCircle };
            case 'refunded':
                return { label: 'Refunded', color: 'bg-accent-sky bg-opacity-10 text-ondark', icon: FaFileInvoiceDollar };
            default:
                return { label: status, color: 'bg-primary text-ondark', icon: FaFileInvoiceDollar };
        }
    };

    const handleExportSingleTransaction = async (transactionId) => {
        try {
            const csvData = await exportTransactionsToCsvAsync(transactionId);
            if (!csvData) {
                throw new Error("Received no data from the server.");
            }
            // Blob (binary large object) used for handling file content in client side
            const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const filename = `transaction_${transactionId}.csv`;
            a.download = filename;
            document.body.appendChild(a);
            a.click();

            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            console.log(`Successfully exported ${filename}`);

        } catch (error) {
            console.error("Export failed:", error);
            toast.error(`Export failed: ${error.message}`);
        }
    };

    // Loading state
    if (loading) {
        return (
            <Layout role="manager">
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted">Loading transaction...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    // Error state
    if (error) {
        return (
            <Layout role="manager">
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <FaFileInvoiceDollar size={64} className="text-accent-danger mx-auto mb-4" />
                        <h2 className="text-heading text-xl font-bold mb-2">Error Loading Transaction</h2>
                        <p className="text-muted mb-4">{error}</p>
                        <button
                            onClick={getTransactionInfo}
                            className="btn-primary"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }

    const badge = statusBadge(transaction.status.toLowerCase());
    const BadgeIcon = badge.icon;
    
    return (
        <Layout role="manager">
            <div className="w-full max-w-full overflow-hidden">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <button
                        onClick={() => navigate('/managerTransactionInfo')}
                        className="flex items-center gap-2 px-3 py-2 text-muted hover:text-heading transition-colors cursor-pointer"
                    >
                        <FaArrowLeft size={16} /> Back to Transactions
                    </button>

                    <div className="flex items-center gap-3">
                        <a
                            href={transaction.receipt || '#'}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-accent-sky bg-opacity-10 text-ondark rounded-lg font-medium hover:bg-opacity-20 transition-colors"
                        >
                            <FaReceipt size={14} /> View Receipt
                        </a>
                    </div>
                </div>

                {/* Top summary card */}
                <div className="bg-card rounded-xl shadow-soft overflow-hidden mb-6">
                    <div className="h-28 bg-gradient-to-r from-primary to-primary-light"></div>
                    <div className="px-8 pb-8 -mt-14">
                        <div className="flex flex-col md:flex-row md:items-end gap-6">
                            <div className="w-28 h-28 rounded-2xl bg-card border-4 border-card shadow-lg flex items-center justify-center text-primary">
                                <FaFileInvoiceDollar size={36} />
                            </div>

                            <div className="flex-1">
                                <h1 className="text-2xl font-bold text-heading mb-1">Transaction Details</h1>
                                <div className="flex flex-wrap gap-3 items-center">
                                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold border-2 ${badge.color}`}>
                                        <BadgeIcon size={14} />
                                          {badge.label}
                                    </span>

                                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-accent-sky bg-opacity-10 text-ondark rounded-full text-sm font-medium">
                                        <FaCalendarAlt size={14} />
                                        {formatDateTime(transaction.paymentTime)}
                                    </span>

                                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-accent-teal bg-opacity-10 text-ondark rounded-full text-sm font-medium">
                                        <FaMoneyCheckAlt size={14} />
                                        {formatCurrency(transaction.amount, transaction.currency)}
                                    </span>
                                </div>

                                <p className="text-muted text-sm mt-2">Transaction ID: <span className="font-medium text-heading">{transaction.id}</span></p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Details grid: split into multiple cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Payment Info */}
                    <div className="bg-main rounded-xl p-6 border border-color">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-primary bg-opacity-10 p-3 rounded-lg">
                                <FaCreditCard className="text-ondark" size={20} />
                            </div>
                            <div>
                                <h3 className="text-heading font-semibold">Payment Info</h3>
                                <p className="text-muted text-sm">Gateway & method</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <InfoItem label="Payment Intent" value={transaction.paymentIntentId} />
                            <InfoItem label="Charge ID" value={transaction.chargeId} />
                            <InfoItem label="Method" value={transaction.paymentMethod + (transaction.cardLast4 ? ` •••• ${transaction.cardLast4}` : '')} />
                            <InfoItem label="Receipt" value={transaction.receipt ? <a href={transaction.receipt} className="text-primary underline" target="_blank" rel="noreferrer">Open receipt</a> : 'N/A'} />
                        </div>
                    </div>

                    {/* Linked Entities */}
                    <div className="bg-main rounded-xl p-6 border border-color">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-accent-sky bg-opacity-10 p-3 rounded-lg">
                                <FaUser className="text-ondark" size={20} />
                            </div>
                            <div>
                                <h3 className="text-heading font-semibold">Linked</h3>
                                <p className="text-muted text-sm">Appointment & people</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <InfoItem label="Appointment ID" value={<button onClick={() => navigate(`/managerViewAppointment/${transaction.appointmentId}`)} className="text-primary underline">{transaction.appointmentId}</button>} />
                            <InfoItem label="Patient" value={`${appointment.patient.firstName} ${appointment.patient.lastName}`} />
                            <InfoItem label="Doctor" value={`Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}`} />
                        </div>
                    </div>

                    {/* Audit & meta */}
                    <div className="bg-main rounded-xl p-6 border border-color">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-accent-teal bg-opacity-10 p-3 rounded-lg">
                                <FaClock className="text-ondark" size={20} />
                            </div>
                            <div>
                                <h3 className="text-heading font-semibold">Audit</h3>
                                <p className="text-muted text-sm">System metadata</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <InfoItem label="Status" value={badge.label} valueColor={badge.color.replace('bg-', 'text-')} />
                            <InfoItem label="Payment Time" value={formatDateTime(transaction.paymentTime)} />
                            {/*<InfoItem label="Recorded At" value={new Date().toLocaleString()} />*/}
                        </div>

                        <div className="mt-6 pt-4 border-t border-color">
                            <button
                                onClick={() => { 
                                    navigator.clipboard?.writeText(transaction.paymentIntentId); 
                                    toast.message('PaymentIntent copied'); 
                                }}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-primary bg-opacity-10 text-ondark rounded-lg font-medium hover:bg-opacity-20 transition-colors cursor-pointer"
                            >
                                Copy PaymentIntent
                            </button>
                        </div>
                    </div>
                </div>

                {/* Raw JSON / admin actions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    <div className="bg-main rounded-xl p-6 border border-color">
                        <h3 className="text-heading font-semibold mb-3">Raw transaction data</h3>
                        <pre className="text-xs bg-card rounded p-3 overflow-auto max-h-48">{JSON.stringify(transaction, null, 2)}</pre>
                    </div>

                    <div className="bg-main rounded-xl p-6 border border-color">
                        <h3 className="text-heading font-semibold mb-3">Admin actions</h3>
                        <p className="text-muted text-sm mb-3">Manager can view and export — refunds must be issued via Stripe dashboard or API (not by editing DB).</p>
                        <div className="flex gap-3">
                            <button onClick={() => navigate('/managerTransactionInfo')} className="px-4 py-2 bg-accent-sky bg-opacity-10 text-ondark rounded-lg hover:cursor-pointer">Back</button>
                            <button onClick={() => handleExportSingleTransaction(transaction.id)} className="px-4 py-2 bg-accent-teal bg-opacity-10 text-ondark rounded-lg cursor-pointer">Export CSV</button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

/* Small InfoItem component */
function InfoItem({ label, value, valueColor = 'text-heading' }) {
    return (
        <div className="flex gap-4">
            <div className="flex-1">
                <p className="text-muted text-xs mb-1">{label}</p>
                <p className={`${valueColor} font-medium break-words`}>{value || 'N/A'}</p>
            </div>
        </div>
    );
}
