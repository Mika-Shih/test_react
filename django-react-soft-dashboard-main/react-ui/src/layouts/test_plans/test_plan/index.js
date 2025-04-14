/**
=========================================================
* Soft UI Dashboard React - v2.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-material-ui
* Copyright 2021 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
// import { Card, Tabs, Tab } from "@mui/material";
import { Card, Select, MenuItem, FormControl, Breadcrumbs, Typography } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext"; // 麵包屑箭頭
// Soft UI Dashboard React components
import SuiBox from "components/SuiBox";
// import SuiTypography from "components/SuiTypography";
import { useState, useEffect } from "react";
// Soft UI Dashboard React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import routes from "routes";
import Footer from "examples/Footer";
import Test_plan from "layouts/test_plans/test_plan/table/test_plan";

// Custom styles for the Tables
import styles from "layouts/tables/styles";

// Data
import TESTCASE from "api/test_plans/test_case";

import Button from "examples/Icons/Button";
import { Dialog, Box } from "@mui/material";

function Tables() {
  const classes = styles();
  //const [selectedTab, setSelectedTab] = useState();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryList, setCategoryList] = useState([]);

  const [, setLoading] = useState(false);
  const [add_category, set_add_category] = useState("");
  const [pop_filter, set_pop_filter] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
  });
  const openModal = (modalNumber) => {
    set_pop_filter((prev) => ({ ...prev, [modalNumber]: true }));
  };
  const closeModal = (modalNumber) => {
    set_pop_filter((prev) => ({ ...prev, [modalNumber]: false }));
  };
  const create_category = () => {
    return (
      <>
        <div className={classes.columns_center}>
          <div className={classes.line_form_style}>
            <div className={classes.columns_center}>
              <label htmlFor="add category">Add Technology Name&nbsp;:&nbsp;&nbsp;</label>
              <input
                id="add_category"
                name="add_category"
                style={{
                  width: "480px",
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                }}
                value={add_category}
                onChange={(e) => {
                  set_add_category(e.target.value);
                }}
              />
            </div>
          </div>
          <div className={classes.line_form_style}>
            <Button onClick={create_new_category}>Create Technology</Button>
            <Button onClick={() => closeModal(1)}>Close</Button>
          </div>
        </div>
      </>
    );
  };
  const create_new_category = async () => {
    setLoading(true);
    try {
      const response = await TESTCASE.add_category({
        category: add_category,
      });
      if (response.data.finaldata) {
        alert(response.data.finaldata);
        closeModal(1);
        window.location.reload();
      } else if (response.data.error) {
        alert(response.data.error);
      }
    } catch (error) {
      console.log(error);
      alert("Please contact the administrator.");
    } finally {
      setLoading(false);
    }
  };

  const get_category = async () => {
    try {
      const response = await TESTCASE.view_category();
      const updatedCategoryList = response.data.finaldata.map((category_name) => ({
        category_name: category_name,
      }));
      //setSelectedTab(updatecategoryList[0].category_name);
      setSelectedCategory(updatedCategoryList[0]?.category_name || "");
      setCategoryList(updatedCategoryList);
    } catch (error) {
      console.error(error);
      alert("Please contact the administrator.");
    }
  };

  useEffect(() => {
    get_category();
  }, []);

  // const [selectedTab, setSelectedTab] = useState(categoryList && categoryList[0].category_name);
  return (
    <DashboardLayout>
      <DashboardNavbar routes={routes} />
      <SuiBox py={1}>
        <SuiBox mb={3}>
          <Card>
            {categoryList.length > 0 ? (
              <>
                {/* 使用 Flex 讓麵包屑與下拉式選單並排，避免換行 */}
                <SuiBox
                  px={2}
                  py={2}
                  display="flex"
                  alignItems="center"
                  sx={{
                    flexWrap: "nowrap", // 讓內容不換行
                    overflow: "hidden", // 避免超出邊界
                  }}
                >
                  {/* 麵包屑導航 + 下拉式選單 */}
                  <Breadcrumbs
                    separator={<NavigateNextIcon fontSize="small" />} // 確保 `>` 符號顯示
                    aria-label="breadcrumb"
                    sx={{
                      whiteSpace: "nowrap", // 避免文字換行
                      overflow: "hidden",
                      textOverflow: "ellipsis", // 如果超出範圍，顯示省略號
                      flexShrink: 0, // 防止縮小導致換行
                    }}
                  >
                    <Typography color="textPrimary">Test Plan</Typography>

                    {/* 讓 Select 在 Breadcrumbs 內，確保 `>` 符號存在 */}
                    <Typography color="textSecondary">
                      <SuiBox display="flex" alignItems="center" gap="10px">
                        {/* 下拉選單 */}
                        <FormControl
                          sx={{
                            minWidth: 200, // 控制選單大小
                          }}
                        >
                          <Select
                            value={selectedCategory}
                            onChange={(event) => setSelectedCategory(event.target.value)}
                            displayEmpty
                            sx={{
                              fontSize: 20, // 調整字體大小
                              width: "200px", // 明確設定寬度
                              height: 50, // 調整高度
                              whiteSpace: "nowrap", // 避免換行
                            }}
                          >
                            {categoryList.map((category) => (
                              <MenuItem key={category.category_name} value={category.category_name}>
                                {category.category_name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>

                        {/* 按鈕 - 設定 gap 讓它與選單間隔適當 */}
                        <Button
                          onClick={() => openModal(1)}
                          variant="contained"
                          color="primary"
                          sx={{
                            height: "50px", // 設定與下拉選單相同的高度
                          }}
                        >
                          Add Technology
                        </Button>
                      </SuiBox>
                    </Typography>
                  </Breadcrumbs>
                </SuiBox>

                <SuiBox customClass={classes.tables_table}>
                  <Test_plan category={selectedCategory} />
                </SuiBox>
              </>
            ) : (
              <p>Loading categories...</p>
            )}
          </Card>
          {/* <Card>
            {selectedTab && categoryList ? (
              <>
                <Tabs value={selectedTab} onChange={(event, newValue) => setSelectedTab(newValue)}>
                  {categoryList.map((category) => (
                    <Tab
                      key={category.category_name}
                      label={category.category_name}
                      value={category.category_name}
                    />
                  ))}
                </Tabs>
                <SuiBox customClass={classes.tables_table}>
                  <Test_case category={selectedTab} />
                </SuiBox>
              </>
            ) : (
              <p>Loading categories...</p>
            )}
          </Card> */}
        </SuiBox>
      </SuiBox>
      <Footer />
      <Dialog open={pop_filter[1]} onClose={() => closeModal(1)} fullWidth maxWidth="sm">
        <Box sx={{ padding: "20px" }}>{create_category()}</Box>
      </Dialog>
    </DashboardLayout>
  );
}

export default Tables;
