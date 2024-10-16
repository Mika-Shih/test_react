import axios from "../index";

class TESTCASE {
  static list_case = (data) => {
    return axios.post(`${base}/list_case/`, data);
  };
  static create_case = (data) => {
    return axios.post(`${base}/create_case/`, data);
  };
  static edit_case = (data) => {
    return axios.post(`${base}/edit_case/`, data);
  };
  static add_category = (data) => {
    return axios.post(`${base}/add_category/`, data);
  };
  static edit_permission = (data) => {
    return axios.post(`${base}/edit_permission/`, data);
  };
  static create_plan = (data) => {
    return axios.post("test_plans/test_plan/create_plan/", data);
  };
}
let base = "test_plans/test_case";
export default TESTCASE;
