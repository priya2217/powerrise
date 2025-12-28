import axios from "./axios";

// Get all BMI records
export const getBMIHistory = async () => {
  try {
    const response = await axios.get("/bmi");
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch BMI history";
  }
};

// Get latest BMI record
export const getLatestBMI = async () => {
  try {
    const response = await axios.get("/bmi/latest");
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return null; // No BMI record yet
    }
    throw error.response?.data?.message || "Failed to fetch BMI";
  }
};

// Create new BMI record
export const createBMI = async (bmiData) => {
  try {
    const response = await axios.post("/bmi", bmiData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to save BMI";
  }
};
