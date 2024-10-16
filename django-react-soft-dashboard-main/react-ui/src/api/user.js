import axios from "./index";

class USERAPI {
  static view_token = () => {
    return axios.get("/user/view_token/");
  };

  static member = () => {
    return axios.get("/user/member/");
  };

  static add_member = (data) => {
    return axios.post("/account/add_member/", data);
  };

  static edit_member = (data) => {
    return axios.post("/account/edit_member/", data);
  };
}

export default USERAPI;
