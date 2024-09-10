import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import {
  Table as MuiTable,
  TableBody,
  TableContainer,
  TableRow,
  TableCell,
  Button,
} from "@mui/material";
import SuiBox from "components/SuiBox";
import SuiAvatar from "components/SuiAvatar";
import SuiTypography from "components/SuiTypography";
import colors from "assets/theme/base/colors";
import typography from "assets/theme/base/typography";
import borders from "assets/theme/base/borders";

function Table({ columns, rows }) {
  const { light } = colors;
  const { size, fontWeightBold } = typography;
  const { borderWidth } = borders;

  // State for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(5); // Fixed number of rows per page

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const renderColumns = columns.map(({ name, align }, key) => {
    let pl;
    let pr;

    if (key === 0 || key === columns.length - 1) {
      pl = 3;
      pr = 3;
    } else {
      pl = 1;
      pr = 1;
    }

    return (
      <TableCell
        key={name}
        padding="normal"
        align={align}
        style={{
          paddingLeft: align === "left" ? pl : 3,
          paddingRight: align === "right" ? pr : 3,
          fontSize: size.xxs,
          fontWeight: fontWeightBold,
          color: "secondary",
          opacity: 0.7,
          borderBottom: `${borderWidth[1]} solid ${light.main}`,
        }}
      >
        {name.toUpperCase()}
      </TableCell>
    );
  });

  const paginatedRows = useMemo(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return rows.slice(startIndex, endIndex);
  }, [rows, page, rowsPerPage]);

  const renderRows = paginatedRows.map((row, key) => {
    const rowKey = `row-${key}`;

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

    return <TableRow key={rowKey}>{tableRow}</TableRow>;
  });

  // Helper function to generate page numbers for pagination
  const getPaginationRange = (currentPage, totalPages) => {
    const range = [];
    const delta = 2;
    const left = Math.max(currentPage - delta, 1);
    const right = Math.min(currentPage + delta, totalPages);
    const needLeftSplice = currentPage > delta + 1;
    const needRightSplice = totalPages - currentPage > delta;

    if (needLeftSplice) {
      range.push(1);
      if (currentPage > delta + 2) {
        range.push("...");
      }
    }

    for (let i = left; i <= right; i++) {
      range.push(i);
    }

    if (needRightSplice) {
      if (currentPage < totalPages - delta - 1) {
        range.push("...");
      }
      range.push(totalPages);
    }

    return range;
  };

  const totalPages = Math.ceil(rows.length / rowsPerPage);
  const paginationRange = getPaginationRange(page + 1, totalPages);

  return (
    <>
      <TableContainer>
        <MuiTable>
          <SuiBox component="thead">
            <TableRow>{renderColumns}</TableRow>
          </SuiBox>
          <TableBody>{renderRows}</TableBody>
        </MuiTable>
      </TableContainer>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "16px",
        }}
      >
        {paginationRange.map((item, index) =>
          item === "..." ? (
            <span key={index} style={{ margin: "0 8px", color: "#000" }}>
              ...
            </span>
          ) : (
            <Button
              key={index}
              onClick={() => handleChangePage(item - 1)}
              style={{
                margin: "0 2px",
                backgroundColor: page === item - 1 ? "#0056b3" : "#007bff", // Blue background for active and default
                color: "#fff", // White text color
                borderRadius: "4px", // Boxed style
                padding: "6px 12px", // Padding for better appearance
                textTransform: "none", // Preserve text case
                fontWeight: page === item - 1 ? "bold" : "normal", // Bold font for active page
              }}
            >
              {item}
            </Button>
          )
        )}
      </div>
    </>
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
