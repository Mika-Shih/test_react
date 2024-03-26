import React, { useState, useEffect, useRef } from "react";
import Modal from "react-modal";
import axios from "axios";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Tablehead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import Tablebody from "@mui/material/TableBody";
import Button from "examples/Icons/Button";
import Loading_option_add_remove from "examples/tool_universal/loading_option_add_remove";
import Loading from "examples/tool_universal/loading";
function DropdownWithButton(iur_data) {
  const [machine_data, set_machine_data] = useState([]);
  useEffect(() => {
    console.log(iur_data["iur_data"]);
    set_machine_data(iur_data["iur_data"]);
  }, []);
  const [popFilters, setPopFilters] = useState({
    1: false,
    2: false,
  });
  const [lendData, setlendData] = useState({
    purpose: "",
    message: "",
    cc_mail: [],
  });
  const [loading, setLoading] = useState(false);
  const [user_experience, set_user_experience] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  function getCellStyle(width) {
    return {
      width: `${width}px`,
      textAlign: "center",
      fontSize: "12px",
    };
  }
  const platform_style = getCellStyle(150);
  const phase_style = getCellStyle(150);
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
  const deleteButtonStyle = {
    cursor: "pointer",
    padding: "5px",
    backgroundColor: "lightcoral",
    border: "none",
    color: "white",
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
            {machine_data[index].platform}
          </TableCell>
          <TableCell key={index} style={phase_style}>
            {machine_data[index].phase}
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
            {machine_data[index].sku}
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
          <TableCell
            key={index}
            style={position_style}
            onClick={() => handleDoubleClick(index, "position")}
          >
            {isEditing[`${index}_position`] ? (
              <input
                ref={inputRef}
                type="text"
                value={machine_data[index].position}
                style={{ width: "50px" }}
                onChange={(e) => {
                  set_machine_data((prevData) => {
                    const newData = [...prevData];
                    newData[index] = { ...newData[index], position: e.target.value };
                    return newData;
                  });
                }}
                onBlur={() => handleBlur(index, "position")}
                onKeyDown={(e) => handleKeyDown(e, index, "position")}
              />
            ) : (
              machine_data[index].position
            )}
          </TableCell>
          <TableCell
            key={index}
            style={remark_style}
            onClick={() => handleDoubleClick(index, "remark")}
          >
            {isEditing[`${index}_remark`] ? (
              <input
                ref={inputRef}
                type="text"
                value={machine_data[index].remark}
                style={{ width: "50px" }}
                onChange={(e) => {
                  set_machine_data((prevData) => {
                    const newData = [...prevData];
                    newData[index] = { ...newData[index], remark: e.target.value };
                    return newData;
                  });
                }}
                onBlur={() => handleBlur(index, "remark")}
                onKeyDown={(e) => handleKeyDown(e, index, "remark")}
              />
            ) : (
              machine_data[index].remark
            )}
          </TableCell>
          <TableCell key={index} style={update_time_style}>
            {formatTimeForFrontend(data.update_time)}
          </TableCell>
        </TableRow>
      </>
    );
  }
  const inputRef = useRef(null);
  const [isEditing, setIsEditing] = useState({});
  const indexRef = useRef(null);

  useEffect(() => {
    if (isEditing[indexRef.current] && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleDoubleClick = (index, data) => {
    indexRef.current = `${index}_${data}`;
    setIsEditing((prevIsEditing) => ({
      ...prevIsEditing,
      [`${index}_${data}`]: true,
    }));
    console.log(isEditing);
    console.log(inputRef);
  };

  const handleBlur = (index, data) => {
    setIsEditing((prevIsEditing) => ({
      ...prevIsEditing,
      [`${index}_${data}`]: false,
    }));
    console.log(isEditing);
  };
  const handleKeyDown = (e, index, data) => {
    if (e.key === "Enter") {
      handleBlur(index, data);
    }
  };

  function check_platform_change() {
    return (
      <>
        <TableContainer>
          <div style={{ overflowX: "auto", position: "relative" }}>
            <Tablehead>{title_row("1")}</Tablehead>
          </div>
          <div style={{ overflowY: "auto", maxHeight: "600px", marginLeft: "16px" }}>
            <Tablebody>{machine_data.map((data, index) => check_data_row(index, data))}</Tablebody>
          </div>
        </TableContainer>
      </>
    );
  }
  function check_data_row(index, data) {
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
  const openModal = (modalNumber) => {
    setPopFilters((prev) => ({ ...prev, [modalNumber]: true }));
  };
  const closeModal = (modalNumber) => {
    setPopFilters((prev) => ({ ...prev, [modalNumber]: false }));
  };

  const check_Styles = {
    content: {
      maxWidth: "1500px",
      maxHeight: "1000px",
      top: "50%",
      left: "60%",
      right: "auto",
      bottom: "auto",
      marginRight: "-750px",
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
    const cc_mail_list = lendData.cc_mail.filter(Boolean).map((item) => item.value);
    let request_data = new FormData();
    request_data.append("finaldata", JSON.stringify(machine_data));
    request_data.append("purpose", JSON.stringify(lendData.purpose));
    request_data.append("message", JSON.stringify(lendData.message));
    request_data.append("cc_mail", JSON.stringify(cc_mail_list));
    request_data.append("file", selectedFile);
    try {
      const response = await axios.post("/polls/returnplatform/", request_data, {
        timeout: 10000,
        headers: {
          "Content-Type": "multipart/form-data",
        },
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
    }
  };
  return (
    <div style={{ display: "flex", alignItems: "center", marginLeft: "20px" }}>
      <Loading loading={loading} />
      <div style={{ display: "flex", overflowY: "auto" }}>
        <Modal
          isOpen={popFilters[1]}
          onRequestClose={() => closeModal(1)}
          style={check_Styles}
          contentLabel="filter"
        >
          <p>Confirm returning the following machines?</p>
          {check_platform_change()}
          <Button style={{ margin: "10px", padding: "10px" }} onClick={clearmodel}>
            Return
          </Button>
          <Button style={{ margin: "10px", padding: "10px" }} onClick={() => closeModal(1)}>
            Close
          </Button>
        </Modal>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <TableContainer>
          <div style={{}}>
            <Tablehead>{title_row("1")}</Tablehead>
          </div>
          <div style={{ marginLeft: "16px" }}>
            <Tablebody>{machine_data.map((data, index) => data_row(index, data))}</Tablebody>
          </div>
        </TableContainer>
        <label htmlFor="Purpose">Purpose:</label>
        <textarea
          id="Purpose"
          name="Purpose"
          rows={4}
          style={{ width: "200px", padding: "8px" }}
          value={lendData.purpose}
          onChange={(e) => {
            setlendData({
              ...lendData,
              purpose: e.target.value,
            });
          }}
        />
        <label htmlFor="message">mail message:</label>
        <input
          id="message"
          name="message"
          style={{ width: "200px", padding: "8px" }}
          value={lendData.message}
          onChange={(e) => {
            setlendData({
              ...lendData,
              message: e.target.value,
            });
          }}
        />
        <label htmlFor="cc_mail">cc mail:</label>
        <Loading_option_add_remove
          api="polls/lendpersonnel"
          name="user_mail"
          selectedOptions={lendData.cc_mail}
          setSelectedOptions={(newOptions) => setlendData({ ...lendData, cc_mail: newOptions })}
        />
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
            style={deleteButtonStyle}
            onClick={() => {
              setSelectedFile(null);
              set_user_experience((prevKey) => prevKey + 1);
            }}
          >
            X
          </Button>
        </div>
        <Button
          onClick={() => openModal(1)}
          style={{ marginTop: "20px", display: "flex", width: "100px", ...button_style }}
        >
          Return Machine
        </Button>
      </div>
    </div>
  );
}
export default DropdownWithButton;
