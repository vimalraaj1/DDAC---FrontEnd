import api from "../api/axios";

const BASE_URL = "/managers";

export const getManagers = async () => {
    const res = await api.post(BASE_URL);
    return res.data;
}

export const registerManager = async (manager) => {
    const res = await api.post(BASE_URL, manager);
    return res.data;
} 

export const getManagerById = async (id) => {
    const res = await api.get(`${BASE_URL}/${id}`);
    return res.data;
}

export const updateManager = async (id, manager) => {
    const res = await api.put(`${BASE_URL}/${id}`, manager);
    return res.data;
}

export const deleteManager = async (id) => {
    const res = await api.delete(`${BASE_URL}/${id}`);
}