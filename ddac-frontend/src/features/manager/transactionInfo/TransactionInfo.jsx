import '../../../index.css';
import Layout from '../../../components/Layout.jsx';
import {useEffect, useMemo, useState} from 'react';
import {
    FaSearch, FaEye, FaDollarSign, FaCheckCircle, FaClock, FaTimesCircle, FaFileExport, FaCreditCard, FaCalendarAlt,
    FaFileInvoiceDollar
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import {exportAllTransactionsToCsvAsync, getTransactions} from "../../../services/transactionManagementService.js";
import {GetAppointmentsWithDetails} from "../../../services/appointmentManagementService.js";
import {getPatients} from "../../../services/patientManagementService.js";

export default function TransactionInfo() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterDate, setFilterDate] = useState('all');
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getTransactionsInfo();
    }, [])

    const getTransactionsInfo = async () => {
        try {
            setLoading(true);
            setError(null);

            const [transactionsData, appointmentsData] = await Promise.all([
                getTransactions(),
                GetAppointmentsWithDetails(),
            ]);

            // Basic validation...
            if (!Array.isArray(transactionsData) || !Array.isArray(appointmentsData)) {
                throw new Error('One or more data sources returned an invalid format.');
            }
            setTransactions(transactionsData);
            setAppointments(appointmentsData);
        }
        catch (err) {
            console.error('Error fetching transactions:', err);
            setError(err.message || 'Failed to fetch transactions');
            setTransactions([]);
            setAppointments([]);
        } finally {
            setLoading(false);
        }
    }

    const totalRevenue = useMemo(() => {
        if (!Array.isArray(transactions) || transactions.length === 0) {
            return 0;
        }
        const total = transactions.reduce((accumulator, transaction) => {
            const amount = parseFloat(transaction.amount) || 0;
            return accumulator + amount;
        }, 0);
        return total;
    }, [transactions]);
    
    const transactionWithNames = useMemo(() => {
        if (transactions.length === 0 || appointments.length === 0) {
            return [];
        }
        const appointmentMap = appointments.reduce((map, a) => {
            const patientObj = a.patient;
            if (patientObj) {
                map[a.id] = `${patientObj.firstName} ${patientObj.lastName}`;
            } else {
                map[a.id] = 'N/A (Patient Data Missing)';
            }
            return map;
        }, {});
        return transactions.map(t => {
            const patientName = appointmentMap[t.appointmentId] || 'N/A (Patient Not Found)';
            return {
                ...t,
                patientName: patientName,
            };
        })
    }, [transactions, appointments]);

    // Status configuration
    const statusConfig = {
        successful: {
            label: 'Success',
            color: 'bg-accent-success bg-opacity-10 text-ondark',
            icon: FaCheckCircle
        },
        success: {
            label: 'Success',
            color: 'bg-accent-success bg-opacity-10 text-ondark',
            icon: FaCheckCircle
        },
        succeeded: {
            label: 'Success',
            color: 'bg-accent-success bg-opacity-10 text-ondark',
            icon: FaCheckCircle
        },
        succeed: {
            label: 'Success',
            color: 'bg-accent-success bg-opacity-10 text-ondark',
            icon: FaCheckCircle
        },
        succeede: {
            label: 'Success',
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
        error: {
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

    // Filter transactions
    const filteredTransactions = transactionWithNames.filter(transaction => {
        const idString = String(transaction.id ?? '');
        const patientNameString = String(transaction.patientName ?? '');
        const appointmentIdString = String(transaction.appointmentId ?? '');
        const cardLast4String = transaction.cardLast4?.toLowerCase() ?? '';
        
        const matchesSearch =
            idString.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patientNameString.toLowerCase().includes(searchTerm.toLowerCase()) ||
            appointmentIdString.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cardLast4String.includes(searchTerm);

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

    const handleExportTransaction = async () => {
        try {
            const csvData = await exportAllTransactionsToCsvAsync();
            if (!csvData) {
                throw new Error("Received no data from the server.");
            }
            // Blob (binary large object) used for handling file content in client side
            const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const filename = `all_transaction_${Date.now()}.csv`;
            a.download = filename;
            document.body.appendChild(a);
            a.click();

            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            console.log(`Successfully exported ${filename}`);

        } catch (error) {
            console.error("Export failed:", error);
            alert(`Export failed: ${error.message}`);
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

    // Loading state
    if (loading) {
        return (
            <Layout role="manager">
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted">Loading transactions...</p>
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
                        <h2 className="text-heading text-xl font-bold mb-2">Error Loading Transactions</h2>
                        <p className="text-muted mb-4">{error}</p>
                        <button
                            onClick={getTransactionsInfo}
                            className="btn-primary"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }

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
                                    RM {totalRevenue.toFixed(2)}
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
                                <h3 className="text-heading text-2xl font-bold">{transactions.filter(t => t.status.toLowerCase() === "success").length}</h3>
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
                                <h3 className="text-heading text-2xl font-bold">{transactions.filter(t => t.status.toLowerCase() === "pending").length}</h3>
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
                                <h3 className="text-heading text-2xl font-bold">{transactions.filter(t => t.status.toLowerCase() === "failed").length}</h3>
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
                                onClick={() => handleExportTransaction()}
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
                                    const statusInfo = statusConfig[transaction.status.toLowerCase()];
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