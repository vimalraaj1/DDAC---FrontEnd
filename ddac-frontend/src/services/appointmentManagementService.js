import api from "../api/axios";

const BASE_URL = "/appointments";

// GET all appointments with patientID
export const getAppointmentsByPatientId = async (patientId) => {
  const res = await api.get(`${BASE_URL}/patient/${patientId}/appointments`);
  return res.data;
};

export const getAppointmentByAppointmentId = async (appointmentId) => {
  const res = await api.get(`${BASE_URL}/${appointmentId}`);
  return res.data;
};

export const getUpcomingAppointmentByPatientId = async (patientId) => {
  const res = await api.get(`${BASE_URL}/upcoming/${patientId}`);
  return res.data;
}


export const registerAppointments = async (appointment) => {
  const res = await api.post(`${BASE_URL}`, appointment);
  return res.data;
}

export const updateAppointment = async (appointmentId, payload) => {
  const res = await api.put(`${BASE_URL}/${appointmentId}`, payload);
  return res.data;
}
export const getAppointments = async () => {
    const res = await api.post(`${BASE_URL}`);
    return res.data;
}

export const getAppointmentById = async (id) => {
    const res = await api.delete(`${BASE_URL}/${id}`);
    return res.data;
}


export const deleteAppointment = async (id) => {
    const res = await api.delete(`${BASE_URL}/${id}`);
    return res.data;
}