// axiosInstance.js
import axios from "axios";
import Cookies from "js-cookie";

const baseURL = `${window.location.origin}/api`;

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: baseURL,
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers.Token = token;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
