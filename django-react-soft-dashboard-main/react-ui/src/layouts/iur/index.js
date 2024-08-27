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

// Soft UI Dashboard React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
// import DashboardNavbar from "examples/Navbars/DashboardNavbar";
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
  return (
    <DashboardLayout>
      <SuiBox py={1}>
        {result == 0 && (
          <>
            <SuiBox mb={3}>
              <Card>
                <SuiBox display="flex" justifyContent="center" alignItems="center" p={3}>
                  <SuiTypography
                    variant="h2"
                    textColor="info"
                    fontWeight="bold"
                    textGradient
                    style={{ letterSpacing: "2px" }}
                  >
                    IUR System
                  </SuiTypography>
                </SuiBox>
                <SuiBox customClass={classes.tables_table}>
                  <Iur_machine
                    iur={(select_iur_machine) => iur_data_get(select_iur_machine)}
                    iur_option={(option) => option_get(option)}
                  />
                </SuiBox>
              </Card>
            </SuiBox>
          </>
        )}
        {result == 2 && (
          <>
            <SuiBox mb={3}>
              <Card>
                <SuiBox
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  p={3}
                ></SuiBox>
                <SuiBox customClass={classes.tables_table}>
                  <Return_machine iur_data={select_iur_machine} />
                </SuiBox>
              </Card>
            </SuiBox>
          </>
        )}
        {result == 3 && (
          <>
            <SuiBox mb={3}>
              <Card>
                <SuiBox
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  p={3}
                ></SuiBox>
                <SuiBox customClass={classes.tables_table}>
                  <New_machine_mail iur_data={select_iur_machine} />
                </SuiBox>
              </Card>
            </SuiBox>
          </>
        )}
        {result == 4 && (
          <>
            <SuiBox mb={3}>
              <Card>
                <SuiBox
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  p={3}
                ></SuiBox>
                <SuiBox customClass={classes.tables_table}>
                  <Change_machine iur_data={select_iur_machine} />
                </SuiBox>
              </Card>
            </SuiBox>
          </>
        )}
        {result == 5 && (
          <>
            <SuiBox mb={3}>
              <Card>
                <SuiBox
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  p={3}
                ></SuiBox>
                <SuiBox customClass={classes.tables_table}>
                  <Delete_machine iur_data={select_iur_machine} />
                </SuiBox>
              </Card>
            </SuiBox>
          </>
        )}
        {result == 6 && (
          <>
            <SuiBox mb={3}>
              <Card>
                <SuiBox
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  p={3}
                ></SuiBox>
                <SuiBox customClass={classes.tables_table}>
                  <Scrapped_machine iur_data={select_iur_machine} />
                </SuiBox>
              </Card>
            </SuiBox>
          </>
        )}
        {result == 7 && (
          <>
            <SuiBox mb={3}>
              <Card>
                <SuiBox
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  p={3}
                ></SuiBox>
                <SuiBox customClass={classes.tables_table}>
                  <Transfer_machine iur_data={select_iur_machine} />
                </SuiBox>
              </Card>
            </SuiBox>
          </>
        )}
      </SuiBox>
      <Footer />
    </DashboardLayout>
  );
}
export default Tables;
