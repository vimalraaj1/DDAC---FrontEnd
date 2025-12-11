import api from "../api/axios";

const BASE_URL = "/doctor-availabilities";

// GET all appointments with patientID
export const getAvailabilitiesByDoctorId = async (doctorId) => {
  const res = await api.get(`${BASE_URL}/doctor/${doctorId}/doctor-availabilities`);
  return res.data;
};

export const getAvailabilities = async () => {
    const res = await api.get(BASE_URL);
    return res.data;
}

export const addAvailability = async (availability) => {
    const res = await api.post(BASE_URL, availability);
    return res.data;
}

export const getAvailabilityById = async (id) => {
    const res = await api.get(`${BASE_URL}/${id}`);
    return res.data;
}

export const updateAvailability = async (id, availability) => {
    const res = await api.put(`${BASE_URL}/${id}`, availability);
    return res.data;
}

export const deleteAvailability = async (id) => {
    const res = await api.delete(`${BASE_URL}/${id}`);
}

export const getDateAndTimeAfterSelectDoctor = async (doctorId) => {
    const res = await api.get(`${BASE_URL}/doctors/${doctorId}/dateAndTime`);
    return res.data;
}

export const bookAppointment = async (id, appointmentId) => {
    const res = await api.patch(`${BASE_URL}/${id}/bookAvailability/${appointmentId}`);
    return res.data;
}

export const unbookAppointment = async (appointmentId) => {
    const res = await api.patch(`${BASE_URL}/${appointmentId}/unbookAvailability`);
    return res.data;
}
