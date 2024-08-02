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

  static select_machine_report = (data) => {
    return axios.post("/cat/select_machine_report/", data);
  };

  static create_task = (data) => {
    return axios.post("/cat/create_task/", data);
  };

  static stop_task = (data) => {
    return axios.post("/cat/stop_machine/", data);
  };

  static pause_task = (data) => {
    return axios.post("/cat/pause_machine/", data);
  };

  static continue_task = (data) => {
    return axios.post("/cat/continue_machine/", data);
  };
}

export default CATAPI;
