import api from "../api/axios";

const BASE_URL = "/reports";

export const getReportsSummary = async () => {
    const res = await api.get(`${BASE_URL}/summary`);
    return res.data;
};

export const getFinancialChartDetails = async (range) => {
    const res = await api.get(`${BASE_URL}/financial-details?range=${range}`);
    return res.data;
};

export const getAppointmentChartDetails = async (range) => {
    const res = await api.get(`${BASE_URL}/appointment-details?range=${range}`);
    return res.data;
};

export const getDoctorStaffChartDetails = async (startDate,  endDate) => {
    const res = await api.get(`${BASE_URL}/doctor-details?range=${startDate}&range=${endDate}`);
    return res.data;
};