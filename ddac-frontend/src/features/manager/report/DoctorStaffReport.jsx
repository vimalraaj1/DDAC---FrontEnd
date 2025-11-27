import '../../../index.css';
import Layout from '../../../components/Layout.jsx';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaArrowLeft, FaDownload, FaUserMd, FaUserTie,
    FaStar, FaCalendarCheck, FaClock, FaTrophy
} from 'react-icons/fa';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function DoctorStaffReport() {
    const navigate = useNavigate();
    const [dateRange, setDateRange] = useState('month');
    const [viewType, setViewType] = useState('doctors');

    // Mock data for doctors
    const topDoctors = [
        { name: 'Dr. Sarah Wilson', appointments: 52, rating: 4.9, specialization: 'Cardiology' },
        { name: 'Dr. Emily Rodriguez', appointments: 48, rating: 4.8, specialization: 'Pediatrics' },
        { name: 'Dr. Ahmed Hassan', appointments: 45, rating: 4.7, specialization: 'Cardiology' },
        { name: 'Dr. Michael Chen', appointments: 42, rating: 4.8, specialization: 'Neurology' },
        { name: 'Dr. James Kumar', appointments: 38, rating: 4.6, specialization: 'Orthopedics' }
    ];

    const doctorWorkload = [
        { name: 'Dr. Sarah W.', appointments: 52 },
        { name: 'Dr. Emily R.', appointments: 48 },
        { name: 'Dr. Ahmed H.', appointments: 45 },
        { name: 'Dr. Michael C.', appointments: 42 },
        { name: 'Dr. James K.', appointments: 38 },
        { name: 'Dr. Lisa T.', appointments: 35 }
    ];

    const specializationDistribution = [
        { name: 'Cardiology', value: 28, color: '#E74C3C' },
        { name: 'Neurology', value: 18, color: '#5DADE2' },
        { name: 'Pediatrics', value: 22, color: '#F39C12' },
        { name: 'Orthopedics', value: 16, color: '#2ECC71' },
        { name: 'Dermatology', value: 10, color: '#9B59B6' },
        { name: 'Others', value: 6, color: '#95A5A6' }
    ];

    // Mock data for staff
    const topStaff = [
        { name: 'Alice Johnson', role: 'Nurse', appointments: 68, rating: 4.9 },
        { name: 'Emma Wilson', role: 'Nurse', appointments: 62, rating: 4.8 },
        { name: 'Bob Martinez', role: 'Receptionist', appointments: 45, rating: 4.7 },
        { name: 'Carol Lee', role: 'Lab Technician', appointments: 42, rating: 4.6 },
        { name: 'David Kim', role: 'Pharmacist', appointments: 38, rating: 4.8 }
    ];

    const staffByRole = [
        { role: 'Nurses', count: 15, appointments: 180 },
        { role: 'Receptionists', count: 8, appointments: 95 },
        { role: 'Lab Technicians', count: 6, appointments: 68 },
        { role: 'Pharmacists', count: 5, appointments: 52 },
        { role: 'Others', count: 10, appointments: 85 }
    ];

    const handleExportPDF = () => {
        alert('PDF export will be implemented');
        // Implement PDF export logic here
    };

    const renderStars = (rating) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                        key={star}
                        className={star <= Math.floor(rating) ? "text-accent-warning" : "text-muted opacity-30"}
                        size={14}
                    />
                ))}
                <span className="ml-1 text-sm text-body">{rating}</span>
            </div>
        );
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
                            <h1 className="text-3xl font-bold text-heading">Doctor & Staff Activity Report</h1>
                            <p className="text-muted mt-1">Performance metrics, workload distribution, and top performers</p>
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

                {/* Filters */}
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

                    <select
                        value={viewType}
                        onChange={(e) => setViewType(e.target.value)}
                        className="px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-primary text-body bg-card"
                    >
                        <option value="doctors">Doctors</option>
                        <option value="staff">Staff</option>
                    </select>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-card rounded-xl shadow-soft p-6">
                        <div className="flex items-center gap-4">
                            <div className={`${viewType === 'doctors' ? 'bg-accent-success' : 'bg-accent-sky'} bg-opacity-10 p-3 rounded-lg`}>
                                {viewType === 'doctors' ? <FaUserMd className="text-ondark" size={24} /> : <FaUserTie className="text-ondark" size={24} />}
                            </div>
                            <div>
                                <h3 className="text-heading text-2xl font-bold">{viewType === 'doctors' ? '42' : '44'}</h3>
                                <p className="text-muted text-sm">{viewType === 'doctors' ? 'Active Doctors' : 'Active Staff'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card rounded-xl shadow-soft p-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-primary bg-opacity-10 p-3 rounded-lg">
                                <FaCalendarCheck className="text-ondark" size={24} />
                            </div>
                            <div>
                                <h3 className="text-heading text-2xl font-bold">{viewType === 'doctors' ? '18' : '22'}</h3>
                                <p className="text-muted text-sm">Avg Appointments</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card rounded-xl shadow-soft p-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-accent-warning bg-opacity-10 p-3 rounded-lg">
                                <FaStar className="text-ondark" size={24} />
                            </div>
                            <div>
                                <h3 className="text-heading text-2xl font-bold">4.8</h3>
                                <p className="text-muted text-sm">Avg Rating</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card rounded-xl shadow-soft p-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-accent-danger bg-opacity-10 p-3 rounded-lg">
                                <FaTrophy className="text-ondark" size={24} />
                            </div>
                            <div>
                                <h3 className="text-heading text-2xl font-bold">{viewType === 'doctors' ? '52' : '68'}</h3>
                                <p className="text-muted text-sm">Top Performer</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Grid */}
                {viewType === 'doctors' ? (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                            {/* Doctor Workload - Bar Chart */}
                            <div className="bg-card rounded-xl shadow-soft p-6">
                                <h3 className="text-heading text-lg font-semibold mb-4 flex items-center gap-2">
                                    <FaUserMd className="text-accent-success" />
                                    <span>Workload Distribution</span>
                                </h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={doctorWorkload}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                                        <XAxis dataKey="name" stroke="#7A7A7A" angle={-45} textAnchor="end" height={100} />
                                        <YAxis stroke="#7A7A7A" />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px' }}
                                        />
                                        <Legend />
                                        <Bar dataKey="appointments" fill="#2ECC71" name="Appointments" radius={[8, 8, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Specialization Distribution - Pie Chart */}
                            <div className="bg-card rounded-xl shadow-soft p-6">
                                <h3 className="text-heading text-lg font-semibold mb-4 flex items-center gap-2">
                                    <FaUserMd className="text-primary" />
                                    <span>By Specialization</span>
                                </h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={specializationDistribution}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {specializationDistribution.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Top Performing Doctors Table */}
                        <div className="bg-card rounded-xl shadow-soft p-6">
                            <h3 className="text-heading text-lg font-semibold mb-4 flex items-center gap-2">
                                <FaTrophy className="text-accent-warning" />
                                <span>Top Performing Doctors</span>
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-main border-b border-color">
                                    <tr>
                                        <th className="text-left py-3 px-4 text-heading font-semibold text-sm">Rank</th>
                                        <th className="text-left py-3 px-4 text-heading font-semibold text-sm">Doctor Name</th>
                                        <th className="text-left py-3 px-4 text-heading font-semibold text-sm">Specialization</th>
                                        <th className="text-center py-3 px-4 text-heading font-semibold text-sm">Appointments</th>
                                        <th className="text-center py-3 px-4 text-heading font-semibold text-sm">Rating</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {topDoctors.map((doctor, index) => (
                                        <tr key={index} className="border-b border-color hover:bg-main transition-colors">
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-2">
                                                    {index === 0 && <FaTrophy className="text-accent-warning" size={18} />}
                                                    <span className="text-heading font-bold">{index + 1}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-body font-medium">{doctor.name}</td>
                                            <td className="py-3 px-4 text-body">{doctor.specialization}</td>
                                            <td className="py-3 px-4 text-center">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full bg-accent-success bg-opacity-10 text-body font-semibold">
                                                    {doctor.appointments}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                {renderStars(doctor.rating)}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                            {/* Staff by Role - Bar Chart */}
                            <div className="bg-card rounded-xl shadow-soft p-6 lg:col-span-2">
                                <h3 className="text-heading text-lg font-semibold mb-4 flex items-center gap-2">
                                    <FaUserTie className="text-accent-sky" />
                                    <span>Staff Distribution by Role</span>
                                </h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={staffByRole}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                                        <XAxis dataKey="role" stroke="#7A7A7A" />
                                        <YAxis stroke="#7A7A7A" />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px' }}
                                        />
                                        <Legend />
                                        <Bar dataKey="count" fill="#5DADE2" name="Staff Count" radius={[8, 8, 0, 0]} />
                                        <Bar dataKey="appointments" fill="#0A3D62" name="Appointments Handled" radius={[8, 8, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Top Performing Staff Table */}
                        <div className="bg-card rounded-xl shadow-soft p-6">
                            <h3 className="text-heading text-lg font-semibold mb-4 flex items-center gap-2">
                                <FaTrophy className="text-accent-warning" />
                                <span>Top Performing Staff</span>
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-main border-b border-color">
                                    <tr>
                                        <th className="text-left py-3 px-4 text-heading font-semibold text-sm">Rank</th>
                                        <th className="text-left py-3 px-4 text-heading font-semibold text-sm">Staff Name</th>
                                        <th className="text-left py-3 px-4 text-heading font-semibold text-sm">Role</th>
                                        <th className="text-center py-3 px-4 text-heading font-semibold text-sm">Appointments</th>
                                        <th className="text-center py-3 px-4 text-heading font-semibold text-sm">Rating</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {topStaff.map((staff, index) => (
                                        <tr key={index} className="border-b border-color hover:bg-main transition-colors">
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-2">
                                                    {index === 0 && <FaTrophy className="text-accent-warning" size={18} />}
                                                    <span className="text-heading font-bold">{index + 1}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-body font-medium">{staff.name}</td>
                                            <td className="py-3 px-4 text-body">{staff.role}</td>
                                            <td className="py-3 px-4 text-center">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full bg-accent-sky bg-opacity-10 text-body font-semibold">
                                                    {staff.appointments}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                {renderStars(staff.rating)}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </Layout>
    );
}