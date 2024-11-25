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
import { Card } from "@mui/material";
// Soft UI Dashboard React components
import SuiBox from "components/SuiBox";
// import SuiTypography from "components/SuiTypography";

// Soft UI Dashboard React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "examples/Footer";
import Test_driver_validation from "layouts/test_driver_validation/table/test_driver_validation";
import Setting_mark from "examples/Icons/Setting_mark";
// Custom styles for the Tables
import styles from "layouts/tables/styles";
//permission
import { hasAzureAccess } from "auth-context/auth.context";

// Data

function Tables() {
  const classes = styles();
  const routes = hasAzureAccess()
    ? [
        { name: "Member", path: "/member" },
        { name: "Token", path: "/token" },
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
              <Test_driver_validation />
            </SuiBox>
          </Card>
        </SuiBox>
      </SuiBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Tables;
