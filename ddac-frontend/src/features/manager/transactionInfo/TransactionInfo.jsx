import '../../../index.css';
import Layout from '../../../components/Layout.jsx';
import { useState } from 'react';
import { FaSearch, FaEye, FaDollarSign, FaCheckCircle, FaClock, FaTimesCircle, FaFileExport, FaCreditCard, FaCalendarAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function TransactionInfo() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterDate, setFilterDate] = useState('all');
    const navigate = useNavigate();

    // Sample transaction data (replace with API call later)
    const transactions = [
        {
            id: 'TX000001',
            paymentIntentId: 'pi_3N8KQhABC123456789',
            chargeId: 'ch_3N8KQhABC987654321',
            amount: 150.00,
            currency: 'MYR',
            status: 'successful',
            paymentTime: '2025-11-25 10:30:00',
            paymentMethod: 'card',
            cardLast4: '4242',
            appointmentId: 'APT000001',
            patientName: 'Ahmad Ibrahim',
            doctorName: 'Dr. Sarah Wilson'
        },
        {
            id: 'TX000002',
            paymentIntentId: 'pi_3N8KRiABC123456790',
            chargeId: 'ch_3N8KRiABC987654322',
            amount: 200.00,
            currency: 'MYR',
            status: 'successful',
            paymentTime: '2025-11-24 14:15:00',
            paymentMethod: 'e-Wallet',
            cardLast4: '',
            appointmentId: 'APT000002',
            patientName: 'Siti Abdullah',
            doctorName: 'Dr. Michael Chen'
        },
        {
            id: 'TX000003',
            paymentIntentId: 'pi_3N8KSjABC123456791',
            chargeId: 'ch_3N8KSjABC987654323',
            amount: 175.50,
            currency: 'MYR',
            status: 'pending',
            paymentTime: '2025-11-23 09:45:00',
            paymentMethod: 'card',
            cardLast4: '5678',
            appointmentId: 'APT000003',
            patientName: 'Raj Kumar',
            doctorName: 'Dr. Emily Rodriguez'
        },
        {
            id: 'TX000004',
            paymentIntentId: 'pi_3N8KTkABC123456792',
            chargeId: 'ch_3N8KTkABC987654324',
            amount: 300.00,
            currency: 'MYR',
            status: 'failed',
            paymentTime: '2025-11-22 16:20:00',
            paymentMethod: 'card',
            cardLast4: '9012',
            appointmentId: 'APT000004',
            patientName: 'Mei Wong',
            doctorName: 'Dr. James Kumar'
        },
        {
            id: 'TX000005',
            paymentIntentId: 'pi_3N8KUlABC123456793',
            chargeId: 'ch_3N8KUlABC987654325',
            amount: 225.00,
            currency: 'MYR',
            status: 'refunded',
            paymentTime: '2025-11-21 11:00:00',
            paymentMethod: 'card',
            cardLast4: '3456',
            appointmentId: 'APT000005',
            patientName: 'Hassan Ali',
            doctorName: 'Dr. Lisa Thompson'
        },
        {
            id: 'TX000006',
            paymentIntentId: 'pi_3N8KVmABC123456794',
            chargeId: 'ch_3N8KVmABC987654326',
            amount: 180.00,
            currency: 'MYR',
            status: 'successful',
            paymentTime: '2025-11-20 13:30:00',
            paymentMethod: 'card',
            cardLast4: '7890',
            appointmentId: 'APT000006',
            patientName: 'Lakshmi Devi',
            doctorName: 'Dr. Sarah Wilson'
        }
    ];

    // Status configuration
    const statusConfig = {
        successful: {
            label: 'Successful',
            color: 'bg-accent-success bg-opacity-10 text-ondark',
            icon: FaCheckCircle
        },
        pending: {
            label: 'Pending',
            color: 'bg-accent-warning bg-opacity-10 text-ondark',
            icon: FaClock
        },
        failed: {
            label: 'Failed',
            color: 'bg-accent-danger bg-opacity-10 text-ondark',
            icon: FaTimesCircle
        },
        refunded: {
            label: 'Refunded',
            color: 'bg-accent-sky bg-opacity-10 text-ondark',
            icon: FaDollarSign
        }
    };

    // Get unique statuses for filter
    const statuses = [...new Set(transactions.map(tx => tx.status))];

    // Calculate statistics
    const totalAmount = transactions.reduce((sum, tx) =>
        tx.status === 'successful' ? sum + tx.amount : sum, 0
    );
    const successfulCount = transactions.filter(tx => tx.status === 'successful').length;
    const pendingCount = transactions.filter(tx => tx.status === 'pending').length;
    const failedCount = transactions.filter(tx => tx.status === 'failed').length;

    // Filter transactions
    const filteredTransactions = transactions.filter(transaction => {
        const matchesSearch =
            transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.appointmentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.cardLast4.includes(searchTerm);

        const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;

        // Date filter logic (you can customize this)
        let matchesDate = true;
        if (filterDate !== 'all') {
            const txDate = new Date(transaction.paymentTime);
            const today = new Date();

            if (filterDate === 'today') {
                matchesDate = txDate.toDateString() === today.toDateString();
            } else if (filterDate === 'week') {
                const weekAgo = new Date(today.setDate(today.getDate() - 7));
                matchesDate = txDate >= weekAgo;
            } else if (filterDate === 'month') {
                const monthAgo = new Date(today.setMonth(today.getMonth() - 1));
                matchesDate = txDate >= monthAgo;
            }
        }

        return matchesSearch && matchesStatus && matchesDate;
    });

    const handleView = (id) => {
        console.log('View transaction:', id);
        navigate(`/managerViewTransaction/${id}`);
    };

    const handleExport = async () => {
        try {
            const response = await fetch("https://your-backend-url/api/transactions/export?format=csv", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (!response.ok) {
                throw new Error("Failed to export file");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "transactions.csv";
            a.click();
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error(error);
            alert("Failed to export. Please try again.");
        }
    };

    // Format currency
    const formatCurrency = (amount, currency) => {
        return `${currency} ${amount.toFixed(2)}`;
    };

    // Format date/time
    const formatDateTime = (dateTime) => {
        const date = new Date(dateTime);
        return date.toLocaleString('en-MY', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <Layout role="manager">
            <div className="w-full max-w-full overflow-hidden">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-heading">Transaction Information</h1>
                    <p className="text-muted mt-1">Manage and view all payment transactions</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-card rounded-xl shadow-soft p-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-primary bg-opacity-10 p-3 rounded-lg">
                                <FaDollarSign size={24} className="text-ondark" />
                            </div>
                            <div>
                                <h3 className="text-heading text-2xl font-bold">
                                    RM {totalAmount.toFixed(2)}
                                </h3>
                                <p className="text-muted text-sm">Total Revenue</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card rounded-xl shadow-soft p-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-accent-success bg-opacity-10 p-3 rounded-lg">
                                <FaCheckCircle size={24} className="text-ondark" />
                            </div>
                            <div>
                                <h3 className="text-heading text-2xl font-bold">{successfulCount}</h3>
                                <p className="text-muted text-sm">Successful</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card rounded-xl shadow-soft p-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-accent-warning bg-opacity-10 p-3 rounded-lg">
                                <FaClock size={24} className="text-ondark" />
                            </div>
                            <div>
                                <h3 className="text-heading text-2xl font-bold">{pendingCount}</h3>
                                <p className="text-muted text-sm">Pending</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card rounded-xl shadow-soft p-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-accent-danger bg-opacity-10 p-3 rounded-lg">
                                <FaTimesCircle size={24} className="text-ondark" />
                            </div>
                            <div>
                                <h3 className="text-heading text-2xl font-bold">{failedCount}</h3>
                                <p className="text-muted text-sm">Failed</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="bg-card rounded-xl shadow-soft p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        {/* Search */}
                        <div className="flex-1 min-w-0">
                            <div className="relative">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search by ID, patient name, appointment, or card..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-input rounded-lg
                                             focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                                             text-body placeholder-muted"
                                />
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="flex gap-4 flex-shrink-0">
                            {/* Status Filter */}
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-4 py-2 border border-input rounded-lg
                                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                                         text-body bg-card"
                            >
                                <option value="all">All Status</option>
                                {statuses.map(status => (
                                    <option key={status} value={status}>
                                        {statusConfig[status]?.label || status}
                                    </option>
                                ))}
                            </select>

                            {/* Date Filter */}
                            <select
                                value={filterDate}
                                onChange={(e) => setFilterDate(e.target.value)}
                                className="px-4 py-2 border border-input rounded-lg
                                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                                         text-body bg-card"
                            >
                                <option value="all">All Time</option>
                                <option value="today">Today</option>
                                <option value="week">Last 7 Days</option>
                                <option value="month">Last 30 Days</option>
                            </select>

                            {/* Export Button */}
                            <button
                                onClick={handleExport}
                                className="flex items-center gap-2 px-4 py-2 bg-accent-sky bg-opacity-10 text-primary rounded-lg font-medium hover:bg-opacity-20 transition-colors whitespace-nowrap"
                            >
                                <FaFileExport size={16} />
                                <span>Export</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Transactions Table */}
                <div className="bg-card rounded-xl shadow-soft overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-full table-fixed">
                            <thead className="bg-primary border-b border-color">
                            <tr>
                                <th className="text-left py-4 px-6 text-ondark font-semibold text-sm break-all">
                                    Transaction ID
                                </th>
                                <th className="text-left py-4 px-6 text-ondark font-semibold text-sm break-all">
                                    Date & Time
                                </th>
                                <th className="text-left py-4 px-6 text-ondark font-semibold text-sm break-all">
                                    Amount
                                </th>
                                <th className="text-left py-4 px-6 text-ondark font-semibold text-sm hidden md:table-cell break-all">
                                    Patient
                                </th>
                                <th className="text-left py-4 px-6 text-ondark font-semibold text-sm break-all">
                                    Payment Method
                                </th>
                                <th className="text-left py-4 px-6 text-ondark font-semibold text-sm break-all">
                                    Status
                                </th>
                                <th className="text-center py-4 px-6 text-ondark font-semibold text-sm break-all">
                                    Actions
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredTransactions.length > 0 ? (
                                filteredTransactions.map((transaction, index) => {
                                    const statusInfo = statusConfig[transaction.status];
                                    const StatusIcon = statusInfo?.icon;

                                    return (
                                        <tr
                                            key={transaction.id}
                                            className={`hover:bg-main border-t border-color transition-colors ${
                                                index % 2 === 0 ? '' : 'bg-main bg-opacity-30'
                                            }`}
                                        >
                                            <td className="py-4 px-6">
                                                <div className="flex flex-col">
                                                    <p className="text-heading font-semibold text-sm">{transaction.id}</p>
                                                    <p className="text-muted text-xs">{transaction.appointmentId}</p>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-body text-sm">
                                                        {formatDateTime(transaction.paymentTime)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <p className="text-heading font-bold text-sm break-all">
                                                    {formatCurrency(transaction.amount, transaction.currency)}
                                                </p>
                                            </td>
                                            <td className="py-4 px-6 hidden md:table-cell">
                                                <p className="text-body text-sm break-all">{transaction.patientName}</p>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex flex-col">
                                                    <p className="text-body text-sm">{transaction.paymentMethod}</p>
                                                    {transaction.paymentMethod === 'card' ? (
                                                    <p className="text-body text-sm">
                                                        •••• {transaction.cardLast4}
                                                    </p>
                                                        ) : null}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
                                                    statusInfo?.color || 'bg-main text-body'
                                                }`}>
                                                    {StatusIcon && <StatusIcon size={12} />}
                                                    {statusInfo?.label || transaction.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center justify-center overflow-x-hidden lg:overflow-x-visible">
                                                    <button
                                                        onClick={() => handleView(transaction.id)}
                                                        className="p-2 hover:bg-accent-sky hover:bg-opacity-10 rounded-lg
                                                                 text-accent-sky transition-colors"
                                                        title="View Details"
                                                    >
                                                        <FaEye size={22} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="7" className="py-12 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <FaDollarSign size={48} className="text-muted opacity-50" />
                                            <p className="text-muted text-lg">No transactions found</p>
                                            <p className="text-muted text-sm">Try adjusting your search or filter</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                <div className="mt-6 flex items-center justify-between">
                    <p className="text-muted text-sm">
                        Showing <span className="font-semibold text-heading">{filteredTransactions.length}</span> of{' '}
                        <span className="font-semibold text-heading">{transactions.length}</span> transactions
                    </p>
                </div>
            </div>
        </Layout>
    );
}