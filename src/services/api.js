import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

// Gestion erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
);

export default api;