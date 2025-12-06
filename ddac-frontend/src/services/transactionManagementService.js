import api from "../api/axios";

const BASE_URL = "/transactions";

export const getTransactions = async () => {
    const res = await api.get(BASE_URL);
    return res.data;
}

const addTransaction = async (transaction) => {
    const res = await api.post(BASE_URL, transaction);
    return res.data;
}

export const getTransactionById = async (id) => {
    const res = await api.get(`${BASE_URL}/${id}`);
    return res.data;
}

export const updateTransaction = async (id, transaction) => {
    const res = await api.post(`${BASE_URL}/${id}`, transaction);
    return res.data;
}

export const deleteTransaction = async (id) => {
    const res = await api.delete(`${BASE_URL}/${id}`);
}

export const getTransactionsByPatientId = async (patientId) => {
    const res = await api.get(`${BASE_URL}/${patientId}/patient`);
    return res.data;
}

export const exportAllTransactionsToCsvAsync = async () => {
    const res = await api.get(`${BASE_URL}/export-all-transactions`);
    return res.data;
}

export const exportTransactionsToCsvAsync = async (id) => {
    const res = await api.get(`${BASE_URL}/${id}/export-transaction`);
    return res.data;
}