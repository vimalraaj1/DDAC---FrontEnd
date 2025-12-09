import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import Layout from "../../../components/Layout";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import * as appointmentService from "../services/appointmentService";
import * as paymentService from "../services/paymentService";
import * as patientService from "../services/patientService";
import * as doctorService from "../services/doctorService";
import { FaPlus, FaCalendarAlt, FaClock, FaCheckCircle } from "react-icons/fa";
import { toast } from "sonner";
import { formatStaffDate } from "../utils/dateFormat";

export default function AppointmentList() {
  const [searchParams] = useSearchParams();
  const filter = searchParams.get("filter") || "all";
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [completedPendingPayments, setCompletedPendingPayments] = useState([]);
  const [completedPaid, setCompletedPaid] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCompleted, setLoadingCompleted] = useState(false);
  const [errorCompleted, setErrorCompleted] = useState(null);
  const [patientsMap, setPatientsMap] = useState({});
  const [doctorsMap, setDoctorsMap] = useState({});
  const [actionLoadingId, setActionLoadingId] = useState(null);

  useEffect(() => {
    loadAppointments();
    if (filter === "completed-pending" || filter === "completed-paid" || filter === "all") {
      loadCompletedAppointments();
    }
  }, [filter]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const data = await appointmentService.getAllAppointments();
      setAppointments(data || []);
      try {
        const [pList, dList] = await Promise.all([patientService.getAllPatients(), doctorService.getAllDoctors()]);
        const pMap = (pList || []).reduce((acc, p) => ({ ...acc, [p.id || p.patientId]: p }), {});
        const dMap = (dList || []).reduce((acc, d) => ({ ...acc, [d.id || d.doctorId]: d }), {});
        setPatientsMap(pMap);
        setDoctorsMap(dMap);
      } catch (err) {
        console.error("Error loading patient/doctor maps:", err);
      }
    } catch (error) {
      console.error("Error loading appointments:", error);
      setAppointments([]); 
    } finally {
      setLoading(false);
    }
  };

  const loadCompletedAppointments = async () => {
    try {
      setLoadingCompleted(true);
      setErrorCompleted(null);
      const [pendingPayments, paid] = await Promise.all([
        appointmentService.getCompletedAppointmentsWithPendingTransactions(),
        appointmentService.getCompletedAppointmentsWithPaidTransactions(),
      ]);
      setCompletedPendingPayments(Array.isArray(pendingPayments) ? pendingPayments : []);
      setCompletedPaid(Array.isArray(paid) ? paid : []);
    } catch (error) {
      console.error("Error loading completed appointments:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to load completed appointments";
      setErrorCompleted(errorMessage);
      toast.error(errorMessage);
      setCompletedPendingPayments([]);
      setCompletedPaid([]);
    } finally {
      setLoadingCompleted(false);
    }
  };

  // Helper to get columns based on filter type
  const getColumns = () => {
    // For completed-pending and completed-paid filters, use AppointmentPaymentStatusDto fields
    if (filter === "completed-pending" || filter === "completed-paid") {
      return [
        {
          key: "appointmentId",
          label: "Appointment ID",
          render: (value, row) => {
            const id = row.appointmentId || row.id || row._id || "N/A";
            return <div className="font-medium">{id}</div>;
          },
        },
        {
          key: "patientName",
          label: "Patient",
          render: (value, row) => {
            return <div className="font-medium">{row.patientName || "N/A"}</div>;
          },
        },
        {
          key: "doctorName",
          label: "Doctor",
          render: (value, row) => {
            return <div>{row.doctorName || "N/A"}</div>;
          },
        },
        {
          key: "appointmentDate",
          label: "Date",
          render: (value, row) => {
            const date = row.appointmentDate || row.date;
            return date ? formatStaffDate(date) : "N/A";
          },
        },
        {
          key: "appointmentTime",
          label: "Time",
          render: (value, row) => {
            return row.appointmentTime || row.time || "N/A";
          },
        },
        {
          key: "transactionAmount",
          label: "Amount",
          render: (value, row) => {
            const amount = row.transactionAmount;
            return amount ? `RM ${amount.toFixed(2)}` : "N/A";
          },
        },
        {
          key: "transactionStatus",
          label: "Payment Status",
          render: (value, row) => {
            return <StatusBadge status={row.transactionStatus || "N/A"} />;
          },
        },
      ];
    }
    
    // For completed-paid filter, add more transaction details
    if (filter === "completed-paid") {
      return [
        {
          key: "appointmentId",
          label: "Appointment ID",
          render: (value, row) => {
            const id = row.appointmentId || row.id || row._id || "N/A";
            return <div className="font-medium">{id}</div>;
          },
        },
        {
          key: "patientName",
          label: "Patient",
          render: (value, row) => {
            return <div className="font-medium">{row.patientName || "N/A"}</div>;
          },
        },
        {
          key: "doctorName",
          label: "Doctor",
          render: (value, row) => {
            return <div>{row.doctorName || "N/A"}</div>;
          },
        },
        {
          key: "appointmentDate",
          label: "Date",
          render: (value, row) => {
            const date = row.appointmentDate || row.date;
            return date ? formatStaffDate(date) : "N/A";
          },
        },
        {
          key: "appointmentTime",
          label: "Time",
          render: (value, row) => {
            return row.appointmentTime || row.time || "N/A";
          },
        },
        {
          key: "transactionAmount",
          label: "Amount",
          render: (value, row) => {
            const amount = row.transactionAmount;
            return amount ? `RM ${amount.toFixed(2)}` : "N/A";
          },
        },
        {
          key: "paymentMethod",
          label: "Payment Method",
          render: (value, row) => {
            return row.paymentMethod || "N/A";
          },
        },
        {
          key: "cardLast4",
          label: "Card Last 4",
          render: (value, row) => {
            return row.cardLast4 ? `****${row.cardLast4}` : "N/A";
          },
        },
        {
          key: "paymentTime",
          label: "Payment Date",
          render: (value, row) => {
            return row.paymentTime ? formatStaffDate(row.paymentTime) : "N/A";
          },
        },
        {
          key: "transactionStatus",
          label: "Status",
          render: (value, row) => {
            return <StatusBadge status={row.transactionStatus || "Paid"} />;
          },
        },
      ];
    }
    
    // Default columns for other filters
    return [
      {
        key: "patientId",
        label: "Patient",
        render: (value, row) => {
          const pid = value || row.patientId || row.patient?.id;
          const p = patientsMap[pid];
          const label = p ? `${p.firstName || ""} ${p.lastName || ""}`.trim() : pid || "N/A";
          return <div className="font-medium">{label}</div>;
        },
      },
      {
        key: "doctorId",
        label: "Doctor",
        render: (value, row) => {
          const did = value || row.doctorId || row.doctor?.id;
          const d = doctorsMap[did];
          const label = d ? `${d.firstName || ""} ${d.lastName || ""}`.trim() : did || "N/A";
          return <div>{label}</div>;
        },
      },
      {
        key: "date",
        label: "Date",
        render: (value) => formatStaffDate(value),
      },
      { key: "time", label: "Time" },
      { key: "purpose", label: "Purpose" },
      { key: "status", label: "Status", render: (value) => <StatusBadge status={value} /> },
    ];
  };

  const columns = getColumns();

  const getRowClassName = (row) => {
    const status = (row.status || "").toLowerCase();
    if (status === "completed") return "bg-blue-50";
    if (status === "paid") return "bg-green-50";
    return "";
  };

  const handleApprove = async (event, row) => {
    event.stopPropagation();
    const appointmentId = row.id;
    if (!appointmentId) return;
    try {
      setActionLoadingId(appointmentId);
      await appointmentService.approveAppointment(appointmentId);
      toast.success("Appointment marked as approved.");
      await loadAppointments();
    } catch (error) {
      console.error("Error approving appointment:", error);
      toast.error("Unable to approve appointment. Please try again.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (event, row) => {
    event.stopPropagation();
    const appointmentId = row.id;
    if (!appointmentId) return;
    const reason =
      window.prompt("Please provide a reason for rejecting this appointment:", "Rejected by staff") ||
      "Rejected by staff";
    try {
      setActionLoadingId(appointmentId);
      await appointmentService.rejectAppointment(appointmentId, reason);
      toast.success("Appointment marked as rejected.");
      await loadAppointments();
    } catch (error) {
      console.error("Error rejecting appointment:", error);
      toast.error("Unable to reject appointment. Please try again.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleNoShow = async (event, row) => {
    event.stopPropagation();
    const appointmentId = row.id;
    if (!appointmentId) return;
    try {
      setActionLoadingId(appointmentId);
      await appointmentService.markAppointmentAsNoShow(appointmentId);
      toast.success("Appointment marked as no show.");
      await loadAppointments();
    } catch (error) {
      console.error("Error marking appointment as no show:", error);
      toast.error("Unable to mark appointment as no show. Please try again.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleComplete = async (event, row) => {
    event.stopPropagation();
    const appointmentId = row.id;
    if (!appointmentId) return;
    try {
      setActionLoadingId(appointmentId);
      await appointmentService.completeAppointment(appointmentId, { completedAt: new Date().toISOString() });
      
      try {
        // Create initial pending transaction (Requirement: Create payment intent on completion)
        await paymentService.createStripeSession(appointmentId, { 
          amount: 2, // Placeholder amount, will be updated in PaymentDetails
          currency: 'MYR' 
        });
      } catch (err) {
        console.error("Failed to create initial payment intent:", err);
        // Continue navigation; staff can retry payment process in the next screen if needed
      }

      toast.success("Appointment marked as completed.");
      // Navigate directly to payment after completing
      navigate(`/staff/payment/${appointmentId}`, {
        state: {
          appointment: row,
          patient: patientsMap[row.patientId],
        },
      });
    } catch (error) {
      console.error("Error completing appointment:", error);
      toast.error("Unable to complete appointment. Please try again.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const tabs = [
    { label: "All", filter: "all" },
    { label: "Today", filter: "today" },
    { label: "Scheduled", filter: "scheduled" },
    { label: "Approved", filter: "approved" },
    { label: "Completed (Pending Payment)", filter: "completed-pending" },
    { label: "Paid", filter: "completed-paid" },
    { label: "Others", filter: "others" },
  ];

  const totalAppointments = appointments.length;
  const scheduledAppointments = appointments.filter(
    (appointment) => (appointment.status || "").toLowerCase() === "scheduled"
  ).length;
  const completedAppointments = appointments.filter(
    (appointment) => (appointment.status || "").toLowerCase() === "completed"
  ).length;
  const approvedAppointments = appointments.filter(
    (appointment) => (appointment.status || "").toLowerCase() === "approved"
  ).length;

  const today = new Date();
  const isSameDay = (dateStr) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    return (
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate()
    );
  };

  const getFilteredAppointments = () => {
    if (filter === "completed-pending") {
      return completedPendingPayments;
    }
    if (filter === "completed-paid") {
      return completedPaid;
    }
    
    return appointments.filter((appointment) => {
      const status = (appointment.status || "").toLowerCase();
      if (filter === "scheduled") return status === "scheduled";
      if (filter === "pending") return status === "scheduled"; // backward compatibility
      if (filter === "completed") return status === "completed";
      if (filter === "approved") return status === "approved";
      if (filter === "paid") return status === "paid";
      if (filter === "today") return isSameDay(appointment.date);
      if (filter === "others") return status === "cancelled" || status === "rejected" || status === "no show";
      return true; // "all" or any unknown filter
    });
  };

  const filteredAppointments = getFilteredAppointments();

  return (
    <Layout role="staff">
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Appointments</h1>
              <p className="text-gray-600">Manage and review all appointments</p>
            </div>
            <Link
              to="/staff/appointments/new"
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover flex items-center gap-2"
            >
              <FaPlus size={16} />
              Create Appointment
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-card rounded-xl shadow-soft p-6">
              <div className="flex items-center gap-4">
                <div className="bg-primary bg-opacity-10 p-3 rounded-lg">
                  <FaCalendarAlt size={24} className="text-ondark" />
                </div>
                <div>
                  <h3 className="text-heading text-2xl font-bold">{totalAppointments}</h3>
                  <p className="text-muted text-sm">Total Appointments</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl shadow-soft p-6">
              <div className="flex items-center gap-4">
                <div className="bg-yellow-500 bg-opacity-10 p-3 rounded-lg">
                  <FaClock size={24} className="text-ondark" />
                </div>
                <div>
                  <h3 className="text-heading text-2xl font-bold">{scheduledAppointments}</h3>
                  <p className="text-muted text-sm">Scheduled</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl shadow-soft p-6">
              <div className="flex items-center gap-4">
                <div className="bg-blue-500 bg-opacity-10 p-3 rounded-lg">
                  <FaClock size={24} className="text-ondark" />
                </div>
                <div>
                  <h3 className="text-heading text-2xl font-bold">{approvedAppointments}</h3>
                  <p className="text-muted text-sm">Approved</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl shadow-soft p-6">
              <div className="flex items-center gap-4">
                <div className="bg-purple-500 bg-opacity-10 p-3 rounded-lg">
                  <FaCheckCircle size={24} className="text-ondark" />
                </div>
                <div>
                  <h3 className="text-heading text-2xl font-bold">
                    {loadingCompleted ? "..." : completedPendingPayments.length}
                  </h3>
                  <p className="text-muted text-sm">Completed (Unpaid)</p>
                  <p className="text-muted text-xs mt-1">Transaction: Pending</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl shadow-soft p-6">
              <div className="flex items-center gap-4">
                <div className="bg-green-500 bg-opacity-10 p-3 rounded-lg">
                  <FaCheckCircle size={24} className="text-ondark" />
                </div>
                <div>
                  <h3 className="text-heading text-2xl font-bold">
                    {loadingCompleted ? "..." : completedPaid.length}
                  </h3>
                  <p className="text-muted text-sm">Paid Appointments</p>
                  <p className="text-muted text-xs mt-1">Transaction: Paid</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-md mb-6">
            <div className="flex border-b border-gray-200">
              {tabs.map((tab) => (
                <button
                  key={tab.filter}
                  onClick={() => navigate(`/staff/appointments?filter=${tab.filter}`)}
                  className={`px-6 py-3 font-medium text-sm ${
                    filter === tab.filter ? "border-b-2 border-primary text-primary" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Appointments Table */}
          {(loading || (loadingCompleted && (filter === "completed-pending" || filter === "completed-paid"))) ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-500">Loading appointments...</p>
            </div>
          ) : errorCompleted && (filter === "completed-pending" || filter === "completed-paid") ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-red-600 mb-2">Error loading data</p>
              <p className="text-gray-500 text-sm mb-4">{errorCompleted}</p>
              <button
                onClick={loadCompletedAppointments}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover"
              >
                Retry
              </button>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={filteredAppointments}
              rowClassName={getRowClassName}
              actions={(row) => {
                // For completed-pending and completed-paid, show different actions
                if (filter === "completed-pending") {
                  const appointmentId = row.appointmentId || row.id || row._id;
                  return (
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/staff/payment/${appointmentId}`);
                        }}
                        className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700"
                      >
                        Process Payment
                      </button>
                    </div>
                  );
                }
                
                if (filter === "completed-paid") {
                  const appointmentId = row.appointmentId || row.id || row._id;
                  return (
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/staff/payment/receipt/view?appointmentId=${appointmentId}`);
                        }}
                        className="px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700"
                      >
                        View Receipt
                      </button>
                    </div>
                  );
                }
                
                // Default actions for other filters
                const status = (row.status || "").toLowerCase();
                const isScheduled = status === "scheduled";
                const isApproved = status === "approved";
                return (
                  <div className="flex gap-2">
                    {isScheduled && (
                      <>
                        <button
                          onClick={(event) => handleApprove(event, row)}
                          disabled={actionLoadingId === row.id}
                          className="px-3 py-1 rounded-lg bg-green-600 text-white text-xs font-medium hover:bg-green-700 disabled:opacity-50"
                        >
                          {actionLoadingId === row.id ? "Approving..." : "Approve"}
                        </button>
                        <button
                          onClick={(event) => handleReject(event, row)}
                          disabled={actionLoadingId === row.id}
                          className="px-3 py-1 rounded-lg bg-red-600 text-white text-xs font-medium hover:bg-red-700 disabled:opacity-50"
                        >
                          {actionLoadingId === row.id ? "Rejecting..." : "Reject"}
                        </button>
                      </>
                    )}
                    {isApproved && (
                      <>
                        <button
                          onClick={(event) => handleNoShow(event, row)}
                          disabled={actionLoadingId === row.id}
                          className="px-3 py-1 rounded-lg bg-orange-600 text-white text-xs font-medium hover:bg-orange-700 disabled:opacity-50"
                        >
                          {actionLoadingId === row.id ? "Updating..." : "No Show"}
                        </button>
                        <button
                          onClick={(event) => handleComplete(event, row)}
                          disabled={actionLoadingId === row.id}
                          className="px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 disabled:opacity-50"
                        >
                          {actionLoadingId === row.id ? "Completing..." : "Complete"}
                        </button>
                      </>
                    )}
                  </div>
                );
              }}
              onRowClick={(row) => {
                const appointmentId = row.appointmentId || row.id || row._id;
                if (!appointmentId) return;
                navigate(`/staff/appointments/${appointmentId}`);
              }}
            />
          )}
        </div>
      </div>
    </Layout>
  );
}
