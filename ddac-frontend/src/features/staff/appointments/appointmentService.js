import staffApi from "../services/staffApi";

const APPOINTMENT_ENDPOINT = "/appointments";

// GET all appointments
export const getAllAppointments = async () => {
  const res = await staffApi.get(APPOINTMENT_ENDPOINT);
  return res.data;
};

// CREATE new appointment
export const createAppointment = async (appointment) => {
  const res = await staffApi.post(APPOINTMENT_ENDPOINT, appointment);
  return res.data;
};

// UPDATE appointment
export const updateAppointment = async (id, updated) => {
  const res = await staffApi.put(`${APPOINTMENT_ENDPOINT}/${id}`, updated);
  return res.data;
};

// DELETE appointment
export const deleteAppointment = async (id) => {
  await staffApi.delete(`${APPOINTMENT_ENDPOINT}/${id}`);
};
