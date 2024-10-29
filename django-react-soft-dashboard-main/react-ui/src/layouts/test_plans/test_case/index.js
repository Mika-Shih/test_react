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
import { Card, Tabs, Tab } from "@mui/material";
// Soft UI Dashboard React components
import SuiBox from "components/SuiBox";
// import SuiTypography from "components/SuiTypography";
import { useState, useEffect } from "react";
// Soft UI Dashboard React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import routes from "routes";
import Footer from "examples/Footer";
import Test_case from "layouts/test_plans/test_case/table/test_case";

// Custom styles for the Tables
import styles from "layouts/tables/styles";

// Data
import TESTCASE from "api/test_plans/test_case";

function Tables() {
  const classes = styles();
  const [selectedTab, setSelectedTab] = useState();
  const [categoryList, setCategoryList] = useState();
  const get_category = async () => {
    try {
      const response = await TESTCASE.view_category();
      const updatecategoryList = response.data.finaldata.map((category_name) => ({
        category_name: category_name,
      }));
      console.log(updatecategoryList);
      setSelectedTab(updatecategoryList[0].category_name);
      setCategoryList(updatecategoryList);
    } catch (error) {
      console.log(error);
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
          </Card>
        </SuiBox>
      </SuiBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Tables;
