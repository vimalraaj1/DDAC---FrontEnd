import '../../../index.css';
import Layout from '../../../components/Layout.jsx';
import {useCallback, useEffect, useRef, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaArrowLeft, FaDownload, FaDollarSign, FaCheckCircle,
    FaClock, FaTimesCircle, FaCalendarAlt, FaCreditCard, FaFileUpload
} from 'react-icons/fa';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {getFinancialChartDetails, getReportsSummary} from "../../../services/reportManagementService.js";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {toast} from "sonner";

export default function FinancialReport() {
    const navigate = useNavigate();
    const [dateRange, setDateRange] = useState('month');
    const [summaryData, setSummaryData] = useState({});
    const [reportData, setReportData] = useState({
        revenueOverTime: [],
        paymentStatus: [],
        paymentMethods: [],
        summaryStats: {}
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const reportRef = useRef(null);
    const [isExporting, setIsExporting] = useState(false);

    const summaryRef = useRef(null);
    const lineChartRef = useRef(null);
    const pieChartRef = useRef(null);
    const methodsRef = useRef(null);
    const tableRef = useRef(null);

    const formatCurrency = (amount) => {
        if (amount === undefined || amount === null || isNaN(amount)) {
            return 'RM 0.00';
        }
        return `RM ${parseFloat(amount).toLocaleString('en-MY', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    };
    
    const fetchReportData = useCallback(async () => {
        let totalRevenueFiltered = 0;
        let totalTransactionsFiltered = 0;
        let avgTransactionFiltered = 0;

        try {
            setLoading(true);
            setError(null);

            const summaryResponse = await getReportsSummary();
            const summary = summaryResponse.transaction || {};
            setSummaryData(summary);

            const chartData = await getFinancialChartDetails(dateRange);
            totalRevenueFiltered = chartData.revenueOverTime.reduce((sum, item) => sum + item.revenue, 0);
            totalTransactionsFiltered = chartData.paymentStatus.reduce((sum, item) => sum + item.count, 0);
            avgTransactionFiltered = totalTransactionsFiltered > 0
                ? totalRevenueFiltered / totalTransactionsFiltered
                : 0;

            const finalStats = {
                totalRevenue: summary.totalRevenue,
                successRate: summary.successRate,
                totalTransactionsFiltered: totalTransactionsFiltered,
                avgTransactionFiltered: avgTransactionFiltered,

                growthRate: 0,
                changeInTransactions: 0,
                changeInAvgTransaction: 0,
                changeInSuccessRate: 0
            }

            setReportData({
                revenueOverTime: chartData.revenueOverTime.map(d => ({ month: d.period, revenue: d.revenue })),
                paymentStatus: chartData.paymentStatus.map(d => ({
                    name: d.category.charAt(0).toUpperCase() + d.category.slice(1),
                    value: d.count,
                    color: { 'succeeded': 'var(--accent-success)', 'succeed': 'var(--accent-success)', 'succeede': 'var(--accent-success)', 'successful': 'var(--accent-success)', 'success': 'var(--accent-success)', 'completed': 'var(--accent-success)', 'pending': 'var(--accent-warning)', 'failed': 'var(--accent-danger)', 'error': 'var(--accent-danger)', 'refunded': 'var(--accent-sky)', 'paid': 'var(--accent-success)' }[d.category.toLowerCase()] || '#7f8c8d'
                })),
                paymentMethods: chartData.paymentMethods.map(d => ({ method: d.category, count: d.count })),
                summaryStats: finalStats
            });

        } catch (err) {
            console.error('Error fetching financial report:', err);
            setError(err.message || 'Failed to fetch financial report');
            setReportData({ revenueOverTime: [], paymentStatus: [], paymentMethods: [], summaryStats: {} });
        } finally {
            setLoading(false);
        }
    }, [dateRange]);

    useEffect(() => {
        fetchReportData();
    }, [dateRange, fetchReportData]);

    const handleExportPDF = async () => {
        if (!summaryRef.current || !lineChartRef.current || !pieChartRef.current || !methodsRef.current || !tableRef.current) return;

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
            await addSectionToPDF(lineChartRef, pdf);
            await addSectionToPDF(pieChartRef, pdf);
            await addSectionToPDF(methodsRef, pdf);
            await addSectionToPDF(tableRef, pdf);
            
            const date = new Date().toISOString().split('T')[0];
            const filename = `Financial_Report_${dateRange}_${date}.pdf`;
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
                        <div className="flex items-start gap-4">
                            <div className="bg-accent-success bg-opacity-10 p-3 rounded-lg">
                                <FaDollarSign className="text-ondark" size={24} />
                            </div>
                            <div>
                                <h3 className="text-heading text-2xl font-bold">{formatCurrency(reportData.summaryStats.totalRevenue)}</h3>
                                <p className="text-muted text-sm">Total Revenue</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card rounded-xl shadow-soft p-6">
                        <div className="flex items-start gap-4">
                            <div className="bg-primary bg-opacity-10 p-3 rounded-lg">
                                <FaCheckCircle className="text-ondark" size={24} />
                            </div>
                            <div>
                                <h3 className="text-heading text-2xl font-bold">{reportData.summaryStats.totalTransactionsFiltered || 0}</h3>
                                <p className="text-muted text-sm">Successful ({dateRange})</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card rounded-xl shadow-soft p-6">
                        <div className="flex items-start gap-4">
                            <div className="bg-accent-warning bg-opacity-10 p-3 rounded-lg">
                                <FaClock className="text-ondark" size={24} />
                            </div>
                            <div>
                                <h3 className="text-heading text-2xl font-bold">{formatCurrency(reportData.summaryStats.avgTransactionFiltered)}</h3>
                                <p className="text-muted text-sm">Avg Transaction ({dateRange})</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card rounded-xl shadow-soft p-6">
                        <div className="flex items-start gap-4">
                            <div className="bg-accent-sky bg-opacity-10 p-3 rounded-lg">
                                <FaCalendarAlt className="text-ondark" size={24} />
                            </div>
                            <div>
                                <h3 className="text-heading text-2xl font-bold">{reportData.summaryStats.successRate || 0}%</h3>
                                <p className="text-muted text-sm">Growth Rate</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Revenue Over Time - Line Chart */}
                    <div ref={lineChartRef} className="bg-card rounded-xl shadow-soft p-6">
                        <h3 className="text-heading text-lg font-semibold mb-4 flex items-center gap-2">
                            <FaDollarSign className="text-primary" />
                            <span>Revenue Over Time</span>
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={reportData.revenueOverTime}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                                <XAxis dataKey="month" stroke="#7A7A7A" tick={{ fontSize: 12 }}/>
                                <YAxis stroke="#7A7A7A" tick={{ fontSize: 12 }} width={70} tickFormatter={(value) => formatCurrency(value)}/>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px' }}
                                    formatter={(value) => [formatCurrency(value), 'Revenue']}
                                />
                                <Legend/>
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
                    <div ref={pieChartRef} className="bg-card rounded-xl shadow-soft p-6">
                        <h3 className="text-heading text-lg font-semibold mb-4 flex items-center gap-2">
                            <FaCheckCircle className="text-accent-success" />
                            <span>Payment Status Distribution</span>
                        </h3>
                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie
                                    data={reportData.paymentStatus}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={70}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {reportData.paymentStatus.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Payment Methods - Bar Chart */}
                    <div ref={methodsRef} className="bg-card rounded-xl shadow-soft p-6 lg:col-span-2">
                        <h3 className="text-heading text-lg font-semibold mb-4 flex items-center gap-2">
                            <FaCreditCard className="text-accent-sky" />
                            <span>Payment Methods Distribution</span>
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={reportData.paymentMethods}>
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
                <div ref={tableRef}className="bg-card rounded-xl shadow-soft p-6">
                    <h3 className="text-heading text-lg font-semibold mb-4">Summary Details ({dateRange} Filter</h3>
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
                                <td className="py-3 px-4 text-heading font-semibold text-right">{reportData.summaryStats.totalTransactionsFiltered || 0}</td>
                                <td className="py-3 px-4 text-accent-success font-semibold text-right">{reportData.summaryStats.changeInTransactions > 0 ? `+${reportData.summaryStats.changeInTransactions}%` : `${reportData.summaryStats.changeInTransactions || 0}%`}</td>
                            </tr>
                            <tr className="border-b border-color">
                                <td className="py-3 px-4 text-body">Average Transaction</td>
                                <td className="py-3 px-4 text-heading font-semibold text-right">{formatCurrency(reportData.summaryStats.avgTransactionFiltered)}</td>
                                <td className="py-3 px-4 text-accent-success font-semibold text-right">{reportData.summaryStats.changeInAvgTransaction > 0 ? `+${reportData.summaryStats.changeInAvgTransaction}%` : `${reportData.summaryStats.changeInAvgTransaction || 0}%`}</td>
                            </tr>
                            <tr className="border-b border-color">
                                <td className="py-3 px-4 text-body">Success Rate</td>
                                <td className="py-3 px-4 text-heading font-semibold text-right">{reportData.summaryStats.successRate || 0}% (Overall)</td>
                                <td className="py-3 px-4 text-accent-success font-semibold text-right">{reportData.summaryStats.changeInSuccessRate > 0 ? `+${reportData.summaryStats.changeInSuccessRate}%` : `${reportData.summaryStats.changeInSuccessRate || 0}%`}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Layout>
    );
}