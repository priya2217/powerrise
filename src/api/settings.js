import axios from "./axios";

// Get user settings
export const getSettings = async () => {
  try {
    const res = await axios.get("/settings");
    return res.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};

// Save user settings
export const saveSettings = async (settings) => {
  try {
    const res = await axios.post("/settings", settings);
    return res.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
