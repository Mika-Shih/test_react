import axios from "../index";

class TestPlanRrecordApi {
  static create_plan_record = (data) => {
    return axios.post(`${base}/create_plan_record/`, data);
  };

  static get_plan_record = (data) => {
    return axios.get(`${base}/get_plan_record/`, data);
  };

  static get_all_plan_record = (data) => {
    return axios.get(`${base}/get_all_plan_record/`, data);
  };

  static get_personal_plan_record = (data) => {
    return axios.post(`${base}/get_personal_plan_record/`, data);
  };

  static get_personal_specific_plan_record = (data) => {
    return axios.post(`${base}/get_personal_specific_plan_record/`, data);
  };

  static update_plan_record = (data) => {
    return axios.post(`${base}/update_plan_record/`, data);
  };

  static delete_plan_record = (data) => {
    return axios.post(`${base}/delete_plan_record/`, data);
  };
}

let base = "test_plan/test_plan_record";

export default TestPlanRrecordApi;
