import '../../../index.css';
import Layout from '../../../components/Layout.jsx';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaArrowLeft, FaDownload, FaDollarSign, FaCheckCircle,
    FaClock, FaTimesCircle, FaCalendarAlt, FaCreditCard
} from 'react-icons/fa';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function FinancialReport() {
    const navigate = useNavigate();
    const [dateRange, setDateRange] = useState('month');

    // Mock data for graphs
    const revenueOverTime = [
        { month: 'Jan', revenue: 2500 },
        { month: 'Feb', revenue: 2800 },
        { month: 'Mar', revenue: 3200 },
        { month: 'Apr', revenue: 2900 },
        { month: 'May', revenue: 3500 },
        { month: 'Jun', revenue: 3800 },
    ];

    const paymentStatus = [
        { name: 'Successful', value: 85, color: '#2ECC71' },
        { name: 'Pending', value: 8, color: '#F39C12' },
        { name: 'Failed', value: 5, color: '#E74C3C' },
        { name: 'Refunded', value: 2, color: '#5DADE2' }
    ];

    const paymentMethods = [
        { method: 'Visa', count: 45 },
        { method: 'Mastercard', count: 32 },
        { method: 'Amex', count: 15 },
        { method: 'Others', count: 8 }
    ];

    const handleExportPDF = () => {
        alert('PDF export will be implemented');
        // Implement PDF export logic here
    };

    return (
        <Layout role="manager">
            <div className="w-full max-w-full overflow-hidden">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/managerReports')}
                            className="p-2 hover:bg-main rounded-lg transition-colors"
                        >
                            <FaArrowLeft className="text-muted" size={20} />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-heading">Financial Performance Report</h1>
                            <p className="text-muted mt-1">Revenue analysis and payment statistics</p>
                        </div>
                    </div>

                    <button
                        onClick={handleExportPDF}
                        className="flex items-center gap-2 px-5 py-2.5 bg-accent-danger text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors"
                    >
                        <FaDownload size={16} />
                        <span>Export PDF</span>
                    </button>
                </div>

                {/* Date Range Filter */}
                <div className="mb-6 flex gap-4">
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-primary text-body bg-card"
                    >
                        <option value="week">Last 7 Days</option>
                        <option value="month">Last 30 Days</option>
                        <option value="quarter">Last 3 Months</option>
                        <option value="year">Last Year</option>
                    </select>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-card rounded-xl shadow-soft p-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-accent-success bg-opacity-10 p-3 rounded-lg">
                                <FaDollarSign className="text-ondark" size={24} />
                            </div>
                            <div>
                                <h3 className="text-heading text-2xl font-bold">RM 18,900</h3>
                                <p className="text-muted text-sm">Total Revenue</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card rounded-xl shadow-soft p-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-primary bg-opacity-10 p-3 rounded-lg">
                                <FaCheckCircle className="text-ondark" size={24} />
                            </div>
                            <div>
                                <h3 className="text-heading text-2xl font-bold">100</h3>
                                <p className="text-muted text-sm">Successful</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card rounded-xl shadow-soft p-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-accent-warning bg-opacity-10 p-3 rounded-lg">
                                <FaClock className="text-ondark" size={24} />
                            </div>
                            <div>
                                <h3 className="text-heading text-2xl font-bold">RM 189</h3>
                                <p className="text-muted text-sm">Avg Transaction</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card rounded-xl shadow-soft p-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-accent-sky bg-opacity-10 p-3 rounded-lg">
                                <FaCalendarAlt className="text-ondark" size={24} />
                            </div>
                            <div>
                                <h3 className="text-heading text-2xl font-bold">+12%</h3>
                                <p className="text-muted text-sm">Growth Rate</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Revenue Over Time - Line Chart */}
                    <div className="bg-card rounded-xl shadow-soft p-6">
                        <h3 className="text-heading text-lg font-semibold mb-4 flex items-center gap-2">
                            <FaDollarSign className="text-primary" />
                            <span>Revenue Over Time</span>
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={revenueOverTime}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                                <XAxis dataKey="month" stroke="#7A7A7A" />
                                <YAxis stroke="#7A7A7A" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px' }}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#0A3D62"
                                    strokeWidth={3}
                                    name="Revenue (RM)"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Payment Status Distribution - Pie Chart */}
                    <div className="bg-card rounded-xl shadow-soft p-6">
                        <h3 className="text-heading text-lg font-semibold mb-4 flex items-center gap-2">
                            <FaCheckCircle className="text-accent-success" />
                            <span>Payment Status Distribution</span>
                        </h3>
                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie
                                    data={paymentStatus}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {paymentStatus.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Payment Methods - Bar Chart */}
                    <div className="bg-card rounded-xl shadow-soft p-6 lg:col-span-2">
                        <h3 className="text-heading text-lg font-semibold mb-4 flex items-center gap-2">
                            <FaCreditCard className="text-accent-sky" />
                            <span>Payment Methods Distribution</span>
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={paymentMethods}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                                <XAxis dataKey="method" stroke="#7A7A7A" />
                                <YAxis stroke="#7A7A7A" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px' }}
                                />
                                <Legend />
                                <Bar dataKey="count" fill="#0A3D62" name="Transactions" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Detailed Table (Optional) */}
                <div className="bg-card rounded-xl shadow-soft p-6">
                    <h3 className="text-heading text-lg font-semibold mb-4">Summary Details</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-main border-b border-color">
                            <tr>
                                <th className="text-left py-3 px-4 text-heading font-semibold text-sm">Metric</th>
                                <th className="text-right py-3 px-4 text-heading font-semibold text-sm">Value</th>
                                <th className="text-right py-3 px-4 text-heading font-semibold text-sm">Change</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr className="border-b border-color">
                                <td className="py-3 px-4 text-body">Total Transactions</td>
                                <td className="py-3 px-4 text-heading font-semibold text-right">100</td>
                                <td className="py-3 px-4 text-accent-success font-semibold text-right">+8%</td>
                            </tr>
                            <tr className="border-b border-color">
                                <td className="py-3 px-4 text-body">Average Transaction</td>
                                <td className="py-3 px-4 text-heading font-semibold text-right">RM 189.00</td>
                                <td className="py-3 px-4 text-accent-success font-semibold text-right">+3%</td>
                            </tr>
                            <tr className="border-b border-color">
                                <td className="py-3 px-4 text-body">Success Rate</td>
                                <td className="py-3 px-4 text-heading font-semibold text-right">85%</td>
                                <td className="py-3 px-4 text-accent-success font-semibold text-right">+2%</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Layout>
    );
}