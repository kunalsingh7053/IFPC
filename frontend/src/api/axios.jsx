import axios from "axios";
import { clearAuthSession } from "../utils/authSession";

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    (import.meta.env.DEV ? "/api" : "https://ifpc-1.onrender.com/api"),
  withCredentials: true,
  timeout: 10000,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;

    if (role === "admin") {
      config.headers.admintoken = token;
    }

    if (role === "member") {
      config.headers.membertoken = token;
    }
  }

  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401 || status === 403) {
      clearAuthSession();
    }

    return Promise.reject(error);
  }
);

export default API;
