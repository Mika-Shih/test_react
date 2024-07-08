import axios from "../index";

class CategoryApi {
  static getCategories = () => {
    return axios.get(`${base}/get_categories/`);
  };

  static update_plan_category = (data) => {
    return axios.post(`${base}/update_plan_category/`, data);
  };

  static update_item_category = (data) => {
    return axios.post(`${base}/update_item_category/`, data);
  };

  static delete_plan_category = (data) => {
    return axios.post(`${base}/delete_plan_category/`, data);
  };

  static delete_item_category = (data) => {
    return axios.post(`${base}/delete_item_category/`, data);
  };
}

let base = "test_plan/category";

export default CategoryApi;
