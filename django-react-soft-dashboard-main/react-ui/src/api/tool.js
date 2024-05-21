import axios from "./index";
import Cookies from "js-cookie";
class TOOLAPI {
  static filter_post = (api, data) => {
    return axios.post(`/${api}/`, data, {
      headers: { Authorization: `Bearer ${Cookies.get("token")}` },
    });
  };

  static filter_get = (api) => {
    return axios.get(`/${api}/`, {
      headers: { Authorization: `Bearer ${Cookies.get("token")}` },
    });
  };
}

export default TOOLAPI;
