import axios from "./index";

class TOOLAPI {
  static filter_post = (api, data) => {
    return axios.post(`/${api}/`, data);
  };

  static filter_get = (api) => {
    return axios.get(`/${api}/`);
  };
}

export default TOOLAPI;
