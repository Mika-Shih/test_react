import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Tablehead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import Tablebody from "@mui/material/TableBody";
import DateTimePicker from "examples/tool_universal/calendar_delay";
import Filter from "examples/tool_universal/filter_function";
import Inputbox from "examples/tool_universal/inputbox";
import { FixedSizeList } from "react-window";
import Button from "examples/Icons/Button";
import Filterbutton from "examples/Icons/Filter_button";
import Loading_option from "examples/tool_universal/loading_option";
import Loading_option_add_remove from "examples/tool_universal/loading_option_add_remove";
import Loading from "examples/tool_universal/loading";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import { useAuth, hasAzureAccess } from "../../../auth-context/auth.context";
function DropdownWithButton(props) {
  const { user } = useAuth();
  const history = useHistory();
  const [option, setOption] = useState(1);
  const [options, setOptions] = useState(0);
  const [select_iur_machine, set_select_iur_machine] = useState([]);
  useEffect(() => {
    props.iur(select_iur_machine);
  }, [select_iur_machine]);
  useEffect(() => {
    get_machine_status_report();
    console.log(user);
  }, []);
  const [startDate, setStartDate] = useState(new Date(Date.now() - 365 * 24 * 60 * 60 * 1000));
  const [endDate, setEndDate] = useState(new Date());
  const [machine_data, set_machine_data] = useState([]);
  const [loading, setLoading] = useState(false);
  const [popFilters, setPopFilters] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
  });
  const [formData, setFormData] = useState({
    target: [],
    group: [],
    cycle: [],
    platform: [],
    phase: [],
    status: [],
  });
  const [lendData, setlendData] = useState({
    lendperson: null,
    purpose: "",
    message: "",
    cc_mail: [],
  });
  const [inputList, setInputList] = useState([""]);
  const [widthsearch, setWidthsearch] = useState([""]);
  function getCellStyle(width) {
    return {
      minWidth: `${width}px`,
      maxWidth: `${width}px`,
      textAlign: "center",
      fontSize: "12px",
    };
  }
  const checkbox_style = getCellStyle(10);
  const platform_style = getCellStyle(150);
  const phase_style = getCellStyle(80);
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
    // border: "1px solid black",
  };
  function title_row(index, request = true) {
    if (request) {
      return (
        <>
          <TableRow style={table_row_style}>
            <TableCell key={index} style={checkbox_style}>
              {"/"}
            </TableCell>
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
    } else {
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
  }
  const handleCheckboxChange = (data) => {
    const updatedSelect_iur_machine = [...select_iur_machine];
    if (updatedSelect_iur_machine.includes(data)) {
      updatedSelect_iur_machine.splice(updatedSelect_iur_machine.indexOf(data), 1);
    } else {
      updatedSelect_iur_machine.push(data);
    }
    set_select_iur_machine(updatedSelect_iur_machine);
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
                checked={select_iur_machine.includes(data)}
                onChange={() => handleCheckboxChange(data)}
              />
            </TableCell>
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
              <span
                onClick={() => {
                  window.open(`/machine_record/?sn=${data.sn}`);
                }}
                style={{ cursor: "pointer", color: "darkblue", fontWeight: "bold", opacity: 0.8 }}
              >
                {data.sn}
              </span>
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
    } else {
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

  useEffect(() => {}, [machine_data]);
  const get_machine_status_report = () => {
    setLoading(true);
    set_select_iur_machine([]);
    const request_data = {
      start_time: new Date(Date.now() - 3650 * 24 * 60 * 60 * 1000),
      end_time: new Date(),
      target: "",
      group: "",
      cycle: "",
      platform: "",
      SN: "",
      phase: "",
      status: "",
      machine_arrive_mail: "",
    };
    axios
      .post("/polls/api/filtersearch/", request_data, { timeout: 60000 })
      .then((response) => {
        if (response.data) {
          console.log(response.data);
          set_machine_data(response.data.finaldata);
        } else if (response.data.error) {
          alert(response.data.error);
        }
      })
      .catch((error) => {
        console.error("error", error);
        alert("Please contact the administrator.");
      })
      .finally(() => {
        setLoading(false);
      });
  };
  /*
  const handle_option_change = (event, selectedOption, fieldName) => {
    const selectedValue = selectedOption ? selectedOption.label : "";
    setFormData({
      ...formData,
      [fieldName]: selectedValue,
    });
    console.log(formData);
  };
  */
  //load module option
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
  Modal.setAppElement("#root");
  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      cycle: [],
    }));
  }, [formData.target, formData.group]);
  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      platform: [],
    }));
  }, [formData.target, formData.group, formData.cycle]);

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
  function ten_year_setting() {
    setStartDate(new Date(Date.now() - 3650 * 24 * 60 * 60 * 1000));
    setEndDate(new Date());
  }
  function pop_filter_content() {
    return (
      <>
        <div style={containerStyle}>
          <div style={leftBlockStyle}>
            <div style={line_form_style}>
              <Button onClick={one_day_setting} style={{ marginLeft: "16px" }}>
                one day
              </Button>
              <Button onClick={one_week_setting} style={{ marginLeft: "16px" }}>
                one week
              </Button>
            </div>
            <div style={line_form_style}>
              <Button onClick={one_month_setting} style={{ marginLeft: "16px" }}>
                one month
              </Button>
              <Button onClick={one_year_setting} style={{ marginLeft: "16px" }}>
                one year
              </Button>
              <Button onClick={ten_year_setting} style={{ marginLeft: "16px" }}>
                ten year
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
                api="polls/api/target"
                item_name="target"
                selectedOptions={formData.target}
                setSelectedOptions={(newOptions) =>
                  setFormData({ ...formData, target: newOptions })
                }
                buttonLabel="Target"
              />
            </div>
            <div style={line_form_style}>
              <Filter
                api="polls/api/group"
                item_name="group"
                selectedOptions={formData.group}
                setSelectedOptions={(newOptions) => setFormData({ ...formData, group: newOptions })}
                buttonLabel="Group"
              />
            </div>
            <div style={line_form_style}>
              <Filter
                api="polls/api/cycle"
                item_name="cycle"
                request={{
                  target: formData.target,
                  group: formData.group,
                }}
                selectedOptions={formData.cycle}
                setSelectedOptions={(newOptions) => setFormData({ ...formData, cycle: newOptions })}
                buttonLabel="Cycle"
              />
            </div>
            <div style={line_form_style}>
              <Filter
                api="polls/api/platform"
                item_name="platform"
                request={{
                  target: formData.target,
                  group: formData.group,
                  cycle: formData.cycle,
                }}
                selectedOptions={formData.platform}
                setSelectedOptions={(newOptions) =>
                  setFormData({ ...formData, platform: newOptions })
                }
                buttonLabel="Platform"
              />
            </div>
            <div style={line_form_style}>
              <Filter
                api="polls/api/phase"
                item_name="phase"
                selectedOptions={formData.phase}
                setSelectedOptions={(newOptions) => setFormData({ ...formData, phase: newOptions })}
                buttonLabel="Phase"
              />
            </div>
            <div style={line_form_style}>
              <Filter
                api="polls/api/status"
                item_name="status"
                selectedOptions={formData.status}
                setSelectedOptions={(newOptions) =>
                  setFormData({ ...formData, status: newOptions })
                }
                buttonLabel="Status"
              />
            </div>
            <Inputbox inputList={inputList} setInputList={setInputList} />
          </div>
          <div style={rightBlockStyle}>
            <div style={line_form_style}>
              <p>target</p>
              <Filterbutton options={formData.target} onClick={one_day_setting} />
            </div>
            <div style={line_form_style}>
              <p>group</p>
              {formData.group.map((option, index) => (
                <div key={index} style={borderedOptionStyle}>
                  {option}
                </div>
              ))}
            </div>
            <div style={line_form_style}>
              <p>cycle</p>
              {formData.cycle.map((option, index) => (
                <div key={index} style={borderedOptionStyle}>
                  {option}
                </div>
              ))}
            </div>
            <div style={line_form_style}>
              <p>platform</p>
              <Filterbutton options={formData.platform} onClick={one_day_setting} />
            </div>
            <div style={line_form_style}>
              <p>phase</p>
              {formData.phase.map((option, index) => (
                <div key={index} style={borderedOptionStyle}>
                  {option}
                </div>
              ))}
            </div>
            <div style={line_form_style}>
              <p>status</p>
              {formData.status.map((option, index) => (
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
  useEffect(() => {
    console.log(lendData.cc_mail);
  }, [lendData.cc_mail]);
  useEffect(() => {
    function machine_length(status) {
      if (select_iur_machine.length > 0) {
        const canOpenModal = select_iur_machine.every((machine) => machine.status === status);
        if (canOpenModal) {
          props.iur_option(options);
        } else {
          setOptions(0);
          alert(`Please ensure that the status of each machine is ${status}.`);
        }
      } else {
        setOptions(0);
        alert("Please select the machine.");
      }
    }
    if (options == 1) {
      const status = "Keep On";
      setOptions(0);
      if (select_iur_machine.length > 0) {
        const canOpenModal = select_iur_machine.every((machine) => machine.status === status);
        if (canOpenModal) {
          openModal(2);
        } else {
          alert(`Please ensure that the status of each machine is ${status}.`);
        }
      } else {
        alert("Please select the machine.");
      }
    }
    if (options == 2) {
      machine_length("Rent");
    }
    if (options == 3 || options == 4 || options == 5 || options == 6) {
      machine_length("Keep On");
    }
  }, [options]);
  function lend_content() {
    return (
      <>
        <div style={{ flexDirection: "column", ...containerStyle }}>
          <div style={line_form_style}>
            <Loading_option
              api="polls/lendpersonnel"
              name="user_name"
              selectedOptions={lendData.lendperson}
              setSelectedOptions={(newOptions) =>
                setlendData({ ...lendData, lendperson: newOptions })
              }
            />
          </div>
          <div style={line_form_style}>
            <TableContainer>
              <div style={{}}>
                <Tablehead>{title_row("1", false)}</Tablehead>
              </div>
              <div style={{ marginLeft: "16px" }}>
                <Tablebody>
                  {select_iur_machine.map((data, index) => data_row(index, data, false))}
                </Tablebody>
              </div>
            </TableContainer>
          </div>
          <div style={line_form_style}>
            <label htmlFor="Purpose">Purpose:</label>
          </div>
          <div style={line_form_style}>
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
          </div>
          <div style={line_form_style}>
            <label htmlFor="cc_mail">cc mail:</label>
          </div>
          <div style={line_form_style}>
            {/* <input
              id="cc_mail"
              name="cc_mail"
              style={{ width: "200px", padding: "8px" }}
              value={lendData.cc_mail}
              onChange={(e) => {
                setlendData({
                  ...lendData,
                  cc_mail: e.target.value,
                });
              }}
            /> */}
            <Loading_option_add_remove
              api="polls/lendpersonnel"
              name="user_mail"
              selectedOptions={lendData.cc_mail}
              setSelectedOptions={(newOptions) => setlendData({ ...lendData, cc_mail: newOptions })}
            />
          </div>
          <div style={line_form_style}>
            <label htmlFor="message">mail message:</label>
          </div>
          <div style={line_form_style}>
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
          </div>
        </div>
      </>
    );
  }
  const clearmodel = () => {
    setFormData({
      target: [],
      group: [],
      cycle: [],
      platform: [],
      phase: [],
      status: [],
    });
    setInputList([""]);
  };
  const widthsearth_function = () => {
    const request_data = {
      keyword: [widthsearch],
    };
    console.log(request_data);
    axios.post("/polls/api/widthsearch/", request_data, { timeout: 10000 }).then((response) => {
      if (response.data.finaldata) {
        console.log(response.data);
        set_machine_data(response.data.finaldata);
      } else if (response.data.error) {
        alert(response.data.error);
      }
    });
    set_select_iur_machine([]);
  };
  const filtersearch = () => {
    const request_data = {
      start_time: startDate,
      end_time: endDate,
      target: formData.target,
      group: formData.group,
      cycle: formData.cycle,
      platform: formData.platform,
      SN: inputList,
      phase: formData.phase,
      status: formData.status,
    };
    axios.post("/polls/api/filtersearch/", request_data, { timeout: 10000 }).then((response) => {
      if (response.data.finaldata) {
        console.log(response.data);
        set_machine_data(response.data.finaldata);
      } else if (response.data.error) {
        alert(response.data.error);
      }
    });
    set_select_iur_machine([]);
    closeModal(1);
  };
  const lend = () => {
    setLoading(true);
    const cc_mail_list = lendData.cc_mail.filter(Boolean).map((item) => item.value);
    const request_data = {
      finaldata: select_iur_machine,
      lendperson: lendData.lendperson == null ? "" : lendData.lendperson.value,
      purpose: lendData.purpose,
      cc_mail: cc_mail_list,
      message: lendData.message,
    };
    console.log(request_data);
    axios
      .post("/polls/lendplatform/", request_data, { timeout: 10000 })
      .then((response) => {
        if (response.data.finaldata) {
          console.log(response.data.finaldata);
          alert("Successfully borrowed.");
          closeModal(2);
          window.location.reload();
        } else if (response.data.error) {
          alert(response.data.error);
        }
      })
      .catch((error) => {
        console.log(error);
        alert("Please contact the administrator.");
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const Row = ({ index, style }) => (
    <TableRow style={style}>{data_row(index, machine_data[index])}</TableRow>
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
            Apply Filters
          </Button>
          <Button style={{ margin: "10px", padding: "10px" }} onClick={clearmodel}>
            Clear
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
          contentLabel="lend"
        >
          <h2>Borrow</h2>
          {lend_content()}
          <Button onClick={lend}>Borrow</Button>
          <Button onClick={() => closeModal(2)}>Close</Button>
        </Modal>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", flexDirection: "row", marginBottom: "20px" }}>
          <Button onClick={() => openModal(1)}>Filter</Button>
          <input
            type="text"
            value={widthsearch}
            onChange={(event) => setWidthsearch(event.target.value)}
            placeholder=" SN / platform / borrower "
            style={{ marginLeft: "30px" }}
          />
          <Button onClick={widthsearth_function}>search</Button>
          {hasAzureAccess() && (
            <div style={{ marginLeft: "auto", marginRight: "70px" }}>
              <select
                value={option}
                onChange={(event) => {
                  setOption(event.target.value);
                }}
                style={{ padding: "5px 25px", marginLeft: "20px", marginRight: "10px" }}
              >
                <option value="1">Borrow</option>
                <option value="2">Return</option>
                <option value="3">New Machine In</option>
                <option value="4">Batch Modify</option>
                <option value="5">Batch Delete</option>
                <option value="6">Batch Scrap</option>
              </select>
              <Button
                onClick={() => {
                  setOptions(option);
                }}
              >
                Submit
              </Button>
              <Button
                style={{ marginLeft: "40px" }}
                onClick={() => {
                  history.push("/new_machine/");
                }}
              >
                Add new machine
              </Button>
            </div>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p
            style={{
              marginLeft: "16px",
              fontFamily: "Calibri, sans-serif",
            }}
          >
            Current machine amount: {machine_data.length}
          </p>
          <p
            style={{
              marginLeft: "16px",
              fontFamily: "Calibri, sans-serif",
            }}
          >
            Check machine amount: {select_iur_machine.length}
          </p>
        </div>
        <TableContainer>
          <div style={{}}>
            <Tablehead>{title_row("1")}</Tablehead>
          </div>
        </TableContainer>
        <div style={{ display: "flex", overflowY: "auto", width: "100%", marginLeft: "16px" }}>
          <FixedSizeList height={600} itemCount={machine_data.length} itemSize={70} width={"100%"}>
            {Row}
          </FixedSizeList>
        </div>
      </div>
    </div>
  );
}
DropdownWithButton.propTypes = {
  iur: PropTypes.func.isRequired,
  iur_option: PropTypes.func.isRequired,
};
export default DropdownWithButton;
