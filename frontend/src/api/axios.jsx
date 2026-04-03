import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://ifpc.onrender.com/api",
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

export default API;
