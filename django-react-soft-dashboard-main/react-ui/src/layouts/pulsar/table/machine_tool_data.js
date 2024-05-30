import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Tablebody from "@mui/material/TableBody";
import DateTimePicker from "examples/tool_universal/calendar_delay";
import Filter from "examples/tool_universal/filter_function";
import Button from "examples/Icons/Button";
import Loading_option from "examples/tool_universal/loading_option";
import Loading from "examples/tool_universal/loading";
import PropTypes from "prop-types";
import { hasAzureAccess } from "auth-context/auth.context";
import DLAAPI from "api/deliverable";
function DropdownWithButton() {
  const [select_device_tool, set_select_device_tool] = useState([]);
  useEffect(() => {
    setLoading(true);
    get_version_report();
    setLoading(false);
  }, []);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [device_tool_data, set_device_tool_data] = useState([]);
  const [loading, setLoading] = useState(false);
  const [popFilters, setPopFilters] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
  });
  const [filterData, setfilterData] = useState({
    shortName: [],
    longName: [],
    subDevice: [],
  });
  const [deviceData, setdeviceData] = useState({
    category: "TOOL",
    shortName: null,
    longName: null,
    subDevice: null,
  });
  const [versionData, setversionData] = useState({
    shortName: null,
    longName: null,
    subDevice: null,
    package_version: "",
    detail_version: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [user_experience, set_user_experience] = useState(0);
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setdeviceData({
      ...deviceData,
      [name]: value,
    });
  };
  function getCellStyle(width) {
    return {
      minWidth: `${width}px`,
      maxWidth: `${width}px`,
      textAlign: "center",
      // border: "1px solid #ddd",
      fontSize: "12px",
    };
  }
  const checkbox_style = getCellStyle(10);
  const short_name_style = getCellStyle(160);
  const long_name_style = getCellStyle(300);
  const category_style = getCellStyle(150);
  const sub_device_style = getCellStyle(150);
  const package_version_style = getCellStyle(180);
  const detail_version_style = getCellStyle(180);
  const update_time_style = getCellStyle(200);
  const active_style = getCellStyle(100);
  const table_row_style = {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    textAlign: "center",
    // border: "1px solid black",
  };
  const deleteButtonStyle = {
    cursor: "pointer",
    padding: "5px",
    backgroundColor: "lightcoral",
    border: "none",
    color: "white",
  };
  function title_row(index, request = true) {
    if (request) {
      return (
        <>
          <TableRow style={table_row_style}>
            <TableCell key={index} style={checkbox_style}>
              {"/"}
            </TableCell>
            <TableCell key={index} style={active_style}>
              {"active"}
            </TableCell>
            <TableCell key={index} style={short_name_style}>
              {"short name"}
            </TableCell>
            <TableCell key={index} style={long_name_style}>
              {"long name"}
            </TableCell>
            <TableCell key={index} style={category_style}>
              {"category"}
            </TableCell>
            <TableCell key={index} style={sub_device_style}>
              {"sub device"}
            </TableCell>
            <TableCell key={index} style={package_version_style}>
              {"package version"}
            </TableCell>
            <TableCell key={index} style={detail_version_style}>
              {"detail version"}
            </TableCell>
            <TableCell key={index} style={update_time_style}>
              {"update_time"}
            </TableCell>
          </TableRow>
        </>
      );
    } else {
      return (
        <>
          <TableRow style={table_row_style}>
            <TableCell key={index} style={active_style}>
              {"active"}
            </TableCell>
            <TableCell key={index} style={short_name_style}>
              {"short name"}
            </TableCell>
            <TableCell key={index} style={long_name_style}>
              {"long name"}
            </TableCell>
            <TableCell key={index} style={category_style}>
              {"category"}
            </TableCell>
            <TableCell key={index} style={sub_device_style}>
              {"sub device"}
            </TableCell>
            <TableCell key={index} style={package_version_style}>
              {"package version"}
            </TableCell>
            <TableCell key={index} style={detail_version_style}>
              {"detail version"}
            </TableCell>
            <TableCell key={index} style={update_time_style}>
              {"update_time"}
            </TableCell>
          </TableRow>
        </>
      );
    }
  }
  const get_version_report = async () => {
    set_select_device_tool([]);
    let response = await DLAAPI.select_version({
      shortname: "",
      longname: "",
      subdevice: "",
    });
    if (response.data) {
      set_device_tool_data(response.data.finaldata);
    } else if (response.data.error) {
      alert(response.data.error);
    }
  };
  const handleCheckboxChange = (data) => {
    const updatedSelect_device_tool = [...select_device_tool];
    if (updatedSelect_device_tool.includes(data)) {
      updatedSelect_device_tool.splice(updatedSelect_device_tool.indexOf(data), 1);
    } else {
      updatedSelect_device_tool.push(data);
    }
    set_select_device_tool(updatedSelect_device_tool);
  };
  function data_row(index, data, request = true) {
    if (!data) {
      return null;
    }
    if (request) {
      return (
        <>
          <TableRow style={table_row_style}>
            <TableCell key={index} style={checkbox_style}>
              <input
                type="checkbox"
                checked={select_device_tool.includes(data)}
                onChange={() => handleCheckboxChange(data)}
              />
            </TableCell>
            <TableCell key={index} style={active_style}>
              {hasAzureAccess() && (
                <>
                  <Button
                    onClick={() => {
                      download_version(data.package_version);
                    }}
                  >
                    Download
                  </Button>
                </>
              )}
            </TableCell>
            <TableCell key={index} style={short_name_style}>
              {data.short_name}
            </TableCell>
            <TableCell key={index} style={long_name_style}>
              {data.long_name}
            </TableCell>
            <TableCell key={index} style={category_style}>
              {data.category}
            </TableCell>
            <TableCell key={index} style={sub_device_style}>
              {data.sub_device}
            </TableCell>
            <TableCell key={index} style={package_version_style}>
              {data.package_version}
            </TableCell>
            <TableCell key={index} style={detail_version_style}>
              {data.detail_version}
            </TableCell>
            <TableCell key={index} style={update_time_style}>
              {formatTimeForFrontend(data.update_time)}
            </TableCell>
          </TableRow>
        </>
      );
    } else {
      return (
        <>
          <TableRow style={table_row_style}>
            <TableCell key={index} style={active_style}>
              {hasAzureAccess() && (
                <>
                  <Button
                    onClick={() => {
                      download_version(data.package_version);
                    }}
                  >
                    Download
                  </Button>
                </>
              )}
            </TableCell>
            <TableCell key={index} style={short_name_style}>
              {data.short_name}
            </TableCell>
            <TableCell key={index} style={long_name_style}>
              {data.long_name}
            </TableCell>
            <TableCell key={index} style={category_style}>
              {data.category}
            </TableCell>
            <TableCell key={index} style={sub_device_style}>
              {data.sub_device}
            </TableCell>
            <TableCell key={index} style={package_version_style}>
              {data.package_version}
            </TableCell>
            <TableCell key={index} style={detail_version_style}>
              {data.detail_version}
            </TableCell>
            <TableCell key={index} style={update_time_style}>
              {formatTimeForFrontend(data.update_time)}
            </TableCell>
          </TableRow>
        </>
      );
    }
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

    // 格式化时间，包括小時和分鐘，使用12小時制
    const formattedTime = date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    return `${month} ${day}, ${year}, ${formattedTime}`;
  }
  const borderedOptionStyle = {
    border: "1px solid #000",
    padding: "3px",
    margin: "4px",
    maxWidth: "500px",
  };
  const containerStyle = {
    display: "flex",
  };
  const leftBlockStyle = {
    maxWidth: "400px",
    minWidth: "400px",
    flex: "0 0 400px", //flex-grow(區域優先級)、flex-shrink(區域空間不夠縮放優先級)、flex-basis
    marginRight: "10px",
    padding: "10px",
    background: "#efefef",
  };
  const rightBlockStyle = {
    flex: "1",
    padding: "10px",
    background: "#f5f5f5",
  };
  const line_form_style = {
    display: "flex",
    alignItems: "center",
    marginBottom: "14px",
    color: "#000000",
    fontSize: "18px",
  };
  useEffect(() => {}, [device_tool_data]);

  const openModal = (modalNumber) => {
    setPopFilters((prev) => ({ ...prev, [modalNumber]: true }));
  };
  const closeModal = (modalNumber) => {
    setPopFilters((prev) => ({ ...prev, [modalNumber]: false }));
  };

  const customStyles = {
    content: {
      maxWidth: "1000px",
      minWidth: "1000px",
      maxHeight: "800px",
      minHeight: "800px",
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-500px",
      transform: "translate(-50%, -50%)",
      overflowY: "auto",
    },
    overlay: {
      zIndex: 1000,
    },
  };
  const little_customStyles = {
    content: {
      maxWidth: "600px",
      maxHeight: "600px",
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-500px",
      transform: "translate(-50%, -50%)",
      overflowY: "auto",
    },
    overlay: {
      zIndex: 1000,
    },
  };
  Modal.setAppElement("#root");
  useEffect(() => {
    setfilterData((prevFormData) => ({
      ...prevFormData,
      longName: [],
    }));
  }, [filterData.shortName]);
  useEffect(() => {
    setfilterData((prevFormData) => ({
      ...prevFormData,
      subDevice: [],
    }));
  }, [filterData.shortName, filterData.longName]);
  function pop_filter_content() {
    return (
      <>
        <div style={containerStyle}>
          <div style={leftBlockStyle}>
            <div style={line_form_style}>
              <DateTimePicker
                startDatetime={startDate}
                endDatetime={endDate}
                setStartDatetime={setStartDate}
                setEndDatetime={setEndDate}
              />
            </div>
            <div style={line_form_style}>
              <Filter
                api="pulsar/select_short_name"
                item_name="short_name"
                selectedOptions={filterData.shortName}
                setSelectedOptions={(newOptions) =>
                  setfilterData({ ...filterData, shortName: newOptions })
                }
                buttonLabel="Short Name"
              />
            </div>
            <div style={line_form_style}>
              <Filter
                api="pulsar/select_long_name"
                item_name="long_name"
                request={{
                  shortname: filterData.shortName,
                }}
                selectedOptions={filterData.longName}
                setSelectedOptions={(newOptions) =>
                  setfilterData({ ...filterData, longName: newOptions })
                }
                buttonLabel="Long Name"
              />
            </div>
            <Filter
              api="pulsar/select_subdevice"
              item_name="subdevice"
              request={{
                shortname: filterData.shortName,
                longname: filterData.longName,
              }}
              selectedOptions={filterData.subDevice}
              setSelectedOptions={(newOptions) =>
                setfilterData({ ...filterData, subDevice: newOptions })
              }
              buttonLabel="Sub Device"
            />
          </div>
          <div style={rightBlockStyle}>
            <div style={line_form_style}>
              {filterData.shortName.map((option, index) => (
                <div key={index} style={borderedOptionStyle}>
                  {option}
                </div>
              ))}
            </div>
            <div style={line_form_style}>
              {filterData.longName.map((option, index) => (
                <div key={index} style={borderedOptionStyle}>
                  {option}
                </div>
              ))}
            </div>
            <div style={line_form_style}>
              {filterData.subDevice.map((option, index) => (
                <div key={index} style={borderedOptionStyle}>
                  {option}
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }
  const renderSubDeviceOptions = () => {
    const category = deviceData.category;
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
  function device_tool_content() {
    return (
      <>
        <div style={{ flexDirection: "column", ...containerStyle }}>
          <div style={line_form_style}>
            <label htmlFor="category" style={{ marginRight: "15px" }}>
              Category :
            </label>
            <select
              id="category"
              name="category"
              value={deviceData.category}
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
            <label htmlFor="subDevice" style={{ marginRight: "15px" }}>
              Sub Device :
            </label>
            <select
              id="subDevice"
              name="subDevice"
              value={deviceData.subDevice}
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
            <label htmlFor="shortName" style={{ marginRight: "15px" }}>
              Short Name :
            </label>
            <input
              type="text"
              id="shortName"
              name="shortName"
              value={deviceData.subDevice}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </>
    );
  }
  function version_content() {
    return (
      <>
        <div style={{ flexDirection: "column", ...containerStyle }}>
          <div style={line_form_style}>
            <label htmlFor="short_name">Short name:</label>
          </div>
          <div style={line_form_style}>
            <Loading_option
              api="pulsar/select_short_name"
              name="short_name"
              selectedOptions={versionData.shortName}
              setSelectedOptions={(newOptions) =>
                setversionData({ ...versionData, shortName: newOptions })
              }
            />
          </div>
          <div style={line_form_style}>
            <label htmlFor="long_name">Long name:</label>
          </div>
          <div style={line_form_style}>
            <Loading_option
              api="pulsar/select_long_name"
              name="long_name"
              request={{
                shortname: versionData.shortName == null ? "" : [versionData.shortName.value],
              }}
              selectedOptions={versionData.longName}
              setSelectedOptions={(newOptions) =>
                setversionData({ ...versionData, longName: newOptions })
              }
            />
          </div>
          <div style={line_form_style}>
            <label htmlFor="sub_device">Sub Device:</label>
          </div>
          <div style={line_form_style}>
            <Loading_option
              api="pulsar/select_subdevice"
              name="subdevice"
              request={{
                shortname: versionData.shortName == null ? "" : [versionData.shortName.value],
                longname: versionData.longName == null ? "" : [versionData.longName.value],
              }}
              selectedOptions={versionData.subDevice}
              setSelectedOptions={(newOptions) =>
                setversionData({ ...versionData, subDevice: newOptions })
              }
            />
          </div>
          <div style={line_form_style}>
            <label htmlFor="package_version" style={{ marginRight: "15px" }}>
              Package Version :
            </label>
            <input
              type="text"
              id="package_version"
              name="package_version"
              value={versionData.package_version}
              onChange={(event) => {
                setversionData({
                  ...versionData,
                  package_version: event.target.value,
                });
              }}
              style={{ height: "25px" }}
            />
          </div>
          <div style={line_form_style}>
            <label htmlFor="detail_version" style={{ marginRight: "15px" }}>
              Detail Version :
            </label>
            <input
              type="text"
              id="detail_version"
              name="detail_version"
              value={versionData.detail_version}
              onChange={(event) => {
                setversionData({
                  ...versionData,
                  detail_version: event.target.value,
                });
              }}
              style={{ height: "25px" }}
            />
          </div>
          <div style={line_form_style}>
            <div>
              <label htmlFor="file">選擇文件：</label>
              <input
                key={user_experience}
                type="file"
                onChange={(event) => {
                  const file = event.target.files[0];
                  setSelectedFile(file);
                }}
              />
              <button
                style={deleteButtonStyle}
                onClick={() => {
                  setSelectedFile(null);
                  set_user_experience((prevKey) => prevKey + 1);
                }}
              >
                X
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }
  const clearmodel = () => {
    setfilterData({
      shortName: [],
      longName: [],
      subDevice: [],
    });
  };
  const filtersearch = async () => {
    setLoading(true);
    try {
      let response = await DLAAPI.select_version({
        shortname: filterData.shortName,
        longname: filterData.longName,
        subdevice: filterData.subDevice,
      });
      if (response.data.finaldata) {
        set_device_tool_data(response.data.finaldata);
        set_select_device_tool([]);
      } else if (response.data.error) {
        alert(response.data.error);
      }
    } catch (error) {
      console.log(error);
      alert("Please contact the administrator.");
    } finally {
      closeModal(1);
      setLoading(false);
    }
  };
  const addversion = async () => {
    setLoading(true);
    let request_data = new FormData();
    request_data.append(
      "shortname",
      JSON.stringify(versionData.shortName == null ? "" : versionData.shortName.value)
    );
    request_data.append(
      "longname",
      JSON.stringify(versionData.longName == null ? "" : versionData.longName.value)
    );
    request_data.append(
      "subdevice",
      JSON.stringify(versionData.subDevice == null ? "" : versionData.subDevice.value)
    );
    request_data.append("package_version", JSON.stringify(versionData.package_version));
    request_data.append("detail_version", JSON.stringify(versionData.detail_version));
    request_data.append("file", selectedFile);
    try {
      console.log(request_data);
      let response = await DLAAPI.create_version(request_data);
      if (response.data.finaldata) {
        alert(response.data.finaldata);
        window.location.reload(true);
      } else if (response.data.error) {
        alert(response.data.error);
      }
    } catch (error) {
      console.log(error);
      alert("Please contact the administrator.");
    } finally {
      setLoading(false);
    }
  };
  const download_version = async (data) => {
    setLoading(true);
    try {
      let response = await DLAAPI.download_version({
        version: data,
      });
      if (response.data.url) {
        window.open(`${response.data.url}`);
        alert("success download");
      } else if (response.data.error) {
        alert(response.data.error);
      }
    } catch (error) {
      console.log(error);
      alert("Please contact the administrator.");
    } finally {
      setLoading(false);
    }
  };
  const adddevice = () => {};
  const Row = ({ index, style }) => (
    <TableRow style={style}>{data_row(index, device_tool_data[index])}</TableRow>
  );
  Row.propTypes = {
    index: PropTypes.number.isRequired,
    style: PropTypes.object.isRequired,
  };
  return (
    <div style={{ display: "flex", alignItems: "center", marginLeft: "20px" }}>
      <Loading loading={loading} />
      <div style={{ display: "flex", overflowY: "auto" }}>
        <Modal
          isOpen={popFilters[1]}
          onRequestClose={() => closeModal(1)}
          style={customStyles}
          contentLabel="filter"
        >
          <h2>filter</h2>
          {pop_filter_content()}
          <Button style={{ margin: "10px", padding: "10px" }} onClick={filtersearch}>
            顯示version
          </Button>
          <Button style={{ margin: "10px", padding: "10px" }} onClick={clearmodel}>
            清除
          </Button>
          <Button style={{ margin: "10px", padding: "10px" }} onClick={() => closeModal(1)}>
            關閉
          </Button>
        </Modal>
      </div>
      <div style={{ display: "flex", overflowY: "auto" }}>
        <Modal
          isOpen={popFilters[2]}
          onRequestClose={() => closeModal(2)}
          style={little_customStyles}
          contentLabel="lend"
        >
          <h3>新增Device_tool</h3>
          {device_tool_content()}
          <Button onClick={adddevice}>新增</Button>
          <Button onClick={() => closeModal(2)}>關閉</Button>
        </Modal>
      </div>
      <div style={{ display: "flex", overflowY: "auto" }}>
        <Modal
          isOpen={popFilters[3]}
          onRequestClose={() => closeModal(3)}
          style={little_customStyles}
          contentLabel="add version"
        >
          <h3>新增Version</h3>
          {version_content()}
          <Button onClick={addversion}>新增</Button>
          <Button onClick={() => closeModal(3)}>關閉</Button>
        </Modal>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", flexDirection: "row", marginBottom: "20px" }}>
          <Button onClick={() => openModal(1)}>Filter</Button>
          {hasAzureAccess() && (
            <>
              <Button onClick={() => openModal(2)}>新增Device_tool</Button>
              <Button onClick={() => openModal(3)}>新增Version</Button>
            </>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <p
            style={{
              marginLeft: "16px",
              fontFamily: "微軟正黑體, Microsoft JhengHei, Arial, sans-serif",
            }}
          >
            當前 Device_tool 數量: {device_tool_data.length}
          </p>
          <p
            style={{
              marginLeft: "16px",
              fontFamily: "微軟正黑體, Microsoft JhengHei, Arial, sans-serif",
            }}
          >
            已勾選 Device_tool 數量: {select_device_tool.length}
          </p>
        </div>
        <TableContainer>
          <div style={{}}>
            <Tablebody>{title_row("1")}</Tablebody>
          </div>
          <div style={{}}>
            <Tablebody>{device_tool_data.map((data, index) => data_row(index, data))}</Tablebody>
          </div>
        </TableContainer>
      </div>
    </div>
  );
}
export default DropdownWithButton;
