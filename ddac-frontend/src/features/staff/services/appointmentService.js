import staffApi from "./staffApi";

const APPOINTMENT_ENDPOINT = "/appointments";

const mapAppointmentPayload = (payload = {}) => ({
  id: payload.id?.trim() ?? "",
  date: payload.date ?? "",
  time: payload.time ?? "",
  status: payload.status ?? "Pending",
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

export const getPendingAppointments = async () => {
  const response = await staffApi.get(`${APPOINTMENT_ENDPOINT}/status/pending`);
  return response.data;
};

export const getCompletedAppointments = async () => {
  const response = await staffApi.get(`${APPOINTMENT_ENDPOINT}/status/completed`);
  return response.data;
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

export const completeAppointment = async (id, payload = {}) => {
  const response = await staffApi.patch(`${APPOINTMENT_ENDPOINT}/${id}/complete`);
  return response.data;
};

export const markAppointmentAsPaid = async (id, payload = {}) => {
  return updateAppointmentStatus(id, "Paid", payload);
};

export const getConsultationByAppointmentId = async (appointmentId) => {
  const response = await staffApi.get(`/consultations/appointment/${appointmentId}`);
  return response.data;
};
