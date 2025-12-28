import axios from "./axios";

// Get user profile
export const getProfile = async () => {
  try {
    const response = await axios.get("/profile");
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return null; // Profile doesn't exist yet
    }
    throw error.response?.data?.message || "Failed to fetch profile";
  }
};

// Create or update profile
export const saveProfile = async (profileData) => {
  try {
    const response = await axios.post("/profile", profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to save profile";
  }
};

// Update profile
export const updateProfile = async (profileData) => {
  try {
    const response = await axios.post("/profile", profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to update profile";
  }
};
