import api from "../api/axios";

const BASE_URL = "/Staff";

export const getStaffs = async () => {
    const res = await api.get(BASE_URL);
    return res.data;
}

export const registerStaff = async (staff) => {
    const res = await api.post(`${BASE_URL}/register`, staff);
    return res.data;
}

export const getStaffById = async (id) => {
    const res = await api.get(`${BASE_URL}/${id}`);
    return res.data;
}

export const updateStaff = async (id, staff) => {
    const res = await api.put(`${BASE_URL}/${id}`, staff);
    return res.data;
}

export const deleteStaff = async (id) => {
    const res = await api.delete(`${BASE_URL}/${id}`);
}
