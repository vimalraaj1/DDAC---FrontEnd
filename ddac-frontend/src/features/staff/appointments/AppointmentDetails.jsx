import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Layout from "../../../components/Layout";
import StatusBadge from "../components/StatusBadge";
import * as appointmentService from "../services/appointmentService";
import { FaArrowLeft, FaCheck, FaTimes, FaFilePrescription } from "react-icons/fa";

export default function AppointmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAppointment();
  }, [id]);

  const loadAppointment = async () => {
    try {
      setLoading(true);
      const data = await appointmentService.getAppointmentById(id);
      setAppointment(data);
    } catch (error) {
      console.error("Error loading appointment:", error);
      // Mock data
      setAppointment({
        id: id,
        patientName: "John Doe",
        date: "2024-12-20",
        time: "10:00",
        status: "pending",
        reason: "General checkup",
        notes: "Patient requested follow-up",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      await appointmentService.approveAppointment(id);
      loadAppointment();
    } catch (error) {
      console.error("Error approving appointment:", error);
    }
  };

  const handleReject = async () => {
    const reason = prompt("Enter rejection reason:");
    if (reason) {
      try {
        await appointmentService.rejectAppointment(id, reason);
        loadAppointment();
      } catch (error) {
        console.error("Error rejecting appointment:", error);
      }
    }
  };

  if (loading) {
    return (
      <Layout role="staff">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <p className="text-gray-500">Loading appointment details...</p>
        </div>
      </Layout>
    );
  }

  if (!appointment) {
    return (
      <Layout role="staff">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 mb-4">Appointment not found</p>
            <Link to="/staff/appointments" className="text-primary hover:underline">
              Back to Appointments
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout role="staff">
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Link
              to="/staff/appointments"
              className="text-primary hover:underline flex items-center gap-2 mb-4"
            >
              <FaArrowLeft size={16} />
              Back to Appointments
            </Link>
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Appointment Details</h1>
                <StatusBadge status={appointment.status} />
              </div>
              {appointment.status === "pending" && (
                <div className="flex gap-2">
                  <button
                    onClick={handleApprove}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                  >
                    <FaCheck size={16} />
                    Approve
                  </button>
                  <button
                    onClick={handleReject}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2"
                  >
                    <FaTimes size={16} />
                    Reject
                  </button>
                </div>
              )}
              {appointment.status === "completed" && (
                <Link
                  to={`/staff/prescriptions/new?appointmentId=${id}`}
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover flex items-center gap-2"
                >
                  <FaFilePrescription size={16} />
                  Assign Prescription
                </Link>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Appointment Information</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Patient Name</p>
                    <p className="text-gray-900 font-medium">
                      {appointment.patientName || appointment.patient?.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="text-gray-900 font-medium">
                      {appointment.date ? new Date(appointment.date).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="text-gray-900 font-medium">{appointment.time || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <StatusBadge status={appointment.status} />
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Details</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Reason</p>
                    <p className="text-gray-900 font-medium">{appointment.reason || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Notes</p>
                    <p className="text-gray-900 font-medium">{appointment.notes || "No notes"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

