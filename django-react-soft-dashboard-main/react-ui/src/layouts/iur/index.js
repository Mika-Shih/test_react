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
import SuiTypography from "components/SuiTypography";
import { Link } from "react-router-dom";
// Soft UI Dashboard React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
// import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Setting_mark from "examples/Icons/Setting_mark";
import Footer from "examples/Footer";
// import Grid from "@mui/material/Grid";

import Iur_machine from "layouts/iur/table/iur_table";
import Delete_machine from "layouts/iur/table/delete_iur";
import Scrapped_machine from "layouts/iur/table/scrapped_iur";
import Change_machine from "layouts/iur/table/change_iur";
import Return_machine from "layouts/iur/table/return_iur";
import New_machine_mail from "layouts/iur/table/new_machine_iur_mail";
import Transfer_machine from "layouts/iur/table/transfer_new_owner";
// Custom styles for the Tables
import styles from "layouts/tables/styles";
import { useEffect, useState } from "react";
//permission
import { hasAzureAccess } from "auth-context/auth.context";
function Tables() {
  const classes = styles();
  const [result, setResult] = useState(0);
  const option_get = (option) => {
    setResult(option);
  };
  const [select_iur_machine, set_select_iur_machine] = useState([]);
  useEffect(() => {}, [result, select_iur_machine]);

  const iur_data_get = (iur_machine) => {
    set_select_iur_machine(iur_machine);
  };
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
            <SuiBox display="flex" justifyContent="center" alignItems="center" p={3}>
              <Link to="/your-target-route" style={{ textDecoration: "none" }}>
                <SuiTypography
                  variant="h2"
                  textColor="info"
                  fontWeight="bold"
                  textGradient
                  style={{ letterSpacing: "2px" }}
                >
                  IUR System
                </SuiTypography>
              </Link>
            </SuiBox>
            <SuiBox display="flex" justifyContent="center" alignItems="center" p={2}></SuiBox>
          </Card>
          {result == 0 && (
            <>
              <Card>
                <SuiBox customClass={classes.tables_table}>
                  <Iur_machine
                    iur={(select_iur_machine) => iur_data_get(select_iur_machine)}
                    iur_option={(option) => option_get(option)}
                  />
                </SuiBox>
              </Card>
            </>
          )}
          {result == 2 && (
            <>
              <Card>
                <SuiBox customClass={classes.tables_table}>
                  <Return_machine iur_data={select_iur_machine} />
                </SuiBox>
              </Card>
            </>
          )}
          {result == 3 && (
            <>
              <Card>
                <SuiBox customClass={classes.tables_table}>
                  <New_machine_mail iur_data={select_iur_machine} />
                </SuiBox>
              </Card>
            </>
          )}
          {result == 4 && (
            <>
              <Card>
                <SuiBox customClass={classes.tables_table}>
                  <Change_machine iur_data={select_iur_machine} />
                </SuiBox>
              </Card>
            </>
          )}
          {result == 5 && (
            <>
              <Card>
                <SuiBox customClass={classes.tables_table}>
                  <Delete_machine iur_data={select_iur_machine} />
                </SuiBox>
              </Card>
            </>
          )}
          {result == 6 && (
            <>
              <Card>
                <SuiBox customClass={classes.tables_table}>
                  <Scrapped_machine iur_data={select_iur_machine} />
                </SuiBox>
              </Card>
            </>
          )}
          {result == 7 && (
            <>
              <Card>
                <SuiBox customClass={classes.tables_table}>
                  <Transfer_machine iur_data={select_iur_machine} />
                </SuiBox>
              </Card>
            </>
          )}
        </SuiBox>
      </SuiBox>
      <Footer />
    </DashboardLayout>
  );
}
export default Tables;
