import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import TableContainer from "@mui/material/TableContainer";
import Button from "examples/Icons/Button";
import Loading from "examples/tool_universal/loading";
import Table from "examples/Table/table_row";
import FolderChoose from "examples/tool_universal/folder_choose";
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
  const [user_experience, set_user_experience] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const classes = useStyles();
  const title_data = [
    { style: classes.platform_style, children: "platform" },
    { style: classes.phase_style, children: "phase" },
    { style: classes.target_style, children: "target" },
    { style: classes.group_style, children: "group" },
    { style: classes.cycle_style, children: "cycle" },
    { style: classes.sku_style, children: "sku" },
    { style: classes.sn_style, children: "serial_number" },
    { style: classes.borrower_style, children: "borrower" },
    { style: classes.status_style, children: "status" },
    { style: classes.position_style, children: "position" },
    { style: classes.remark_style, children: "remark" },
    { style: classes.update_time_style, children: "update_time" },
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

  const new_machine_mail_model = async () => {
    setLoading(true);
    try {
      let request_data = new FormData();
      request_data.append("finaldata", JSON.stringify(machine_data));
      request_data.append("file", selectedFile);
      let response = await IURAPI.new_machine_mail(request_data);
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
            <p>Confirm the content of the new machine and send an email?</p>
            <Button style={{ margin: "10px", padding: "10px" }} onClick={new_machine_mail_model}>
              Confirm
            </Button>
            <Button style={{ margin: "10px", padding: "10px" }} onClick={closeModal}>
              Close
            </Button>
          </Modal>
        </div>
        <div>
          <label htmlFor="file">Select file : </label>
          <input
            key={user_experience}
            type="file"
            onChange={(event) => {
              const file = event.target.files[0];
              setSelectedFile(file);
            }}
          />
          <Button
            className={classes.deleteButtonStyle}
            onClick={() => {
              setSelectedFile(null);
              set_user_experience((prevKey) => prevKey + 1);
            }}
          >
            X
          </Button>
        </div>
        <FolderChoose></FolderChoose>
      </div>
      <TableContainer>
        <Table row_style={classes.table_row_style} data={title_data}></Table>
        {machine_data.map((data) => data_row(data))}
      </TableContainer>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Button onClick={openModal} className={classes.button_style}>
          Send email
        </Button>
      </div>
    </>
  );
}

export default DropdownWithButton;
