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
import Card from "@mui/material/Card";
// Soft UI Dashboard React components
import SuiBox from "components/SuiBox";
// import SuiTypography from "components/SuiTypography";

// Soft UI Dashboard React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Setting_mark from "examples/Icons/Setting_mark";
import Footer from "examples/Footer";
// import Grid from "@mui/material/Grid";

import Member from "layouts/member/table/member";
// Custom styles for the Tables
import { hasAzureAccess } from "auth-context/auth.context";
import styles from "layouts/tables/styles";

function Tables() {
  const classes = styles();
  const routes = hasAzureAccess()
    ? [
        { name: "IUR", path: "/iur" },
        { name: "Test Plan", path: "/test_plan" },
      ]
    : [];
  return (
    <DashboardLayout>
      <SuiBox py={1}>
        <SuiBox mb={3}>
          <Card>
            <SuiBox display="flex" justifyContent="right" alignItems="right">
              <Setting_mark options={routes} />
            </SuiBox>
            <SuiBox customClass={classes.tables_table}>
              <Member />
            </SuiBox>
          </Card>
        </SuiBox>
      </SuiBox>
      <Footer />
    </DashboardLayout>
  );
}
export default Tables;
