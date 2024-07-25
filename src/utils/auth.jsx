// auth.js
import axios from "axios";

export const checkTokenValidity = async (token) => {
  try {
    const response = await axios.get("http://localhost:8080/validate-token", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.status === 200;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Token invalid:", error.response.data);
      return false;
    } else if (error.request) {
      // The request was made but no response was received
      console.error("Network error:", error.request);
      throw new Error("Network error");
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error:", error.message);
      throw error;
    }
  }
};
