import axios from "../index";

class TESTPLAN {
  static list_plan = (data) => {
    return axios.post(`${base}/list_plan/`, data);
  };
  static create_plan = (data) => {
    return axios.post(`${base}/create_plan/`, data);
  };
  static edit_plan = (data) => {
    return axios.post(`${base}/edit_plan/`, data);
  };
  static edit_permission = (data) => {
    return axios.post(`${base}/edit_permission/`, data);
  };
}
let base = "test_plans/test_plan";
export default TESTPLAN;
