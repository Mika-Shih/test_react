// components/CompareTestCases.js
import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import SuiTypography from "components/SuiTypography";
import Table from "examples/Table";
import SuiBox from "components/SuiBox";
import TestCaseRecordApi from "api/test_plan/testCaseRecord";
import PropTypes from "prop-types";

function CompareVersions({ checkedIds }) {
  const [open, setOpen] = useState(true);
  const [maxDescriptionLength, setMaxDescriptionLength] = useState([]);
  const [comparisonData, setComparisonData] = useState([]);

  const handleResize = () => {
    const screenWidth = window.innerWidth;
    let maxDescriptionLength;

    if (screenWidth <= 768) {
      maxDescriptionLength = 80 + ((screenWidth - 320) / 448) * 20;
    } else if (screenWidth <= 1024) {
      maxDescriptionLength = 100 + ((screenWidth - 769) / 255) * 10;
    } else {
      maxDescriptionLength = 110 + ((screenWidth - 1025) / (1920 - 1025)) * 10;
    }

    maxDescriptionLength = Math.min(maxDescriptionLength, 120); // 假定最大描述长度为120

    setMaxDescriptionLength(Math.round(maxDescriptionLength));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await TestCaseRecordApi.get_version_specific_record({
          ids: checkedIds,
        });
        console.log(response.data);
        if (response.data.length >= 2) {
          setComparisonData(response.data);
        } else {
          alert("Not enough data was returned for a comparison.");
        }
      } catch (error) {
        console.error("Error fetching communication test plan records:", error);
        alert("Error fetching test case data. Please try again later.");
      }
    };

    fetchData();
  }, [checkedIds]);

  useEffect(() => {
    handleResize(); // 初始化
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  function autoWrapText(text, maxLength) {
    let formattedText = [];
    let currentLine = "";

    const chars = text.split("");
    for (let i = 0; i < chars.length; i++) {
      const char = chars[i];
      if (currentLine.length + 1 <= maxLength) {
        currentLine += char;
      } else {
        formattedText.push(
          <React.Fragment key={formattedText.length}>
            {currentLine}
            <br />
          </React.Fragment>
        );
        currentLine = char;
      }
    }

    formattedText.push(<React.Fragment key={formattedText.length}>{currentLine}</React.Fragment>);

    return formattedText;
  }

  const columns = [
    { name: "version", align: "left", headerName: "version" },
    { name: "note", align: "left", headerName: "note" },
    { name: "description", align: "left", headerName: "description" },
  ];

  const rows = comparisonData.map((record) => ({
    version: (
      <SuiBox paddingLeft={2}>
        <SuiTypography variant="caption" textColor="secondary" fontWeight="medium">
          {record.item_id}.{record.version}
        </SuiTypography>
      </SuiBox>
    ),
    note: (
      <SuiBox paddingLeft={2}>
        <SuiTypography variant="caption" textColor="secondary" fontWeight="medium">
          {record.note}
        </SuiTypography>
      </SuiBox>
    ),
    description: (
      <SuiBox paddingLeft={2}>
        <SuiTypography variant="caption" textColor="secondary" fontWeight="medium">
          {autoWrapText(record.description, maxDescriptionLength)}
        </SuiTypography>
      </SuiBox>
    ),
  }));

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>{"Compare Test Cases"}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Table columns={columns} rows={rows} />
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

CompareVersions.propTypes = {
  onClose: PropTypes.func.isRequired,
  checkedIds: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default CompareVersions;
