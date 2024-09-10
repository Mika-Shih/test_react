import React, { useState, useEffect } from "react";
import TableContainer from "@mui/material/TableContainer";
import Button from "examples/Icons/Button";
import Table from "examples/Table/table_row";
import Loading from "examples/tool_universal/loading";
import useStyles from "layouts/iur/table/styles/iur";
import { Box, Dialog } from "@mui/material";
import IURAPI from "api/iur";
function DropdownWithButton(iur_data) {
  useEffect(() => {
    console.log(iur_data["iur_data"]);
    set_machine_data(iur_data["iur_data"]);
  }, []);
  const [machine_data, set_machine_data] = useState([]);
  const [pop_filter, set_pop_filter] = useState(false);
  const [loading, setLoading] = useState(false);
  const classes = useStyles();
  const title_data = [
    { style: classes.title_platform_style, children: "Platform" },
    { style: classes.title_phase_style, children: "Phase" },
    { style: classes.title_target_style, children: "Target" },
    { style: classes.title_group_style, children: "Group" },
    { style: classes.title_cycle_style, children: "Cycle" },
    { style: classes.title_sku_style, children: "Sku" },
    { style: classes.title_sn_style, children: "Serial Number" },
    { style: classes.title_borrower_style, children: "Borrower" },
    { style: classes.title_status_style, children: "Status" },
    { style: classes.title_position_style, children: "Position" },
    { style: classes.title_remark_style, children: "Remark" },
    { style: classes.title_update_time_style, children: "Update Time" },
  ];
  function data_row(data) {
    if (!data) {
      return null;
    }
    const tablebody_data = [
      { style: classes.platform_style, children: data.platform },
      { style: classes.phase_style, children: data.phase },
      { style: classes.target_style, children: data.target },
      { style: classes.group_style, children: data.group },
      { style: classes.cycle_style, children: data.cycle },
      { style: classes.sku_style, children: data.sku },
      { style: classes.sn_style, children: data.sn },
      { style: classes.borrower_style, children: data.borrower },
      { style: classes.status_style, children: data.status },
      { style: classes.position_style, children: data.position },
      { style: classes.remark_style, children: data.remark },
      { style: classes.update_time_style, children: formatTimeForFrontend(data.update_time) },
    ];
    return (
      <>
        <Table row_style={classes.table_row_style} data={tablebody_data}></Table>
      </>
    );
  }
  function formatTimeForFrontend(inputTime) {
    const date = new Date(inputTime);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();

    const formattedTime = date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    return `${month}/${day}, ${year}, ${formattedTime}`;
  }
  useEffect(() => {}, [machine_data]);
  const openModal = () => {
    set_pop_filter(true);
  };
  const closeModal = () => {
    set_pop_filter(false);
  };

  const clearmodel = async () => {
    setLoading(true);
    try {
      const response = await IURAPI.delete({
        finaldata: machine_data,
      });
      if (response.data.finaldata) {
        alert(response.data.finaldata);
        window.location.reload();
      } else if (response.data.error) {
        alert(response.data.error);
      }
    } catch (error) {
      console.error("Error in Axios request:", error);
      alert("Please contact the administrator.");
    } finally {
      setLoading(false);
      set_pop_filter(false);
    }
  };
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", marginLeft: "20px" }}>
        <Loading loading={loading} />
        <Dialog open={pop_filter} onClose={() => closeModal} fullWidth maxWidth="xs">
          <Box sx={{ padding: "20px" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <p>Confirm deletion of the following machines?</p>
              <div claasName={classes.line_form_style}>
                <Button style={{ margin: "10px", padding: "10px" }} onClick={clearmodel}>
                  Delete
                </Button>
                <Button style={{ margin: "10px", padding: "10px" }} onClick={closeModal}>
                  Close
                </Button>
              </div>
            </div>
          </Box>
        </Dialog>
      </div>
      <TableContainer>
        <Table row_style={classes.title_table_row_style} data={title_data}></Table>
        {machine_data.map((data) => data_row(data))}
      </TableContainer>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "20px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "10px" }}>
          <Button onClick={openModal} className={classes.button_style}>
            Delete Machine
          </Button>
          <Button onClick={() => window.location.reload()}>Cancel</Button>
        </div>
      </div>
    </>
  );
}

export default DropdownWithButton;
