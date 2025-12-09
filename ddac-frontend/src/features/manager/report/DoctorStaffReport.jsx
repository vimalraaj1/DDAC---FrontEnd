import '../../../index.css';
import Layout from '../../../components/Layout.jsx';
import {useCallback, useEffect, useRef, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaArrowLeft, FaDownload, FaUserMd, FaUserTie,
    FaStar, FaCalendarCheck, FaClock, FaTrophy
} from 'react-icons/fa';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {getDoctorStaffChartDetails, getReportsSummary} from "../../../services/reportManagementService.js";
import {toast} from "sonner";

const calculateDateRange = (rangeKey) => {
    const today = new Date();
    const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
    let startDate = new Date(today);

    switch (rangeKey) {
        case 'week':
            startDate.setDate(today.getDate() - 6);
            break;
        case 'month':
            startDate.setDate(today.getDate() - 29);
            break;
        case 'quarter':
            startDate.setDate(today.getDate() - 89);
            break;
        case 'year':
            startDate.setDate(today.getDate() - 364);
            break;
        default:
            return { startDate: null, endDate: null };
    }
    startDate.setHours(0, 0, 0, 0);

    const formatToISO = (date) => date ? date.toISOString().split('T')[0] : null;

    return {
        startDate: formatToISO(startDate),
        endDate: formatToISO(endDate),
    };
};

const specialization_colors = ['#E74C3C', '#5DADE2', '#F39C12', '#2ECC71', '#9B59B6', '#95A5A6'];

const mapDoctorChartData = (backendData) => {
    if (!backendData) {
        return {
            workloadByDoctor: [],
            distributionBySpecialization: [],
            topDoctorDetails: [],
        };
    }

    return {
        workloadByDoctor: (backendData.workloadByDoctor || []).map(item => ({
            name: item.category,
            appointments: item.count,
        })),

        distributionBySpecialization: (backendData.distributionBySpecialization || []).map((item, index) => ({
            name: item.category,
            value: item.count,
            color: specialization_colors[index % specialization_colors.length]
        })),

        topDoctorDetails: backendData.topDoctorDetails || []
    };
};

export default function DoctorStaffReport() {
    const navigate = useNavigate();
    const [dateRange, setDateRange] = useState('month');
    const [viewType, setViewType] = useState('doctors');
    const [summaryData, setSummaryData] = useState({
        ActiveDoctors: 0,
        AvgAppointmentsPerDoctor: 0,
        TopPerformerName: 'N/A',
        AvgRating: 0, 
        TopPerformerCount: 0 
    });
    const [chartData, setChartData] = useState(mapDoctorChartData(null));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isExporting, setIsExporting] = useState(false);

    const summaryRef = useRef(null);
    const barChartRef = useRef(null);
    const pieChartRef = useRef(null);
    const tableRef = useRef(null);

    const fetchReportData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const { startDate, endDate } = calculateDateRange(dateRange);
            const chartJson = await getDoctorStaffChartDetails(startDate, endDate);
            const mappedChartData = mapDoctorChartData(chartJson);
            setChartData(mappedChartData);

            const summaryJson = await getReportsSummary();
            const doctorStaffSummary = summaryJson.doctorStaff || {};

            const totalAppointmentsInPeriod = mappedChartData.topDoctorDetails.reduce((sum, doc) => sum + doc.appointmentsCount, 0);
            const avgRating = mappedChartData.topDoctorDetails.length > 0
                ? (mappedChartData.topDoctorDetails.reduce((sum, doc) => sum + doc.rating, 0) / mappedChartData.topDoctorDetails.length).toFixed(1)
                : 0;

            const topDoctorInPeriod = mappedChartData.topDoctorDetails.length > 0
                ? mappedChartData.topDoctorDetails[0]
                : null;

            setSummaryData({
                ActiveDoctors: doctorStaffSummary.activeDoctors || 0,
                AvgAppointmentsPerDoctor: doctorStaffSummary.avgAppointmentsPerDoctor || 0, 
                TopPerformerName: topDoctorInPeriod ? topDoctorInPeriod.name : doctorStaffSummary.topPerformerName || 'N/A',
                AvgRating: parseFloat(avgRating),
                TopPerformerCount: topDoctorInPeriod ? topDoctorInPeriod.appointmentsCount : 0
            });

        } catch (err) {
            console.error('Error fetching doctor report:', err);
            setError('Could not load doctor report data. Please check the API status.');
        } finally {
            setLoading(false);
        }
    }, [dateRange]);

    useEffect(() => {
        fetchReportData();
    }, [fetchReportData]);

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

    const handleExportPDF = async () => {
        if (!summaryRef.current || !barChartRef.current || !pieChartRef.current || !tableRef.current) return;

        try {
            setIsExporting(true);
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210;
            let yPosition = 10; // Starting y position with a margin

            // --- Helper Function to capture and add a section ---
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
            await addSectionToPDF(barChartRef, pdf);
            await addSectionToPDF(pieChartRef, pdf);
            await addSectionToPDF(tableRef, pdf);

            const date = new Date().toISOString().split('T')[0];
            const filename = `DoctorStaff_Report_${dateRange}_${date}.pdf`;
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
                        <p className="text-muted">Loading Doctor Staff Report...</p>
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
                        <h2 className="text-heading text-xl font-bold mb-2">Error Loading Report</h2>
                        <p className="text-muted mb-4">{error}</p>
                        <button
                            onClick={fetchReportData}
                            className="btn-primary"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }

    const { workloadByDoctor, distributionBySpecialization, topDoctorDetails } = chartData;

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
                </div>

                {/* Summary Stats */}
                <div ref={summaryRef} className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-card rounded-xl shadow-soft p-6">
                        <div className="flex items-center gap-4">
                            <div className={`${viewType === 'doctors' ? 'bg-accent-success' : 'bg-accent-sky'} bg-opacity-10 p-3 rounded-lg`}>
                                {viewType === 'doctors' ? <FaUserMd className="text-ondark" size={24} /> : <FaUserTie className="text-ondark" size={24} />}
                            </div>
                            <div>
                                <h3 className="text-heading text-2xl font-bold">{summaryData.ActiveDoctors}</h3>
                                <p className="text-muted text-sm">Active Doctors</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card rounded-xl shadow-soft p-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-primary bg-opacity-10 p-3 rounded-lg">
                                <FaCalendarCheck className="text-ondark" size={24} />
                            </div>
                            <div>
                                <h3 className="text-heading text-2xl font-bold">{summaryData.AvgAppointmentsPerDoctor}</h3>
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
                                <h3 className="text-heading text-2xl font-bold">{summaryData.AvgRating}</h3>
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
                                <h3 className="text-heading text-2xl font-bold">{summaryData.TopPerformerCount}</h3>
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
                            <div ref={barChartRef} className="bg-card rounded-xl shadow-soft p-6">
                                <h3 className="text-heading text-lg font-semibold mb-4 flex items-center gap-2">
                                    <FaUserMd className="text-accent-success" />
                                    <span>Workload Distribution ({dateRange})</span>
                                </h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={workloadByDoctor}>
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
                            <div ref={pieChartRef} className="bg-card rounded-xl shadow-soft p-6">
                                <h3 className="text-heading text-lg font-semibold mb-4 flex items-center gap-2">
                                    <FaUserMd className="text-primary" />
                                    <span>By Specialization ({dateRange})</span>
                                </h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={distributionBySpecialization}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {distributionBySpecialization.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Top Performing Doctors Table */}
                        <div ref={tableRef} className="bg-card rounded-xl shadow-soft p-6">
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
                                    {topDoctorDetails.map((doctor, index) => (
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