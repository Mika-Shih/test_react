import axios from "../index";

class AiApi {
  static get_case_suggestion = (data) => {
    return axios.post(`${base}/get_case_suggestion/`, data);
  };
}

let base = "test_plan/ai";

export default AiApi;
