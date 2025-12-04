import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../../components/Layout";
import * as paymentService from "../services/paymentService";
import * as appointmentService from "../services/appointmentService";
import { FaEye, FaCreditCard, FaDollarSign, FaCheckCircle, FaClock } from "react-icons/fa";
import { toast } from "sonner";
import { formatStaffDate } from "../utils/dateFormat";

export default function PaymentList() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPendingPayments();
  }, []);

  const loadPendingPayments = async () => {
    try {
      setLoading(true);
      // Get all appointments and filter for approved status
      const allAppointments = await appointmentService.getAllAppointments();
      const approvedAppointments = (allAppointments || []).filter(
        (appointment) => (appointment.status || "").toLowerCase() === "approved"
      );
      
      // Filter appointments that don't have a successful payment
      const pendingPayments = [];
      for (const appointment of approvedAppointments) {
        try {
          const payments = await paymentService.getPaymentsByAppointment(appointment.id || appointment._id);
          const hasPaid = payments?.some(
            (p) => (p.status || "").toLowerCase() === "paid" || (p.status || "").toLowerCase() === "successful"
          );
          if (!hasPaid) {
            pendingPayments.push(appointment);
          }
        } catch (err) {
          // If no payment found, it's pending
          pendingPayments.push(appointment);
        }
      }
      
      setAppointments(pendingPayments);
    } catch (error) {
      console.error("Error loading pending payments:", error);
      toast.error("Failed to load pending payments. Please try again.");
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (appointment) => {
    const appointmentId = appointment?.id || appointment?._id;
    if (!appointmentId) {
      toast.error("Unable to determine appointment identifier.");
      return;
    }

    navigate(`/staff/payment/${appointmentId}`, {
      state: {
        appointment,
        patient: appointment._patient || null,
      },
    });
  };

  const formatCurrency = (amount) => {
    return `RM ${(amount || 0).toFixed(2)}`;
  };

  const getPatientName = (appointment) => {
    if (appointment._patient) {
      return `${appointment._patient.firstName || ""} ${appointment._patient.lastName || ""}`.trim();
    }
    return appointment.patientName || appointment.patientId || "N/A";
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card rounded-xl shadow-soft p-6">
            <div className="flex items-center gap-4">
              <div className="bg-primary bg-opacity-10 p-3 rounded-lg">
                <FaCreditCard size={24} className="text-ondark" />
              </div>
              <div>
                <h3 className="text-heading text-2xl font-bold">{appointments.length}</h3>
                <p className="text-muted text-sm">Pending Payments</p>
              </div>
            </div>
          </div>
        </div>

        {/* Appointments Table */}
        <div className="bg-card rounded-xl shadow-soft overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <p className="text-muted">Loading pending payments...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-full table-fixed">
                <thead className="bg-primary border-b border-color">
                  <tr>
                    <th className="text-left py-4 px-6 text-ondark font-semibold text-sm break-all">Appointment ID</th>
                    <th className="text-left py-4 px-6 text-ondark font-semibold text-sm break-all">Patient</th>
                    <th className="text-left py-4 px-6 text-ondark font-semibold text-sm break-all">Doctor</th>
                    <th className="text-left py-4 px-6 text-ondark font-semibold text-sm break-all">Appointment Date</th>
                    <th className="text-left py-4 px-6 text-ondark font-semibold text-sm break-all">Time</th>
                    <th className="text-left py-4 px-6 text-ondark font-semibold text-sm break-all">Purpose</th>
                    <th className="text-center py-4 px-6 text-ondark font-semibold text-sm break-all">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.length > 0 ? (
                    appointments.map((appointment, index) => (
                      <tr
                        key={appointment.id || appointment._id}
                        className={`hover:bg-main border-t border-color transition-colors ${
                          index % 2 === 0 ? "" : "bg-main bg-opacity-30"
                        }`}
                      >
                        <td className="py-4 px-6">
                          <p className="text-body text-sm break-all">
                            {appointment.id || appointment._id || "N/A"}
                          </p>
                        </td>
                        <td className="py-4 px-6">
                          <p className="text-body text-sm">{getPatientName(appointment)}</p>
                        </td>
                        <td className="py-4 px-6">
                          <p className="text-body text-sm">
                            {appointment.doctorName || appointment.doctorId || "N/A"}
                          </p>
                        </td>
                        <td className="py-4 px-6">
                          <p className="text-body text-sm">
                            {formatStaffDate(appointment.date || appointment.appointmentDate)}
                          </p>
                        </td>
                        <td className="py-4 px-6">
                          <p className="text-body text-sm">{appointment.time || "N/A"}</p>
                        </td>
                        <td className="py-4 px-6">
                          <p className="text-body text-sm">{appointment.purpose || "N/A"}</p>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleViewDetails(appointment)}
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
                      <td colSpan="6" className="py-12 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <FaDollarSign size={48} className="text-muted opacity-50" />
                          <p className="text-muted text-lg">No pending payments</p>
                          <p className="text-muted text-sm">All approved appointments have been paid</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

