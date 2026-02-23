import axios from "axios";

const API = axios.create({
  baseURL: "https://translator-lo1e.onrender.com/api", // backend base URL
  withCredentials: true, // send cookies automatically 
});

export default API;
