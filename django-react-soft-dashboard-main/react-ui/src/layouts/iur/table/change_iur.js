import React, { useState, useEffect, useRef } from "react";
import Modal from "react-modal";
import axios from "axios";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Tablehead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import Tablebody from "@mui/material/TableBody";
import Button from "examples/Icons/Button";
import Loading_option from "examples/tool_universal/loading_option";
import Loading_option_4to1 from "examples/tool_universal/loading_option_4to1";
import Loading from "examples/tool_universal/loading";
function DropdownWithButton(iur_data) {
  const [machine_data, set_machine_data] = useState([]);
  const [platform_combine, set_platform_combine] = useState([]);
  const [options, setOptions] = useState([]);
  useEffect(() => {
    console.log(iur_data["iur_data"]);
    set_machine_data(iur_data["iur_data"]);
    const fetchData = async () => {
      try {
        const response = await axios.get("/polls/api/phase/");
        const formattedOptions = response.data["phase"].filter((item) => item !== "");
        setOptions(formattedOptions);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
    const transformed_data = iur_data["iur_data"].map((item) => ({
      title: `${item["platform"]} - ${item["target"]} - ${item["group"]} - ${item["cycle"]}`,
      value: `${item["platform"]} - ${item["target"]} - ${item["group"]} - ${item["cycle"]}`,
    }));
    console.log(transformed_data);
    set_platform_combine(transformed_data);
  }, []);
  const [popFilters, setPopFilters] = useState({
    1: false,
    2: false,
  });
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    platform: [],
    target: null,
    group: null,
    cycle: [],
  });
  useEffect(() => {}, [formData, options]);
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
  useEffect(() => {
    console.log(platform_combine);
    console.log(formData);
  }, [platform_combine]);
  function data_row(index, data) {
    if (!data) {
      return null;
    }
    return (
      <>
        <TableRow style={table_row_style}>
          <TableCell
            key={index}
            style={platform_style}
            onClick={() => handleDoubleClick(index, "platform")}
            ref={inputRef}
            onBlur={() => handleBlur(index, "platform")}
          >
            {isEditing[`${index}_platform`] ? (
              <Loading_option_4to1
                api="polls/api/addplatformcombination"
                name="platform"
                selectedOptions={platform_combine[index]}
                setSelectedOptions={(newOptions) => {
                  // set_platform_combine({ index: newOptions });
                  // set_platform_combine({ ...platform_combine, index: newOptions });
                  set_platform_combine((prevPlatformCombine) => ({
                    ...prevPlatformCombine,
                    [index]: newOptions,
                  }));
                  console.log(newOptions);
                  const [platform, target, group, cycle] = newOptions
                    ? newOptions.value.split(" - ")
                    : ["", "", "", ""];
                  machine_data[index].platform = platform || "";
                  machine_data[index].target = target || "";
                  machine_data[index].group = group || "";
                  machine_data[index].cycle = cycle || "";
                }}
              />
            ) : (
              machine_data[index].platform
            )}
          </TableCell>
          <TableCell key={index} style={phase_style}>
            <select
              value={machine_data[index].phase}
              onChange={(e) => {
                set_machine_data((prevData) => {
                  const newData = [...prevData];
                  newData[index] = { ...newData[index], phase: e.target.value };
                  return newData;
                });
              }}
              style={{ padding: "5px 5px", marginLeft: "20px", marginRight: "10px" }}
            >
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
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
          <TableCell key={index} style={sku_style} onClick={() => handleDoubleClick(index, "sku")}>
            {isEditing[`${index}_sku`] ? (
              <input
                ref={inputRef}
                type="text"
                value={machine_data[index].sku}
                style={{ width: "30px" }}
                onChange={(e) => {
                  set_machine_data((prevData) => {
                    const newData = [...prevData];
                    newData[index] = { ...newData[index], sku: e.target.value };
                    return newData;
                  });
                }}
                onBlur={() => handleBlur(index, "sku")}
                onKeyDown={(e) => handleKeyDown(e, index, "sku")}
              />
            ) : (
              machine_data[index].sku
            )}
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

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
  };
  function pop_filter_content() {
    return (
      <>
        <div style={containerStyle}>
          <label>Platform:</label>
          <input
            type="text"
            value={formData.platform}
            onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
            style={{ paddingTop: "8px", paddingBottom: "8px", width: "300px" }}
          />
          <label>Target:</label>
          <Loading_option
            api="polls/api/target"
            name="target"
            selectedOptions={formData.target}
            setSelectedOptions={(newOptions) => setFormData({ ...formData, target: newOptions })}
          />
          <label>Group:</label>
          <Loading_option
            api="polls/api/group"
            name="group"
            selectedOptions={formData.group}
            setSelectedOptions={(newOptions) => setFormData({ ...formData, group: newOptions })}
          />
          <label>Cycle:</label>
          <input
            type="text"
            value={formData.cycle}
            onChange={(e) => setFormData({ ...formData, cycle: e.target.value })}
            style={{ paddingTop: "8px", paddingBottom: "8px", width: "300px" }}
          />
        </div>
      </>
    );
  }
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

  const addplatformmodel = async () => {
    setLoading(true);
    const request_data = {
      platform: formData.platform,
      target: formData.target == null ? "" : formData.target.value,
      group: formData.group == null ? "" : formData.group.value,
      cycle: formData.cycle,
    };
    console.log(request_data);
    try {
      const response = await axios.post("/polls/api/addplatformonly/", request_data, {
        timeout: 10000,
      });
      if (response.data.successful) {
        alert(response.data.successful);
        closeModal(2);
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
  const clearmodel = async () => {
    setLoading(true);
    const request_data = {
      finaldata: machine_data,
    };
    try {
      const response = await axios.post("/polls/changeplatform/", request_data, {
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
          <p>Confirm modifying the following machines?</p>
          {check_platform_change()}
          <Button style={{ margin: "10px", padding: "10px" }} onClick={clearmodel}>
            Modify
          </Button>
          <Button style={{ margin: "10px", padding: "10px" }} onClick={() => closeModal(1)}>
            Close
          </Button>
        </Modal>
      </div>
      <div style={{ display: "flex", overflowY: "auto" }}>
        <Modal
          isOpen={popFilters[2]}
          onRequestClose={() => closeModal(2)}
          style={customStyles}
          contentLabel="filter"
        >
          <h2>Add new platform</h2>
          {pop_filter_content()}
          <Button style={{ margin: "10px", padding: "10px" }} onClick={addplatformmodel}>
            Add machine
          </Button>
          <Button style={{ margin: "10px", padding: "10px" }} onClick={() => closeModal(2)}>
            Close
          </Button>
        </Modal>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Button
          onClick={() => openModal(2)}
          style={{ display: "flex", width: "180px", ...button_style }}
        >
          Add new platform
        </Button>
        <TableContainer>
          <div style={{}}>
            <Tablehead>{title_row("1")}</Tablehead>
          </div>
          <div style={{ marginLeft: "16px" }}>
            <Tablebody>{machine_data.map((data, index) => data_row(index, data))}</Tablebody>
          </div>
        </TableContainer>
        <Button
          onClick={() => openModal(1)}
          style={{ marginTop: "20px", display: "flex", width: "100px", ...button_style }}
        >
          Change
        </Button>
      </div>
    </div>
  );
}
export default DropdownWithButton;
