import React, { useState, useEffect } from "react";
import Modal from "react-modal";
// import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import "react-datetime/css/react-datetime.css";
import axios from "axios";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Tablebody from "@mui/material/TableBody";
import Button from "examples/Icons/Button";
import DateTimePicker from "examples/tool_universal/calendar_delay";
import Filter from "examples/tool_universal/filter_function";
import Loading from "examples/tool_universal/loading";
import { hasAzureAccess } from "../../../auth-context/auth.context";
function DropdownWithButton() {
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
  const [endDate, setEndDate] = useState(new Date());
  const [data, setData] = useState([]);
  const [machine_data, set_machine_data] = useState([]);
  const [popFilters, setPopFilters] = useState({
    1: false,
    2: false,
    3: false,
  });
  const [formData, setFormData] = useState({
    module: [],
    platform: [],
    shortName: "",
    longName: "",
    hardwareId: "",
  });
  const [popdata, setPopdata] = useState(null);
  const [showToolName, setShowToolName] = useState(data.map(() => false));
  useEffect(() => {
    get_machine_status_report();
  }, []);
  const toggleItem = (index) => {
    setShowToolName((prevShowToolName) => ({
      ...prevShowToolName,
      [index]: !prevShowToolName[index],
    }));
  };
  function getCellStyle(width) {
    return {
      minWidth: `${width}px`,
      maxWidth: `${width}px`,
      textAlign: "center",
      fontSize: "12px",
    };
  }
  const checkbox_style = getCellStyle(10);
  const fold_issue_data_style = getCellStyle(30);
  const platform_style = getCellStyle(150);
  const phase_style = getCellStyle(80);
  const sn_style = getCellStyle(150);
  const status_style = getCellStyle(80);
  const item_style = getCellStyle(100);
  const active_style = getCellStyle(200);
  const time_style = getCellStyle(200);
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
          <TableCell key={index} style={checkbox_style}>
            {"/"}
          </TableCell>
          <TableCell key={index} style={fold_issue_data_style}></TableCell>
          <TableCell key={index} style={platform_style}>
            {"platform"}
          </TableCell>
          <TableCell key={index} style={phase_style}>
            {"phase"}
          </TableCell>
          <TableCell key={index} style={sn_style}>
            {"serial_number"}
          </TableCell>
          <TableCell key={index} style={status_style}>
            {"status"}
          </TableCell>
          <TableCell key={index} style={item_style}>
            {"item"}
          </TableCell>
          <TableCell key={index} style={active_style}>
            {"active"}
          </TableCell>
          <TableCell key={index} style={time_style}>
            {"start time"}
          </TableCell>
          <TableCell key={index} style={time_style}>
            {"finish time"}
          </TableCell>
        </TableRow>
        <Collapse in={showToolName[`${index}_${data.serial_number}`]} style={hide_text}>
          {report_data(index, data)}
        </Collapse>
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
          <TableCell key={index} style={checkbox_style}>
            {"O"}
          </TableCell>
          <TableCell key={index} style={fold_issue_data_style}>
            <Typography
              onClick={() => toggleItem(`${index}_${data.serial_number}`)}
              style={show_hide_button}
            >
              {data.issue_restart ||
              data.issue_s4 ||
              data.issue_s0i3 ||
              data.issue_s0i3tos4 ||
              data.issue_total
                ? "⛔🔽"
                : "🔽"}
            </Typography>
          </TableCell>
          <TableCell key={index} style={platform_style}>
            {data.platform}
          </TableCell>
          <TableCell key={index} style={phase_style}>
            {data.phase}
          </TableCell>
          <TableCell key={index} style={sn_style}>
            {data.serial_number}
          </TableCell>
          <TableCell key={index} style={status_style}>
            {data.status}
          </TableCell>
          <TableCell key={index} style={item_style}>
            {data.devicename}/{data.IOT_CATM_status}
          </TableCell>
          <TableCell key={index} style={active_style}>
            {"active//"}
          </TableCell>
          <TableCell key={index} style={time_style}>
            {formatTimeForFrontend(data.start_time)}
          </TableCell>
          <TableCell key={index} style={time_style}>
            {data.finish_time ? formatTimeForFrontend(data.finish_time) : ""}
          </TableCell>
        </TableRow>
        <Collapse in={showToolName[`${index}_${data.serial_number}`]} style={hide_text}>
          {report_data(index, data)}
        </Collapse>
      </>
    );
  }
  function report_data(index, data) {
    if (!data.start_time) {
      return null;
    }
    return (
      <>
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
            {data.IOT_CATM_devicename && (
              <p>
                {"CAT-M"} {data.IOT_CATM_status || "offline"}
              </p>
            )}
            {/* {rendercollapsedata(index, data.tool_name, data.tool_version, showToolName, toggleItem)} */}
            {rendercollapsedata(index, "BIOS version", data.bios_version, showToolName, toggleItem)}
            {rendercollapsedata(
              index,
              "Image version",
              data.image_version,
              showToolName,
              toggleItem
            )}
            {rendercollapsedata(index, "OS version", data.os_version, showToolName, toggleItem)}
            {rendercollapsedata(index, "Connected wifi AP", data.wifi, showToolName, toggleItem)}
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
            {rendercollapsedata(index, data.dock_name, data.dock_version, showToolName, toggleItem)}
            {rendercollapsedata(index, data.wlan_name, data.wlan_version, showToolName, toggleItem)}
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
            {rendercollapsedata(index, data.mbim_name, data.mbim_version, showToolName, toggleItem)}
            {rendercollapsedata(index, data.qmux_name, data.qmux_version, showToolName, toggleItem)}
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
            {render_s0_data(
              index,
              "S0",
              data.s0_airplanemode,
              data.s0_idle,
              data.s0_onlinestream_test,
              showToolName,
              toggleItem
            )}
            {renderissuedata(
              index,
              "Restart",
              data.restart,
              data.issue_restart,
              showToolName,
              toggleItem
            )}
            {renderissuedata(index, "S4", data.s4, data.issue_s4, showToolName, toggleItem)}
            {renderissuedata(index, "MSC", data.s0i3, data.issue_s0i3, showToolName, toggleItem)}
            {renderissuedata(
              index,
              "MSC to S4",
              data.s0i3tos4,
              data.issue_s0i3tos4,
              showToolName,
              toggleItem
            )}
            {renderissuedata(
              index,
              "Total",
              data.total,
              data.issue_total,
              showToolName,
              toggleItem
            )}
          </div>
        </div>
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

    // 格式化时间，包括小時和分鐘，使用12小時制
    const formattedTime = date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    // 返回格式化后的日期时间字符串
    return `${month} ${day}, ${year}, ${formattedTime}`;
  }

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
  useEffect(() => {}, [data]);
  const handleButtonClick = () => {
    axios.get("/cat/machine_report/", { timeout: 10000 }).then((response) => {
      if (response.data) {
        console.log(response.data);
        setData(response.data);
      } else if (response.data.error) {
        alert(response.data.error);
      }
    });
  };
  useEffect(() => {
    console.log(machine_data);
  }, [machine_data]);
  const get_machine_status_report = () => {
    const request = {
      start_time: new Date(Date.now() - 36500 * 24 * 60 * 60 * 1000),
      end_time: new Date(),
      platform: formData.platform,
      module: formData.module,
    };
    console.log(request);
    axios
      .post("/cat/machine_status_report/", request, { timeout: 10000 })
      .then((response) => {
        if (response.data) {
          console.log(response.data);
          set_machine_data(response.data);
        } else if (response.data.error) {
          alert(response.data.error);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const filter_machine_status_report = () => {
    const request = {
      start_time: startDate,
      end_time: endDate,
      platform: formData.platform,
      module: formData.module,
    };
    // console.log(request);
    axios
      .post("/cat/filter_machine_status_report/", request, { timeout: 10000 })
      .then((response) => {
        console.log(response.data);
        if (response.data.finaldata) {
          set_machine_data(response.data.finaldata);
        } else if (response.data.error) {
          alert("無匹配資料");
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        closeModal(1);
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

  function issue_filter_content(data) {
    if (!data) {
      return null;
    }
    return (
      <>
        <div style={{ ...line_form_style, flexDirection: "column", alignItems: "left" }}>
          <p>{"Level : " + data.servity}</p>
          <p>{"Occur_time : " + formatTimeForFrontend(data.add_time)}</p>
          <p>{"Short description : " + data.short_description}</p>
          <p>{"Issue detail : " + data.issue_detail}</p>
        </div>
      </>
    );
  }
  function renderissuedata(index, label, label_data, data, showToolName, toggleItem) {
    if (!data) {
      return null;
    }
    if (data) {
      const errorcount = data.filter((item) => item.servity === "Error").length;
      const warningcount = data.filter((item) => item.servity === "Warning").length;
      return (
        <>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              border: "1px solid black",
              padding: "2px",
            }}
          >
            <Typography onClick={() => toggleItem(`${index}_${label}`)} style={show_hide_button}>
              <div style={{ display: "flex", flexDirection: "row", margin: "10px" }}>
                {label}
                <div style={{ border: "2px solid red", width: "30px", justifyContent: "center" }}>
                  <span style={{ color: "red" }}>{errorcount}</span>
                </div>
                <div
                  style={{
                    border: "2px solid darkorange",
                    width: "30px",
                    justifyContent: "center",
                  }}
                >
                  <span style={{ color: "darkorange", border: "2px" }}>{warningcount}</span>
                </div>
              </div>
            </Typography>
          </div>
          <Collapse in={showToolName[`${index}_${label}`]} style={hide_text}>
            {data
              .filter((item) => item.servity === "Error")
              .map((item, itemIndex) => (
                <div key={itemIndex} style={{ border: "1px dashed red" }}>
                  <p style={{ cursor: "pointer" }} onClick={() => openModal(2, item)}>
                    🔺 {item.servity} : {item.short_description}
                  </p>
                </div>
              ))}
            {data
              .filter((item) => item.servity === "Warning")
              .map((item, itemIndex) => (
                <div key={itemIndex} style={{ border: "1px dashed gold" }}>
                  <p style={{ cursor: "pointer" }} onClick={() => openModal(2, item)}>
                    🔸 {item.servity} : {item.short_description}
                  </p>
                </div>
              ))}
          </Collapse>
        </>
      );
    }
    return (
      <>
        <Typography onClick={() => toggleItem(`${index}_${label}`)} style={show_hide_button}>
          {label + " : " + label_data + " Round "}
        </Typography>
      </>
    );
  }
  // function renderissuedata_detail_error(
  //   index,
  //   label_data,
  //   data,
  //   itemIndex,
  //   showToolName,
  //   toggleItem
  // ) {
  //   if (data.servity[itemIndex] == "Error") {
  //     return null;
  //   }
  //   if (!label_data || label_data == '"null"') {
  //     return null;
  //   }
  //   return (
  //     <>
  //       <Typography
  //         onClick={() => toggleItem(`${index}_${label_data}_${itemIndex}`)}
  //         style={{
  //           ...show_hide_button,
  //           color: "red",
  //         }}
  //       >
  //         {data.servity[itemIndex] + " : " + data.issue_short_description[itemIndex]}
  //       </Typography>
  //       <Collapse in={showToolName[`${index}_${label_data}_${itemIndex}`]} style={hide_text}>
  //         <p key={itemIndex}>
  //           {data.failed_device_info[itemIndex]} : {data.add_time[itemIndex]} :{" "}
  //           {data.servity[itemIndex]}
  //         </p>
  //       </Collapse>
  //     </>
  //   );
  // }
  const download_cth_version = (data) => {
    setLoading(true);
    const request_data = {
      version: data,
    };
    axios
      .post("/cat/download_cth/", request_data)
      .then((response) => {
        if (response.data) {
          window.open(`${response.data.url}`);
          alert("success download");
          closeModal(3);
        } else if (response.data.error) {
          alert(response.data.error);
        }
      })
      .catch((error) => {
        console.log(error);
        alert("請聯絡管理員");
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    console.log(popdata);
  }, [popdata]);
  //load module option
  const openModal = (modalNumber, data = null) => {
    setPopdata(data);
    setPopFilters((prev) => ({ ...prev, [modalNumber]: true }));
  };
  const closeModal = (modalNumber) => {
    setPopFilters((prev) => ({ ...prev, [modalNumber]: false }));
  };
  const customStyles = {
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
  function test() {
    console.log(startDate);
    console.log(endDate);
    console.log(new Date());
  }
  function one_day_setting() {
    setStartDate(new Date(Date.now() - 24 * 60 * 60 * 1000));
    setEndDate(new Date());
  }
  function one_week_setting() {
    setStartDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
    setEndDate(new Date());
  }
  function one_month_setting() {
    setStartDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
    setEndDate(new Date());
  }
  function one_year_setting() {
    setStartDate(new Date(Date.now() - 365 * 24 * 60 * 60 * 1000));
    setEndDate(new Date());
  }
  function pop_filter_content() {
    return (
      <>
        <div style={line_form_style}>
          <Button onClick={test}>get</Button>
        </div>
        <div style={line_form_style}>
          <Button onClick={one_day_setting} style={{ marginLeft: "16px" }}>
            one day
          </Button>
          <Button onClick={one_week_setting} style={{ marginLeft: "16px" }}>
            one week
          </Button>
          <Button onClick={one_month_setting} style={{ marginLeft: "16px" }}>
            one month
          </Button>
          <Button onClick={one_year_setting} style={{ marginLeft: "16px" }}>
            one year
          </Button>
        </div>
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
            api="cat/filter_module"
            item_name={[
              "bt",
              "lan",
              "dock_lan",
              "nfc",
              "dock",
              "wlan",
              "usb_gnss",
              "mcd",
              "ude",
              "pcie_gnss",
              "mbim",
              "qmux",
              "wwannet_gnss",
            ]}
            request={{
              start_time: startDate,
              end_time: endDate,
            }}
            selectedOptions={formData.module}
            setSelectedOptions={(newOptions) => setFormData({ ...formData, module: newOptions })}
            buttonLabel="Module"
          />
        </div>
        <div style={line_form_style}>
          <Filter
            api="cat/filter_platform"
            item_name="platform"
            request={{
              start_time: startDate,
              end_time: endDate,
            }}
            selectedOptions={formData.platform}
            setSelectedOptions={(newOptions) => setFormData({ ...formData, platform: newOptions })}
            buttonLabel="Platform"
          />
        </div>
      </>
    );
  }
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
          <div style={{ flexDirection: "row", display: "flex" }}>
            <Button onClick={filter_machine_status_report}>確定</Button>
            <Button onClick={() => closeModal(1)}>關閉</Button>
          </div>
        </Modal>
      </div>
      <div style={{ display: "flex", overflowY: "auto" }}>
        <Modal
          isOpen={popFilters[2]}
          onRequestClose={() => closeModal(2)}
          style={customStyles}
          contentLabel="filter"
        >
          <h2>Issue detail</h2>
          {issue_filter_content(popdata)}
          <Button onClick={() => closeModal(2)}>關閉</Button>
        </Modal>
      </div>
      <div style={{ display: "flex", overflowY: "auto" }}>
        <Modal
          isOpen={popFilters[3]}
          onRequestClose={() => closeModal(3)}
          style={customStyles}
          contentLabel="filter"
        >
          <h4>確定下載內容，檔案較大! 需較長等待時間</h4>
          <Button
            onClick={() => {
              download_cth_version("PowerStressTest-2.1.0.0_CTH_Test");
            }}
          >
            確定
          </Button>
          <Button onClick={() => closeModal(3)}>關閉</Button>
        </Modal>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", flexDirection: "row", marginBottom: "20px" }}>
          <Button onClick={() => openModal(1)} style={{ display: "flex", width: "50px" }}>
            Filter
          </Button>
          {hasAzureAccess() && (
            <Button onClick={() => openModal(3)} style={{ display: "flex", width: "50px" }}>
              Download CTH
            </Button>
          )}
        </div>
        <p>machine status</p>
        <TableContainer>
          <div style={{ marginLeft: "16px" }}>
            <Tablebody>{title_row("1")}</Tablebody>
            <Tablebody>{machine_data.map((data, index) => data_row(index, data))}</Tablebody>
          </div>
        </TableContainer>
        <Button onClick={handleButtonClick} style={button_style}>
          report_get
        </Button>
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
