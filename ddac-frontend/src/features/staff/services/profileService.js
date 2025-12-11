import staffApi from "./staffApi";
import { getStoredStaffId } from "../utils/staffStorage";

const STAFF_ENDPOINT = "/Staff";

const resolveStaffId = () => getStoredStaffId() || "ST000001";

// Get current staff profile using stored ID
export const getProfile = async () => {
  try {
    const staffId = resolveStaffId();
    const response = await staffApi.get(`${STAFF_ENDPOINT}/${staffId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};

// Get staff profile by ID
export const getStaffProfile = async (id) => {
  try {
    const response = await staffApi.get(`${STAFF_ENDPOINT}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching staff profile:", error);
    throw error;
  }
};

// Update staff profile
export const updateProfile = async (id, updatedData) => {
  try {
    const response = await staffApi.put(`${STAFF_ENDPOINT}/${id}`, updatedData);
    console.log("Updated profile:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    console.error("Request Body: ", updatedData);
    throw error;
  }
};

// Update staff profile (gets ID from profile first)
export const updateStaffProfile = async (profileData) => {
  try {
    const staffId = resolveStaffId();
    const response = await staffApi.put(`${STAFF_ENDPOINT}/${staffId}`, profileData);
    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

// Change password
export const changePassword = async (passwordData) => {
  const response = await staffApi.patch("/profile/password", passwordData);
  return response.data;
};

