import DoctorSidebar from "./components/DoctorSidebar";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import appointmentService from "./appointments/appointmentService";
import patientService from "./patients/patientService";

export default function DoctorDashboard() {
    const navigate = useNavigate();
    const userName = localStorage.getItem("userName") || "Dr. Sarah Wilson";
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalAppointments: 0,
        todayAppointments: 0,
        totalPatients: 0,
        completedAppointments: 0
    });
    const [recentAppointments, setRecentAppointments] = useState([]);
    const [chartData, setChartData] = useState({
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        values: [0, 0, 0, 0, 0, 0, 0]
    });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            
            // Fetch appointments and stats
            const [appointments, appointmentStats, patientStats] = await Promise.all([
                appointmentService.getDoctorAppointments(),
                appointmentService.getAppointmentStats(),
                patientService.getPatientStats()
            ]);

            // Update stats
            setStats({
                totalAppointments: appointmentStats.total || 0,
                todayAppointments: appointmentStats.today || 0,
                totalPatients: patientStats.total || 0,
                completedAppointments: appointmentStats.completed || 0
            });

            // Get recent appointments (last 5)
            const recent = appointments
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 5);
            setRecentAppointments(recent);

            // Generate chart data from appointments (last 7 days)
            generateChartData(appointments);
            
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const generateChartData = (appointments) => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const counts = [0, 0, 0, 0, 0, 0, 0];
        const today = new Date();
        
        appointments.forEach(apt => {
            const aptDate = new Date(apt.date);
            const diffTime = Math.abs(today - aptDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays <= 7) {
                const dayIndex = aptDate.getDay();
                counts[dayIndex]++;
            }
        });
        
        setChartData({ labels: days, values: counts });
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userName");
        navigate("/login");
    };

    const departments = [
        { name: 'Cardiology', percentage: 30, color: '#60a5fa' },
        { name: 'Neurology', percentage: 25, color: '#5ebbbb' },
        { name: 'Pediatrics', percentage: 20, color: '#4ade80' },
        { name: 'Orthopedics', percentage: 15, color: '#fb923c' },
        { name: 'General', percentage: 10, color: '#1e3a5f' }
    ];

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <DoctorSidebar />

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Top Header */}
                <header className="bg-white border-b border-gray-200 px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Doctor Dashboard</h1>
                            <p className="text-gray-500 text-sm">Healthcare Management Overview</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            {/* Search Bar
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                                />
                                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div> */}
                            
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
                                    </div>
                                )}
                            </div>

                            {/* Logout Button */}
                            <button 
                                onClick={handleLogout}
                                className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <span className="text-sm font-medium">Logout</span>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Loading State */}
                {loading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading dashboard...</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Dashboard Content */}
                        <main className="flex-1 p-8 overflow-auto">
                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                {/* Total Appointments */}
                                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="flex items-center space-x-2 mb-3">
                                                <div className="p-2 bg-blue-50 rounded-lg">
                                                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <h3 className="text-3xl font-bold text-gray-900">{stats.totalAppointments}</h3>
                                            <p className="text-gray-500 text-sm mt-1">Total Appointments</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Today's Appointments */}
                                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="flex items-center space-x-2 mb-3">
                                                <div className="p-2 bg-teal-50 rounded-lg">
                                                    <svg className="w-6 h-6 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <h3 className="text-3xl font-bold text-gray-900">{stats.todayAppointments}</h3>
                                            <p className="text-gray-500 text-sm mt-1">Today's Appointments</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Total Patients */}
                                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="flex items-center space-x-2 mb-3">
                                                <div className="p-2 bg-green-50 rounded-lg">
                                                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <h3 className="text-3xl font-bold text-gray-900">{stats.totalPatients}</h3>
                                            <p className="text-gray-500 text-sm mt-1">Total Patients</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Completed Appointments */}
                                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="flex items-center space-x-2 mb-3">
                                                <div className="p-2 bg-purple-50 rounded-lg">
                                                    <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <h3 className="text-3xl font-bold text-gray-900">{stats.completedAppointments}</h3>
                                            <p className="text-gray-500 text-sm mt-1">Completed</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        {/* Appointments Overview Chart */}
                        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-semibold text-gray-900">Appointments Overview</h2>
                                <select className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option>Last 7 days</option>
                                    <option>Last 30 days</option>
                                    <option>Last 3 months</option>
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
                                    {chartData.labels.map((label, i) => (
                                        <text
                                            key={label}
                                            x={55 + i * 77}
                                            y="235"
                                            fontSize="12"
                                            fill="#999"
                                            textAnchor="middle"
                                        >
                                            {label}
                                        </text>
                                    ))}
                                    {/* Line chart */}
                                    <polyline
                                        points={chartData.values
                                            .map((v, i) => `${55 + i * 77},${220 - v * 4}`)
                                            .join(' ')}
                                        fill="none"
                                        stroke="#60a5fa"
                                        strokeWidth="3"
                                    />
                                    {/* Area fill */}
                                    <polygon
                                        points={`${55},220 ` +
                                            chartData.values
                                                .map((v, i) => `${55 + i * 77},${220 - v * 4}`)
                                                .join(' ') +
                                            ` ${55 + (chartData.values.length - 1) * 77},220`}
                                        fill="url(#gradient)"
                                    />
                                    {/* Gradient definition */}
                                    <defs>
                                        <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                                            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.3" />
                                            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
                                        </linearGradient>
                                    </defs>
                                    {/* Data points */}
                                    {chartData.values.map((v, i) => (
                                        <circle
                                            key={i}
                                            cx={55 + i * 77}
                                            cy={220 - v * 4}
                                            r="4"
                                            fill="#60a5fa"
                                        />
                                    ))}
                                </svg>
                            </div>
                        </div>

                        {/* Department Distribution */}
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-semibold text-gray-900">Department Distribution</h2>
                                <button className="text-blue-500 text-sm hover:text-blue-600">View All</button>
                            </div>
                            <div className="flex items-center justify-center mb-6">
                                <svg width="200" height="200" viewBox="0 0 200 200">
                                    {departments.reduce((acc, dept, index) => {
                                        const previousPercentage = departments
                                            .slice(0, index)
                                            .reduce((sum, d) => sum + d.percentage, 0);
                                        const startAngle = (previousPercentage / 100) * 360;
                                        const endAngle = ((previousPercentage + dept.percentage) / 100) * 360;
                                        const startRad = (startAngle - 90) * (Math.PI / 180);
                                        const endRad = (endAngle - 90) * (Math.PI / 180);
                                        const largeArc = dept.percentage > 50 ? 1 : 0;
                                        const x1 = 100 + 80 * Math.cos(startRad);
                                        const y1 = 100 + 80 * Math.sin(startRad);
                                        const x2 = 100 + 80 * Math.cos(endRad);
                                        const y2 = 100 + 80 * Math.sin(endRad);
                                        const path = `M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`;
                                        
                                        acc.push(
                                            <path key={index} d={path} fill={dept.color} />
                                        );
                                        return acc;
                                    }, [])}
                                </svg>
                            </div>
                            <div className="space-y-3">
                                {departments.map((dept, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: dept.color }}
                                            ></div>
                                            <span className="text-sm text-gray-600">{dept.name}</span>
                                        </div>
                                        <span className="text-sm font-semibold text-gray-900">{dept.percentage}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                            <button className="text-blue-500 text-sm hover:text-blue-600">View All</button>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-start space-x-3 pb-4 border-b border-gray-100">
                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                                <div className="flex-1">
                                    <p className="text-gray-900 text-sm">Dr. Johnson completed appointment with Patient #1247</p>
                                    <p className="text-gray-500 text-xs mt-1">2 minutes ago</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3 pb-4 border-b border-gray-100">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                <div className="flex-1">
                                    <p className="text-gray-900 text-sm">New appointment scheduled for Cardiology Department</p>
                                    <p className="text-gray-500 text-xs mt-1">15 minutes ago</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3 pb-4 border-b border-gray-100">
                                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                                <div className="flex-1">
                                    <p className="text-gray-900 text-sm">Patient #1156 checked in for appointment</p>
                                    <p className="text-gray-500 text-xs mt-1">32 minutes ago</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                                <div className="flex-1">
                                    <p className="text-gray-900 text-sm">Dr. Smith updated patient medical records</p>
                                    <p className="text-gray-500 text-xs mt-1">1 hour ago</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                </>
                )}
            </div>
        </div>
    );
}