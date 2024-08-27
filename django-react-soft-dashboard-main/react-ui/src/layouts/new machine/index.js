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
import React, { useState } from "react";
// Soft UI Dashboard React components
import SuiBox from "components/SuiBox";
import SuiTypography from "components/SuiTypography";

// Soft UI Dashboard React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
// import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Addsn from "layouts/new machine/table/add_sn";
import Addplatform from "layouts/new machine/table/add_platform";
import Button from "examples/Icons/Button";
// Custom styles for the Tables
import styles from "layouts/tables/styles";

function Tables() {
  const classes = styles();
  // console.log(machine_tool_data());
  const [isStep, setIsStep] = useState(false);
  const togglePage = () => {
    setIsStep((prevIsStep) => !prevIsStep);
  };
  const [sn, set_sn] = useState([]);
  const sn_data_get = (sn) => {
    set_sn(sn);
  };
  return (
    <DashboardLayout>
      <SuiBox py={1}>
        <SuiBox mb={3}>
          <Card>
            <SuiBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
              <SuiTypography variant="h3"></SuiTypography>
            </SuiBox>
            <SuiBox customClass={classes.tables_table}>
              {!isStep && <Addsn serial_number={sn} serial_number_get={(sn) => sn_data_get(sn)} />}
              {isStep && <Addplatform serial_number={sn} />}
            </SuiBox>
            <Button onClick={togglePage} style={{ marginLeft: "16px", width: "100px" }}>
              {isStep ? "previous step" : "next step"}
            </Button>
          </Card>
        </SuiBox>
      </SuiBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Tables;
