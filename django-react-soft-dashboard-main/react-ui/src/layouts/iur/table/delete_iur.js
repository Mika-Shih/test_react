import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Tablehead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import Tablebody from "@mui/material/TableBody";
import Button from "examples/Icons/Button";
import Loading from "examples/tool_universal/loading";
function DropdownWithButton(iur_data) {
  useEffect(() => {
    console.log(iur_data["iur_data"]);
    set_machine_data(iur_data["iur_data"]);
  }, []);
  const [machine_data, set_machine_data] = useState([]);
  const [pop_filter, set_pop_filter] = useState(false);
  const [loading, setLoading] = useState(false);
  function getCellStyle(width) {
    return {
      width: `${width}px`,
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
  const status_style = getCellStyle(80);
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
        <TableRow style={table_row_style}>
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
          <TableCell key={index} style={sn_style}>
            {"serial_number"}
          </TableCell>
          <TableCell key={index} style={borrower_style}>
            {"borrower"}
          </TableCell>
          <TableCell key={index} style={status_style}>
            {"status"}
          </TableCell>
          <TableCell key={index} style={position_style}>
            {"position"}
          </TableCell>
          <TableCell key={index} style={remark_style}>
            {"remark"}
          </TableCell>
          <TableCell key={index} style={update_time_style}>
            {"update_time"}
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
          <TableCell key={index} style={sn_style}>
            {data.sn}
          </TableCell>
          <TableCell key={index} style={borrower_style}>
            {data.borrower}
          </TableCell>
          <TableCell key={index} style={status_style}>
            {data.status}
          </TableCell>
          <TableCell key={index} style={position_style}>
            {data.position}
          </TableCell>
          <TableCell key={index} style={remark_style}>
            {data.remark}
          </TableCell>
          <TableCell key={index} style={update_time_style}>
            {formatTimeForFrontend(data.update_time)}
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
  const button_style = {
    padding: "5px 10px",
    transform: "rotate(0deg)",
    whiteSpace: "nowrap",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
    outline: "none",
  };
  useEffect(() => {}, [machine_data]);
  const openModal = () => {
    set_pop_filter(true);
  };
  const closeModal = () => {
    set_pop_filter(false);
  };
  const customStyles = {
    content: {
      maxWidth: "900px",
      maxHeight: "800px",
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-450px",
      transform: "translate(-50%, -50%)",
      overflowY: "auto",
    },
    overlay: {
      zIndex: 1000,
    },
  };
  Modal.setAppElement("#root");

  const clearmodel = async () => {
    setLoading(true);
    const request_data = {
      finaldata: machine_data,
    };
    try {
      const response = await axios.post("/polls/deleteplatform/", request_data, {
        timeout: 10000,
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
    <div style={{ display: "flex", alignItems: "center", marginLeft: "20px" }}>
      <Loading loading={loading} />
      <div style={{ display: "flex", overflowY: "auto" }}>
        <Modal
          isOpen={pop_filter}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="filter"
        >
          <p>Confirm deletion of the following machines?</p>
          <Button style={{ margin: "10px", padding: "10px" }} onClick={clearmodel}>
            Delete
          </Button>
          <Button style={{ margin: "10px", padding: "10px" }} onClick={closeModal}>
            Close
          </Button>
        </Modal>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Button onClick={openModal} style={{ display: "flex", width: "100px", ...button_style }}>
          Delete machine
        </Button>
        <TableContainer>
          <div style={{}}>
            <Tablehead>{title_row("1")}</Tablehead>
          </div>
          <div style={{ marginLeft: "16px" }}>
            <Tablebody>{machine_data.map((data, index) => data_row(index, data))}</Tablebody>
          </div>
        </TableContainer>
      </div>
    </div>
  );
}

export default DropdownWithButton;
