import Axios from "axios";
import { API_SERVER } from "../config/constant";
import Cookies from "js-cookie";

const axios = Axios.create({
  baseURL: `${API_SERVER}`,
  headers: { "Content-Type": "application/json" },
});

axios.interceptors.request.use(
  (config) => {
    console.log(config);
    if (!config.url.includes("/user/verify/")) {
      const token = Cookies.get("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        handleLogout();
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => Promise.resolve(response),
  (error) => {
    return Promise.reject(error);
  }
);

const handleLogout = () => {
  Cookies.remove("token");
  localStorage.removeItem("user");
  window.location.reload();
};

export default axios;
