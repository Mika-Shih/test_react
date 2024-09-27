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
}
let base = "test_plans/test_case";
export default TESTCASE;
