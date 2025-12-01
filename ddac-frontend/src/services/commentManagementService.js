import api from "../api/axios";

const BASE_URL = "/comments";

// GET all appointments with patientID
export const getCommentsByPatientId = async (patientId) => {
  const res = await api.get(`${BASE_URL}/patient/${patientId}/comments`);
  return res.data;
};

export const addComment = async (commentId, payload) => {
  const res = await api.put(`${BASE_URL}/${commentId}`, payload);
  return res.data;
}