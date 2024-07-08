import React, { useState, useEffect } from "react";
import SuiBox from "components/SuiBox";
import SuiTypography from "components/SuiTypography";
import Checkbox from "@mui/material/Checkbox";

import TestCaseRrecordApi from "api/test_plan/testCaseRecord";
import { useLocation } from "react-router-dom";

function testCasesHistoryTableData(editorId, item_id) {
  console.log("item_id", item_id);
  const [testCaseRecords, setTestCaseRecords] = useState([]);
  const [maxNoteLength, setMaxNoteLength] = useState([]);
  const [checkedStates, setCheckedStates] = useState({});
  const [checkedIds, setCheckedIds] = useState([]);
  const [isFormDirty, setIsFormDirty] = useState(false);

  console.log(checkedStates);
  const handleCheckboxChange = (recordId) => {
    setCheckedIds((prev) => {
      if (prev.includes(recordId)) {
        return prev.filter((id) => id !== recordId); // Remove id if already included
      } else if (prev.length < 2) {
        return [...prev, recordId]; // Add id if less than two are selected
      }
      return prev; // Return previous state if two are already selected and trying to add another
    });
  };

  const location = useLocation();
  const { data } = location.state || {};
  console.log("data", data);

  const handleResize = () => {
    const screenWidth = window.innerWidth;
    let maxNoteLength;

    if (screenWidth <= 768) {
      // maxNameLength = 15 + ((screenWidth - 320) / 448) * 5; // 320为手机屏幕基准宽度，448为768-320
      maxNoteLength = 80 + ((screenWidth - 320) / 448) * 20;
    } else if (screenWidth <= 1024) {
      // maxNameLength = 20 + ((screenWidth - 769) / 255) * 2; // 769为上一档次的最大宽度+1，255为1024-769
      maxNoteLength = 100 + ((screenWidth - 769) / 255) * 10;
    } else {
      // maxNameLength = 22 + ((screenWidth - 1025) / (1920 - 1025)) * 3; // 假设最大屏幕宽度为1920
      maxNoteLength = 110 + ((screenWidth - 1025) / (1920 - 1025)) * 10;
    }

    // maxNameLength = Math.min(maxNameLength, 25); // 假定最大名字长度为25
    maxNoteLength = Math.min(maxNoteLength, 120); // 假定最大描述长度为120

    setMaxNoteLength(Math.round(maxNoteLength));
  };

  useEffect(() => {
    handleResize(); // 初始化
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const initialCheckStates = {};
    testCaseRecords.forEach((record) => {
      initialCheckStates[record.id] = false;
    });
    setCheckedStates(initialCheckStates);
  }, [testCaseRecords]); // Dependent on testCaseRecords so it updates when they do

  useEffect(() => {
    setIsFormDirty(checkedIds.length === 2);
  }, [checkedIds]);

  function autoWrapText(text, maxLength) {
    if (typeof text !== "string") {
      text = "";
    }

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
    { name: "version", align: "left", headerName: "version" }, //need to show item_id.version
    { name: "note", align: "left", headerName: "note" },
    { name: "timestamp", align: "left", headerName: "timestamp" },
    { name: "id", width: 0 },
    { name: "editor_id", width: 0 },
    { name: "action", align: "center", headerName: "Action" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requestData = {
          item_id: item_id,
        };
        const response = await TestCaseRrecordApi.get_all_version_record(requestData);
        console.log("Response:", response);
        const records = response.data;
        console.log("records", records);
        const processedData = records.map((record) => {
          const rowData = {};
          columns.forEach((column) => {
            if (column.name !== "Common") {
              rowData[column.name] = record[column.name];
            }
          });
          return rowData;
        });
        setTestCaseRecords(processedData);
      } catch (error) {
        console.error("Error fetching communication test plan records:", error);
      }
    };
    fetchData();
  }, [item_id]);
  console.log("testCaseRecord", testCaseRecords);

  const rows = testCaseRecords.map((record) => {
    console.log(record.id);
    if (record.description === null) {
      record.description = "";
    }

    const fullVersion = `${item_id}.${record.version}`;
    const formattedNote = autoWrapText(record.note, maxNoteLength);

    return {
      version: (
        <SuiBox paddingLeft={2}>
          <SuiTypography variant="caption" textColor="secondary" fontWeight="medium" align="left">
            {fullVersion}
          </SuiTypography>
        </SuiBox>
      ),
      note: (
        <SuiTypography variant="caption" textColor="secondary" fontWeight="medium">
          {formattedNote}
        </SuiTypography>
      ),
      timestamp: (
        <SuiTypography variant="caption" textColor="secondary" fontWeight="medium">
          {record.timestamp}
        </SuiTypography>
      ),
      action: (
        <Checkbox
          checked={checkedIds.includes(record.id)}
          onChange={() => handleCheckboxChange(record.id)}
          inputProps={{ "aria-label": "Select" }}
        />
      ),
    };
  });

  return { columns, rows, isFormDirty, checkedIds };
}

export default testCasesHistoryTableData;
