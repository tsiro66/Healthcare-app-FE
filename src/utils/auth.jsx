import axios from "axios";

export const checkTokenValidity = async (token) => {
  try {
    const response = await axios.get("http://localhost:8080/validate-token", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.status === 200;
  } catch (error) {
    if (error.response) {
      console.error("Token invalid:", error.response.data);
      return false;
    } else if (error.request) {
      console.error("Network error:", error.request);
      throw new Error("Network error");
    } else {
      console.error("Error:", error.message);
      throw error;
    }
  }
};
