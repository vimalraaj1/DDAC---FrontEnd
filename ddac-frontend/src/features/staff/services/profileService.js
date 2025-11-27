import staffApi from "./staffApi";

// Get staff profile
export const getStaffProfile = async () => {
  const response = await staffApi.get("/profile");
  return response.data;
};

// Update staff profile
export const updateStaffProfile = async (profileData) => {
  const response = await staffApi.put("/profile", profileData);
  return response.data;
};

// Change password
export const changePassword = async (passwordData) => {
  const response = await staffApi.patch("/profile/password", passwordData);
  return response.data;
};

