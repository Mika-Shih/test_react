import axios from "../index";

class TestPlanApi {
  static create_plan = (data) => {
    return axios.post(`${base}/create_plan/`, data);
  };

  static get_plan = (data) => {
    return axios.post(`${base}/get_plan/`, data);
  };

  static update_plan = (data) => {
    return axios.post(`${base}/update_plan/`, data);
  };

  static delete_plan = (data) => {
    return axios.post(`${base}/delete_plan/`, data);
  };
}

let base = "test_plan/test_plan";

export default TestPlanApi;
