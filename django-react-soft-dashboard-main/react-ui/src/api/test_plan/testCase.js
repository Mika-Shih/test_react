import axios from "../index";

class TestCaseApi {
  static create_case = (data) => {
    return axios.post(`${base}/create_case/`, data);
  };

  static get_case = (data) => {
    return axios.post(`${base}/get_case/`, data);
  };

  static update_case = (data) => {
    return axios.post(`${base}/update_case/`, data);
  };

  static delete_case = (data) => {
    return axios.post(`${base}/delete_case/`, data);
  };
}

let base = "test_plan/test_case";

export default TestCaseApi;
