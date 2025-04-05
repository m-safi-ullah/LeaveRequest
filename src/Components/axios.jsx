// import axios from "axios";
// import Cookies from "js-cookie";

// const baseURL = `https://ciho.com.au/api`;

// const axiosInstance = axios.create({
//   baseURL: baseURL,
// });

// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = Cookies.get("token");

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//       config.headers.Token = token;
//     }

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;

import axios from "axios";
import Cookies from "js-cookie";

const baseURL = `https://ciho.com.au/api`;

const axiosInstance = axios.create({
  baseURL: baseURL,
});

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

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      Cookies.remove("token");
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
