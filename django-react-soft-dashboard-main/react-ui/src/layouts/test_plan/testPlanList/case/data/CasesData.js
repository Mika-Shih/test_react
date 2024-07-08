import Icon from "@mui/material/Icon";

import React, { useState, useEffect } from "react";
import TestCaseRrecordApi from "api/test_plan/testCaseRecord"; // Update the import path

import SuiTypography from "components/SuiTypography";
import SuiBadge from "components/SuiBadge";
import SuiButton from "components/SuiButton";
import SuiBox from "components/SuiBox";
import { useHistory } from "react-router-dom";

function testItemsTableData(editorId, planId, Category) {
  const [testItemRecords, setTestItemRecords] = useState([]);
  const [maxNameLength, setMaxNameLength] = useState([]);
  const [maxDescriptionLength, setMaxDescriptionLength] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const history = useHistory();

  const handleEditClick = (event, itemId) => {
    console.log("Edit clicked");
    handleMenuClose();
    console.log("editorId", editorId);
    const dataToPass = {
      editorId: editorId,
      planId: planId,
      itemId: itemId,
      category: Category,
    };
    history.push({
      pathname: `/edit_case`,
      state: { data: dataToPass },
    });
  };

  const handleDeleteClick = async (event, itemId) => {
    handleMenuClose();
    try {
      const delete_data = {
        editor_id: editorId,
        plan_id: planId,
        item_id: itemId,
      };
      console.log("delete_data", delete_data);
      await TestCaseRrecordApi.delete_case_from_plan(delete_data);
      const requestData = {
        editor_id: editorId,
        plan_id: planId,
      };
      const response = await TestCaseRrecordApi.get_personal_case_record(requestData);
      console.log("response", response);
      const records = response.data;
      const processedData = records.map((record) => {
        const rowData = {};
        columns.forEach((column) => {
          rowData[column.name] = record[column.name];
        });
        return rowData;
      });
      console.log(processedData);
      setTestItemRecords(processedData);
    } catch (error) {
      console.error("Response:", error.response);
      if (error.response && error.response.data) {
        console.error("Error message:", error.response.data.message);
      }
    }
  };
  const handleResize = () => {
    const screenWidth = window.innerWidth;
    let maxNameLength, maxDescriptionLength;

    if (screenWidth <= 768) {
      maxNameLength = 15 + ((screenWidth - 320) / 448) * 5; // 320为手机屏幕基准宽度，448为768-320
      maxDescriptionLength = 80 + ((screenWidth - 320) / 448) * 20;
    } else if (screenWidth <= 1024) {
      maxNameLength = 20 + ((screenWidth - 769) / 255) * 2; // 769为上一档次的最大宽度+1，255为1024-769
      maxDescriptionLength = 100 + ((screenWidth - 769) / 255) * 10;
    } else {
      maxNameLength = 22 + ((screenWidth - 1025) / (1920 - 1025)) * 3; // 假设最大屏幕宽度为1920
      maxDescriptionLength = 110 + ((screenWidth - 1025) / (1920 - 1025)) * 10;
    }

    maxNameLength = Math.min(maxNameLength, 25); // 假定最大名字长度为25
    maxDescriptionLength = Math.min(maxDescriptionLength, 120); // 假定最大描述长度为120

    setMaxNameLength(Math.round(maxNameLength));
    setMaxDescriptionLength(Math.round(maxDescriptionLength));
  };

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
    { name: "item_name", align: "left", headerName: "item Name" },
    { name: "item_id", align: "center", hide: true },
    { name: "item_status", align: "center", headerName: "item Status" },
    { name: "reviewer_comment", align: "center", headerName: "reviewer Comment" },
    { name: "description", align: "left", headerName: "updated Time" },
    { name: "updated_time", align: "left", headerName: "updated Time" },
    { name: "action", align: "center", headerName: "Action" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requestData = {
          editor_id: editorId,
          plan_id: planId,
        };
        const response = await TestCaseRrecordApi.get_personal_case_record(requestData);
        const records = response.data;
        console.log("records", records);
        const processedData = records.map((record) => {
          const rowData = {};
          columns.forEach((column) => {
            rowData[column.name] = record[column.name];
          });
          return rowData;
        });
        setTestItemRecords(processedData);
      } catch (error) {
        console.error("Error fetching communication test pliteman records:", error);
      }
    };
    fetchData();
  }, []);

  const rows = testItemRecords.map((record) => {
    if (record.description === null) {
      record.description = "";
    }
    // 設置最大字數限制
    // const maxNameLength = 20;
    // const maxDescriptionLength = 100;

    // 處理 item_name 和 description 的自動換行
    const formattedName = autoWrapText(record.item_name, maxNameLength);
    const formattedDescription = autoWrapText(record.description, maxDescriptionLength);
    return {
      item_name: (
        <SuiBox paddingLeft={2}>
          <SuiTypography variant="caption" textColor="secondary" fontWeight="medium" align="left">
            {formattedName}
          </SuiTypography>
        </SuiBox>
      ),
      item_id: (
        <SuiTypography variant="caption" textColor="secondary" fontWeight="medium" align="left">
          {record.item_id}
        </SuiTypography>
      ),
      item_status: (
        <SuiBadge
          variant="gradient"
          badgeContent={
            record.item_status === "approved"
              ? "approved"
              : record.item_status === "disapproved"
              ? "disapproved"
              : "pending"
          }
          color={
            record.item_status === "approved"
              ? "success"
              : record.item_status === "disapproved"
              ? "error"
              : "warning"
          }
          size="extra-small"
        />
      ),
      reviewer_comment: (
        <SuiTypography variant="caption" textColor="secondary" fontWeight="medium">
          {record.reviewer_comment}
        </SuiTypography>
      ),
      description: (
        <SuiTypography variant="caption" textColor="secondary" fontWeight="medium">
          {formattedDescription}
        </SuiTypography>
      ),
      updated_time: (
        <SuiTypography variant="caption" textColor="secondary" fontWeight="medium">
          {record.updated_time}
        </SuiTypography>
      ),
      action: (
        <>
          <SuiBox display="flex" alignItems="center" mt={{ xs: 2, sm: 0 }} ml={{ xs: -1.5, sm: 0 }}>
            <SuiBox mr={1} anchorEl={anchorEl}>
              <SuiButton
                variant="text"
                buttonColor="dark"
                onClick={(event) => handleEditClick(event, record.item_id)}
              >
                <Icon className="material-icons-round">edit</Icon>
                &nbsp;edit
              </SuiButton>
              <SuiButton
                variant="text"
                buttonColor="error"
                onClick={(event) => handleDeleteClick(event, record.item_id)}
              >
                <Icon className="material-icons-round">delete</Icon>&nbsp;delete
              </SuiButton>
            </SuiBox>
          </SuiBox>
        </>
      ),
    };
  });
  return { columns, rows };
}

export default testItemsTableData;
