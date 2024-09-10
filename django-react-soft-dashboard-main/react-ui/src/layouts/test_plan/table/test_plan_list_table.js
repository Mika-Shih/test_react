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
import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import {
  Table as MuiTable,
  TableContainer,
  TableBody,
  TableRow,
  TableCell,
  Icon,
} from "@mui/material";
import SuiBox from "components/SuiBox";
import SuiAvatar from "components/SuiAvatar";
import SuiTypography from "components/SuiTypography";
import Checkbox from "@mui/material/Checkbox";
import SuiButton from "components/SuiButton";
// Soft UI Dashboard React base styles
// import colors from "assets/theme/base/colors";
// import typography from "assets/theme/base/typography";
// import borders from "assets/theme/base/borders";
const Table = ({ columns, rows }) => {
  // const { light } = colors;
  // const { size, fontWeightBold } = typography;
  // const { borderWidth } = borders;

  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState({});
  console.log(columns, rows);
  const handleSelectAll = (event) => {
    setSelectAll(event.target.checked);
    const newSelectedRows = {};
    rows.forEach((row, index) => {
      newSelectedRows[index] = event.target.checked;
    });
    setSelectedRows(newSelectedRows);
  };

  const handleSelectRow = (index) => (event) => {
    setSelectedRows({
      ...selectedRows,
      [index]: event.target.checked,
    });
  };

  // const renderColumns = columns.map(({ name, align, headerName }, key) => {
  //   let pl, pr;

  //   if (key === 0) {
  //     pl = 3;
  //     pr = 3;
  //   } else if (key === columns.length - 1) {
  //     pl = 3;
  //     pr = 3;
  //   } else {
  //     pl = 1;
  //     pr = 1;
  //   }
  //   // <Checkbox
  //   //   checked={selectAll}
  //   //   onChange={handleSelectAll}
  //   //   inputProps={{ "aria-label": "select all rows" }}
  //   // />
  //   console.log("headerName", headerName, key);
  //   return (
  //     <SuiBox
  //       key={name}
  //       component="th"
  //       pt={1.5}
  //       pb={1.25}
  //       pl={align === "left" ? pl : 3}
  //       pr={align === "right" ? pr : 3}
  //       textAlign={align}
  //       fontSize={size.xxs}
  //       fontWeight={fontWeightBold}
  //       color="secondary"
  //       opacity={0.7}
  //       borderBottom={`${borderWidth[1]} solid ${light.main}`}
  //     >
  //       <Checkbox
  //         checked={selectAll}
  //         onChange={handleSelectAll}
  //         inputProps={{ "aria-label": "select all rows" }}
  //       />
  //       {name.toUpperCase()}
  //     </SuiBox>
  //   );
  // });
  const renderColumns = () => {
    const tableRow = columns.map(({ name, align }) => {
      let template;
      if (Array.isArray(name)) {
        template = (
          <TableCell key={name[1]} align={align}>
            <SuiBox display="flex" alignItems="center" py={0.5} px={1}>
              <SuiBox mr={2}>
                <SuiAvatar src={name[0]} name={name[1]} variant="rounded" size="sm" />
              </SuiBox>
              <SuiTypography variant="button" fontWeight="medium" customClass="w-max">
                {name[1]}
              </SuiTypography>
            </SuiBox>
          </TableCell>
        );
      } else {
        template = (
          <TableCell key={name} align={align}>
            <SuiTypography
              variant="button"
              fontWeight="regular"
              textColor="secondary"
              customClass="d-inline-block w-max"
            >
              {name.toUpperCase()}
            </SuiTypography>
          </TableCell>
        );
      }

      return template;
    });

    return (
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            checked={selectAll}
            onChange={handleSelectAll}
            inputProps={{ "aria-label": "select all rows" }}
          />
        </TableCell>
        {tableRow}
      </TableRow>
    );
  };

  const renderRows = rows.map((row, index) => {
    const rowKey = `row-${index}`;
    const isChecked = selectedRows[index] || false;

    const tableRow = columns.map(({ name, align }) => {
      let template;
      if (Array.isArray(row[name])) {
        template = (
          <TableCell key={row[name][1]} align={align}>
            <SuiBox display="flex" alignItems="center" py={0.5} px={1}>
              <SuiBox mr={2}>
                <SuiAvatar src={row[name][0]} name={row[name][1]} variant="rounded" size="sm" />
              </SuiBox>
              <SuiTypography variant="button" fontWeight="medium" customClass="w-max">
                {row[name][1]}
              </SuiTypography>
            </SuiBox>
          </TableCell>
        );
      } else {
        template = (
          <TableCell key={row[name]} align={align}>
            <SuiTypography
              variant="button"
              fontWeight="regular"
              textColor="secondary"
              customClass="d-inline-block w-max"
            >
              {row[name]}
            </SuiTypography>
          </TableCell>
        );
      }

      return template;
    });

    return (
      <TableRow key={rowKey}>
        <TableCell padding="checkbox">
          <Checkbox
            checked={isChecked}
            onChange={handleSelectRow(index)}
            inputProps={{ "aria-label": `select row ${index}` }}
          />
        </TableCell>
        {tableRow}
      </TableRow>
    );
  });

  return useMemo(
    () => (
      <>
        <SuiBox mr={2}>
          <SuiButton
            variant="text"
            buttonColor="success"
            // onClick={(event) => handleExportClick(event, record)}
          >
            <Icon className="material-icons-round">cloud_download</Icon>&nbsp;export
          </SuiButton>
        </SuiBox>

        <SuiBox mr={2}>
          <SuiButton
            variant="text"
            buttonColor="error"
            // onClick={(event) => handleDeleteClick(event, record.plan_id)}
          >
            <Icon className="material-icons-round">delete</Icon>&nbsp;delete
          </SuiButton>
        </SuiBox>
        <TableContainer>
          <MuiTable>
            <SuiBox component="thead">{renderColumns()}</SuiBox>
            <TableBody>{renderRows}</TableBody>
          </MuiTable>
        </TableContainer>
      </>
    ),
    [columns, rows, selectAll, selectedRows]
  );
};

Table.defaultProps = {
  columns: [],
  rows: [{}],
};

Table.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object),
  rows: PropTypes.arrayOf(PropTypes.object),
};

export default Table;
