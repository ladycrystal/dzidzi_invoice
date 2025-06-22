import axios from "axios";

const API = axios.create({
  baseURL: "https://invoiceapp-8ub4.onrender.com/api/v1",
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // or sessionStorage.getItem("token")

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
