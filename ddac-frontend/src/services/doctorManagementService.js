import api from "../api/axios";

const BASE_URL = "/doctors";

// GET all appointments with patientID
export const getDoctors = async () => {
  const res = await api.get(`${BASE_URL}`);
  return res.data;
};

export const registerDoctor = async (payload) => {
  const res = await api.post(`${BASE_URL}`, payload);
  return res.data;
}

export const getDoctorById = async (id) => {
    const res = await api.get(`${BASE_URL}/${id}`);
    return res.data;
}

export const updateDoctor = async (id, payload) => {
    const res = await api.put(`${BASE_URL}/${id}`, payload);
    return res.data;
}

const deleteDoctor = async (id) => {
    const res = await api.delete(`${BASE_URL}/${id}`);
}