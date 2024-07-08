import React, { useState, useEffect } from "react";
import TestPlanRrecordApi from "api/test_plan/testPlanRecord"; // Update the import path

// import SuiBox from "components/SuiBox";
import SuiTypography from "components/SuiTypography";
// import SuiAvatar from "components/SuiAvatar";
import SuiBadge from "components/SuiBadge";

function testPlansTableData() {
  const [testPlanRecords, setTestPlanRecords] = useState([]);

  useEffect(() => {
    TestPlanRrecordApi.get_all_plan_record()
      .then((response) => {
        const records = response.data;
        const processedData = records.map((record) => {
          const rowData = {};
          columns.forEach((column) => {
            rowData[column.name] = record[column.name];
          });
          return rowData;
        });
        setTestPlanRecords(processedData);
      })
      .catch((error) => {
        console.error("Error fetching communication test plan records:", error);
      });
  }, []);

  const columns = [
    { name: "editor_id", align: "left" },
    { name: "plan_id", align: "left" },
    { name: "plan_status", align: "center" },
    { name: "reviewer_comment", align: "center" },
    { name: "plan_details", align: "center" },
    { name: "action", align: "center" },
  ];
  console.log(testPlanRecords);
  const rows = testPlanRecords.map((record) => ({
    // author: <Author name="Michelle" email="john@creative-tim.com" />,
    plan_status: (
      <SuiBadge
        variant="gradient"
        badgeContent={
          record.plan_status === "approved"
            ? "approved"
            : record.plan_status === "disapproved"
            ? "disapproved"
            : "pending"
        }
        color={
          record.plan_status === "approved"
            ? "success"
            : record.plan_status === "disapproved"
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
    plan_details: (
      <SuiTypography variant="caption" textColor="secondary" fontWeight="medium">
        {record.plan_details}
      </SuiTypography>
    ),
    action: (
      <SuiTypography
        component="a"
        href="#"
        variant="caption"
        textColor="secondary"
        fontWeight="medium"
      >
        Edit
      </SuiTypography>
    ),
  }));
  return { columns, rows };
}

export default testPlansTableData;
