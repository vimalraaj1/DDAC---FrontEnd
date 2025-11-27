import staffApi from "./staffApi";

// Get all ratings
export const getAllRatings = async () => {
  const response = await staffApi.get("/ratings");
  return response.data;
};

// Get ratings by customer ID
export const getRatingsByCustomer = async (customerId) => {
  const response = await staffApi.get(`/ratings/customer/${customerId}`);
  return response.data;
};

// Get rating by ID
export const getRatingById = async (id) => {
  const response = await staffApi.get(`/ratings/${id}`);
  return response.data;
};

// Get customer rating analytics
export const getCustomerRatingAnalytics = async (customerId) => {
  const response = await staffApi.get(`/ratings/customer/${customerId}/analytics`);
  return response.data;
};

