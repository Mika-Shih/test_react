import React, { useState } from "react";
import axios from "axios";
function DropdownWithButton() {
  //const [message, setMessage] = useState("");
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

  const handleButtonClick = () => {
    const request_data = {
      shortname: formData.shortName,
      longname: formData.longName,
      category: formData.category,
      subdevice: formData.subDevice,
      hw_id: formData.hardwareId,
    };
    console.log(request_data);
    alert(request_data);
    const backendServer = process.env.REACT_APP_BACKEND_SERVER;
    //const frontendServer = process.env.REACT_APP_FRONTEND_SERVER;
    axios
      .post(`${backendServer}pulsar/create_device_tool/`, request_data, { timeout: 10000 })
      .then((response) => {
        if (response.data.redirect_url) {
          console.log(response.data.redirect_url);
          //window.location.replace(`${frontendServer}pulsar/`);
        } else if (response.data.error) {
          alert(response.data.error);
        }
      });
  };
  return (
    <div style={{ display: "flex", alignItems: "center", marginLeft: "100px" }}>
      <form style={{ display: "flex", flexDirection: "column" }}>
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
            <option value="TOOL">TOOL</option>
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
          Submit
        </button>
      </form>
    </div>
  );
}

export default DropdownWithButton;
