import api from "../api/axios";

const BASE_URL = "/comments";

export const getComments = async () => {
    const res = await api.get(BASE_URL);
    return res.data;
}

const addComment = async (comment) => {
    const res = await api.post(BASE_URL, comment);
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
}

export const averageStaffRating = async (staffId) => {
    const res = await api.get(`${BASE_URL}/staffs/${staffId}/average-rating`);
    return res.data;
}