import axios from "axios";

// allow overriding via Vite environment variable (must start with VITE_)
const API = axios.create({
  // Point to the Node backend. In development the server defaults to 4000,
  // but the value can be changed via VITE_API_URL in .env.local etc.
  baseURL:
    import.meta.env.VITE_API_URL || "http://127.0.0.1:5001/api",
    withCredentials : true ,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;
