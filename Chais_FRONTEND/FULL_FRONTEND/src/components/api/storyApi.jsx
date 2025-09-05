// src/api/storyApi.js
import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:8000/api/v1/stories" });

// Attach JWT token
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const createStory = (data) => API.post("/create", data);
export const listStories = () => API.get("/");
export const getStory = (id) => API.get(`/${id}`);
export const getFullStoryTree = (id) => API.get(`/${id}/full`);
export const addBranch = (videoId, data) => API.post(`/${videoId}/branch`, data);
export const voteOnVideo = (videoId, data) => API.post(`/${videoId}/vote`, data);
export const deleteStory = (id) => API.delete(`/${id}`);
export const deleteVideo = (videoId) => API.delete(`/video/${videoId}`);
