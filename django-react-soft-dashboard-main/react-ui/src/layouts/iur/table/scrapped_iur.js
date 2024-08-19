import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import TableContainer from "@mui/material/TableContainer";
import Button from "examples/Icons/Button";
import Table from "examples/Table/table_row";
import Loading from "examples/tool_universal/loading";
import useStyles from "layouts/iur/table/styles/iur";
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
    { style: classes.title_sn_style, children: "Serial_number" },
    { style: classes.title_borrower_style, children: "Borrower" },
    { style: classes.title_status_style, children: "Status" },
    { style: classes.title_position_style, children: "Position" },
    { style: classes.title_remark_style, children: "Remark" },
    { style: classes.title_update_time_style, children: "Update_time" },
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
    try {
      let response = await IURAPI.scrappped({
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
        <div style={{ display: "flex", overflowY: "auto" }}>
          <Modal
            isOpen={pop_filter}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="filter"
          >
            <p>Confirm scrapping the following machines?</p>
            <Button style={{ margin: "10px", padding: "10px" }} onClick={clearmodel}>
              Scrapped
            </Button>
            <Button style={{ margin: "10px", padding: "10px" }} onClick={closeModal}>
              Close
            </Button>
          </Modal>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Button onClick={openModal} style={{ display: "flex", width: "100px", ...button_style }}>
            Scrapped machine
          </Button>
        </div>
      </div>
      <TableContainer>
        <Table row_style={classes.title_table_row_style} data={title_data}></Table>
        {machine_data.map((data) => data_row(data))}
      </TableContainer>
    </>
  );
}
export default DropdownWithButton;
