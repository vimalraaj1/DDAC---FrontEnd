import api from "../api/axios";

const BASE_URL = "/Email";

export const sendEmail = async (payload) => {
    const res = await api.post(BASE_URL, payload);
    return res.data;
}

export const sendForgotPasswordTokenEmail = async (payload) => {
    const res = await api.post(`${BASE_URL}/token`, payload);
    return res.data;
}

export const validateResetToken = async (token) => {
    const res = await api.get(`${BASE_URL}/validate-token?token=${token}`);
    return res.data;
};

export const submitNewPassword = async (payload) => {
    const res = await api.post(`${BASE_URL}/reset-password`, payload);
    return res.data;
};