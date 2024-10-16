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
import { useState } from "react";
// Soft UI Dashboard React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "examples/Footer";
import Test_plan from "layouts/test_plans/test_plan/table/test_plan";

// Custom styles for the Tables
import styles from "layouts/tables/styles";

// Data

function Tables() {
  const classes = styles();
  const categoryList = [
    { category_name: "DOCK" },
    { category_name: "WLAN" },
    { category_name: "NFC" },
    { category_name: "NIC" },
    { category_name: "WWAN" },
    { category_name: "CATM/IOT" },
    { category_name: "BT" },
    { category_name: "GPS" },
  ];
  const [selectedTab, setSelectedTab] = useState(categoryList[0].category_name);
  return (
    <DashboardLayout>
      <SuiBox py={1}>
        <SuiBox mb={3}>
          <Card>
            <Tabs value={selectedTab} onChange={(event, newValue) => setSelectedTab(newValue)}>
              {Array.isArray(categoryList) &&
                categoryList.map((category) => (
                  <Tab
                    key={category.category_name}
                    label={category.category_name}
                    value={category.category_name}
                  />
                ))}
            </Tabs>
            <SuiBox customClass={classes.tables_table}>
              <Test_plan category={selectedTab} />
            </SuiBox>
          </Card>
        </SuiBox>
      </SuiBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Tables;
