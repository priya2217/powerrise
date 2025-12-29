import axios from "./axios";

// Get all exercises for logged in user
export const getExercises = async () => {
  try {
    const response = await axios.get("/exercises");
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch exercises";
  }
};

// Get single exercise by ID
export const getExercise = async (id) => {
  try {
    const response = await axios.get(`/exercises/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch exercise";
  }
};

// Create new exercise
export const createExercise = async (exerciseData) => {
  try {
    const response = await axios.post("/exercises", exerciseData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to create exercise";
  }
};

// Update exercise
export const updateExercise = async (id, exerciseData) => {
  try {
    const response = await axios.put(`/exercises/${id}`, exerciseData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to update exercise";
  }
};

// Delete exercise
export const deleteExercise = async (id) => {
  try {
    const response = await axios.delete(`/exercises/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to delete exercise";
  }
};
