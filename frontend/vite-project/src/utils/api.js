import axios from "axios";

const API_URI = import.meta.env.VITE_API_URI; // must match .env

const API = axios.create({
  baseURL: API_URI,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
