import '../../../index.css';
import Layout from '../../../components/Layout.jsx';
import { useState } from 'react';
import { FaSearch, FaEdit, FaTrash, FaEye, FaCalendarCheck, FaCalendarAlt, FaClock, FaUserMd, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import {FaRegCalendarXmark} from "react-icons/fa6";

export default function AppointmentInfo() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const navigate = useNavigate();

    // Sample appointment data (replace with API call later)
    const appointments = [
        {
            id: 'APT000001',
            date: '2024-11-25',
            time: '09:00',
            status: 'scheduled',
            patientId: 'PT000001',
            patientName: 'Ahmad Ibrahim',
            doctorId: 'DR000001',
            doctorName: 'Dr. Sarah Wilson',
            staffId: 'ST000001',
            purpose: 'General Checkup',
            cancellationReason: ''
        },
        {
            id: 'APT000002',
            date: '2024-11-25',
            time: '10:30',
            status: 'completed',
            patientId: 'PT000002',
            patientName: 'Siti Abdullah',
            doctorId: 'DR000002',
            doctorName: 'Dr. Michael Chen',
            staffId: 'ST000002',
            purpose: 'Follow-up Consultation',
            cancellationReason: ''
        },
        {
            id: 'APT000003',
            date: '2024-11-26',
            time: '14:00',
            status: 'scheduled',
            patientId: 'PT000003',
            patientName: 'Raj Kumar',
            doctorId: 'DR000001',
            doctorName: 'Dr. Sarah Wilson',
            staffId: 'ST000001',
            purpose: 'Cardiac Screening',
            cancellationReason: ''
        },
        {
            id: 'APT000004',
            date: '2024-11-26',
            time: '15:30',
            status: 'cancelled',
            patientId: 'PT000004',
            patientName: 'Mei Wong',
            doctorId: 'DR000003',
            doctorName: 'Dr. Emily Rodriguez',
            staffId: 'ST000003',
            purpose: 'Pediatric Consultation',
            cancellationReason: 'Patient requested reschedule'
        },
        {
            id: 'APT000005',
            date: '2024-11-27',
            time: '11:00',
            status: 'scheduled',
            patientId: 'PT000005',
            patientName: 'Hassan Ali',
            doctorId: 'DR000004',
            doctorName: 'Dr. James Kumar',
            staffId: 'ST000004',
            purpose: 'Orthopedic Evaluation',
            cancellationReason: ''
        },
        {
            id: 'APT000006',
            date: '2024-11-27',
            time: '16:00',
            status: 'no-show',
            patientId: 'PT000006',
            patientName: 'Lakshmi Devi',
            doctorId: 'DR000005',
            doctorName: 'Dr. Lisa Thompson',
            staffId: 'ST000005',
            purpose: 'Dermatology Consultation',
            cancellationReason: ''
        }
    ];

    // Get unique statuses for filter
    const statuses = [...new Set(appointments.map(apt => apt.status))];

    // Format date for display
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-MY', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Format time for display
    const formatTime = (timeStr) => {
        const [hours, minutes] = timeStr.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    // Filter appointments
    const filteredAppointments = appointments.filter(appointment => {
        const matchesSearch =
            appointment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            appointment.purpose.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || appointment.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    // Get status badge color
    const getStatusColor = (status) => {
        switch(status) {
            case 'scheduled':
                return 'bg-accent-sky bg-opacity-10 text-body';
            case 'completed':
                return 'bg-accent-success bg-opacity-10 text-body';
            case 'cancelled':
                return 'bg-accent-danger bg-opacity-10 text-body';
            case 'no-show':
                return 'bg-accent-warning bg-opacity-10 text-body';
            default:
                return 'bg-primary bg-opacity-10 text-body';
        }
    };

    // Format status text
    const formatStatus = (status) => {
        return status.split('-').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };

    const handleView = (id) => {
        console.log('View appointment:', id);
        navigate(`/managerViewAppointment/${id}`);
    };

    const handleEdit = (id) => {
        console.log('Edit appointment:', id);
        navigate(`/managerEditAppointment/${id}`);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this appointment?')) {
            console.log('Delete appointment:', id);
            // Call delete API
        }
    };

    return (
        <Layout role="manager">
            <div className="w-full max-w-full overflow-hidden">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-heading">Appointment Information</h1>
                    <p className="text-muted mt-1">Manage and view all appointment records</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-card rounded-xl shadow-soft p-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-primary bg-opacity-10 p-3 rounded-lg">
                                <FaCalendarCheck size={24} className="text-ondark" />
                            </div>
                            <div>
                                <h3 className="text-heading text-2xl font-bold">{appointments.length}</h3>
                                <p className="text-muted text-sm">Total Appointments</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card rounded-xl shadow-soft p-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-accent-sky bg-opacity-10 p-3 rounded-lg">
                                <FaCalendarAlt size={24} className="text-ondark" />
                            </div>
                            <div>
                                <h3 className="text-heading text-2xl font-bold">
                                    {appointments.filter(a => a.status === 'scheduled').length}
                                </h3>
                                <p className="text-muted text-sm">Scheduled</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card rounded-xl shadow-soft p-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-accent-success bg-opacity-10 p-3 rounded-lg">
                                <FaCalendarCheck size={24} className="text-ondark" />
                            </div>
                            <div>
                                <h3 className="text-heading text-2xl font-bold">
                                    {appointments.filter(a => a.status === 'completed').length}
                                </h3>
                                <p className="text-muted text-sm">Completed</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card rounded-xl shadow-soft p-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-accent-danger bg-opacity-10 p-3 rounded-lg">
                                <FaRegCalendarXmark size={24} className="text-ondark" />
                            </div>
                            <div>
                                <h3 className="text-heading text-2xl font-bold">
                                    {appointments.filter(a => a.status === 'cancelled').length}
                                </h3>
                                <p className="text-muted text-sm">Cancelled</p>
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
                                    placeholder="Search by ID, patient, doctor, or purpose..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-input rounded-lg
                                             focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                                             text-body placeholder-muted"
                                />
                            </div>
                        </div>

                        {/* Filter */}
                        <div className="flex gap-4 flex-shrink-4">
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-4 py-2 border border-input rounded-lg
                                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                                         text-body bg-card"
                            >
                                <option value="all">All Status</option>
                                {statuses.map(status => (
                                    <option key={status} value={status}>{formatStatus(status)}</option>
                                ))}
                            </select>

                            <button
                                className="btn-primary whitespace-nowrap"
                                onClick={() => navigate("/managerAddNewAppointment")}
                            >
                                + Add Appointment
                            </button>
                        </div>
                    </div>
                </div>

                {/* Appointments Table */}
                <div className="bg-card rounded-xl shadow-soft overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-full table-fixed">
                            <thead className="bg-primary border-b border-color">
                            <tr>
                                <th className="text-left py-4 px-6 text-ondark font-semibold text-sm break-all">
                                    Appointment
                                </th>
                                <th className="text-left py-4 px-6 text-ondark font-semibold text-sm break-all">
                                    Date & Time
                                </th>
                                <th className="text-left py-4 px-6 text-ondark font-semibold text-sm hidden md:table-cell break-all">
                                    Patient
                                </th>
                                <th className="text-left py-4 px-6 text-ondark font-semibold text-sm hidden lg:table-cell break-all">
                                    Doctor
                                </th>
                                <th className="text-left py-4 px-6 text-ondark font-semibold text-sm break-all">
                                    Purpose
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
                            {filteredAppointments.length > 0 ? (
                                filteredAppointments.map((appointment, index) => (
                                    <tr
                                        key={appointment.id}
                                        className={`hover:bg-main border-t border-color transition-colors ${
                                            index % 2 === 0 ? '' : 'bg-main bg-opacity-30'
                                        }`}
                                    >
                                        <td className="py-4 px-4 md:px-6 align-top">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="w-8 h-8 rounded-full bg-primary text-ondark flex items-center justify-center font-semibold text-xs flex-shrink-0">
                                                    <FaCalendarAlt size={14} />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-heading text-sm font-bold break-all">{appointment.id}</p>
                                                    <p className="text-muted text-xs break-all">{appointment.staffId}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div>
                                                <p className="text-heading font-semibold text-sm flex items-center gap-1">
                                                    {/*<FaCalendarAlt className="text-muted" size={12} />*/}
                                                    {formatDate(appointment.date)}
                                                </p>
                                                <p className="text-muted text-xs flex items-center gap-1 mt-1">
                                                    {/*<FaClock className="text-muted" size={12} />*/}
                                                    {formatTime(appointment.time)}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 hidden md:table-cell">
                                            <div>
                                                <p className="text-heading font-medium text-sm flex items-center gap-1">
                                                    {/*<FaUser className="text-muted" size={12} />*/}
                                                    {appointment.patientName}
                                                </p>
                                                <p className="text-muted text-xs">{appointment.patientId}</p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 hidden lg:table-cell">
                                            <div>
                                                <p className="text-heading font-medium text-sm flex items-center gap-1">
                                                    {/*<FaUserMd className="text-muted" size={12} />*/}
                                                    {appointment.doctorName}
                                                </p>
                                                <p className="text-muted text-xs">{appointment.doctorId}</p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <p className="text-body text-sm">{appointment.purpose}</p>
                                        </td>
                                        <td className="py-4 px-6">
                                                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusColor(appointment.status)}`}>
                                                    {formatStatus(appointment.status)}
                                                </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center justify-center gap-2 overflow-x-hidden lg:overflow-x-visible">
                                                <button
                                                    onClick={() => handleView(appointment.id)}
                                                    className="p-2 hover:bg-accent-sky hover:bg-opacity-10 rounded-lg
                                                                 text-accent-sky transition-colors"
                                                    title="View Details"
                                                >
                                                    <FaEye size={22} />
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(appointment.id)}
                                                    className="p-2 hover:bg-primary hover:bg-opacity-10 rounded-lg
                                                                 text-primary transition-colors"
                                                    title="Edit"
                                                >
                                                    <FaEdit size={22} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(appointment.id)}
                                                    className="p-2 hover:bg-accent-danger hover:bg-opacity-10 rounded-lg
                                                                 text-accent-danger transition-colors"
                                                    title="Delete"
                                                >
                                                    <FaTrash size={22} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="py-12 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <FaCalendarCheck size={48} className="text-muted opacity-50" />
                                            <p className="text-muted text-lg">No appointments found</p>
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
                        Showing <span className="font-semibold text-heading">{filteredAppointments.length}</span> of{' '}
                        <span className="font-semibold text-heading">{appointments.length}</span> appointments
                    </p>
                </div>
            </div>
        </Layout>
    );
}