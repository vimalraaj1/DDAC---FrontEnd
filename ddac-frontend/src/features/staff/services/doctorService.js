import staffApi from "./staffApi";

const DOCTOR_ENDPOINT = "/doctors";

export const getAllDoctors = async () => {
  const response = await staffApi.get(DOCTOR_ENDPOINT);
  return response.data;
};

export const getDoctorById = async (id) => {
  const response = await staffApi.get(`${DOCTOR_ENDPOINT}/${id}`);
  return response.data;
};

export const searchDoctors = async (query) => {
  const response = await staffApi.get(`${DOCTOR_ENDPOINT}/search`, {
    params: { q: query },
  });
  return response.data;
};

