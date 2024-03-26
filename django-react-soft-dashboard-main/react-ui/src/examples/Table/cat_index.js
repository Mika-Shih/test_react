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

import { useMemo } from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import { Table as MuiTable } from "@mui/material";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";

// Soft UI Dashboard React components
import SuiBox from "components/SuiBox";
//import SuiAvatar from "components/SuiAvatar";
import SuiTypography from "components/SuiTypography";
import SuiButton from "components/SuiButton";
// Soft UI Dashboard React base styles
import colors from "assets/theme/base/colors";
import typography from "assets/theme/base/typography";
import borders from "assets/theme/base/borders";
import axios from "axios";
function Table({ columns, rows }) {
  const backendServer = process.env.REACT_APP_BACKEND_SERVER;
  const { light } = colors;
  const { size, fontWeightBold } = typography;
  const { borderWidth } = borders;
  const newcolumns = [...columns, { name: "ACTIVE", align: "center" }];
  const renderColumns = newcolumns.map(({ name, align }, key) => {
    let pl;
    let pr;

    if (key === 0) {
      pl = 3;
      pr = 3;
    } else if (key === newcolumns.length - 1) {
      pl = 3;
      pr = 3;
    } else {
      pl = 1;
      pr = 1;
    }

    return (
      <SuiBox
        key={name}
        component="th"
        pt={1.5}
        pb={1.25}
        pl={align === "left" ? pl : 3}
        pr={align === "right" ? pr : 3}
        textAlign={align}
        fontSize={size.xxs}
        fontWeight={fontWeightBold}
        color="secondary"
        opacity={0.7}
        borderBottom={`${borderWidth[1]} solid ${light.main}`}
      >
        {name.toUpperCase()}
      </SuiBox>
    );
  });
  const handlePause = (serialnumber) => {
    const request_data = { serial_number: serialnumber };
    axios.post(`${backendServer}cat/pause_machine_tool/`, request_data).then((response) => {
      if (response.data.successful) {
        const apiData = response.data.successful;
        console.log(apiData);
        alert(apiData);
      } else {
        const apiData = response.data.error;
        console.log(apiData);
        alert(apiData);
      }
    });
  };
  const handleContinue = (serialnumber) => {
    const request_data = { serial_number: serialnumber };
    axios.post(`${backendServer}cat/continue_machine_tool/`, request_data).then((response) => {
      if (response.data.successful) {
        const apiData = response.data.successful;
        console.log(apiData);
        alert(apiData);
      } else {
        const apiData = response.data.error;
        console.log(apiData);
        alert(apiData);
      }
    });
  };

  const handleFinish = (row) => {
    alert(`Finishing row with SERIAL_NUMBER: ${row.SERIAL_NUMBER}`);
  };
  const renderRows = rows.map((row, key) => {
    const rowKey = `row-${key}`;
    const tableRow = newcolumns.map(({ name, align }) => {
      let template;
      if (name === "ACTIVE") {
        //console.log(row["status"].props.badgeContent);
        if (row["status"].props.badgeContent === "running") {
          template = (
            <SuiBox key={row[name]} component="td" p={1} textAlign={align}>
              <SuiButton
                variant="contained"
                color="warning"
                size="small"
                onClick={() => handlePause(row["serial_number"])}
              >
                Pause
              </SuiButton>
              <SuiButton
                variant="contained"
                color="success"
                size="small"
                onClick={() => handleFinish(row)}
              >
                Finish
              </SuiButton>
            </SuiBox>
          );
          console.log(template);
        } else if (row["status"].props.badgeContent === "pause") {
          template = (
            <SuiBox key={row[name]} component="td" p={1} textAlign={align}>
              <SuiButton
                variant="contained"
                color="warning"
                size="small"
                onClick={() => handleContinue(row["serial_number"])}
                //style={{ backgroundColor: "#FFB6C1" }}
              >
                Continue
              </SuiButton>
              <SuiButton
                variant="contained"
                color="success"
                size="small"
                onClick={() => handleFinish(row)}
              >
                Finish
              </SuiButton>
            </SuiBox>
          );
        } else {
          template = (
            <SuiBox key={row[name]} component="td" p={1} textAlign={align}>
              <SuiTypography
                variant="button"
                fontWeight="regular"
                textColor="secondary"
                customClass="d-inline-block w-max"
              >
                {row[name]}
              </SuiTypography>
            </SuiBox>
          );
        }
      } else {
        template = (
          <SuiBox key={row[name]} component="td" p={1} textAlign={align}>
            <SuiTypography
              variant="button"
              fontWeight="regular"
              textColor="secondary"
              customClass="d-inline-block w-max"
            >
              {row[name]}
            </SuiTypography>
          </SuiBox>
        );
      }
      return template;
    });

    return <TableRow key={rowKey}>{tableRow}</TableRow>;
  });

  return useMemo(
    () => (
      <TableContainer>
        <MuiTable>
          <SuiBox component="thead">
            <TableRow>{renderColumns}</TableRow>
          </SuiBox>
          <TableBody>{renderRows}</TableBody>
        </MuiTable>
      </TableContainer>
    ),
    [columns, rows]
  );
}

// Setting default values for the props of Table
Table.defaultProps = {
  columns: [],
  rows: [{}],
};

// Typechecking props for the Table
Table.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object),
  rows: PropTypes.arrayOf(PropTypes.object),
};

export default Table;
