import axios from "./index";

class USERAPI {
  static view_token = () => {
    return axios.get("/user/view_token/");
  };
}

export default USERAPI;
