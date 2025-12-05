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

export const getComments = async () => {
    const res = await api.get(BASE_URL);
    return res.data;
}

export const getCommentById = async (id) => {
    const res = await api.get(`${BASE_URL}/${id}`);
    return res.data;
}

export const updateComment = async (id, comment) => {
    const res = await api.post(`${BASE_URL}/${id}`, comment);
    return res.data;
}

export const deleteComment = async (id) => {
    const res = await api.delete(`${BASE_URL}/${id}`);
    return res.data;
}

export const averageStaffRating = async (staffId) => {
    const res = await api.get(`${BASE_URL}/staffs/${staffId}/average-rating`);
    return res.data;
}