import staffApi from "./staffApi";

const PATIENT_ENDPOINT = "/patients";

const mapPatientPayload = (payload = {}) => ({
  firstName: payload.firstName?.trim() ?? "",
  lastName: payload.lastName?.trim() ?? "",
  email: payload.email?.trim() ?? "",
  phone: payload.phone?.trim() ?? "",
  dateOfBirth: payload.dateOfBirth ?? "",
  gender: payload.gender ?? "",
  address: payload.address ?? "",
  bloodGroup: payload.bloodGroup || null,
  emergencyContact: payload.emergencyContact || null,
  emergencyName: payload.emergencyName || null,
  emergencyRelationship: payload.emergencyRelationship || null,
  allergies: payload.allergies || null,
  conditions: payload.conditions || null,
  medications: payload.medications || null,
  password: payload.password || "123456"
});

export const getAllPatients = async () => {
  const response = await staffApi.get(PATIENT_ENDPOINT);
  return response.data;
};

export const getPatientById = async (id) => {
  const response = await staffApi.get(`${PATIENT_ENDPOINT}/${id}`);
  return response.data;
};

export const createPatient = async (patientData) => {
  console.log(patientData);
  const response = await staffApi.post(
    `${PATIENT_ENDPOINT}/register`,
    mapPatientPayload(patientData)
  );
  return response.data;
};

export const updatePatient = async (id, patientData) => {
  const response = await staffApi.put(
    `${PATIENT_ENDPOINT}/${id}`,
    mapPatientPayload(patientData)
  );
  return response.data;
};

export const deletePatient = async (id) => {
  const response = await staffApi.delete(`${PATIENT_ENDPOINT}/${id}`);
  return response.data;
};

export const searchPatients = async (query) => {
  const response = await staffApi.get(
    `${PATIENT_ENDPOINT}/search`,
    {
      params: { q: query },
    }
  );
  return response.data;
};

