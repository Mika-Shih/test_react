import axios from "./index";
class AuthApi {
  // static Login = (data) => {
  //   return axios.post(`${base}/login`, data);
  // };
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

  static change_password = (data) => {
    return axios.post("/user/change_password/", data);
  };

  static active_code = (data) => {
    return axios.post("/user/active_code/", data);
  };
}

let base = "users";

export default AuthApi;
