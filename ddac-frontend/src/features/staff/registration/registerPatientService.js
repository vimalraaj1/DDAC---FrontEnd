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

