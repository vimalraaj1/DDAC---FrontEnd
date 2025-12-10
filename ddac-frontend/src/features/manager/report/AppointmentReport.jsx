import '../../../index.css';
import Layout from '../../../components/Layout.jsx';
import {useCallback, useEffect, useRef, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaArrowLeft, FaDownload, FaCalendarAlt, FaCheckCircle,
    FaClock, FaTimesCircle, FaUserMd, FaCalendarCheck, FaFileUpload
} from 'react-icons/fa';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {getAppointmentChartDetails, getReportsSummary} from "../../../services/reportManagementService.js";
import {toast} from "sonner";

const status_colors = {
    'Completed': 'var(--accent-success)',
    'Approved': 'var(--accent-success)',
    'Scheduled': 'var(--accent-warning)',
    'Cancelled': 'var(--accent-danger)',
    'No Show': 'var(--primary)',
    'Rejected': 'var(--accent-danger)',
};

const mapChartData = (backendData) => {
    if (!backendData) {
        return {
            appointmentsOverTime: [],
            appointmentStatus: [],
            appointmentsBySpecialization: [],
            appointmentsByTimeSlot: [],
        };
    }

    return {
        appointmentsOverTime: (backendData.appointmentsOverTime || []).map(item => ({
            month: item.period,
            appointments: item.revenue,
        })),

        appointmentStatus: (backendData.appointmentStatus || []).map(item => ({
            name: item.category,
            value: item.count,
            color: status_colors[item.category] || '#7F8C8D',
        })),

        appointmentsBySpecialization: (backendData.appointmentsBySpecialization || []).map(item => ({
            specialization: item.category,
            count: item.count,
        })),

        appointmentsByTimeSlot: (backendData.appointmentsByTimeSlot || []).map(item => ({
            time: item.category,
            count: item.count,
        })),
    };
};

