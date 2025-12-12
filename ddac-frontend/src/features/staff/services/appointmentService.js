import staffApi from "./staffApi";
import * as paymentService from "./paymentService";

const APPOINTMENT_ENDPOINT = "/appointments";

const mapAppointmentPayload = (payload = {}) => ({
  id: payload.id?.trim() ?? "",
  date: payload.date ?? "",
  time: payload.time ?? "",
  status: payload.status ?? "Scheduled",
  patientId: payload.patientId?.trim() ?? "",
  doctorId: payload.doctorId?.trim() ?? "",
  staffId: payload.staffId?.trim() ?? "",
  purpose: payload.purpose ?? "",
  cancellationReason: payload.cancellationReason || null,
});

const getAppointments = async (params = {}) => {
  const response = await staffApi.get(APPOINTMENT_ENDPOINT, { params });
  return response.data;
};

export const getAllAppointments = () => getAppointments();

export const getScheduledAppointments = async () => {
  const response = await staffApi.get(`${APPOINTMENT_ENDPOINT}/status/scheduled`);
  return response.data;
};

// Keep for backward compatibility
export const getPendingAppointments = getScheduledAppointments;

export const getCompletedAppointments = async () => {
  const response = await staffApi.get(`${APPOINTMENT_ENDPOINT}/status/completed`);
  return response.data;
};

// Get appointments by payment status using the transactions endpoint
// Endpoint: GET /api/transactions/appointments/by-payment-status?paymentStatus={Pending|Paid}
// Returns list of objects with appointment info, patient/doctor names, and latest transaction info
export const getAppointmentsByPaymentStatus = async (paymentStatus) => {
  return await paymentService.getAppointmentsByPaymentStatus(paymentStatus);
};

// Get completed appointments with pending transactions
// Uses the new backend endpoint that returns appointment + transaction data
// Conditions: appointmentStatus = "Completed" AND transactionStatus = "Pending"
export const getCompletedAppointmentsWithPendingTransactions = async () => {
  try {
    const data = await getAppointmentsByPaymentStatus("Pending");
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching appointments with pending payments:", error);
    return [];
  }
};

// Get completed appointments with paid transactions
// Conditions: transactionStatus = "Paid" OR "succeeded"
export const getCompletedAppointmentsWithPaidTransactions = async () => {
  try {
    const paid = await getAppointmentsByPaymentStatus("Paid");
    const succeeded = await getAppointmentsByPaymentStatus("succeede");

    // Normalize to arrays
    const listPaid = Array.isArray(paid) ? paid : [];
    const listSucceeded = Array.isArray(succeeded) ? succeeded : [];

    // Combine and remove duplicates by appointmentId
    const combined = [...listPaid, ...listSucceeded].reduce((acc, item) => {
      acc[item.appointmentId] = item;
      return acc;
    }, {});

    return Object.values(combined);

  } catch (error) {
    console.error(
      "Error fetching appointments with paid/succeeded transactions:",
      error
    );
    return [];
  }
};

export const getAppointmentById = async (id) => {
  const response = await staffApi.get(`${APPOINTMENT_ENDPOINT}/${id}`);
  return response.data;
};

export const createAppointment = async (appointmentData) => {
  const response = await staffApi.post(
    APPOINTMENT_ENDPOINT,
    mapAppointmentPayload(appointmentData)
  );
  return response.data;
};

export const updateAppointment = async (id, appointmentData) => {
  const response = await staffApi.put(
    `${APPOINTMENT_ENDPOINT}/${id}`,
    mapAppointmentPayload(appointmentData)
  );
  return response.data;
};

export const approveAppointment = async (id) => {
  const response = await staffApi.patch(`${APPOINTMENT_ENDPOINT}/${id}/approve`);
  return response.data;
};

export const rejectAppointment = async (id, reason) => {
  const response = await staffApi.patch(
    `${APPOINTMENT_ENDPOINT}/${id}/reject`,
    JSON.stringify(reason || "Rejected"),
    {
      headers: { "Content-Type": "application/json" }
    }
  );

  return response.data;
};


export const updateAppointmentStatus = async (id, status, extra = {}) => {
  const response = await staffApi.patch(`${APPOINTMENT_ENDPOINT}/${id}`, {
    status,
    ...extra,
  });
  return response.data;
};

export const completeAppointment = async (id) => {
  const response = await staffApi.patch(`${APPOINTMENT_ENDPOINT}/${id}/complete`);
  return response.data;
};


export const markAppointmentAsNoShow = async (id) => {
  const response = await staffApi.patch(`${APPOINTMENT_ENDPOINT}/${id}/mark-no-show`);
  return response.data;
};

export const markAppointmentAsPaid = async (id, payload = {}) => {
  return updateAppointmentStatus(id, "Paid", payload);
};

export const getConsultationByAppointmentId = async (appointmentId) => {
  const response = await staffApi.get(`/consultations/appointment/${appointmentId}`);
  return response.data;
};
