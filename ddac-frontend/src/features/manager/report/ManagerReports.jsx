import '../../../index.css';
import Layout from '../../../components/Layout.jsx';
import { useNavigate } from 'react-router-dom';
import {
    FaDollarSign,
    FaCalendarAlt,
    FaChartLine,
    FaFileInvoiceDollar,
    FaChartBar,
    FaArrowRight,
    FaUserMd, FaUserInjured, FaFileUpload
} from 'react-icons/fa';
import {useEffect, useState} from "react";
import {getReportsSummary} from "../../../services/reportManagementService.js";

export default function ManagerReports() {
    const navigate = useNavigate();
    const [reportsData, setReportsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getReportsInfo();
    }, []);

    const getReportsInfo = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getReportsSummary();
            console.log('Fetched reports summary:', data);
            setReportsData(data);
        } catch (err) {
            console.error('Error fetching reports:', err);
            setError(err.message || 'Failed to fetch reports');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        if (amount === undefined || amount === null || isNaN(amount)) {
            return 'RM 0.00';
        }
        return `RM ${amount.toLocaleString('en-MY', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    };

    const reports = reportsData ? [
        {
            id: 'financial',
            title: 'Financial Performance Report',
            description: 'Revenue analysis, payment status, and financial trends',
            icon: FaDollarSign,
            color: 'bg-accent-success',
            stats: [
                { label: 'Total Revenue', value: formatCurrency(reportsData.transaction?.totalRevenue) },
                { label: 'Success Rate', value: `${reportsData.transaction?.successRate}%` },
                { label: 'This Month', value: formatCurrency(reportsData.transaction?.thisMonthRevenue) }
            ],
            path: '/managerFinancialReport'
        },
        {
            id: 'appointments',
            title: 'Appointment Overview Report',
            description: 'Appointment trends, status distribution, and booking patterns',
            icon: FaCalendarAlt,
            color: 'bg-primary',
            stats: [
                { label: 'Total Appointments', value: reportsData.appointments?.totalAppointments.toString() },
                { label: 'Completion Rate', value: `${reportsData.appointments?.completionRate}%` },
                { label: 'This Week', value: reportsData.appointments?.thisWeekAppointments.toString() }
            ],
            path: '/managerAppointmentReport'
        },
        {
            id: 'doctor-staff-activity',
            title: 'Doctor & Staff Activity Report',
            description: 'Performance metrics, workload distribution, and top performers',
            icon: FaUserMd,
            color: 'bg-accent-sky',
            stats: [
                { label: 'Active Doctors', value: reportsData.doctorStaff.activeDoctors?.toString() },
                { label: 'Avg Appointments', value: `${reportsData.doctorStaff?.avgAppointmentsPerDoctor}/doctor` },
                { label: 'Top Performer', value: reportsData.doctorStaff.topPerformerName }
            ],
            path: '/managerDoctorStaffReport'
        }
    ] : [];

    // Loading state
    if (loading) {
        return (
            <Layout role="manager">
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted">Loading Reports...</p>
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
                        <FaFileUpload size={64} className="text-accent-danger mx-auto mb-4" />
                        <h2 className="text-heading text-xl font-bold mb-2">Error Loading Reports</h2>
                        <p className="text-muted mb-4">{error}</p>
                        <button
                            onClick={getReportsInfo}
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
                    <h1 className="text-3xl font-bold text-heading">Reports & Analytics</h1>
                    <p className="text-muted mt-1">View comprehensive reports and download detailed analysis</p>
                </div>

                {/* Reports Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reports.map((report) => {
                        const Icon = report.icon;
                        return (
                            <div
                                key={report.id}
                                className="bg-card rounded-xl shadow-soft border border-color hover:shadow-md transition-all cursor-pointer group"
                                onClick={() => navigate(report.path)}
                            >
                                {/* Report Header */}
                                <div className="p-6 border-b border-color">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`${report.color} bg-opacity-10 p-3 rounded-lg`}>
                                            <Icon className="text-ondark" size={28} />
                                        </div>
                                        <button className="p-2 hover:bg-main rounded-lg transition-colors">
                                            <FaArrowRight className="text-primary group-hover:translate-x-1 transition-transform" size={20} />
                                        </button>
                                    </div>
                                    <h3 className="text-heading text-lg font-bold mb-2">{report.title}</h3>
                                    <p className="text-muted text-sm">{report.description}</p>
                                </div>

                                {/* Quick Stats Preview */}
                                <div className="p-6">
                                    <div className="space-y-3">
                                        {report.stats.map((stat, index) => (
                                            <div key={index} className="flex items-center justify-between">
                                                <span className="text-muted text-sm">{stat.label}</span>
                                                <span className="text-heading font-semibold">{stat.value}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Mini Graph Placeholder */}
                                    <div className="mt-4 pt-4 border-t border-color">
                                        <div className="flex items-end gap-1 h-16">
                                            {/* Simple bar chart visualization */}
                                            {[40, 65, 45, 80, 60, 90, 75].map((height, index) => (
                                                <div
                                                    key={index}
                                                    className={`flex-1 ${report.color} bg-opacity-20 rounded-t`}
                                                    style={{ height: `${height}%` }}
                                                ></div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* View Full Report Button */}
                                <div className="px-6 pb-6">
                                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary bg-opacity-10 text-ondark rounded-lg font-medium hover:bg-opacity-20 transition-colors">
                                        <FaChartBar size={16} />
                                        <span>View Full Report</span>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </Layout>
    );
}