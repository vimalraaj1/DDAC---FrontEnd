import '../../../index.css';
import Layout from '../../../components/Layout.jsx';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaArrowLeft, FaDownload, FaCalendarAlt, FaCheckCircle,
    FaClock, FaTimesCircle, FaUserMd, FaCalendarCheck
} from 'react-icons/fa';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AppointmentReport() {
    const navigate = useNavigate();
    const [dateRange, setDateRange] = useState('month');

    // Mock data for graphs
    const appointmentsOverTime = [
        { month: 'Jan', appointments: 38 },
        { month: 'Feb', appointments: 42 },
        { month: 'Mar', appointments: 45 },
        { month: 'Apr', appointments: 40 },
        { month: 'May', appointments: 48 },
        { month: 'Jun', appointments: 52 },
    ];

    const appointmentStatus = [
        { name: 'Completed', value: 89, color: '#2ECC71' },
        { name: 'Scheduled', value: 7, color: '#5DADE2' },
        { name: 'Cancelled', value: 3, color: '#E74C3C' },
        { name: 'No-Show', value: 1, color: '#F39C12' }
    ];

    const appointmentsBySpecialization = [
        { specialization: 'Cardiology', count: 45 },
        { specialization: 'Neurology', count: 38 },
        { specialization: 'Pediatrics', count: 52 },
        { specialization: 'Orthopedics', count: 41 },
        { specialization: 'Dermatology', count: 35 },
        { specialization: 'Others', count: 37 }
    ];

    const appointmentsByTimeSlot = [
        { time: '8-10 AM', count: 25 },
        { time: '10-12 PM', count: 45 },
        { time: '12-2 PM', count: 30 },
        { time: '2-4 PM', count: 52 },
        { time: '4-6 PM', count: 48 },
        { time: '6-8 PM', count: 28 }
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
                            <h1 className="text-3xl font-bold text-heading">Appointment Overview Report</h1>
                            <p className="text-muted mt-1">Appointment trends, status distribution, and booking patterns</p>
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
                            <div className="bg-primary bg-opacity-10 p-3 rounded-lg">
                                <FaCalendarAlt className="text-ondark" size={24} />
                            </div>
                            <div>
                                <h3 className="text-heading text-2xl font-bold">248</h3>
                                <p className="text-muted text-sm">Total Appointments</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card rounded-xl shadow-soft p-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-accent-success bg-opacity-10 p-3 rounded-lg">
                                <FaCheckCircle className="text-ondark" size={24} />
                            </div>
                            <div>
                                <h3 className="text-heading text-2xl font-bold">221</h3>
                                <p className="text-muted text-sm">Completed</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card rounded-xl shadow-soft p-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-accent-sky bg-opacity-10 p-3 rounded-lg">
                                <FaCalendarCheck className="text-ondark" size={24} />
                            </div>
                            <div>
                                <h3 className="text-heading text-2xl font-bold">18</h3>
                                <p className="text-muted text-sm">Scheduled</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card rounded-xl shadow-soft p-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-accent-warning bg-opacity-10 p-3 rounded-lg">
                                <FaClock className="text-ondark" size={24} />
                            </div>
                            <div>
                                <h3 className="text-heading text-2xl font-bold">89%</h3>
                                <p className="text-muted text-sm">Completion Rate</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Appointments Over Time - Line Chart */}
                    <div className="bg-card rounded-xl shadow-soft p-6">
                        <h3 className="text-heading text-lg font-semibold mb-4 flex items-center gap-2">
                            <FaCalendarAlt className="text-primary" />
                            <span>Appointment Trends</span>
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={appointmentsOverTime}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                                <XAxis dataKey="month" stroke="#7A7A7A" />
                                <YAxis stroke="#7A7A7A" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px' }}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="appointments"
                                    stroke="#0A3D62"
                                    strokeWidth={3}
                                    name="Appointments"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Appointment Status Distribution - Pie Chart */}
                    <div className="bg-card rounded-xl shadow-soft p-6">
                        <h3 className="text-heading text-lg font-semibold mb-4 flex items-center gap-2">
                            <FaCheckCircle className="text-accent-success" />
                            <span>Status Distribution</span>
                        </h3>
                        <ResponsiveContainer width="100%" height={260}>
                            <PieChart>
                                <Pie
                                    data={appointmentStatus}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={75}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {appointmentStatus.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Appointments by Specialization - Bar Chart */}
                    <div className="bg-card rounded-xl shadow-soft p-6">
                        <h3 className="text-heading text-lg font-semibold mb-4 flex items-center gap-2">
                            <FaUserMd className="text-accent-sky" />
                            <span>By Specialization</span>
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={appointmentsBySpecialization}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                                <XAxis dataKey="specialization" stroke="#7A7A7A" angle={-45} textAnchor="end" height={90} />
                                <YAxis stroke="#7A7A7A" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px' }}
                                />
                                <Legend />
                                <Bar dataKey="count" fill="#5DADE2" name="Appointments" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Appointments by Time Slot - Bar Chart */}
                    <div className="bg-card rounded-xl shadow-soft p-6">
                        <h3 className="text-heading text-lg font-semibold mb-4 flex items-center gap-2">
                            <FaClock className="text-accent-warning" />
                            <span>Peak Booking Times</span>
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={appointmentsByTimeSlot}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                                <XAxis dataKey="time" stroke="#7A7A7A" />
                                <YAxis stroke="#7A7A7A" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px' }}
                                />
                                <Legend />
                                <Bar dataKey="count" fill="#F39C12" name="Appointments" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Detailed Table */}
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
                                <td className="py-3 px-4 text-body">Total Appointments</td>
                                <td className="py-3 px-4 text-heading font-semibold text-right">248</td>
                                <td className="py-3 px-4 text-accent-success font-semibold text-right">+12%</td>
                            </tr>
                            <tr className="border-b border-color">
                                <td className="py-3 px-4 text-body">Completion Rate</td>
                                <td className="py-3 px-4 text-heading font-semibold text-right">89%</td>
                                <td className="py-3 px-4 text-accent-success font-semibold text-right">+3%</td>
                            </tr>
                            <tr className="border-b border-color">
                                <td className="py-3 px-4 text-body">Average Daily Appointments</td>
                                <td className="py-3 px-4 text-heading font-semibold text-right">8.3</td>
                                <td className="py-3 px-4 text-accent-success font-semibold text-right">+5%</td>
                            </tr>
                            <tr className="border-b border-color">
                                <td className="py-3 px-4 text-body">No-Show Rate</td>
                                <td className="py-3 px-4 text-heading font-semibold text-right">1%</td>
                                <td className="py-3 px-4 text-accent-danger font-semibold text-right">-2%</td>
                            </tr>
                            <tr className="border-b border-color">
                                <td className="py-3 px-4 text-body">Most Popular Time Slot</td>
                                <td className="py-3 px-4 text-heading font-semibold text-right" colSpan="2">2-4 PM (52 appointments)</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Layout>
    );
}