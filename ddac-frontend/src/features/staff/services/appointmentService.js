import staffApi from "./staffApi";

// Get all appointments
export const getAllAppointments = async () => {
  const response = await staffApi.get("/appointments");
  return response.data;
};

// Get pending appointments
export const getPendingAppointments = async () => {
  const response = await staffApi.get("/appointments/pending");
  return response.data;
};

// Get completed appointments
export const getCompletedAppointments = async () => {
  const response = await staffApi.get("/appointments/completed");
  return response.data;
};

// Get appointment by ID
export const getAppointmentById = async (id) => {
  const response = await staffApi.get(`/appointments/${id}`);
  return response.data;
};

// Approve appointment
export const approveAppointment = async (id) => {
  const response = await staffApi.patch(`/appointments/${id}/approve`);
  return response.data;
};

// Reject appointment
export const rejectAppointment = async (id, reason) => {
  const response = await staffApi.patch(`/appointments/${id}/reject`, { reason });
  return response.data;
};

// Update appointment status
export const updateAppointmentStatus = async (id, status) => {
  const response = await staffApi.patch(`/appointments/${id}/status`, { status });
  return response.data;
};

