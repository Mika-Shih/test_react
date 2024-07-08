import axios from "../index";

class TestCaseRrecordApi {
  static create_case_record = (data) => {
    return axios.post(`${base}/create_case_record/`, data);
  };

  static get_case_record = (data) => {
    return axios.post(`${base}/get_case_record/`, data);
  };

  static get_personal_case_record = (data) => {
    return axios.post(`${base}/get_personal_case_record/`, data);
  };

  static get_personal_case_specific_record = (data) => {
    return axios.post(`${base}/get_personal_case_specific_record/`, data);
  };

  static get_version_specific_record = (data) => {
    return axios.post(`${base}/get_version_specific_record/`, data);
  };

  static get_personal_plan_cases = (data) => {
    return axios.post(`${base}/get_personal_plan_cases/`, data);
  };

  static get_category_all_case = (data) => {
    return axios.post(`${base}/get_category_all_case/`, data);
  };

  static get_all_version_record = (data) => {
    return axios.post(`${base}/get_all_version_record/`, data);
  };

  static update_case_record = (data) => {
    return axios.post(`${base}/update_case_record`, data);
  };

  static update_case_record_ai_suggestion = (data) => {
    return axios.patch(`${base}/update_case_record_ai_suggestion/`, data);
  };

  static get_case_highestid = () => {
    return axios.get(`${base}/get_case_highestid/`);
  };

  static delete_case_from_plan = (data) => {
    return axios.post(`${base}/delete_case_from_plan/`, data);
  };

  static delete_case_record = (data) => {
    return axios.post(`${base}/delete_case_record/`, data);
  };
}

let base = "test_plan/test_case_record";

export default TestCaseRrecordApi;
