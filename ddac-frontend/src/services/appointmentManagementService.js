import api from "../api/axios";

const BASE_URL = "/appointments";

// GET all appointments with patientID
export const getAppointmentsByPatientId = async (patientId) => {
  const res = await api.get(`${BASE_URL}/patient/${patientId}/appointments`);
  return res.data;
};

export const registerAppointments = async (appointment) => {
  const res = await api.post(`${BASE_URL}`, appointment);
  return res.data;
}
