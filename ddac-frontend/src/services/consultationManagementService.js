import api from "../api/axios";

const BASE_URL = "/consultations";

// GET all appointments with patientID
export const getConsultationsByPatientId = async (patientId) => {
  const res = await api.get(`${BASE_URL}/patient/${patientId}/consultations`);
  return res.data;
};

