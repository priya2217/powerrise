import axios from "./axios";
// ☝️ ONLY this import, nothing else!

// Get all workout plans
export const getWorkoutPlans = async () => {
  try {
    const response = await axios.get("/workout-plans");
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch workout plans";
  }
};

// Get single workout plan
export const getWorkoutPlan = async (id) => {
  try {
    const response = await axios.get(`/workout-plans/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch workout plan";
  }
};

// Create new workout plan
export const createWorkoutPlan = async (planData) => {
  try {
    const response = await axios.post("/workout-plans", planData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to create workout plan";
  }
};

// Update workout plan
export const updateWorkoutPlan = async (id, planData) => {
  try {
    const response = await axios.put(`/workout-plans/${id}`, planData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to update workout plan";
  }
};

// Delete workout plan
export const deleteWorkoutPlan = async (id) => {
  try {
    const response = await axios.delete(`/workout-plans/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to delete workout plan";
  }
};
