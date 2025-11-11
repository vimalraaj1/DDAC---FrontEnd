import axios from "axios";

// change to backend url when set up
const BASE_URL = "http://localhost:5000/api";

const api = axios.create({
    baseURL: BASE_URL,
    header: {
        "Content-Type": "application/json",
    },
});

export default api;