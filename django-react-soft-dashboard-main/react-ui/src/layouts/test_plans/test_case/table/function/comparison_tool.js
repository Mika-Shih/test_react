import React from "react";
import PropTypes from "prop-types";
import useStyles from "../styles/case_styles";
import { TableContainer, TableRow, TableCell, TableBody, Button } from "@mui/material";

function ComparisonTool({
  testCaseData,
  selectedCases,
  setSelectedCases,
  formatTimeForFrontend,
  getVersionNumber,
}) {
  // 使用本地樣式
  const classes = useStyles();
  const [comparisonData, setComparisonData] = React.useState(null);
  const [showComparison, setShowComparison] = React.useState(false);

  // compareText 函數不變...

  const compareText = (text1, text2) => {
    // 相同內容，直接返回
    if (text1 === text2) return text1;

    // 處理空值情況
    if (!text1 || text1 === "") {
      return "";
    }

    if (!text2 || text2 === "") {
      return <span style={{ color: "red", fontWeight: "bold" }}>{text1}</span>;
    }
    const diffIndex = [...text1].findIndex((char, i) => char !== text2[i]);

    if (diffIndex === -1) {
      if (text1.length < text2.length) {
        return (
          <span>
            {text1}
            <span style={{ color: "red", fontWeight: "bold" }}>{text2.slice(text1.length)}</span>
          </span>
        );
      } else {
        return text1;
      }
    }
    return (
      <span>
        {text1.slice(0, diffIndex)}
        <span style={{ color: "red", fontWeight: "bold" }}>{text1.slice(diffIndex)}</span>
      </span>
    );
  };

  const handleCompare = () => {
    if (selectedCases.length !== 2) {
      alert("Please select exactly two versions for comparison!");
      return;
    }

    const [version1, version2] = selectedCases.map((id) =>
      testCaseData.data.find((item) => item.case_id === id)
    );

    setComparisonData({ version1, version2 });
    setShowComparison(true);
    setSelectedCases([]);
  };

  const getVersionNumberForCase = (caseId) => {
    return getVersionNumber(testCaseData, caseId);
  };

  const data_row = (index, rowData, comparisonData = null) => {
    if (!rowData || typeof rowData.case_id === "undefined") {
      console.error("Invalid rowData:", rowData);
      return null;
    }

    const versionNumber = getVersionNumberForCase(rowData.case_id);
    const isSelected = selectedCases.includes(rowData.case_id);

    return (
      <TableRow className={classes.view_table_row_style} key={index}>
        <TableCell className={classes.checkbox}>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => toggleCaseSelection(rowData.case_id)}
          />
        </TableCell>
        <TableCell className={classes.view_case_name}>
          {comparisonData
            ? compareText(rowData.case_name, comparisonData.case_name)
            : rowData.case_name}
        </TableCell>
        <TableCell className={classes.view_description} style={{ whiteSpace: "pre-wrap" }}>
          {comparisonData
            ? compareText(rowData.description, comparisonData.description)
            : rowData.description}
        </TableCell>
        <TableCell className={classes.view_comment}>
          {comparisonData ? compareText(rowData.comment, comparisonData.comment) : rowData.comment}
        </TableCell>
        <TableCell className={classes.view_last_editor}>{rowData.editor_name}</TableCell>
        <TableCell className={classes.view_version}>{versionNumber}</TableCell>
        <TableCell className={classes.view_update_time}>
          {formatTimeForFrontend(rowData.update_time)}
        </TableCell>
      </TableRow>
    );
  };

  const toggleCaseSelection = (caseId) => {
    setSelectedCases((prev) =>
      prev.includes(caseId) ? prev.filter((id) => id !== caseId) : [...prev, caseId]
    );
  };

  return (
    <div>
      <Button
        variant="contained"
        onClick={handleCompare}
        disabled={selectedCases.length !== 2}
        className={classes.line_form_style}
        style={{
          backgroundColor: "#bbdefb",
          color: "#000",
          borderRadius: "20px",
          border: "none",
          fontWeight: "500",
          minWidth: "80px",
          textTransform: "none",
          fontSize: "14px",

          padding: "0px 20px",
          // 方案2: 透過縮小元素尺寸
          transform: "scale(0.9)",
          // 方案3: 使用較小的固定高度
          height: "12px",
          lineHeight: "1",
        }}
      >
        Compare
      </Button>

      {showComparison && comparisonData && (
        <div
          className={classes.columns_center}
          style={{
            position: "absolute",
            width: "100%",
            left: 0,
            marginTop: "15px",
            zIndex: 10,
          }}
        >
          <TableContainer>
            <TableRow className={classes.title_table_row_style}>
              <TableCell className={classes.checkbox}></TableCell>
              <TableCell className={classes.view_title_case_name}>Case Name</TableCell>
              <TableCell className={classes.view_title_description}>Description</TableCell>
              <TableCell className={classes.view_title_comment}>Comment</TableCell>
              <TableCell className={classes.view_title_last_editor}>Last Editor</TableCell>
              <TableCell className={classes.view_title_version}>Version</TableCell>
              <TableCell className={classes.view_title_update_time}>Update Time</TableCell>
            </TableRow>

            <TableBody>
              {data_row(0, comparisonData.version1, comparisonData.version2)}
              {data_row(1, comparisonData.version2, comparisonData.version1)}
            </TableBody>
          </TableContainer>
        </div>
      )}
    </div>
  );
}

ComparisonTool.propTypes = {
  testCaseData: PropTypes.object.isRequired,
  selectedCases: PropTypes.array.isRequired,
  setSelectedCases: PropTypes.func.isRequired,
  formatTimeForFrontend: PropTypes.func.isRequired,
  getVersionNumber: PropTypes.func.isRequired,
  classes: PropTypes.object, // 改為可選，因為現在我們使用本地styles
};

export default ComparisonTool;
