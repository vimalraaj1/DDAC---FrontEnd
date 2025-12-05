import api from "../api/axios";

const BASE_URL = "/consultations";

export const getConsultations = async () => {
    const res = await api.get(BASE_URL);
    return res.data;
}

export const addConsultation = async (consultation) => {
    const res = await api.post(BASE_URL, consultation);
    return res.data;
}

export const getConsultationById = async (id) => {
    const res = await api.get(`${BASE_URL}/${id}`);
    return res.data;
}

export const updateConsultation = async (id, consultation) => {
    const res = await api.post(`${BASE_URL}/${id}`, consultation);
    return res.data;
}

export const deleteConsultation = async (id) => {
    const res = await api.delete(`${BASE_URL}/${id}`);
}