export default function AppointmentReport() {
    const navigate = useNavigate();
    const [dateRange, setDateRange] = useState('month');
    const [summaryData, setSummaryData] = useState({
        TotalAppointments: 0,
        Completed: 0,
        Scheduled: 0,
        CompletionRate: 0,
        NoShowRate: 0,
        AvgDailyAppointments: 0,
        MostPopularTimeSlot: 'N/A',
    });
    const [chartData, setChartData] = useState(mapChartData(null));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isExporting, setIsExporting] = useState(false);

    //useRef lets you reference a value that's not needed for rendering
    const summaryRef = useRef(null);
    const lineChartRef = useRef(null);
    const pieChartRef = useRef(null);
    const specializationRef = useRef(null);
    const timeSlotRef = useRef(null);
    const tableRef = useRef(null);

    const fetchReportData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const chartJson = await getAppointmentChartDetails(dateRange);
            const mappedChartData = mapChartData(chartJson);
            setChartData(mappedChartData);

            const summaryJson = await getReportsSummary();
            const appointmentSummary = summaryJson.appointments || {};

            const totalFromChart = mappedChartData.appointmentStatus.reduce((sum, item) => sum + item.value, 0);
            const total = mappedChartData?.totalAppointments || totalFromChart;
            const completedCount = mappedChartData.appointmentStatus.find(s => s.name.toLowerCase() === 'completed')?.value || 0;
            const scheduledCount = mappedChartData.appointmentStatus.find(s => s.name.toLowerCase() === 'scheduled')?.value || 0;
            const noShowCount = mappedChartData.appointmentStatus.find(s => s.name.toLowerCase() === 'no show')?.value || 0;
            const daysInPeriod = { week: 7, month: 30, quarter: 90, year: 365 }[dateRange] || 30;
            const avgDailyAppointments = total > 0 ? (total / daysInPeriod).toFixed(1) : 0;
            const noShowRate = total > 0 ? ((noShowCount / total) * 100).toFixed(0) : 0;

            const mostPopularTimeSlot = mappedChartData.appointmentsByTimeSlot.length > 0
                ? mappedChartData.appointmentsByTimeSlot.reduce((max, item) => (
                    item.count > max.count ? item : max
                ), { time: 'N/A', count: -1 })
                : { time: 'N/A', count: 0 };

            setSummaryData({
                TotalAppointments: total,
                Completed: completedCount,
                Scheduled: scheduledCount,
                CompletionRate: parseFloat(appointmentSummary?.completionRate || 0),
                NoShowRate: parseFloat(noShowRate),
                AvgDailyAppointments: parseFloat(avgDailyAppointments),
                MostPopularTimeSlot: `${mostPopularTimeSlot.time} (${mostPopularTimeSlot.count} appointments)`,
            });
        } catch (err) {
            console.error('Error fetching appointment report:', err);
            setError('Could not load appointment report data. Please check the API status.');
        } finally {
            setLoading(false);
        }
    }, [dateRange]);

    useEffect(() => {
        fetchReportData();
    }, [fetchReportData]);

    const handleExportPDF = async () => {
        if (!summaryRef.current || !lineChartRef.current || !pieChartRef.current || !tableRef.current || !specializationRef.current || !timeSlotRef.current) return;

        try {
            setIsExporting(true);
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210;
            let yPosition = 10; // Starting y position with a margin

            const addSectionToPDF = async (ref, pdfInstance) => {
                const element = ref.current;
                const originalBg = element.style.backgroundColor;
                element.style.backgroundColor = '#ffffff';

                await new Promise(resolve => setTimeout(resolve, 50)); // Small delay for rendering

                const canvas = await html2canvas(element, { scale: 2, useCORS: true, logging: false, backgroundColor: '#ffffff' });
                element.style.backgroundColor = originalBg;

                const imgHeight = (canvas.height * imgWidth) / canvas.width;

                // Check if the element will fit on the remaining part of the current page (A4 height is 297mm)
                if (yPosition + imgHeight > 280) { // Using 280 for a safety margin
                    pdfInstance.addPage();
                    yPosition = 10; // Reset position for new page
                }

                pdfInstance.addImage(canvas.toDataURL('image/png'), 'PNG', 0, yPosition, imgWidth, imgHeight);
                yPosition += imgHeight + 5; // Move Y position down for the next element, plus a small gap
            };

            await addSectionToPDF(summaryRef, pdf);
            await addSectionToPDF(lineChartRef, pdf);
            await addSectionToPDF(pieChartRef, pdf);
            await addSectionToPDF(specializationRef, pdf);
            await addSectionToPDF(timeSlotRef, pdf);
            await addSectionToPDF(tableRef, pdf);

            const date = new Date().toISOString().split('T')[0];
            const filename = `Appointment_Report_${dateRange}_${date}.pdf`;
            pdf.save(filename);
            toast.success('PDF exported successfully!');
        } catch (error) {
            console.error('Error exporting PDF:', error);
            toast.error('Failed to export PDF. Please try again.');
        } finally {
            setIsExporting(false);
        }
    };

    if (loading) {
        return (
            <Layout role="manager">
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted">Loading Financial Report...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout role="manager">
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <FaFileUpload size={64} className="text-accent-danger mx-auto mb-4" />
                        <h2 className="text-heading text-xl font-bold mb-2">Error Loading Report</h2>
                        <p className="text-muted mb-4">{error}</p>
                        <button
                            onClick={() => fetchReportData(dateRange)}
                            className="btn-primary"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }

    const { appointmentsOverTime, appointmentStatus, appointmentsBySpecialization, appointmentsByTimeSlot } = chartData;
    const completionRateColor = summaryData.CompletionRate >= 80 ? 'text-accent-success' : 'text-accent-warning';
    
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
                        disabled={isExporting}
                        className="flex items-center gap-2 px-5 py-2.5 bg-accent-danger text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isExporting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <span>Exporting...</span>
                            </>
                        ) : (
                            <>
                                <FaDownload size={16} />
                                <span>Export PDF</span>
                            </>
                        )}
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
                <div ref={summaryRef} className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-card rounded-xl shadow-soft p-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-primary bg-opacity-10 p-3 rounded-lg">
                                <FaCalendarAlt className="text-ondark" size={24} />
                            </div>
                            <div>
                                <h3 className="text-heading text-2xl font-bold">{summaryData.TotalAppointments}</h3>
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
                                <h3 className="text-heading text-2xl font-bold">{summaryData.Completed}</h3>
                                <p className="text-muted text-sm">Completed ({dateRange})</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card rounded-xl shadow-soft p-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-accent-sky bg-opacity-10 p-3 rounded-lg">
                                <FaCalendarCheck className="text-ondark" size={24} />
                            </div>
                            <div>
                                <h3 className="text-heading text-2xl font-bold">{summaryData.Scheduled}</h3>
                                <p className="text-muted text-sm">Scheduled ({dateRange})</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card rounded-xl shadow-soft p-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-accent-warning bg-opacity-10 p-3 rounded-lg">
                                <FaClock className="text-ondark" size={24} />
                            </div>
                            <div>
                                <h3 className="text-heading text-2xl font-bold">{summaryData.CompletionRate}%</h3>
                                <p className="text-muted text-sm">Completion Rate (Overall)</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Appointments Over Time - Line Chart */}
                    <div ref={lineChartRef} className="bg-card rounded-xl shadow-soft p-6">
                        <h3 className="text-heading text-lg font-semibold mb-4 flex items-center gap-2">
                            <FaCalendarAlt className="text-primary" />
                            <span>Appointment Trends ({dateRange})</span>
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={appointmentsOverTime}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                                <XAxis dataKey="month" stroke="#7A7A7A" />
                                <YAxis stroke="#7A7A7A" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px' }} formatter={(value) => [`${value} appointments`, 'Count']}
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
                    <div ref={pieChartRef} className="bg-card rounded-xl shadow-soft p-6">
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
                                <Tooltip formatter={(value) => [`${value} appointments`, 'Count']}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Appointments by Specialization - Bar Chart */}
                    <div ref={specializationRef} className="bg-card rounded-xl shadow-soft p-6">
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
                                    formatter={(value) => [`${value} appointments`, 'Count']}
                                />
                                <Legend />
                                <Bar dataKey="count" fill="#5DADE2" name="Appointments" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Appointments by Time Slot - Bar Chart */}
                    <div ref={timeSlotRef} className="bg-card rounded-xl shadow-soft p-6">
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
                                    formatter={(value) => [`${value} appointments`, 'Count']}
                                />
                                <Legend />
                                <Bar dataKey="count" fill="#F39C12" name="Appointments" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Detailed Table */}
                <div ref={tableRef} className="bg-card rounded-xl shadow-soft p-6">
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
                                <td className="py-3 px-4 text-heading font-semibold text-right">{summaryData.TotalAppointments}</td>
                                <td className="py-3 px-4 text-accent-success font-semibold text-right">--</td>
                            </tr>
                            <tr className="border-b border-color">
                                <td className="py-3 px-4 text-body">Completion Rate</td>
                                <td className="py-3 px-4 text-heading font-semibold text-right">{summaryData.CompletionRate}%</td>
                                <td className={`py-3 px-4 ${completionRateColor} font-semibold text-right`}>--</td>
                            </tr>
                            <tr className="border-b border-color">
                                <td className="py-3 px-4 text-body">Average Daily Appointments</td>
                                <td className="py-3 px-4 text-heading font-semibold text-right">{summaryData.AvgDailyAppointments}</td>
                                <td className="py-3 px-4 text-accent-success font-semibold text-right">--</td>
                            </tr>
                            <tr className="border-b border-color">
                                <td className="py-3 px-4 text-body">No-Show Rate</td>
                                <td className="py-3 px-4 text-heading font-semibold text-right">{summaryData.NoShowRate}</td>
                                <td className="py-3 px-4 text-accent-danger font-semibold text-right">{summaryData.NoShowRate > 5 ? 'High' : 'Low'}</td>
                            </tr>
                            <tr className="border-b border-color">
                                <td className="py-3 px-4 text-body">Most Popular Time Slot</td>
                                <td className="py-3 px-4 text-heading font-semibold text-right" colSpan="2">{summaryData.MostPopularTimeSlot}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Layout>
    );
}