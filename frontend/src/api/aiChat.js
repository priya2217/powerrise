import axios from "./axios";

// Send a message to the AI fitness assistant
// history: array of { role: "user"|"assistant", content: string }
export const sendAiChatMessage = async (message, history = []) => {
  try {
    const response = await axios.post("/ai-chat", { message, history });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to get AI response";
  }
};
