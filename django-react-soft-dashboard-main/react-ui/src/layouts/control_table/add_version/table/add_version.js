import React, { useState } from "react";
import axios from "axios";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
function DropdownWithButton() {
  const backendServer = process.env.REACT_APP_BACKEND_SERVER;
  //const [message, setMessage] = useState("");
  const [short_name_option, short_name_options] = useState([]);
  const [device_tool_option, device_tool_options] = useState([]);
  const [formData, setFormData] = useState({
    short_name: "",
    device_tool: "",
    sub_device: "",
    package_version: "",
    detail_version: "",
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
  const handle_option_change = (event, selectedOption, fieldName) => {
    const selectedValue = selectedOption ? selectedOption.label : "";
    setFormData({
      ...formData,
      [fieldName]: selectedValue,
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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
  const short_name_loadoptions = async (inputValue) => {
    try {
      const response = await axios.get(`${backendServer}pulsar/select_short_name/`);
      const shortNames = response.data.short_name;
      const options = shortNames.map((name, index) => ({
        value: index + 1, // Value can be any unique identifier
        label: name,
      }));
      const filteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(inputValue.toLowerCase())
      );
      return filteredOptions;
    } catch (error) {
      console.error(error);
      throw error; // 如果请求失败，抛出异常
    }
  };
  const device_tool_loadoptions = async (inputValue, short_name_option) => {
    try {
      const request_data = {
        shortname: [short_name_option],
      };
      console.log(request_data);
      const response = await axios.post(`${backendServer}pulsar/select_long_name/`, request_data);
      const longnames = response.data.long_name.filter((item) => item !== null);
      const options = longnames.map((name, index) => ({
        value: index + 1, // Value can be any unique identifier
        label: name,
      }));
      const filteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(inputValue.toLowerCase())
      );
      return filteredOptions;
    } catch (error) {
      console.error(error);
      throw error; // 如果請求失敗，丟出異常
    }
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
          <label htmlFor="short_name" style={{ marginRight: "10px" }}>
            Short Name :
          </label>
          <Autocomplete
            id="short_name"
            name="short_name"
            options={short_name_option}
            onOpen={() => {
              short_name_loadoptions("").then((loadedOptions) => {
                short_name_options(loadedOptions);
              });
            }}
            onChange={(event, selectedOption) => {
              handle_option_change(event, selectedOption, "short_name");
              //device_tool_options([]);
              setFormData((prevFormData) => {
                const updatedData = {
                  ...prevFormData,
                  device_tool: "", // 设置 device_tool 为一个空字符串
                };
                console.log(updatedData); // 在状态已更新后打印
                return updatedData;
              });
            }}
            getOptionLabel={(option) => option.label}
            renderInput={(params) => <TextField {...params} />}
          />
        </div>
        <div style={line_form_style}>
          <label htmlFor="device_tool" style={{ marginRight: "10px" }}>
            Device/Tool :
          </label>
          <Autocomplete
            id="device_tool"
            name="device_tool"
            options={device_tool_option}
            onOpen={() => {
              console.log(formData.short_name);
              device_tool_loadoptions("", formData.short_name).then((loadedOptions) => {
                device_tool_options(loadedOptions);
              });
            }}
            onChange={(event, selectedOption) => {
              handle_option_change(event, selectedOption, "device_tool");
            }}
            getOptionLabel={(option) => option.label}
            renderInput={(params) => <TextField {...params} id="device_tool_text" />}
          />
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
