import axios from "axios";
import api from "../api/axios";

const BASE_URL = "/patients";

// GET all patients
export const getPatients = async () => {
  const res = await api.get(BASE_URL);
  return res.data;
};

// REGISTER new patient
export const registerPatient = async (patient) => {
  const res = await api.post(BASE_URL, patient);
  return res.data;
};

// GET one patient
export const getPatientById = async (id) => {
  console.log("VITE_API_URL =", import.meta.env.VITE_API_URL);

  const res = await api.get(`${BASE_URL}/${id}`);
  return res.data;
};

// UPDATE patient
export const updatePatient = async (id, updated) => {
  const res = await api.put(`${BASE_URL}/${id}`, updated);
  return res.data;
};

// DELETE patient
export const deletePatient = async (id) => {
  await api.delete(`${BASE_URL}/${id}`);
};
