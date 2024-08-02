import React, { useState, useEffect } from "react";
import axios from "axios";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";
function DropdownWithButton() {
  //const [message, setMessage] = useState("");
  const [data, setData] = useState([]);
  const [showToolName, setShowToolName] = useState(data.map(() => false));
  const toggleItem = (index) => {
    setShowToolName((prevShowToolName) => ({
      ...prevShowToolName,
      [index]: !prevShowToolName[index],
    }));
  };
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

    // 格式化时间，包括小时和分钟，使用 12 小时制
    const formattedTime = date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    // 返回格式化后的日期时间字符串
    return `${month} ${day}, ${year}, ${formattedTime}`;
  }
  const [formData, setFormData] = useState({
    category: "TOOL",
    subDevice: "",
    shortName: "",
    longName: "",
    hardwareId: "",
  });
  const button_style = {
    padding: "5px 10px",
    transform: "rotate(0deg)", //水平翻轉
    whiteSpace: "nowrap", //禁止換行
    backgroundColor: "#007bff", // 背景颜色
    color: "#fff", // 文本颜色
    border: "none", // 去掉邊框
    borderRadius: "5px", // 圆角
    cursor: "pointer", // 鼠標點擊樣式
    fontSize: "14px",
    fontWeight: "bold", // 字體粗細
    outline: "none", // 去掉聚焦时的邊框
  };
  const line_form_style = {
    display: "flex",
    alignItems: "center",
    marginBottom: "14px",
    color: "#000000",
    fontSize: "18px",
  };
  const show_hide_button = {
    cursor: "pointer",
    fontSize: "16px",
    color: "lightseagreen",
  };
  const hide_text = {
    marginLeft: "14px",
    fontSize: "16px",
  };
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const renderSubDeviceOptions = () => {
    const category = formData.category;
    if (category === "TOOL") {
      return [
        "WLAN",
        "BT",
        "NFC",
        "LAN",
        "DOCK",
        "DOCK_LAN",
        "GNSS",
        "WWANNET",
        "USB",
        "MCD",
        "MBIM",
        "PCIE",
      ];
    } else if (category === "WLAN_BT") {
      return ["WLAN", "BT"];
    } else if (category === "NFC") {
      return ["NFC"];
    } else if (category === "LAN") {
      return ["LAN"];
    } else if (category === "DOCK_LAN") {
      return ["DOCK", "DOCK_LAN"];
    } else if (category === "WWAN_GPS") {
      return ["GNSS", "WWANNET", "USB", "MCD", "MBIM", "PCIE"];
    }
  };

  const renderAdditionalFields = () => {
    if (formData.category !== "TOOL") {
      return (
        <>
          <div style={line_form_style}>
            <label htmlFor="longName" style={{ marginRight: "10px" }}>
              Long Name :
            </label>
            <input type="text" id="longName" name="longName" onChange={handleInputChange} />
          </div>
          <div style={line_form_style}>
            <label htmlFor="hardwareId" style={{ marginRight: "10px" }}>
              Supported HW ID :
            </label>
            <input type="text" id="hardwareId" name="hardwareId" onChange={handleInputChange} />
          </div>
        </>
      );
    }
    return null;
  };
  useEffect(() => {}, [data]);
  const handleButtonClick = () => {
    const backendServer = process.env.REACT_APP_BACKEND_SERVER;
    //const frontendServer = process.env.REACT_APP_FRONTEND_SERVER;
    axios.get(`${backendServer}cat/machine_report/`, { timeout: 10000 }).then((response) => {
      if (response.data) {
        console.log(response.data);
        //window.location.replace(`${frontendServer}pulsar/`);
        setData(response.data);
      } else if (response.data.error) {
        alert(response.data.error);
      }
    });
  };
  function rendercollapsedata(index, label, data, showToolName, toggleItem) {
    if (!label) {
      return null;
    }
    return (
      <>
        <Typography onClick={() => toggleItem(`${index}_${label}`)} style={show_hide_button}>
          {label}
        </Typography>
        <Collapse in={showToolName[`${index}_${label}`]} style={hide_text}>
          <p>{data}</p>
        </Collapse>
      </>
    );
  }
  function render_s0_data(
    index,
    label,
    data_airplanemode,
    data_idle,
    data_onlinestream,
    showToolName,
    toggleItem
  ) {
    let label_data = 0;
    if (data_airplanemode) label_data++;
    if (data_idle) label_data++;
    if (data_onlinestream) label_data++;
    if (label_data === 0) {
      return null;
    }
    return (
      <>
        <Typography onClick={() => toggleItem(`${index}_${label}`)} style={show_hide_button}>
          {label + " : " + label_data + " function"}
        </Typography>
        <Collapse in={showToolName[`${index}_${label}`]} style={hide_text}>
          {renderissuedata(index, "Airplanemode", data_airplanemode, "", showToolName, toggleItem)}
          {renderissuedata(index, "Idle", data_idle, "", showToolName, toggleItem)}
          {renderissuedata(index, "Online Stream", data_onlinestream, "", showToolName, toggleItem)}
        </Collapse>
      </>
    );
  }
  function renderissuedata(index, label, label_data, data, showToolName, toggleItem) {
    if (!label_data) {
      return null;
    }
    return (
      <>
        <Typography onClick={() => toggleItem(`${index}_${label}`)} style={show_hide_button}>
          {label + " : " + label_data}
        </Typography>
        <Collapse in={showToolName[`${index}_${label}`]} style={hide_text}>
          <p>{data}</p>
        </Collapse>
      </>
    );
  }
  return (
    <div style={{ display: "flex", alignItems: "center", marginLeft: "100px" }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={line_form_style}>
          <label htmlFor="category" style={{ marginRight: "10px" }}>
            Category :
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
          >
            {/* <option value="TOOL">TOOL</option> */}
            <option value="WLAN_BT">WLAN_BT</option>
            <option value="NFC">NFC</option>
            <option value="LAN">LAN</option>
            <option value="DOCK_LAN">DOCK_LAN</option>
            <option value="WWAN_GPS">WWAN_GPS</option>
          </select>
        </div>
        <div style={line_form_style}>
          <label htmlFor="subDevice" style={{ marginRight: "10px" }}>
            Sub Device :
          </label>
          <select
            id="subDevice"
            name="subDevice"
            value={formData.subDevice}
            onChange={handleInputChange}
          >
            {renderSubDeviceOptions().map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div style={line_form_style}>
          <label htmlFor="shortName" style={{ marginRight: "10px" }}>
            Short Name :
          </label>
          <input type="text" id="shortName" name="shortName" onChange={handleInputChange} />
        </div>
        {renderAdditionalFields()}
        <button onClick={handleButtonClick} style={button_style}>
          report_get
        </button>
        {data.map((data, index) => (
          <div
            key={index}
            style={{
              border: "2px solid blue",
              padding: "10px",
              marginBottom: "20px",
              display: "flex",
              flexDirection: "row",
              borderRadius: "15px",
              fontFamily: "Calibri",
              fontSize: "18px",
            }}
          >
            <div
              style={{
                padding: "10px",
                marginRight: "10px",
                width: "300px",
              }}
            >
              {rendercollapsedata(
                index,
                "Serial Number",
                data.serial_number,
                showToolName,
                toggleItem
              )}
              {rendercollapsedata(
                index,
                data.tool_name,
                data.tool_version,
                showToolName,
                toggleItem
              )}
              {rendercollapsedata(
                index,
                "BIOS version",
                data.bios_version,
                showToolName,
                toggleItem
              )}
              {rendercollapsedata(
                index,
                "Image version",
                data.image_version,
                showToolName,
                toggleItem
              )}
              {rendercollapsedata(index, "OS version", data.os_version, showToolName, toggleItem)}
              {rendercollapsedata(index, "Wifi", data.wifi, showToolName, toggleItem)}
            </div>
            <div
              style={{
                padding: "10px",
                marginRight: "10px",
                width: "500px",
              }}
            >
              {rendercollapsedata(index, data.bt_name, data.bt_version, showToolName, toggleItem)}
              {rendercollapsedata(index, data.lan_name, data.lan_version, showToolName, toggleItem)}
              {rendercollapsedata(
                index,
                data.dock_lan_name,
                data.dock_lan_version,
                showToolName,
                toggleItem
              )}
              {rendercollapsedata(index, data.nfc_name, data.nfc_version, showToolName, toggleItem)}
              {rendercollapsedata(
                index,
                data.dock_name,
                data.dock_version,
                showToolName,
                toggleItem
              )}
              {rendercollapsedata(
                index,
                data.wlan_name,
                data.wlan_version,
                showToolName,
                toggleItem
              )}
              {rendercollapsedata(
                index,
                data.usb_gnss_name,
                data.usb_gnss_version,
                showToolName,
                toggleItem
              )}
              {rendercollapsedata(index, data.mcd_name, data.mcd_version, showToolName, toggleItem)}
              {rendercollapsedata(index, data.ude_name, data.ude_version, showToolName, toggleItem)}
              {rendercollapsedata(
                index,
                data.pcie_gnss_name,
                data.pcie_gnss_version,
                showToolName,
                toggleItem
              )}
              {rendercollapsedata(
                index,
                data.mbim_name,
                data.mbim_version,
                showToolName,
                toggleItem
              )}
              {rendercollapsedata(
                index,
                data.qmux_name,
                data.qmux_version,
                showToolName,
                toggleItem
              )}
              {rendercollapsedata(
                index,
                data.wwannet_gnss_name,
                data.wwannet_gnss_version,
                showToolName,
                toggleItem
              )}
            </div>
            <div
              style={{
                padding: "10px",
                marginRight: "10px",
                width: "300px",
              }}
            >
              <p>{formatTimeForFrontend(data.finish_time)}</p>
              {render_s0_data(
                index,
                "S0",
                data.s0_airplanemode,
                data.s0_idle,
                data.s0_onlinestream_test,
                showToolName,
                toggleItem
              )}
              {renderissuedata(index, "Restart", data.restart, "", showToolName, toggleItem)}
              {renderissuedata(index, "S4", data.s4, "", showToolName, toggleItem)}
              {renderissuedata(index, "MSC", data.s0i3, "", showToolName, toggleItem)}
              {renderissuedata(index, "MSC to S4", data.s0i3tos4, "", showToolName, toggleItem)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DropdownWithButton;
