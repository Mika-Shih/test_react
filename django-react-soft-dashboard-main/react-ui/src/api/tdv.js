import axios from "./index";

class TDVAPI {
  static list_task = () => {
    return axios.get(`${base}/list_task/`);
  };

  static create_task = (data) => {
    return axios.post(`${base}/create_new_task/`, data);
  };

  static approve_task = (data) => {
    return axios.post(`${base}/approve_task/`, data);
  };
}
let base = "test_driver_validation";
export default TDVAPI;
