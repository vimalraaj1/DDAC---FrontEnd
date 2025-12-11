import DoctorSidebar from "../components/DoctorSidebar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOutDialog } from "../../customer/components/LogoutDialog";
import appointmentService from "../appointments/appointmentService";
import patientService from "../patients/patientService";

export default function DoctorAnalytics() {
    const navigate = useNavigate();
    const userName = localStorage.getItem("userName");
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState("7days");
    const [showDropdown, setShowDropdown] = useState(false);
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
    const [analytics, setAnalytics] = useState({
        totalAppointments: 0,
        completedAppointments: 0,
        cancelledAppointments: 0,
        totalPatients: 0,
        appointmentsByDay: [],
        appointmentsByStatus: {},
        recentAppointments: [],
        patientGrowth: []
    });

    useEffect(() => {
        fetchAnalytics();
    }, [timeRange]);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const [appointments, patients] = await Promise.all([
                appointmentService.getDoctorAppointments(),
                patientService.getDoctorPatients()
            ]);

            // Calculate date range
            const now = new Date();
            const daysBack = timeRange === "7days" ? 7 : timeRange === "30days" ? 30 : 90;
            const startDate = new Date(now);
            startDate.setDate(startDate.getDate() - daysBack);

            // Filter appointments by date range (only for trend chart)
            const filteredAppointments = appointments.filter(apt => {
                // Use 'date' field instead of 'appointmentDate'
                const aptDate = new Date(apt.date);
                return !isNaN(aptDate.getTime()) && aptDate >= startDate;
            });

            // Count appointments by status (use ALL appointments, not filtered)
            const statusCounts = appointments.reduce((acc, apt) => {
                acc[apt.status] = (acc[apt.status] || 0) + 1;
                return acc;
            }, {});

            // Group appointments by day for trend chart
            const appointmentsByDay = {};
            filteredAppointments.forEach(apt => {
                // Use 'date' field instead of 'appointmentDate'
                const aptDate = new Date(apt.date);
                if (!isNaN(aptDate.getTime())) {
                    const dateStr = aptDate.toLocaleDateString();
                    appointmentsByDay[dateStr] = (appointmentsByDay[dateStr] || 0) + 1;
                }
            });

            // Get last 7 days for chart
            const last7Days = [];
            for (let i = 6; i >= 0; i--) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                const dateStr = date.toLocaleDateString();
                last7Days.push({
                    label: date.toLocaleDateString('en-US', { weekday: 'short' }),
                    value: appointmentsByDay[dateStr] || 0
                });
            }

            // Calculate top procedures/reasons
            const procedureCounts = {};
            appointments.forEach(apt => {
                const reason = apt.reason || 'General Checkup';
                procedureCounts[reason] = (procedureCounts[reason] || 0) + 1;
            });
            const topProcedures = Object.entries(procedureCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 4);

            // Calculate peak hours
            const hourCounts = {};
            appointments.forEach(apt => {
                if (apt.time) {
                    const hour = parseInt(apt.time.split(':')[0]);
                    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
                }
            });

            // Calculate age distribution
            const calculateAge = (dateOfBirth) => {
                if (!dateOfBirth) return 0;
                const today = new Date();
                const birthDate = new Date(dateOfBirth);
                let age = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();
                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }
                return age;
            };

            const ageGroups = { '0-18': 0, '19-35': 0, '36-55': 0, '56+': 0 };
            patients.forEach(patient => {
                const age = calculateAge(patient.dateOfBirth);
                if (age <= 18) ageGroups['0-18']++;
                else if (age <= 35) ageGroups['19-35']++;
                else if (age <= 55) ageGroups['36-55']++;
                else ageGroups['56+']++;
            });
            const totalPatients = patients.length || 1; // Avoid division by zero
            const ageDistribution = Object.entries(ageGroups).map(([range, count]) => ({
                range,
                count,
                percentage: Math.round((count / totalPatients) * 100)
            }));

            setAnalytics({
                totalAppointments: appointments.length,
                completedAppointments: statusCounts['Completed'] || 0,
                cancelledAppointments: statusCounts['Cancelled'] || 0,
                approvedAppointments: statusCounts['Approved'] || 0,
                totalPatients: patients.length,
                appointmentsByDay: last7Days,
                appointmentsByStatus: statusCounts,
                recentAppointments: appointments.slice(0, 5),
                topProcedures,
                hourCounts,
                ageDistribution
            });
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };
    

    const confirmedLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("id");
        localStorage.removeItem("userName");
        localStorage.removeItem("role");
        navigate("/login");
    };

    if (loading) {
        return (
            <div className="flex min-h-screen bg-gray-50">
                <DoctorSidebar />
                <div className="flex-1">
                    <div className="flex items-center justify-center h-screen">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading analytics...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    // Calculate metrics from analytics data
    const completionRate = analytics.totalAppointments > 0 
        ? Math.round((analytics.completedAppointments / analytics.totalAppointments) * 100) 
        : 0;

    const cancellationRate = analytics.totalAppointments > 0
        ? Math.round((analytics.cancelledAppointments / analytics.totalAppointments) * 100)
        : 0;

    const recentMetrics = [
        { 
            label: "Total Appointments", 
            value: analytics.totalAppointments, 
            change: `${analytics.completedAppointments} Completed`, 
            positive: true 
        },
        { 
            label: "Total Patients", 
            value: analytics.totalPatients, 
            change: "Active patients", 
            positive: true 
        },
        { 
            label: "Completion Rate", 
            value: `${completionRate}%`, 
            change: `${analytics.completedAppointments} of ${analytics.totalAppointments}`, 
            positive: completionRate >= 80 
        },
        { 
            label: "Approved Appointments", 
            value: analytics.approvedAppointments || 0, 
            change: "Ready for consultation", 
            positive: true 
        }
    ];

    const appointmentStatusStats = Object.entries(analytics.appointmentsByStatus).map(([status, count]) => {
        const colors = {
            'Completed': '#4ade80',
            'Pending': '#fb923c',
            'Cancelled': '#ef4444',
            'Confirmed': '#60a5fa'
        };
        return {
            name: status,
            patients: count,
            percentage: analytics.totalAppointments > 0 ? Math.round((count / analytics.totalAppointments) * 100) : 0,
            color: colors[status] || '#6b7280'
        };
    });

    return (
        <div className="flex min-h-screen bg-gray-50">
            <DoctorSidebar />
            
            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Top Header */}
                <header className="bg-white border-b border-gray-200 px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
                            <p className="text-gray-500 text-sm">Performance insights and statistics</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            {/* Search Bar */}
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                                />
                                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>

                            {/* User Profile */}
                            <div className="relative">
                                <div 
                                    className="flex items-center space-x-3 cursor-pointer group"
                                    onClick={() => setShowDropdown(!showDropdown)}
                                >
                                    <img
                                        src="https://ui-avatars.com/api/?name=Sarah+Wilson&background=4f46e5&color=fff"
                                        alt="Profile"
                                        className="w-10 h-10 rounded-full"
                                    />
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-gray-900">{userName}</p>
                                        <p className="text-xs text-gray-500">Doctor</p>
                                    </div>
                                    <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>

                                {/* Dropdown Menu */}
                                {showDropdown && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                        <button
                                            onClick={() => {
                                                setShowDropdown(false);
                                                navigate('/doctorProfile');
                                            }}
                                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            <span>Edit Profile</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowDropdown(false);
                                                navigate('/doctorProfile');
                                            }}
                                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <span>View Profile</span>
                                        </button>
                                        <div className="border-t border-gray-200 my-1"></div>
                                        <button
                                            onClick={() => {
                                                setShowDropdown(false);
                                                navigate('/doctorSettings');
                                            }}
                                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span>Settings</span>
                                        </button>
                                        <div className="border-t border-gray-200 my-1"></div>
                                        <button
                                            onClick={() => {
                                                setShowDropdown(false);
                                                setLogoutDialogOpen(true);
                                            }}
                                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-8 overflow-auto">
                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {recentMetrics.map((metric, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <p className="text-gray-500 text-sm mb-1">{metric.label}</p>
                                        <h3 className="text-2xl font-bold text-gray-900">{metric.value}</h3>
                                        <div className="flex items-center mt-2">
                                            <span className={`text-sm font-medium ${metric.positive ? 'text-green-600' : 'text-red-600'}`}>
                                                {metric.change}
                                            </span>
                                            <span className="text-gray-500 text-xs ml-2">vs last period</span>
                                        </div>
                                    </div>
                                    <svg className={`w-5 h-5 ${metric.positive ? 'text-green-500' : 'text-red-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        {metric.positive ? (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                        ) : (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                                        )}
                                    </svg>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        {/* Appointment Trends */}
                        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-semibold text-gray-900">Appointment Trends</h2>
                                <select 
                                    value={timeRange}
                                    onChange={(e) => setTimeRange(e.target.value)}
                                    className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="7days">Last 7 days</option>
                                    <option value="30days">Last 30 days</option>
                                    <option value="3months">Last 3 months</option>
                                </select>
                            </div>
                            <div className="h-64">
                                <svg className="w-full h-full" viewBox="0 0 600 240">
                                    {/* Grid lines */}
                                    {[0, 10, 20, 30, 40, 50].map((y) => (
                                        <line
                                            key={y}
                                            x1="40"
                                            y1={220 - y * 4}
                                            x2="580"
                                            y2={220 - y * 4}
                                            stroke="#f0f0f0"
                                            strokeWidth="1"
                                        />
                                    ))}
                                    {/* Y-axis labels */}
                                    {[0, 10, 20, 30, 40, 50].map((y) => (
                                        <text
                                            key={y}
                                            x="30"
                                            y={225 - y * 4}
                                            fontSize="12"
                                            fill="#999"
                                            textAnchor="end"
                                        >
                                            {y}
                                        </text>
                                    ))}
                                    {/* X-axis labels */}
                                    {analytics.appointmentsByDay.map((day, i) => (
                                        <text
                                            key={i}
                                            x={55 + i * 77}
                                            y="235"
                                            fontSize="12"
                                            fill="#999"
                                            textAnchor="middle"
                                        >
                                            {day.label}
                                        </text>
                                    ))}
                                    {/* Line chart */}
                                    {analytics.appointmentsByDay.length > 0 && (
                                        <polyline
                                            points={analytics.appointmentsByDay
                                                .map((day, i) => `${55 + i * 77},${220 - Math.min(day.value * 4, 200)}`)
                                                .join(' ')}
                                            fill="none"
                                            stroke="#60a5fa"
                                            strokeWidth="3"
                                        />
                                    )}
                                    {/* Area fill */}
                                    {analytics.appointmentsByDay.length > 0 && (
                                        <polygon
                                            points={`${55},220 ` +
                                                analytics.appointmentsByDay
                                                    .map((day, i) => `${55 + i * 77},${220 - Math.min(day.value * 4, 200)}`)
                                                    .join(' ') +
                                                ` ${55 + (analytics.appointmentsByDay.length - 1) * 77},220`}
                                            fill="url(#gradient)"
                                        />
                                    )}
                                    {/* Gradient definition */}
                                    <defs>
                                        <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                                            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.3" />
                                            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
                                        </linearGradient>
                                    </defs>
                                    {/* Data points */}
                                    {analytics.appointmentsByDay.map((day, i) => (
                                        <circle
                                            key={i}
                                            cx={55 + i * 77}
                                            cy={220 - Math.min(day.value * 4, 200)}
                                            r="4"
                                            fill="#60a5fa"
                                        />
                                    ))}
                                </svg>
                            </div>
                        </div>

                        {/* Appointment Status Distribution */}
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-semibold text-gray-900">Appointment Status</h2>
                            </div>
                            <div className="space-y-4">
                                {appointmentStatusStats.length > 0 ? (
                                    appointmentStatusStats.map((stat, index) => (
                                        <div key={index}>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm text-gray-700">{stat.name}</span>
                                                <span className="text-sm font-semibold text-gray-900">{stat.patients}</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div 
                                                    className="h-2 rounded-full transition-all duration-300"
                                                    style={{ 
                                                        width: `${stat.percentage}%`,
                                                        backgroundColor: stat.color 
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500 text-center py-4">No appointment data available</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Recent Appointments */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">Recent Appointments</h2>
                            <button 
                                onClick={() => navigate('/doctorAppointments')}
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                                View All →
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            {analytics.recentAppointments && analytics.recentAppointments.length > 0 ? (
                                <table className="min-w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient ID</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {analytics.recentAppointments.map((appointment, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm text-gray-900">{appointment.patientId}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">
                                                    {appointment.date || 'N/A'}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-600">{appointment.time || 'N/A'}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                        appointment.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                                        appointment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        appointment.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                                        'bg-blue-100 text-blue-800'
                                                    }`}>
                                                        {appointment.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-600">{appointment.reason || 'General Checkup'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p>No recent appointments</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Top Procedures */}
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Procedures</h3>
                            <div className="space-y-3">
                                {analytics.topProcedures && analytics.topProcedures.length > 0 ? (
                                    analytics.topProcedures.map(([procedure, count], index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">{procedure}</span>
                                            <span className="text-sm font-semibold text-gray-900">{count}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500 text-center py-2">No procedure data available</p>
                                )}
                            </div>
                        </div>

                        {/* Peak Hours */}
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Peak Hours</h3>
                            <div className="space-y-3">
                                {analytics.hourCounts && Object.keys(analytics.hourCounts).length > 0 ? (
                                    Object.entries(analytics.hourCounts)
                                        .sort((a, b) => b[1] - a[1])
                                        .slice(0, 3)
                                        .map(([hour, count], index) => {
                                            const hourNum = parseInt(hour);
                                            const timeRange = `${hourNum}:00 ${hourNum >= 12 ? 'PM' : 'AM'} - ${hourNum + 1}:00 ${hourNum + 1 >= 12 ? 'PM' : 'AM'}`;
                                            const level = index === 0 ? 'High' : index === 1 ? 'Medium' : 'Low';
                                            const colorClass = index === 0 ? 'bg-green-100 text-green-800' : 
                                                              index === 1 ? 'bg-yellow-100 text-yellow-800' : 
                                                              'bg-blue-100 text-blue-800';
                                            return (
                                                <div key={hour} className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-600">{timeRange} ({count})</span>
                                                    <span className={`px-2 py-1 ${colorClass} rounded text-xs font-medium`}>{level}</span>
                                                </div>
                                            );
                                        })
                                ) : (
                                    <p className="text-sm text-gray-500 text-center py-2">No appointment time data available</p>
                                )}
                            </div>
                        </div>

                        {/* Age Distribution */}
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Age Distribution</h3>
                            <div className="space-y-3">
                                {analytics.ageDistribution && analytics.ageDistribution.length > 0 ? (
                                    analytics.ageDistribution.map((group, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">{group.range} years ({group.count})</span>
                                            <span className="text-sm font-semibold text-gray-900">{group.percentage}%</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500 text-center py-2">No patient age data available</p>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            
            <LogOutDialog
                open={logoutDialogOpen}
                onOpenChange={setLogoutDialogOpen}
                onConfirmLogout={confirmedLogout}
            />
        </div>
    );
}
