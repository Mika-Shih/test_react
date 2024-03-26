// prop-types is a library for typechecking of props
import PropTypes from "prop-types";
import React, { useMemo /*useState*/ } from "react";

// @mui material components
//import { Table as MuiTable } from "@mui/material";   自動延伸模板
import { FixedSizeList } from "react-window";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
//import TableCell from "@mui/material/TableCell";
import Tablehead from "@mui/material/TableHead";
//import Checkbox from "@mui/material/Checkbox";
//import Paper from "@mui/material/Paper";
// Soft UI Dashboard React components
import SuiBox from "components/SuiBox";
//import SuiAvatar from "components/SuiAvatar";
import SuiTypography from "components/SuiTypography";

// Soft UI Dashboard React base styles
import colors from "assets/theme/base/colors";
import typography from "assets/theme/base/typography";
import borders from "assets/theme/base/borders";

function Table({ columns, rows }) {
  const { light } = colors;
  const { size, fontWeightBold } = typography;
  const { borderWidth } = borders;
  const columnWidths = [150, 60, 70, 120, 100, 50, 150, 100, 80, 80, 70, 300];

  const renderColumns = columns.map(({ name, align }, key) => {
    let pl;
    let pr;
    const columnWidth = columnWidths[key];
    if (key === 0) {
      pl = 1;
      pr = 1;
    } else if (key === columns.length - 1) {
      pl = 1;
      pr = 1;
    } else {
      pl = 0;
      pr = 0;
    }

    return (
      <SuiBox
        key={name}
        component="th"
        pt={1.5}
        pb={1.25}
        pl={align === "left" ? pl : 1}
        pr={align === "right" ? pr : 1}
        textAlign={align}
        fontSize={size.xxs}
        fontWeight={fontWeightBold} /*加粗文本*/
        color="secondary"
        opacity={0.7} /*透明度*/
        borderBottom={`${borderWidth[1]} solid ${light.main}`}
        style={{
          minWidth: columnWidth,
          maxWidth: columnWidth,
          border: `1px solid ${light.main}`,
          //display: "flex",
          alignItems: "center",
        }}
      >
        {name.toUpperCase()}
      </SuiBox>
    );
  });

  const renderRows = rows.map((row, key) => {
    const rowKey = `row-${key}`;
    let pl;
    let pr;

    if (key === 0) {
      pl = 1;
      pr = 1;
    } else if (key === columns.length - 1) {
      pl = 1;
      pr = 1;
    } else {
      pl = 0;
      pr = 0;
    }
    const tableRow = columns.map(({ name, align }, colkey) => {
      let template;
      const columnWidth = columnWidths[colkey];
      template = (
        <SuiBox
          key={row[name]}
          component={colkey === 0 ? "th" : "td"}
          p={1}
          pt={1.5}
          pb={1.25}
          pl={align === "left" ? pl : 1}
          pr={align === "right" ? pr : 1}
          textAlign={align}
          fontSize={size.xxs}
          fontWeight={fontWeightBold} /*加粗文本*/
          color="secondary"
          opacity={0.7} /*透明度*/
          borderBottom={`${borderWidth[1]} solid ${light.main}`}
          style={{
            minWidth: columnWidth,
            maxWidth: columnWidth,
            border: `1px solid ${light.main}`,
            alignItems: "center",
          }}
        >
          <SuiTypography
            variant="button" /*文字變體*/
            fontWeight="regular"
            textColor="secondary"
            customClass="d-inline-block w-max" /*CSS自定義名*/
          >
            {row[name]}
          </SuiTypography>
        </SuiBox>
      );
      return template;
    });

    return <TableRow key={rowKey}>{tableRow}</TableRow>;
  });

  /*虛擬DOM*/
  return useMemo(
    () => (
      <TableContainer>
        <div style={{}}>
          <Tablehead>
            <TableRow style={{ width: 100 }}>{renderColumns}</TableRow>
          </Tablehead>
        </div>
        <div style={{ display: "flex", overflowY: "auto", width: "100%", marginLeft: "16px" }}>
          <FixedSizeList
            height={600} // 設置可見區域的高度
            itemCount={rows.length} // 行數
            itemSize={/* 每一行的高度 */ 50} // 根據您的需求設置
            width={"120%"}
          >
            {({ index, style }) => <TableRow style={style}>{renderRows[index]}</TableRow>}
          </FixedSizeList>
        </div>
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
