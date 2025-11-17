import axios from "axios";

const BASE_URL = "http://localhost:5000/appointments";

// GET all appointments
export const getAllAppointments = async () => {
  const res = await axios.get(BASE_URL);
  return res.data;
};

// CREATE new appointment
export const createAppointment = async (appointment) => {
  const res = await axios.post(BASE_URL, appointment);
  return res.data;
};

// UPDATE appointment
export const updateAppointment = async (id, updated) => {
  const res = await axios.put(`${BASE_URL}/${id}`, updated);
  return res.data;
};

// DELETE appointment
export const deleteAppointment = async (id) => {
  await axios.delete(`${BASE_URL}/${id}`);
};
