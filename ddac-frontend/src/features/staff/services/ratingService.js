import staffApi from "./staffApi";

const COMMENT_ENDPOINT = "/comments";

// Get ratings/comments for a specific staff member
export const getStaffRatings = async (staffId) => {
  const response = await staffApi.get(`${COMMENT_ENDPOINT}/staff/${staffId}`);
  return response.data;
};

// Get all ratings/comments
export const getAllRatings = async () => {
  const response = await staffApi.get(COMMENT_ENDPOINT);
  return response.data;
};

// Get ratings by customer/patient
export const getRatingsByCustomer = async (patientId) => {
  const response = await staffApi.get(COMMENT_ENDPOINT, {
    params: { patientId },
  });
  return response.data;
};

// Get rating by ID
export const getRatingById = async (id) => {
  const response = await staffApi.get(`${COMMENT_ENDPOINT}/${id}`);
  return response.data;
};

// Get customer rating analytics
export const getCustomerRatingAnalytics = async (patientId) => {
  const response = await staffApi.get(`${COMMENT_ENDPOINT}/analytics`, {
    params: { patientId },
  });
  return response.data;
};

