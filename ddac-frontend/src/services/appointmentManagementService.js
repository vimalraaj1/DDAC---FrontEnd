import api from "../api/axios";

const BASE_URL = "/appointments";

// GET all appointments with patientID
export const getAppointmentsByPatientId = async (patientId) => {
  const res = await api.get(`${BASE_URL}/patient/${patientId}/appointments`);
  return res.data;
};

export const registerAppointment = async (appointment) => {
  const res = await api.post(`${BASE_URL}`, appointment);
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

export const updateAppointment = async (id, appointment) => {
    const res = await api.put(`${BASE_URL}/${id}`, appointment);
    return res.data;
}

export const deleteAppointment = async (id) => {
    const res = await api.delete(`${BASE_URL}/${id}`);
}