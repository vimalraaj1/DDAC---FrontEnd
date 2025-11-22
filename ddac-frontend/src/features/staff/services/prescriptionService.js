import staffApi from "./staffApi";

// Get all prescriptions
export const getAllPrescriptions = async () => {
  const response = await staffApi.get("/prescriptions");
  return response.data;
};

// Get prescription by ID
export const getPrescriptionById = async (id) => {
  const response = await staffApi.get(`/prescriptions/${id}`);
  return response.data;
};

// Get prescriptions by appointment ID
export const getPrescriptionsByAppointment = async (appointmentId) => {
  const response = await staffApi.get(`/prescriptions/appointment/${appointmentId}`);
  return response.data;
};

// Create prescription
export const createPrescription = async (prescriptionData) => {
  const response = await staffApi.post("/prescriptions", prescriptionData);
  return response.data;
};

// Update prescription
export const updatePrescription = async (id, prescriptionData) => {
  const response = await staffApi.put(`/prescriptions/${id}`, prescriptionData);
  return response.data;
};

// Delete prescription
export const deletePrescription = async (id) => {
  const response = await staffApi.delete(`/prescriptions/${id}`);
  return response.data;
};

