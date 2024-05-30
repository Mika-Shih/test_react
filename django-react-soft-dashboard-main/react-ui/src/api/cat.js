import axios from "./index";

class CATAPI {
  static machine_status_report = (data) => {
    return axios.post("/cat/machine_status_report/", data);
  };

  static filter_machine_status_report = (data) => {
    return axios.post("/cat/filter_machine_status_report/", data);
  };

  static download_cth = (data) => {
    return axios.post("/cat/download_cth/", data);
  };

  static machine_report = () => {
    return axios.get("/cat/machine_report/");
  };

  static create_task = (data) => {
    return axios.post("/cat/create_task/", data);
  };
}

export default CATAPI;
