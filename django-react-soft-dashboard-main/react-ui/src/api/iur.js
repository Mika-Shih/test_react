import axios from "./index";
import Cookies from "js-cookie";
class IURAPI {
  static phase = () => {
    return axios.get("/polls/api/phase/", {
      headers: { Authorization: `Bearer ${Cookies.get("token")}` },
    });
  };

  static filtersearch = (data) => {
    return axios.post("/polls/api/filtersearch/", data, {
      headers: { Authorization: `Bearer ${Cookies.get("token")}` },
    });
  };

  static widthsearch = (data) => {
    return axios.post("/polls/api/widthsearch/", data, {
      headers: { Authorization: `Bearer ${Cookies.get("token")}` },
    });
  };

  static excel_export = (data) => {
    return axios.post("/polls/excel_export/", data, {
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
        "Content-Type": "multipart/form-data",
      },
      responseType: "blob",
    });
  };

  static addplatformonly = (data) => {
    return axios.post("/polls/api/addplatformonly/", data, {
      headers: { Authorization: `Bearer ${Cookies.get("token")}` },
    });
  };

  static lend = (data) => {
    return axios.post("/polls/lendplatform/", data, {
      headers: { Authorization: `Bearer ${Cookies.get("token")}` },
    });
  };

  static return = (data) => {
    return axios.post("/polls/returnplatform/", data, {
      headers: { Authorization: `Bearer ${Cookies.get("token")}` },
    });
  };

  static change = (data) => {
    return axios.post("/polls/changeplatform/", data, {
      headers: { Authorization: `Bearer ${Cookies.get("token")}` },
    });
  };

  static delete = (data) => {
    return axios.post("/polls/deleteplatform/", data, {
      headers: { Authorization: `Bearer ${Cookies.get("token")}` },
    });
  };

  static scrappped = (data) => {
    return axios.post("/polls/scrapped_platform/", data, {
      headers: { Authorization: `Bearer ${Cookies.get("token")}` },
    });
  };

  static add_member = (data) => {
    return axios.post("/account/add_member/", data, {
      headers: { Authorization: `Bearer ${Cookies.get("token")}` },
    });
  };

  static hint_machine_mail = () => {
    return axios.get("/polls/hint_machine_arrive_mail/", {
      headers: { Authorization: `Bearer ${Cookies.get("token")}` },
    });
  };
}

export default IURAPI;
