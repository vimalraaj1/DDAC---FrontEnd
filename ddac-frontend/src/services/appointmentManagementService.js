import api from "../api/axios";

const BASE_URL = "/appointments";

// GET all appointments with patientID
export const getAppointmentsByPatientId = async (patientId) => {
    const res = await api.get(`${BASE_URL}/patient/${patientId}/appointments`);
    return res.data;
};

export const getAppointmentByAppointmentId = async (appointmentId) => {
    const res = await api.get(`${BASE_URL}/${appointmentId}`);
    return res.data;
};

export const getUpcomingAppointmentByPatientId = async (patientId) => {
    const res = await api.get(`${BASE_URL}/upcoming/${patientId}`);
    return res.data;
}

export const registerAppointment = async (appointment) => {
    const res = await api.post(`${BASE_URL}`, appointment);
    return res.data;
}

export const getAppointments = async () => {
    const res = await api.get(`${BASE_URL}`);
    return res.data;
}

export const getAppointmentById = async (id) => {
    const res = await api.get(`${BASE_URL}/${id}`);
    return res.data;
}

export const updateAppointment = async (id, appointment) => {
    const res = await api.put(`${BASE_URL}/${id}`, appointment);
    return res.data;
}

export const deleteAppointment = async (id) => {
    const res = await api.delete(`${BASE_URL}/${id}`);
}

export const CountNumberOfUniquePatientsByDoctorId = async (doctorId) => {
    const res = await api.get(`${BASE_URL}/doctors/${doctorId}/patient-count`);
    return res.data;
}

export const CountNumberOfAppointmentsByDoctorId = async (doctorId) => {
    const res = await api.get(`${BASE_URL}/doctors/${doctorId}/appointment-count`);
    return res.data;
}

export const TotalVisits = async (patientId) => {
    const res = await api.get(`${BASE_URL}/patients/${patientId}/total-visits`);
    return res.data;
}

export const UpcomingAppointments = async (patientId) => {
    const res = await api.get(`${BASE_URL}/patients/${patientId}/upcoming-appointments`);
    return res.data;
}

export const HasAppointment = async (patientId) => {
    const res = await api.get(`${BASE_URL}/patients/${patientId}/has-appointment`);
    return res.data;
}

export const GetAppointmentsWithDetails = async () => {
    const res = await api.get(`${BASE_URL}/detailed`)
    return res.data;
}

export const GetAppointmentWithDetailsById = async (id) => {
    const res = await api.get(`${BASE_URL}/detailed/${id}`)
    return res.data;
}