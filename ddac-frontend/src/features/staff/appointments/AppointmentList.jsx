import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Layout from "../../../components/Layout";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import Modal from "../components/Modal";
import * as appointmentService from "../services/appointmentService";
import { FaCheck, FaTimes, FaFilePrescription } from "react-icons/fa";

export default function AppointmentList() {
  const [searchParams] = useSearchParams();
  const filter = searchParams.get("filter") || "all";
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState(null);

  useEffect(() => {
    loadAppointments();
  }, [filter]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      let data = [];
      if (filter === "pending") {
        data = await appointmentService.getPendingAppointments();
      } else if (filter === "completed") {
        data = await appointmentService.getCompletedAppointments();
      } else {
        data = await appointmentService.getAllAppointments();
      }
      setAppointments(data || []);
    } catch (error) {
      console.error("Error loading appointments:", error);
      // Mock data
      setAppointments([
        {
          id: 1,
          patientName: "John Doe",
          date: "2024-12-20",
          time: "10:00",
          status: "pending",
          reason: "General checkup",
        },
        {
          id: 2,
          patientName: "Jane Smith",
          date: "2024-12-19",
          time: "14:00",
          status: "completed",
          reason: "Follow-up",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await appointmentService.approveAppointment(id);
      loadAppointments();
      setShowActionModal(false);
    } catch (error) {
      console.error("Error approving appointment:", error);
      alert("Error approving appointment");
    }
  };

  const handleReject = async (id, reason) => {
    try {
      await appointmentService.rejectAppointment(id, reason);
      loadAppointments();
      setShowActionModal(false);
    } catch (error) {
      console.error("Error rejecting appointment:", error);
      alert("Error rejecting appointment");
    }
  };

  const handleAction = (appointment, type) => {
    setSelectedAppointment(appointment);
    setActionType(type);
    setShowActionModal(true);
  };

  const columns = [
    {
      key: "patientName",
      label: "Patient",
      render: (value, row) => (
        <div className="font-medium text-gray-900">{value || row.patient?.name || "N/A"}</div>
      ),
    },
    {
      key: "date",
      label: "Date",
      render: (value) => value ? new Date(value).toLocaleDateString() : "N/A",
    },
    {
      key: "time",
      label: "Time",
    },
    {
      key: "reason",
      label: "Reason",
    },
    {
      key: "status",
      label: "Status",
      render: (value) => <StatusBadge status={value} />,
    },
  ];

  const actions = (row) => {
    if (row.status === "pending") {
      return (
        <div className="flex items-center gap-8">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAction(row, "approve");
            }}
            className="text-green-600 hover:text-green-800"
            title="Approve"
          >
            <FaCheck size={20} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAction(row, "reject");
            }}
            className="text-red-600 hover:text-red-800"
            title="Reject"
          >
            <FaTimes size={20} />
          </button>
        </div>
      );
    } else if (row.status === "completed") {
      return (
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/staff/prescriptions/new?appointmentId=${row.id}`);
          }}
          className="text-blue-600 hover:text-blue-800"
          title="Assign Prescription"
        >
          <FaFilePrescription size={20} />
        </button>
      );
    }
    return null;
  };

  const tabs = [
    { label: "All", filter: "all" },
    { label: "Pending", filter: "pending" },
    { label: "Completed", filter: "completed" },
  ];

  return (
    <Layout role="staff">
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Appointments</h1>
            <p className="text-gray-600">Manage and review all appointments</p>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-md mb-6">
            <div className="flex border-b border-gray-200">
              {tabs.map((tab) => (
                <button
                  key={tab.filter}
                  onClick={() => navigate(`/staff/appointments?filter=${tab.filter}`)}
                  className={`px-6 py-3 font-medium text-sm ${
                    filter === tab.filter
                      ? "border-b-2 border-primary text-primary"
                      : "text-gray-600 hover:text-gray-900"
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
              data={appointments}
              onRowClick={(row) => navigate(`/staff/appointments/${row.id}`)}
              actions={actions}
            />
          )}
        </div>

        {/* Action Modal */}
        <Modal
          isOpen={showActionModal}
          onClose={() => setShowActionModal(false)}
          title={actionType === "approve" ? "Approve Appointment" : "Reject Appointment"}
        >
          {selectedAppointment && (
            <div className="space-y-4">
              <p>
                {actionType === "approve"
                  ? "Are you sure you want to approve this appointment?"
                  : "Are you sure you want to reject this appointment?"}
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">Patient: {selectedAppointment.patientName}</p>
                <p>Date: {selectedAppointment.date}</p>
                <p>Time: {selectedAppointment.time}</p>
              </div>
              {actionType === "reject" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rejection Reason
                  </label>
                  <textarea
                    id="reason"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    placeholder="Enter reason for rejection..."
                  />
                </div>
              )}
              <div className="flex gap-4 justify-end">
                <button
                  onClick={() => setShowActionModal(false)}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (actionType === "approve") {
                      handleApprove(selectedAppointment.id);
                    } else {
                      const reason = document.getElementById("reason")?.value || "";
                      handleReject(selectedAppointment.id, reason);
                    }
                  }}
                  className={`px-4 py-2 rounded-lg text-white ${
                    actionType === "approve"
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {actionType === "approve" ? "Approve" : "Reject"}
                </button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </Layout>
  );
}

