import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../../components/Layout";
import * as appointmentService from "../services/appointmentService";
import { FaEye, FaCreditCard, FaDollarSign, FaCheckCircle, FaClock, FaFileInvoice, FaSpinner } from "react-icons/fa";
import { toast } from "sonner";
import { formatStaffDate } from "../utils/dateFormat";

export default function PaymentList() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [paidAppointments, setPaidAppointments] = useState([]);
  const [loadingPending, setLoadingPending] = useState(true);
  const [loadingPaid, setLoadingPaid] = useState(true);
  const [errorPending, setErrorPending] = useState(null);
  const [errorPaid, setErrorPaid] = useState(null);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'paid'

  useEffect(() => {
    loadPendingPayments();
    loadPaidTransactions();
  }, []);

  const loadPendingPayments = async () => {
    try {
      setLoadingPending(true);
      setErrorPending(null);
      // Get completed appointments with pending transactions using new backend endpoint
      // Returns AppointmentPaymentStatusDto[] with appointmentStatus = "Completed" AND transactionStatus = "Pending"
      const data = await appointmentService.getCompletedAppointmentsWithPendingTransactions();
      setAppointments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading pending payments:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to load pending payments";
      setErrorPending(errorMessage);
      toast.error(errorMessage);
      setAppointments([]);
    } finally {
      setLoadingPending(false);
    }
  };

  const loadPaidTransactions = async () => {
    try {
      setLoadingPaid(true);
      setErrorPaid(null);
      // Get completed appointments with paid transactions using new backend endpoint
      // Returns AppointmentPaymentStatusDto[] with appointmentStatus = "Completed" AND transactionStatus = "Paid"
      const data = await appointmentService.getCompletedAppointmentsWithPaidTransactions();
      setPaidAppointments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading paid transactions:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to load paid transactions";
      setErrorPaid(errorMessage);
      toast.error(errorMessage);
      setPaidAppointments([]);
    } finally {
      setLoadingPaid(false);
    }
  };

  const handleViewDetails = (item) => {
    const appointmentId = getAppointmentId(item);
    if (!appointmentId || appointmentId === "N/A") {
      toast.error("Unable to determine appointment identifier.");
      return;
    }

    navigate(`/staff/payment/${appointmentId}`, {
      state: {
        appointment: item,
        patient: { name: getPatientName(item) },
      },
    });
  };

  const viewReceipt = (item) => {
    const appointmentId = getAppointmentId(item);
    if (!appointmentId || appointmentId === "N/A") {
      toast.error("Unable to determine appointment identifier.");
      return;
    }
    // Navigate to receipt view with appointment ID
    navigate(`/staff/payment/receipt/view?appointmentId=${appointmentId}`);
  };

  const formatCurrency = (amount) => {
    return `RM ${(amount || 0).toFixed(2)}`;
  };

  // Helper to get appointment ID from AppointmentPaymentStatusDto
  const getAppointmentId = (item) => {
    return item.appointmentId || item.id || item._id || "N/A";
  };

  // Helper to get patient name from AppointmentPaymentStatusDto
  const getPatientName = (item) => {
    return item.patientName || "N/A";
  };

  // Helper to get doctor name from AppointmentPaymentStatusDto
  const getDoctorName = (item) => {
    return item.doctorName || "N/A";
  };

  // Helper to get appointment date from AppointmentPaymentStatusDto
  const getAppointmentDate = (item) => {
    return item.appointmentDate || item.date || null;
  };

  // Helper to get appointment time from AppointmentPaymentStatusDto
  const getAppointmentTime = (item) => {
    return item.appointmentTime || item.time || "N/A";
  };

  return (
    <Layout role="staff">
      <div className="w-full max-w-full overflow-hidden">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-heading">Payment Management</h1>
          <p className="text-muted mt-1">Process payments for approved appointments</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-card rounded-xl shadow-soft p-6">
            <div className="flex items-center gap-4">
              <div className="bg-yellow-500 bg-opacity-10 p-3 rounded-lg">
                <FaClock size={24} className="text-ondark" />
              </div>
              <div>
                <h3 className="text-heading text-2xl font-bold">
                  {loadingPending ? "..." : appointments.length}
                </h3>
                <p className="text-muted text-sm">Completed (Unpaid)</p>
                <p className="text-muted text-xs mt-1">
                  Appointment Status: Completed • Transaction Status: Pending
                </p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl shadow-soft p-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-600 bg-opacity-10 p-3 rounded-lg">
                <FaCheckCircle size={24} className="text-ondark"/>
              </div>
              <div>
                <h3 className="text-heading text-2xl font-bold">
                  {loadingPaid ? "..." : paidAppointments.length}
                </h3>
                <p className="text-muted text-sm">Paid Appointments</p>
                <p className="text-muted text-xs mt-1">
                  Appointment Status: Completed • Transaction Status: Paid
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-color">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'pending'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted hover:text-heading'
              }`}
            >
              Pending Payments ({appointments.length})
            </button>
            <button
              onClick={() => setActiveTab('paid')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'paid'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted hover:text-heading'
              }`}
            >
              Paid Appointments ({paidAppointments.length})
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'pending' ? (
          <div className="bg-card rounded-xl shadow-soft overflow-hidden">
            {loadingPending ? (
              <div className="p-12 text-center">
                <FaSpinner className="animate-spin mx-auto mb-4 text-primary" size={32} />
                <p className="text-muted">Loading completed appointments (unpaid)...</p>
              </div>
            ) : errorPending ? (
              <div className="p-12 text-center">
                <p className="text-red-600 mb-2">Error loading data</p>
                <p className="text-muted text-sm">{errorPending}</p>
                <button
                  onClick={loadPendingPayments}
                  className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover"
                >
                  Retry
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-full table-fixed">
                  <thead className="bg-primary border-b border-color">
                    <tr>
                      <th className="text-left py-4 px-6 text-ondark font-semibold text-sm break-all">Appointment ID</th>
                      <th className="text-left py-4 px-6 text-ondark font-semibold text-sm break-all">Patient</th>
                      <th className="text-left py-4 px-6 text-ondark font-semibold text-sm break-all">Doctor</th>
                      <th className="text-left py-4 px-6 text-ondark font-semibold text-sm break-all">Date</th>
                      <th className="text-left py-4 px-6 text-ondark font-semibold text-sm break-all">Time</th>
                      <th className="text-left py-4 px-6 text-ondark font-semibold text-sm break-all">Amount</th>
                      <th className="text-left py-4 px-6 text-ondark font-semibold text-sm break-all">Status</th>
                      <th className="text-center py-4 px-6 text-ondark font-semibold text-sm break-all">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.length > 0 ? (
                      appointments.map((item, index) => (
                        <tr
                          key={getAppointmentId(item)}
                          className={`hover:bg-main border-t border-color transition-colors ${
                            index % 2 === 0 ? "" : "bg-main bg-opacity-30"
                          }`}
                        >
                          <td className="py-4 px-6">
                            <p className="text-body text-sm break-all">{getAppointmentId(item)}</p>
                          </td>
                          <td className="py-4 px-6">
                            <p className="text-body text-sm">{getPatientName(item)}</p>
                          </td>
                          <td className="py-4 px-6">
                            <p className="text-body text-sm">{getDoctorName(item)}</p>
                          </td>
                          <td className="py-4 px-6">
                            <p className="text-body text-sm">
                              {getAppointmentDate(item) ? formatStaffDate(getAppointmentDate(item)) : "N/A"}
                            </p>
                          </td>
                          <td className="py-4 px-6">
                            <p className="text-body text-sm">{getAppointmentTime(item)}</p>
                          </td>
                          <td className="py-4 px-6">
                            <p className="text-body text-sm font-semibold">
                              {item.transactionAmount ? formatCurrency(item.transactionAmount) : "N/A"}
                            </p>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              (item.transactionStatus || "").toLowerCase() === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }`}>
                              {item.transactionStatus || "Pending"}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleViewDetails(item)}
                                className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700"
                                title="Process Payment"
                              >
                                Pay
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="py-12 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <FaDollarSign size={48} className="text-muted opacity-50" />
                            <p className="text-muted text-lg">No completed appointments (unpaid)</p>
                            <p className="text-muted text-sm">All completed appointments have been paid</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-card rounded-xl shadow-soft overflow-hidden">
            {loadingPaid ? (
              <div className="p-12 text-center">
                <FaSpinner className="animate-spin mx-auto mb-4 text-primary" size={32} />
                <p className="text-muted">Loading paid appointments...</p>
              </div>
            ) : errorPaid ? (
              <div className="p-12 text-center">
                <p className="text-red-600 mb-2">Error loading data</p>
                <p className="text-muted text-sm">{errorPaid}</p>
                <button
                  onClick={loadPaidTransactions}
                  className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover"
                >
                  Retry
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-full table-fixed">
                  <thead className="bg-primary border-b border-color">
                    <tr>
                      <th className="text-left py-4 px-6 text-ondark font-semibold text-sm break-all">Appointment ID</th>
                      <th className="text-left py-4 px-6 text-ondark font-semibold text-sm break-all">Patient</th>
                      <th className="text-left py-4 px-6 text-ondark font-semibold text-sm break-all">Doctor</th>
                      <th className="text-left py-4 px-6 text-ondark font-semibold text-sm break-all">Date</th>
                      <th className="text-left py-4 px-6 text-ondark font-semibold text-sm break-all">Amount</th>
                      <th className="text-left py-4 px-6 text-ondark font-semibold text-sm break-all">Payment Method</th>
                      <th className="text-left py-4 px-6 text-ondark font-semibold text-sm break-all">Card Last 4</th>
                      <th className="text-left py-4 px-6 text-ondark font-semibold text-sm break-all">Payment Date</th>
                      <th className="text-left py-4 px-6 text-ondark font-semibold text-sm break-all">Status</th>
                      <th className="text-center py-4 px-6 text-ondark font-semibold text-sm break-all">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paidAppointments.length > 0 ? (
                      paidAppointments.map((item, index) => (
                        <tr
                          key={getAppointmentId(item)}
                          className={`hover:bg-main border-t border-color transition-colors ${
                            index % 2 === 0 ? "" : "bg-main bg-opacity-30"
                          }`}
                        >
                          <td className="py-4 px-6">
                            <p className="text-body text-sm break-all">{getAppointmentId(item)}</p>
                          </td>
                          <td className="py-4 px-6">
                            <p className="text-body text-sm">{getPatientName(item)}</p>
                          </td>
                          <td className="py-4 px-6">
                            <p className="text-body text-sm">{getDoctorName(item)}</p>
                          </td>
                          <td className="py-4 px-6">
                            <p className="text-body text-sm">
                              {getAppointmentDate(item) ? formatStaffDate(getAppointmentDate(item)) : "N/A"}
                            </p>
                          </td>
                          <td className="py-4 px-6">
                            <p className="text-body text-sm font-semibold">
                              {item.transactionAmount ? formatCurrency(item.transactionAmount) : "N/A"}
                            </p>
                          </td>
                          <td className="py-4 px-6">
                            <p className="text-body text-sm">
                              {item.paymentMethod || "N/A"}
                            </p>
                          </td>
                          <td className="py-4 px-6">
                            <p className="text-body text-sm">
                              {item.cardLast4 ? `****${item.cardLast4}` : "N/A"}
                            </p>
                          </td>
                          <td className="py-4 px-6">
                            <p className="text-body text-sm">
                              {item.paymentTime ? formatStaffDate(item.paymentTime) : "N/A"}
                            </p>
                          </td>
                          <td className="py-4 px-6">
                            <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                              {"Paid"}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center justify-center gap-2">
                              {item.receipt ? (
                                <button
                                  onClick={() => viewReceipt(item)}
                                  className="px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 flex items-center gap-1"
                                  title="View Receipt"
                                >
                                  <FaFileInvoice size={12} />
                                  Receipt
                                </button>
                              ) : (
                                <span className="text-muted text-xs">No receipt</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="10" className="py-12 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <FaFileInvoice size={48} className="text-muted opacity-50" />
                            <p className="text-muted text-lg">No paid appointments</p>
                            <p className="text-muted text-sm">Paid appointments will appear here</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}

