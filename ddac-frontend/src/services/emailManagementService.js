import api from "../api/axios";

const BASE_URL = "/Email";

export const sendEmail = async (payload) => {
    const res = await api.post(BASE_URL, payload);
    return res.data;
}


