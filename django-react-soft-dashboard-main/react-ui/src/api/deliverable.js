import axios from "./index";

class DLAAPI {
  static select_version = (data) => {
    return axios.post("/pulsar/select_version/", data);
  };

  static create_version = (data) => {
    return axios.post("/pulsar/create_version/", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };

  static download_version = (data) => {
    return axios.post("/pulsar/download_version/", data);
  };
}

export default DLAAPI;
