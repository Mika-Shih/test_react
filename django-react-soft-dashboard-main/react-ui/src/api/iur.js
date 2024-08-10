import axios from "./index";

class IURAPI {
  static phase = () => {
    return axios.get("/polls/api/phase/");
  };

  static filter_option = (data) => {
    return axios.post("/polls/filter_option/", data);
  };

  static filtersearch = (data) => {
    return axios.post("/polls/api/filtersearch/", data);
  };

  static widthsearch = (data) => {
    return axios.post("/polls/api/widthsearch/", data);
  };

  static excel_export = (data) => {
    return axios.post("/polls/excel_export/", data, {
      responseType: "blob",
    });
  };

  static addplatformonly = (data) => {
    return axios.post("/polls/api/addplatformonly/", data);
  };

  static lend = (data) => {
    return axios.post("/polls/lendplatform/", data);
  };

  static return = (data) => {
    return axios.post("/polls/returnplatform/", data);
  };

  static change = (data) => {
    return axios.post("/polls/changeplatform/", data);
  };

  static delete = (data) => {
    return axios.post("/polls/deleteplatform/", data);
  };

  static scrappped = (data) => {
    return axios.post("/polls/scrapped_platform/", data);
  };

  static new_machine_mail = (data) => {
    return axios.post("/polls/send_mail_newplatform/", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };

  static addnewplatform = (data) => {
    return axios.post("/polls/addnewplatform/", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };

  static machine_record = (data) => {
    return axios.post("/polls/machine_record/", data);
  };

  static hint_machine_mail = () => {
    return axios.get("/polls/hint_machine_arrive_mail/");
  };

  static iur_folder_choose = (data) => {
    return axios.post("/polls/sharepoint_name_user/", data);
  };
}

export default IURAPI;
