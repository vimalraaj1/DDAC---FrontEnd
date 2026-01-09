import api from "../api/axios";

const BASE_URL = "/medical-documents";

export const getMedicalDocument = async () => {
    const res = await api.post(BASE_URL);
    return res.data;
}

export const addMedicalDocument = async (doc) => {
    const res = await api.post(BASE_URL, doc);
    return res.data;
}

export const getMedicalDocumentById = async (id) => {
    const res = await api.get(`${BASE_URL}/${id}`);
    return res.data;
}

export const updateMedicalDocument = async (id, doc) => {
    const res = await api.put(`${BASE_URL}/${id}`, doc);
    return res.data;
}

export const deleteMedicalDocument = async (id) => {
    const res = await api.delete(`${BASE_URL}/${id}`);
}

export const getMedicalDocumentByPatientId = async (patientId) => {
    const res = await api.get(`${BASE_URL}/patient/${patientId}`);
    return res.data;
}