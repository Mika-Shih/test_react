import React, { useState, useEffect } from "react";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Tablebody from "@mui/material/TableBody";
import useStyles from "layouts/machine record/table/styles/iur";
import IURAPI from "api/iur";
function MachineRecord() {
  const [machineRecord, setMachineRecord] = useState(null);
  const [machine_data, set_machine_data] = useState([]);
  const classes = useStyles();
  const urlParams = new URLSearchParams(window.location.href);
  useEffect(() => {
    console.log(urlParams);
    urlParams.forEach((value, key) => {
      console.log(`${key}: ${value}`);
      console.log(value);
      setMachineRecord(value);
    });
  }, [urlParams]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await IURAPI.machine_record({ sn: machineRecord });
        const formattedOptions = response.data["iur_data"];
        set_machine_data(formattedOptions);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [machineRecord]);
  function title_row(index) {
    return (
      <>
        <TableRow className={classes.title_table_row_style}>
          <TableCell key={index} className={classes.title_platform_style}>
            {"Platform"}
          </TableCell>
          <TableCell key={index} className={classes.title_phase_style}>
            {"Phase"}
          </TableCell>
          <TableCell key={index} className={classes.title_target_style}>
            {"Target"}
          </TableCell>
          <TableCell key={index} className={classes.title_group_style}>
            {"Group"}
          </TableCell>
          <TableCell key={index} className={classes.title_cycle_style}>
            {"Cycle"}
          </TableCell>
          <TableCell key={index} className={classes.title_sku_style}>
            {"Sku"}
          </TableCell>
          <TableCell key={index} className={classes.title_position_style}>
            {"Position"}
          </TableCell>
          <TableCell key={index} className={classes.title_remark_style}>
            {"Remark"}
          </TableCell>
          <TableCell key={index} className={classes.title_acquirer_style}>
            {"Acquirer"}
          </TableCell>
          <TableCell key={index} className={classes.title_sn_style}>
            {"Serial Number"}
          </TableCell>
          <TableCell key={index} className={classes.title_update_time_style}>
            {"Key In Time"}
          </TableCell>
        </TableRow>
      </>
    );
  }
  function record_title_row(index) {
    return (
      <>
        <TableRow className={classes.title_table_row_style}>
          <TableCell key={index} className={classes.title_status_style}>
            {"Status"}
          </TableCell>
          <TableCell key={index} className={classes.title_borrower_style}>
            {"Borrower"}
          </TableCell>
          <TableCell key={index} className={classes.title_purpose_remark_style}>
            {"Purpose / Remark"}
          </TableCell>
          <TableCell key={index} className={classes.title_update_time_style}>
            {"Start Time"}
          </TableCell>
          <TableCell key={index} className={classes.title_update_time_style}>
            {"End Time"}
          </TableCell>
        </TableRow>
      </>
    );
  }
  function data_row(index, data) {
    if (!data) {
      return null;
    }
    return (
      <>
        <TableRow className={classes.table_row_style}>
          <TableCell key={index} className={classes.platform_style}>
            {data.platform}
          </TableCell>
          <TableCell key={index} className={classes.phase_style}>
            {data.phase}
          </TableCell>
          <TableCell key={index} className={classes.target_style}>
            {data.target}
          </TableCell>
          <TableCell key={index} className={classes.group_style}>
            {data.group}
          </TableCell>
          <TableCell key={index} className={classes.cycle_style}>
            {data.cycle}
          </TableCell>
          <TableCell key={index} className={classes.sku_style}>
            {data.sku}
          </TableCell>
          <TableCell key={index} className={classes.position_style}>
            {data.position}
          </TableCell>
          <TableCell key={index} className={classes.remark_style}>
            {data.remark}
          </TableCell>
          <TableCell key={index} className={classes.acquirer_style}>
            {data.acquirer}
          </TableCell>
          <TableCell key={index} className={classes.sn_style}>
            {data.sn}
          </TableCell>
          <TableCell key={index} className={classes.update_time_style}>
            {formatTimeForFrontend(data.update_time)}
          </TableCell>
        </TableRow>
      </>
    );
  }
  function record_data_row(index, data, nextData) {
    if (!data) {
      return null;
    }
    return (
      <>
        <TableRow className={classes.table_row_style}>
          <TableCell key={index} className={classes.status_style}>
            {data.status}
          </TableCell>
          <TableCell key={index} className={classes.borrower_style}>
            {data.borrower}
          </TableCell>
          <TableCell key={index} className={classes.purpose_remark_style}>
            {data.purpose}
          </TableCell>
          <TableCell key={index} className={classes.update_time_style}>
            {formatTimeForFrontend(data.update_time)}
          </TableCell>
          <TableCell key={index} className={classes.update_time_style}>
            {nextData ? formatTimeForFrontend(nextData.update_time) : ""}
          </TableCell>
        </TableRow>
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
  return (
    <div
      style={{
        display: "flex",
        alignItems: "left",
        marginLeft: "20px",
        flexDirection: "column",
      }}
    >
      <div style={{ marginBottom: "20px" }}>
        <TableContainer>
          <div style={{ marginLeft: "16px" }}>
            <Tablebody>{title_row("1")}</Tablebody>
            <Tablebody>{data_row("1", machine_data[machine_data.length - 1])}</Tablebody>
          </div>
        </TableContainer>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <TableContainer>
          <div style={{ marginLeft: "16px" }}>
            <Tablebody>{record_title_row("1")}</Tablebody>
            <Tablebody>
              {machine_data.map((data, index, array) =>
                record_data_row(index, data, array[index - 1])
              )}
            </Tablebody>
          </div>
        </TableContainer>
      </div>
    </div>
  );
}

export default MachineRecord;
