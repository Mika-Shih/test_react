// @mui material components
import Card from "@mui/material/Card";

// Soft UI Dashboard React components
import SuiBox from "components/SuiBox";
import SuiTypography from "components/SuiTypography";

// Soft UI Dashboard React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Table from "examples/Table";
import { useLocation } from "react-router-dom";

// Custom styles for the Tables
import styles from "layouts/test_plan/tables/styles";

// Data
import PersonalTestItemData from "layouts/test_plan/testPlanList/case/data/CasesData";

function Tables() {
  const classes = styles();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const editor_id = queryParams.get("editor_id");
  const plan_id = queryParams.get("plan_id");
  const category = queryParams.get("category");

  const { columns, rows } = PersonalTestItemData(editor_id, plan_id, category);

  const modifiedColumns = columns.filter(
    (column) =>
      column.name !== "item_id" &&
      column.name !== "item_status" &&
      column.name !== "reviewer_comment"
  );

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SuiBox py={3}>
        <SuiBox mb={3}>
          <Card>
            <SuiBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
              <SuiTypography variant="h6">Test Case</SuiTypography>
            </SuiBox>
            <SuiBox customClass={classes.tables_table}>
              <Table columns={modifiedColumns} rows={rows} />
            </SuiBox>
          </Card>
        </SuiBox>
      </SuiBox>
    </DashboardLayout>
  );
}

export default Tables;
