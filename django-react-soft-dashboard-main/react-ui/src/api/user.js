import axios from "./index";

class USERAPI {
  static view_token = () => {
    return axios.get("/user/view_token/");
  };

  static member = () => {
    return axios.get("/user/member/");
  };
}

export default USERAPI;
