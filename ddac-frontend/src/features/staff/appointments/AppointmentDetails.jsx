import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Layout from "../../../components/Layout";
import StatusBadge from "../components/StatusBadge";
import * as appointmentService from "../services/appointmentService";
import * as patientService from "../services/patientService";
import * as doctorService from "../services/doctorService";
import * as profileService from "../services/profileService";
import * as paymentService from "../services/paymentService";
import { FaArrowLeft, FaCheckCircle, FaSpinner, FaTimesCircle } from "react-icons/fa";
import { toast } from "sonner";
import { formatStaffDate } from "../utils/dateFormat";

export default function AppointmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const appointmentIdValue = appointment?.id ?? id;
  const normalizedStatus = (appointment?.status || "").toLowerCase();
  const canApprove = normalizedStatus === "scheduled";
  const canComplete = normalizedStatus === "approved";
  const isPaid = normalizedStatus === "paid";

  useEffect(() => {
    loadAppointment();
  }, [id]);

  const handleApprove = async () => {
    if (!appointmentIdValue) {
      toast.error("Unable to determine appointment identifier.");
      return;
    }
    try {
      setActionLoading(true);
      await appointmentService.approveAppointment(appointmentIdValue);
      toast.success("Appointment approved.");
      await loadAppointment();
    } catch (error) {
      console.error("Error approving appointment:", error);
      toast.error("Failed to approve appointment. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!appointmentIdValue) {
      toast.error("Unable to determine appointment identifier.");
      return;
    }

    const reason =
      window.prompt("Please provide a reason for rejecting this appointment:", "Rejected by staff") ||
      "Rejected by staff";

    try {
      setActionLoading(true);
      await appointmentService.rejectAppointment(appointmentIdValue, reason);
      toast.success("Appointment rejected.");
      await loadAppointment();
    } catch (error) {
      console.error("Error rejecting appointment:", error);
      toast.error("Failed to reject appointment. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const loadAppointment = async () => {
    try {
      setLoading(true);
      const data = await appointmentService.getAppointmentById(id);
      // try to enrich with related objects
      try {
        if (data?.patientId) {
          const p = await patientService.getPatientById(data.patientId);
          data._patient = p;
        }
        if (data?.doctorId) {
          const d = await doctorService.getDoctorById(data.doctorId);
          data._doctor = d;
        }
        if (data?.staffId) {
          const s = await profileService.getProfile();
          data._staff = s;
        }
      } catch (err) {
        // ignore enrichment errors
      }
      setAppointment(data);
    } catch (error) {
      console.error("Error loading appointment:", error);
      toast.error("Failed to load appointment details. Please try again.");
      setAppointment(null);
    } finally {
      setLoading(false);
    }
  };

  const handleNoShow = async () => {
    if (!appointmentIdValue) {
      toast.error("Unable to determine appointment identifier.");
      return;
    }
    try {
      setActionLoading(true);
      await appointmentService.markAppointmentAsNoShow(appointmentIdValue);
      toast.success("Appointment marked as no show.");
      await loadAppointment();
    } catch (error) {
      console.error("Error marking appointment as no show:", error);
      toast.error("Failed to mark appointment as no show. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!appointmentIdValue) {
      toast.error("Unable to determine appointment identifier.");
      return;
    }
    try {
      setActionLoading(true);
      await appointmentService.completeAppointment(appointmentIdValue, { completedAt: new Date().toISOString() });

      try {
        // Create initial pending transaction (Requirement: Create payment intent on completion)
        await paymentService.createStripeSession(appointmentIdValue, { 
          amount: 2, // Placeholder amount
          currency: 'MYR' 
        });
      } catch (err) {
        console.error("Failed to create initial payment intent:", err);
      }

      toast.success("Appointment marked as completed.");
      // Navigate directly to payment after completing
      navigate(`/staff/payment/${appointmentIdValue}`, {
        state: { appointment, patient: appointment?._patient },
      });
    } catch (error) {
      console.error("Error completing appointment:", error);
      toast.error("Failed to complete appointment. Please try again.");
    } finally {
      setActionLoading(false);
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
                <h4 className="text-lg font-bold text-gray-900 mb-2">{appointment.id}</h4>
              </div>
              <div className="flex gap-2">
                {canApprove && (
                  <>
                    <button
                      onClick={handleApprove}
                      disabled={actionLoading}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 disabled:opacity-60"
                    >
                      {actionLoading ? (
                        <>
                          <FaSpinner className="animate-spin" size={16} />
                          Approving...
                        </>
                      ) : (
                        <>
                          <FaCheckCircle size={16} />
                          Approve
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleReject}
                      disabled={actionLoading}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2 disabled:opacity-60"
                    >
                      {actionLoading ? (
                        <>
                          <FaSpinner className="animate-spin" size={16} />
                          Rejecting...
                        </>
                      ) : (
                        <>
                          <FaTimesCircle size={16} />
                          Reject
                        </>
                      )}
                    </button>
                  </>
                )}
                {canComplete && (
                  <>
                    <button
                      onClick={handleNoShow}
                      disabled={actionLoading}
                      className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center gap-2 disabled:opacity-60"
                    >
                      {actionLoading ? (
                        <>
                          <FaSpinner className="animate-spin" size={16} />
                          Updating...
                        </>
                      ) : (
                        <>
                          <FaTimesCircle size={16} />
                          No Show
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleComplete}
                      disabled={actionLoading}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-60"
                    >
                      {actionLoading ? (
                        <>
                          <FaSpinner className="animate-spin" size={16} />
                          Completing...
                        </>
                      ) : (
                        <>
                          <FaCheckCircle size={16} />
                          Complete
                        </>
                      )}
                    </button>
                  </>
                )}
                {isPaid && (
                  <div className="px-4 py-2 rounded-lg bg-green-50 text-green-700 font-medium border border-green-200">
                    Payment Completed
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Appointment Information</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Patient</p>
                    <p className="text-gray-900 font-medium">
                      {appointment._patient ? `${appointment._patient.firstName || ""} ${appointment._patient.lastName || ""}`.trim() : appointment.patientId || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Doctor</p>
                    <p className="text-gray-900 font-medium">{appointment._doctor ? `${appointment._doctor.firstName || ""} ${appointment._doctor.lastName || ""}`.trim() : appointment.doctorId || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="text-gray-900 font-medium">{formatStaffDate(appointment.date)}</p>
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
                    <p className="text-sm text-gray-500">Purpose</p>
                    <p className="text-gray-900 font-medium">{appointment.purpose || "N/A"}</p>
                  </div>
                  {appointment.status === "Completed" && appointment.comment && (
                    <div>
                      <p className="text-sm text-gray-500">Doctor&apos;s Comment</p>
                      <p className="text-gray-900 font-medium whitespace-pre-wrap">{appointment.comment}</p>
                    </div>
                  )}
                  {appointment.status === "Cancelled" && (
                    <div>
                      <p className="text-sm text-gray-500">Cancellation Reason</p>
                      <p className="text-gray-900 font-medium">{appointment.cancellationReason || "N/A"}</p>
                    </div>
                  )}
                  {appointment.status === "Rejected" && (
                    <div>
                      <p className="text-sm text-gray-500">Cancellation Reason</p>
                      <p className="text-gray-900 font-medium">{appointment.cancellationReason || "N/A"}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-500">Handled By</p>
                    <p className="text-gray-900 font-medium">{appointment._staff ? appointment._staff.fullName || appointment._staff.email : appointment.staffId || "N/A"}</p>
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

