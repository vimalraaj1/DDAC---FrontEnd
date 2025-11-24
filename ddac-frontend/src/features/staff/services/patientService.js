import staffApi from "./staffApi";
import api from "../../../api/axios";

// Get all patients
export const getAllPatients = async () => {
  const response = await staffApi.get("/patient");
  return response.data;
};

// Get patient by ID
export const getPatientById = async (id) => {
  const response = await staffApi.get(`/patient/${id}`);
  return response.data;
};

// Create new patient
export const createPatient = async (patientData) => {
  const response = await staffApi.post("/patient", patientData);
  return response.data;
};

// Update patient
export const updatePatient = async (id, patientData) => {
  console.log("Request Body: ", patientData);

  const response = await staffApi.put(`/patient/${id}`, patientData);
  return response.data;
};

// Delete patient
export const deletePatient = async (id) => {
  const response = await staffApi.delete(`/patients/${id}`);
  return response.data;
};

// Search patients
export const searchPatients = async (query) => {
  const response = await staffApi.get(`/patients/search?q=${query}`);
  return response.data;
};

