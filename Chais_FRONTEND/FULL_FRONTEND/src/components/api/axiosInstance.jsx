// src/api/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api/v1/videos",
  withCredentials: true, // 🔑 send cookies automatically
});

export default axiosInstance;
