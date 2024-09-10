import Icon from "@mui/material/Icon";
import React, { useState, useEffect } from "react";
import SuiButton from "components/SuiButton";
import SuiBox from "components/SuiBox";
import SuiTypography from "components/SuiTypography";
import { Link, useHistory } from "react-router-dom";

import TestPlanRrecordApi from "api/test_plan/testPlanRecord";
import TestCaseRrecordApi from "api/test_plan/testCaseRecord";

import * as XlsxPopulate from "xlsx-populate";
import template from "assets/template.xlsx";

function testPlansTableData(editorId, category) {
  const [testPlanRecords, setTestPlanRecords] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const history = useHistory();

  const handleEditClick = (event, planId) => {
    const dataToPass = {
      editorId: editorId,
      planId: planId,
      category: category,
    };
    handleMenuClose();
    history.push({
      pathname: `/edit_plan`,
      state: { from: "test_plans", data: dataToPass },
    });
  };

  const handleCopyClick = async (event, planId) => {
    console.log("Copy clicked for planId", planId);
    const dataToPass = {
      editorId: editorId,
      planId: planId,
      category: category,
    };
    history.push({
      pathname: `/copy_plan`,
      state: { from: "test_plans", data: dataToPass },
    });
  };

  const handleViewClick = (event, planId) => {
    const dataToPass = {
      editorId: editorId,
      planId: planId,
      category: category,
    };
    history.push({
      pathname: `/view_plan`,
      state: { from: "test_plans", data: dataToPass },
    });
  };

  const handleExportClick = async (event, record) => {
    console.log(record);
    try {
      const response = await fetch(template);
      if (!response.ok) throw new Error("Network response was not ok.");
      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();

      const workbook = await XlsxPopulate.fromDataAsync(arrayBuffer);
      const sheet = workbook.sheet(0);

      const requestData = {
        editor_id: editorId,
        plan_id: record.plan_id,
      };
      const dataResponse = await TestCaseRrecordApi.get_personal_case_record(requestData);
      const data = dataResponse.data.map((item) => {
        const details = JSON.parse(item.item_details);
        return {
          id: item.item_id,
          case: details.test_item_name,
          description: details.description,
        };
      });

      data.forEach((item, index) => {
        const currentRow = index + 4;
        console.log(item);
        sheet
          .cell(currentRow, 1)
          .value(item.id)
          .style("horizontalAlignment", "left")
          .style("fill", { type: "solid", color: "ffff99" })
          .style("border", {
            top: { style: "thin", color: "000000" },
            left: { style: "thin", color: "000000" },
            bottom: { style: "thin", color: "000000" },
            right: { style: "thin", color: "000000" },
          })
          .style("wrapText", true);
        ["case", "description"].forEach((attr, colOffset) => {
          sheet
            .cell(currentRow, 2 + colOffset)
            .value(item[attr])
            .style("border", {
              top: { style: "thin", color: "000000" },
              left: { style: "thin", color: "000000" },
              bottom: { style: "thin", color: "000000" },
              right: { style: "thin", color: "000000" },
            })
            .style("wrapText", true);
        });
      });

      const placeholders = {
        "{{plan}}": record.plan_name,
      };

      sheet.usedRange().forEach((cell) => {
        if (cell.value() && typeof cell.value() === "string") {
          Object.entries(placeholders).forEach(([placeholder, value]) => {
            if (cell.value().includes(placeholder)) {
              cell.value(value);
            }
          });
        }
      });

      workbook.outputAsync().then(function (blob) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.href = url;
        a.download = `${record.plan_name}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      });
    } catch (error) {
      console.error("Error exporting data:", error);
    }
  };

  const handleDeleteClick = async (event, planId) => {
    handleMenuClose();
    try {
      const delete_data = {
        plan_id: planId,
      };
      await TestPlanRrecordApi.delete_plan_record(delete_data);
      const requestData = {
        editor_id: editorId,
        category: category,
      };
      const response = await TestPlanRrecordApi.get_personal_plan_record(requestData);
      const records = response.data;
      const processedData = records.map((record) => {
        const rowData = {};
        columns.forEach((column) => {
          rowData[column.name] = record[column.name];
        });
        return rowData;
      });
      setTestPlanRecords(processedData);
    } catch (error) {
      console.error("Response:", error.response);
      if (error.response && error.response.data) {
        console.error("Error message:", error.response.data.message);
      }
    }
  };

  const columns = [
    { name: "plan_name", align: "center", headerName: "Plan Name" },
    { name: "plan_id", width: 0 },
    { name: "editor_id", width: 0 },
    { name: "action", align: "center", headerName: "Action" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requestData = {
          editor_id: editorId,
          category: category,
        };
        const response = await TestPlanRrecordApi.get_personal_plan_record(requestData);
        const records = response.data;
        const processedData = records.map((record) => {
          const rowData = {};
          columns.forEach((column) => {
            rowData[column.name] = record[column.name];
          });
          return rowData;
        });
        setTestPlanRecords(processedData);
      } catch (error) {
        console.error("Error fetching communication test plan records:", error);
      }
    };
    fetchData();
  }, [category]);

  const rows = testPlanRecords.map((record) => ({
    plan_name: (
      <SuiBox paddingLeft={2}>
        <Link
          to={`/personal_test_item/?editor_id=${record.editor_id}&plan_id=${record.plan_id}&category=${category}`}
        >
          <SuiTypography variant="caption" textColor="secondary" fontWeight="medium">
            {record.plan_name}
          </SuiTypography>
        </Link>
      </SuiBox>
    ),
    action: (
      <>
        <SuiBox
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mt={{ xs: 2, sm: 0 }}
          ml={{ xs: -1.5, sm: 2 }}
        >
          <SuiBox mr={2} anchorEl={anchorEl}>
            <SuiButton
              variant="text"
              buttonColor="dark"
              onClick={(event) => handleEditClick(event, record.plan_id)}
            >
              <Icon className="material-icons-round">edit</Icon>
              &nbsp;edit
            </SuiButton>
          </SuiBox>
          <SuiBox mr={2} anchorEl={anchorEl}>
            <SuiButton
              variant="text"
              buttonColor="info"
              onClick={(event) => handleViewClick(event, record.plan_id)}
            >
              <Icon className="material-icons-round">visibility</Icon>
              &nbsp;view
            </SuiButton>
          </SuiBox>
          <SuiBox mr={2}>
            <SuiButton
              variant="text"
              buttonColor="primary" // Choose an appropriate color for the copy action
              onClick={(event) => handleCopyClick(event, record.plan_id)}
            >
              <Icon className="material-icons-round">file_copy</Icon>&nbsp;clone
            </SuiButton>
          </SuiBox>
          <SuiBox mr={2}>
            <SuiButton
              variant="text"
              buttonColor="success"
              onClick={(event) => handleExportClick(event, record)}
            >
              <Icon className="material-icons-round">cloud_download</Icon>&nbsp;export
            </SuiButton>
          </SuiBox>

          <SuiBox mr={2}>
            <SuiButton
              variant="text"
              buttonColor="error"
              onClick={(event) => handleDeleteClick(event, record.plan_id)}
            >
              <Icon className="material-icons-round">delete</Icon>&nbsp;delete
            </SuiButton>
          </SuiBox>
        </SuiBox>
      </>
    ),
  }));

  return { columns, rows };
}

export default testPlansTableData;
