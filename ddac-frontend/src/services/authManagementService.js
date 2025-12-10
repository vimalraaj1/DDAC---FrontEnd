import api from "../api/axios";

const BASE_URL = "/Login";

export const login = async (credentials) => {
    const res = await api.post(BASE_URL, credentials);
    return res.data;
}

