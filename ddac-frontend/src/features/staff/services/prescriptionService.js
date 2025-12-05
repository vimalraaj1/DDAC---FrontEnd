import staffApi from "./staffApi";

const CONSULTATION_ENDPOINT = "/consultations";

const mapConsultationPayload = (payload = {}) => ({
  id: payload.id?.trim() ?? "",
  appointmentId: payload.appointmentId?.trim() ?? "",
  feedbackNotes: payload.feedbackNotes || "",
  prescriptionNotes: payload.prescriptionNotes || "",
});

export const getAllPrescriptions = async () => {
  const response = await staffApi.get(CONSULTATION_ENDPOINT);
  return response.data;
};

export const getPrescriptionById = async (id) => {
  const response = await staffApi.get(`${CONSULTATION_ENDPOINT}/${id}`);
  return response.data;
};

export const getPrescriptionsByAppointment = async (appointmentId) => {
  const response = await staffApi.get(CONSULTATION_ENDPOINT, {
    params: { appointmentId },
  });
  return response.data;
};

export const createPrescription = async (consultationData) => {
  const response = await staffApi.post(
    CONSULTATION_ENDPOINT,
    mapConsultationPayload(consultationData)
  );
  return response.data;
};

export const updatePrescription = async (id, consultationData) => {
  const response = await staffApi.put(
    `${CONSULTATION_ENDPOINT}/${id}`,
    mapConsultationPayload(consultationData)
  );
  return response.data;
};

export const deletePrescription = async (id) => {
  const response = await staffApi.delete(`${CONSULTATION_ENDPOINT}/${id}`);
  return response.data;
};

