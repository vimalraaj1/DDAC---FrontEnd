import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import Layout from "../../../components/Layout";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import * as appointmentService from "../services/appointmentService";
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
  const [loading, setLoading] = useState(true);
  const [patientsMap, setPatientsMap] = useState({});
  const [doctorsMap, setDoctorsMap] = useState({});
  const [actionLoadingId, setActionLoadingId] = useState(null);

  useEffect(() => {
    loadAppointments();
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

  const columns = [
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
    { label: "Pending", filter: "pending" },
    { label: "Approved", filter: "approved" },
    { label: "Completed", filter: "completed" },
    { label: "Others", filter: "others" },
  ];

  const totalAppointments = appointments.length;
  const pendingAppointments = appointments.filter(
    (appointment) => (appointment.status || "").toLowerCase() === "pending"
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

  const filteredAppointments = appointments.filter((appointment) => {
    const status = (appointment.status || "").toLowerCase();
    if (filter === "pending") return status === "pending";
    if (filter === "completed") return status === "completed";
    if (filter === "approved") return status === "approved";
    if (filter === "paid") return status === "paid";
    if (filter === "today") return isSameDay(appointment.date);
    if (filter === "others") return status === "cancelled" || status === "rejected" || status === "no show";
    return true; // "all" or any unknown filter
  });

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                <div className="bg-accent-warning bg-opacity-10 p-3 rounded-lg">
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
                <div className="bg-accent-success bg-opacity-10 p-3 rounded-lg">
                  <FaCheckCircle size={24} className="text-ondark" />
                </div>
                <div>
                  <h3 className="text-heading text-2xl font-bold">{completedAppointments}</h3>
                  <p className="text-muted text-sm">Completed</p>
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
          {loading ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-500">Loading appointments...</p>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={filteredAppointments}
              rowClassName={getRowClassName}
              actions={(row) => {
                const status = (row.status || "").toLowerCase();
                const isPending = status === "pending";
                const isApproved = status === "approved";
                return (
                  <div className="flex gap-2">
                    {isPending && (
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
                const appointmentId = row.id;
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
