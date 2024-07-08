import React from "react";
import SuiBox from "components/SuiBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Table from "examples/Table";
import styles from "layouts/test_plan/tables/styles";
import testCasesHistory from "./data/casesData";
import CompareVersions from "layouts/test_plan/CompareVersions";
import { Card, Button, Dialog } from "@mui/material";
import { useLocation } from "react-router-dom";

function Tables() {
  const classes = styles();
  const user_id = 1;
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const item_id = queryParams.get("item_id");

  const { columns, rows, isFormDirty, checkedIds } = testCasesHistory(user_id, item_id); // Call the hook
  const modifiedColumns = columns.filter(
    (column) => column.name !== "plan_id" && column.name !== "editor_id" && column.name !== "id"
  );
  const [openDialog, setOpenDialog] = React.useState(false); // For opening and closing the dialog

  const handleOpenDialog = () => {
    if (checkedIds.length !== 2) {
      alert(
        `Please select exactly two test cases for comparison. Currently selected: ${checkedIds.length}`
      );
      return;
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SuiBox py={3}>
        <SuiBox mb={3}>
          <Card>
            <SuiBox customClass={classes.tables_table}>
              <Table columns={modifiedColumns} rows={rows} />
            </SuiBox>
          </Card>
        </SuiBox>
      </SuiBox>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button
          variant="contained"
          type="submit"
          style={{ marginRight: "10px" }}
          disabled={!isFormDirty}
          onClick={handleOpenDialog}
        >
          Compare Two Versions
        </Button>
      </div>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth={false}
        style={{ width: "70%", height: "50%" }}
      >
        <CompareVersions onClose={handleCloseDialog} checkedIds={checkedIds} />
      </Dialog>
    </DashboardLayout>
  );
}

export default Tables;
