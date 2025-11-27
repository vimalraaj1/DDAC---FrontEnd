import '../../../index.css';
import Layout from '../../../components/Layout.jsx';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaFileInvoiceDollar, FaCreditCard, FaMoneyCheckAlt, FaCalendarAlt, FaClock, FaReceipt, FaUser, FaUserMd, FaHospital } from 'react-icons/fa';
import { FaTimesCircle, FaCheckCircle } from 'react-icons/fa';

export default function ViewTransaction() {
    const navigate = useNavigate();
    const { id } = useParams();

    // Replace with API call to fetch transaction by id
    const tx = {
        id: id || 'TX000001',
        paymentIntentId: 'pi_3N8KQhABC123456789',
        chargeId: 'ch_3N8KQhABC987654321',
        amount: 150.00,
        currency: 'MYR',
        status: 'successful', 
        paymentTime: '2025-11-25 10:30:00',
        paymentMethod: 'card',
        cardLast4: '4242',
        appointmentId: 'APT000001',
        receiptUrl: 'https://pay.stripe.com/receipts/xxx'
    };

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
                return { label: 'Successful', color: 'bg-accent-success bg-opacity-10 text-ondark', icon: FaCheckCircle };
            case 'pending':
                return { label: 'Pending', color: 'bg-accent-warning bg-opacity-10 text-ondark', icon: FaClock };
            case 'failed':
                return { label: 'Failed', color: 'bg-accent-danger bg-opacity-10 text-ondark', icon: FaTimesCircle };
            case 'refunded':
                return { label: 'Refunded', color: 'bg-accent-sky bg-opacity-10 text-ondark', icon: FaFileInvoiceDollar };
            default:
                return { label: status, color: 'bg-main text-ondark', icon: FaFileInvoiceDollar };
        }
    };

    const badge = statusBadge(tx.status);
    const BadgeIcon = badge.icon;

    return (
        <Layout role="manager">
            <div className="w-full max-w-full overflow-hidden">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <button
                        onClick={() => navigate('/managerTransactionInfo')}
                        className="flex items-center gap-2 px-3 py-2 text-muted hover:text-heading transition-colors"
                    >
                        <FaArrowLeft size={16} /> Back to Transactions
                    </button>

                    <div className="flex items-center gap-3">
                        <a
                            href={tx.receiptUrl || '#'}
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
                                        {formatDateTime(tx.paymentTime)}
                                    </span>

                                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-accent-teal bg-opacity-10 text-ondark rounded-full text-sm font-medium">
                                        <FaMoneyCheckAlt size={14} />
                                        {formatCurrency(tx.amount, tx.currency)}
                                    </span>
                                </div>

                                <p className="text-muted text-sm mt-2">Transaction ID: <span className="font-medium text-heading">{tx.id}</span></p>
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
                            <InfoItem label="Payment Intent" value={tx.paymentIntentId} />
                            <InfoItem label="Charge ID" value={tx.chargeId} />
                            <InfoItem label="Method" value={tx.paymentMethod + (tx.cardLast4 ? ` •••• ${tx.cardLast4}` : '')} />
                            <InfoItem label="Receipt" value={tx.receiptUrl ? <a href={tx.receiptUrl} className="text-primary underline" target="_blank" rel="noreferrer">Open receipt</a> : 'N/A'} />
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
                            <InfoItem label="Appointment ID" value={<button onClick={() => navigate(`/managerViewAppointment/${tx.appointmentId}`)} className="text-primary underline">{tx.appointmentId}</button>} />
                            <InfoItem label="Patient" value={tx.patientName} />
                            <InfoItem label="Doctor" value={tx.doctorName} />
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
                            <InfoItem label="Payment Time" value={formatDateTime(tx.paymentTime)} />
                            <InfoItem label="Recorded At" value={new Date().toLocaleString()} /> {/* replace with createdAt from API */}
                        </div>

                        <div className="mt-6 pt-4 border-t border-color">
                            <button
                                onClick={() => { 
                                    navigator.clipboard?.writeText(tx.paymentIntentId); 
                                    alert('PaymentIntent copied'); 
                                }}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-primary bg-opacity-10 text-ondark rounded-lg font-medium hover:bg-opacity-20 transition-colors"
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
                        <pre className="text-xs bg-card rounded p-3 overflow-auto max-h-48">{JSON.stringify(tx, null, 2)}</pre>
                    </div>

                    <div className="bg-main rounded-xl p-6 border border-color">
                        <h3 className="text-heading font-semibold mb-3">Admin actions</h3>
                        <p className="text-muted text-sm mb-3">Manager can view and export — refunds must be issued via Stripe dashboard or API (not by editing DB).</p>
                        <div className="flex gap-3">
                            <button onClick={() => navigate('/managerTransactionInfo')} className="px-4 py-2 bg-accent-sky bg-opacity-10 text-ondark rounded-lg">Back</button>
                            <button onClick={() => alert('Export not implemented')} className="px-4 py-2 bg-accent-teal bg-opacity-10 text-ondark rounded-lg">Export JSON</button>
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
