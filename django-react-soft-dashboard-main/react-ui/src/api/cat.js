import axios from "./index";
import Cookies from "js-cookie";
class CATAPI {
  static create_task = (data) => {
    return axios.post("/cat/create_task/", data, {
      headers: { Authorization: `Bearer ${Cookies.get("token")}` },
    });
  };
  static Login = (data) => {
    return axios.post("/user/verify/", data);
  };

  static Register = (data) => {
    return axios.post(`${base}/register`, data);
  };

  static Logout = (data) => {
    console.log(data.token);
    return axios.post("/user/logout/", data, {
      headers: { Authorization: `Bearer ${data.token}` },
    });
  };
}

let base = "users";

export default CATAPI;
