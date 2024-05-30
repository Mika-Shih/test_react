import React, { useState, useEffect } from "react";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Tablebody from "@mui/material/TableBody";
import IURAPI from "api/iur";
function MachineRecord() {
  const [machineRecord, setMachineRecord] = useState(null);
  const [machine_data, set_machine_data] = useState([]);
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
  function getCellStyle(width) {
    return {
      minWidth: `${width}px`,
      maxWidth: `${width}px`,
      textAlign: "center",
      fontSize: "12px",
    };
  }

  const platform_style = getCellStyle(150);
  const phase_style = getCellStyle(80);
  const target_style = getCellStyle(80);
  const group_style = getCellStyle(120);
  const cycle_style = getCellStyle(80);
  const sku_style = getCellStyle(60);
  const sn_style = getCellStyle(150);
  const borrower_style = getCellStyle(100);
  const status_style = getCellStyle(90);
  const position_style = getCellStyle(100);
  const remark_style = getCellStyle(90);
  const update_time_style = getCellStyle(200);
  const table_row_style = {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    textAlign: "center",
  };
  function title_row(index) {
    return (
      <>
        <TableRow style={{ ...table_row_style, backgroundColor: "#E6C786" }}>
          <TableCell key={index} style={platform_style}>
            {"platform"}
          </TableCell>
          <TableCell key={index} style={phase_style}>
            {"phase"}
          </TableCell>
          <TableCell key={index} style={target_style}>
            {"target"}
          </TableCell>
          <TableCell key={index} style={group_style}>
            {"group"}
          </TableCell>
          <TableCell key={index} style={cycle_style}>
            {"cycle"}
          </TableCell>
          <TableCell key={index} style={sku_style}>
            {"sku"}
          </TableCell>
          <TableCell key={index} style={position_style}>
            {"position"}
          </TableCell>
          <TableCell key={index} style={sn_style}>
            {"serial_number"}
          </TableCell>
          <TableCell key={index} style={update_time_style}>
            {"key in time"}
          </TableCell>
        </TableRow>
      </>
    );
  }
  function record_title_row(index) {
    return (
      <>
        <TableRow style={{ ...table_row_style, backgroundColor: "#E6C786" }}>
          <TableCell key={index} style={status_style}>
            {"status"}
          </TableCell>
          <TableCell key={index} style={borrower_style}>
            {"borrower"}
          </TableCell>
          <TableCell key={index} style={remark_style}>
            {"remark"}
          </TableCell>
          <TableCell key={index} style={update_time_style}>
            {"start time"}
          </TableCell>
          <TableCell key={index} style={update_time_style}>
            {"end time"}
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
        <TableRow style={table_row_style}>
          <TableCell key={index} style={platform_style}>
            {data.platform}
          </TableCell>
          <TableCell key={index} style={phase_style}>
            {data.phase}
          </TableCell>
          <TableCell key={index} style={target_style}>
            {data.target}
          </TableCell>
          <TableCell key={index} style={group_style}>
            {data.group}
          </TableCell>
          <TableCell key={index} style={cycle_style}>
            {data.cycle}
          </TableCell>
          <TableCell key={index} style={sku_style}>
            {data.sku}
          </TableCell>
          <TableCell key={index} style={position_style}>
            {data.position}
          </TableCell>
          <TableCell key={index} style={sn_style}>
            {data.sn}
          </TableCell>
          <TableCell key={index} style={update_time_style}>
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
        <TableRow style={table_row_style}>
          <TableCell key={index} style={status_style}>
            {data.status}
          </TableCell>
          <TableCell key={index} style={borrower_style}>
            {data.borrower}
          </TableCell>
          <TableCell key={index} style={remark_style}>
            {data.remark}
          </TableCell>
          <TableCell key={index} style={update_time_style}>
            {formatTimeForFrontend(data.update_time)}
          </TableCell>
          <TableCell key={index} style={update_time_style}>
            {nextData ? formatTimeForFrontend(nextData.update_time) : ""}
          </TableCell>
        </TableRow>
      </>
    );
  }
  function formatTimeForFrontend(inputTime) {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const date = new Date(inputTime);
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    const formattedTime = date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    return `${month} ${day}, ${year}, ${formattedTime}`;
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
