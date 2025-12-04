import api from "../api/axios";

const BASE_URL = "/doctor-availabilities";

// GET all appointments with patientID
export const getAvailabilitiesByDoctorId = async (doctorId) => {
  const res = await api.get(`${BASE_URL}/doctor/${doctorId}/doctor-availabilities`);
  return res.data;
};

export const updateAvailabilityByAppointmentId = async (appointmentId) => {
  const res = await api.patch(`${BASE_URL}/${appointmentId}/bookAvailability`);
  return res.data;
}

