import api from "../api/axios";

const BASE_URL = "/doctors";

// GET all appointments with patientID
export const getDoctors = async () => {
  const res = await api.get(`${BASE_URL}`);
  return res.data;
};

export const addDoctors = async (payload) => {
  const res = await api.post(`${BASE_URL}`, payload);
  return res.data;
}