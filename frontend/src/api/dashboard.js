import axios from "./axios";

// Get dashboard stats (total workouts, calories burned, streak, avg workout time)
export const getDashboardStats = async () => {
  try {
    const response = await axios.get("/workouts/stats");
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch dashboard stats";
  }
};

// Get AI-generated fitness suggestion based on user's stats
export const getAiSuggestion = async () => {
  try {
    const response = await axios.get("/workouts/ai-suggestion");
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch AI suggestion";
  }
};

// Log a completed workout (called from WorkoutTimer or similar)
export const logWorkout = async (workoutData) => {
  try {
    const response = await axios.post("/workouts", workoutData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to log workout";
  }
};
