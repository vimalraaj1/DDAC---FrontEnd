import axios from "axios";

const BASE_URL = "http://localhost:5000/patients";


// GET all patients
export const getPatients = async () => {
  const res = await axios.get(BASE_URL);
  return res.data;
};

// REGISTER new patient
export const registerPatient = async (patient) => {
  const res = await axios.post(BASE_URL, patient);
  return res.data;
};

// GET one patient
export const getPatientById = async (id) => {
  const res = await axios.get(`${BASE_URL}/${id}`);
  return res.data;
};

// UPDATE patient
export const updatePatient = async (id, updated) => {
  const res = await axios.put(`${BASE_URL}/${id}`, updated);
  return res.data;
};

// DELETE patient
export const deletePatient = async (id) => {
  await axios.delete(`${BASE_URL}/${id}`);
};
