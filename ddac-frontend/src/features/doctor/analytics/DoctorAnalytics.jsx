import DoctorSidebar from "../components/DoctorSidebar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function DoctorAnalytics() {
    const navigate = useNavigate();
    const userName = localStorage.getItem("userName") || "Dr. Sarah Wilson";
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState("7days");

    useEffect(() => {
        // Simulate loading analytics data
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userName");
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
    const appointmentTrend = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        values: [30, 45, 38, 52, 42, 35, 28]
    };

    const patientGrowth = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        values: [150, 180, 220, 260, 310, 342]
    };

    const departmentStats = [
        { name: 'Cardiology', patients: 89, percentage: 30, color: '#60a5fa' },
        { name: 'Neurology', patients: 74, percentage: 25, color: '#5ebbbb' },
        { name: 'Pediatrics', patients: 59, percentage: 20, color: '#4ade80' },
        { name: 'Orthopedics', patients: 44, percentage: 15, color: '#fb923c' },
        { name: 'General', percentage: 10, patients: 30, color: '#1e3a5f' }
    ];

    const recentMetrics = [
        { label: "Average Wait Time", value: "12 min", change: "-3 min", positive: true },
        { label: "Patient Satisfaction", value: "94%", change: "+2%", positive: true },
        { label: "Appointment Completion", value: "87%", change: "-1%", positive: false },
        { label: "Revenue This Month", value: "$45,200", change: "+$5,300", positive: true }
    ];

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
                            <div className="flex items-center space-x-3 cursor-pointer group">
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
                                    {appointmentTrend.labels.map((label, i) => (
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
                                        points={appointmentTrend.values
                                            .map((v, i) => `${55 + i * 77},${220 - v * 4}`)
                                            .join(' ')}
                                        fill="none"
                                        stroke="#60a5fa"
                                        strokeWidth="3"
                                    />
                                    {/* Area fill */}
                                    <polygon
                                        points={`${55},220 ` +
                                            appointmentTrend.values
                                                .map((v, i) => `${55 + i * 77},${220 - v * 4}`)
                                                .join(' ') +
                                            ` ${55 + (appointmentTrend.values.length - 1) * 77},220`}
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
                                    {appointmentTrend.values.map((v, i) => (
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
                                <h2 className="text-lg font-semibold text-gray-900">By Department</h2>
                            </div>
                            <div className="space-y-4">
                                {departmentStats.map((dept, index) => (
                                    <div key={index}>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm text-gray-700">{dept.name}</span>
                                            <span className="text-sm font-semibold text-gray-900">{dept.patients}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div 
                                                className="h-2 rounded-full transition-all duration-300"
                                                style={{ 
                                                    width: `${dept.percentage}%`,
                                                    backgroundColor: dept.color 
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Patient Growth Chart */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">Patient Growth</h2>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-500">Total Growth:</span>
                                <span className="text-sm font-semibold text-green-600">+128%</span>
                            </div>
                        </div>
                        <div className="h-64">
                            <svg className="w-full h-full" viewBox="0 0 700 240">
                                {/* Grid lines */}
                                {[0, 100, 200, 300, 400].map((y) => (
                                    <line
                                        key={y}
                                        x1="50"
                                        y1={220 - (y / 2)}
                                        x2="680"
                                        y2={220 - (y / 2)}
                                        stroke="#f0f0f0"
                                        strokeWidth="1"
                                    />
                                ))}
                                {/* Y-axis labels */}
                                {[0, 100, 200, 300, 400].map((y) => (
                                    <text
                                        key={y}
                                        x="40"
                                        y={225 - (y / 2)}
                                        fontSize="12"
                                        fill="#999"
                                        textAnchor="end"
                                    >
                                        {y}
                                    </text>
                                ))}
                                {/* X-axis labels */}
                                {patientGrowth.labels.map((label, i) => (
                                    <text
                                        key={label}
                                        x={75 + i * 105}
                                        y="235"
                                        fontSize="12"
                                        fill="#999"
                                        textAnchor="middle"
                                    >
                                        {label}
                                    </text>
                                ))}
                                {/* Bar chart */}
                                {patientGrowth.values.map((v, i) => (
                                    <rect
                                        key={i}
                                        x={60 + i * 105}
                                        y={220 - (v / 2)}
                                        width="50"
                                        height={v / 2}
                                        fill="#60a5fa"
                                        rx="4"
                                    />
                                ))}
                                {/* Value labels on bars */}
                                {patientGrowth.values.map((v, i) => (
                                    <text
                                        key={i}
                                        x={85 + i * 105}
                                        y={210 - (v / 2)}
                                        fontSize="12"
                                        fill="#374151"
                                        fontWeight="600"
                                        textAnchor="middle"
                                    >
                                        {v}
                                    </text>
                                ))}
                            </svg>
                        </div>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Procedures</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">General Checkup</span>
                                    <span className="text-sm font-semibold text-gray-900">142</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Blood Test</span>
                                    <span className="text-sm font-semibold text-gray-900">98</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">X-Ray</span>
                                    <span className="text-sm font-semibold text-gray-900">76</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">ECG</span>
                                    <span className="text-sm font-semibold text-gray-900">54</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Peak Hours</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">9:00 AM - 11:00 AM</span>
                                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">High</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">2:00 PM - 4:00 PM</span>
                                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">Medium</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">4:00 PM - 6:00 PM</span>
                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">Low</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Age Distribution</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">0-18 years</span>
                                    <span className="text-sm font-semibold text-gray-900">18%</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">19-35 years</span>
                                    <span className="text-sm font-semibold text-gray-900">32%</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">36-55 years</span>
                                    <span className="text-sm font-semibold text-gray-900">35%</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">56+ years</span>
                                    <span className="text-sm font-semibold text-gray-900">15%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
