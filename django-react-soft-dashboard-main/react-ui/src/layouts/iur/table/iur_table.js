import React, { useState, useEffect, useRef } from "react";
import Modal from "react-modal";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Tablehead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import Tablebody from "@mui/material/TableBody";
import DateTimePicker from "examples/tool_universal/calendar_delay";
// import Filter from "examples/tool_universal/filter_function";
import Inputbox from "examples/tool_universal/inputbox";
import { FixedSizeList } from "react-window";
import Button from "examples/Icons/Button";
import Table from "examples/Table/table_row";
import Filterbutton from "examples/Icons/Filter_button";
import Filter from "examples/tool_universal/filter";
import Loading_option from "examples/tool_universal/loading_option";
import Loading_option_add_remove from "examples/tool_universal/loading_option_add_remove";
import Loading from "examples/tool_universal/loading";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import { useAuth, hasAzureAccess } from "../../../auth-context/auth.context";
import useStyles from "layouts/iur/table/styles/iur";
import IURAPI from "api/iur";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import AddIcon from "@mui/icons-material/Add";
function DropdownWithButton(props) {
  const classes = useStyles();
  const { user } = useAuth();
  const history = useHistory();
  const [option, setOption] = useState();
  const [options, setOptions] = useState(0);
  const [button_name, set_button_name] = useState("");
  const [select_iur_machine, set_select_iur_machine] = useState([]);
  useEffect(() => {
    props.iur(select_iur_machine);
  }, [select_iur_machine]);
  useEffect(() => {
    console.log(user);
    get_machine_status_report();
  }, []);
  const [startDate, setStartDate] = useState(new Date(Date.now() - 10 * 365 * 24 * 60 * 60 * 1000));
  const [endDate, setEndDate] = useState(new Date());
  const [machine_data, set_machine_data] = useState([]);
  const [loading, setLoading] = useState(false);
  const [popFilters, setPopFilters] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
  });
  const [option_list, setoption_list] = useState({
    target: [],
    group: [],
    cycle: [],
    platform: [],
    phase: [],
    status: [],
  });
  const [selectoption, setselectoption] = useState({
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
  const [memberData, setmemberData] = useState({
    username: "",
    site: "TW",
    email: "",
  });
  const [inputList, setInputList] = useState([""]);
  const [widthsearch, setWidthsearch] = useState([""]);
  function MyTableCell({ index, style, className, children }) {
    return (
      <TableCell key={index} style={style} className={className}>
        {children}
      </TableCell>
    );
  }
  MyTableCell.propTypes = {
    index: PropTypes.number.isRequired,
    style: PropTypes.object,
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
  };
  const data = [
    ...(hasAzureAccess()
      ? [{ index: "1", className: classes.title_checkbox_style, children: "/" }]
      : []),
    { index: "1", className: classes.title_platform_style, children: "platform" },
    { index: "1", className: classes.title_phase_style, children: "phase" },
    { index: "1", className: classes.title_target_style, children: "target" },
    { index: "1", className: classes.title_group_style, children: "group" },
    { index: "1", className: classes.title_cycle_style, children: "cycle" },
    { index: "1", className: classes.title_sku_style, children: "sku" },
    { index: "1", className: classes.title_sn_style, children: "serial_number" },
    { index: "1", className: classes.title_borrower_style, children: "borrower" },
    { index: "1", className: classes.title_status_style, children: "status" },
    { index: "1", className: classes.title_position_style, children: "position" },
    { index: "1", className: classes.title_remark_style, children: "remark" },
    { index: "1", className: classes.title_update_time_style, children: "update_time" },
  ];
  function title_row(index, request = true) {
    if (request) {
      return (
        <>
          <TableRow className={classes.table_row_style}>
            {data.map((item, index) => (
              <MyTableCell key={index} className={item.className}>
                {item.children}
              </MyTableCell>
            ))}
          </TableRow>
        </>
      );
    } else {
      return (
        <>
          <TableRow className={classes.table_row_style}>
            <TableCell key={index} className={classes.title_platform_style}>
              {"platform"}
            </TableCell>
            <TableCell key={index} className={classes.title_phase_style}>
              {"phase"}
            </TableCell>
            <TableCell key={index} className={classes.title_target_style}>
              {"target"}
            </TableCell>
            <TableCell key={index} className={classes.title_group_style}>
              {"group"}
            </TableCell>
            <TableCell key={index} className={classes.title_cycle_style}>
              {"cycle"}
            </TableCell>
            <TableCell key={index} className={classes.title_sku_style}>
              {"sku"}
            </TableCell>
            <TableCell key={index} className={classes.title_title_sn_style}>
              {"serial_number"}
            </TableCell>
            <TableCell key={index} className={classes.title_borrower_style}>
              {"borrower"}
            </TableCell>
            <TableCell key={index} className={classes.title_status_style}>
              {"status"}
            </TableCell>
            <TableCell key={index} className={classes.title_position_style}>
              {"position"}
            </TableCell>
            <TableCell key={index} className={classes.title_remark_style}>
              {"remark"}
            </TableCell>
            <TableCell key={index} className={classes.title_update_time_style}>
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
      return hasAzureAccess() ? (
        <>
          <TableRow className={classes.table_row_style}>
            <TableCell key={index} className={classes.checkbox_style}>
              <input
                type="checkbox"
                checked={select_iur_machine.includes(data)}
                onChange={() => handleCheckboxChange(data)}
              />
            </TableCell>
            <TableCell key={index} className={classes.platform_style}>
              {data.platform}
            </TableCell>
            <TableCell key={index} className={classes.phase_style}>
              {data.phase}
            </TableCell>
            <TableCell key={index} className={classes.target_style}>
              {data.target}
            </TableCell>
            <TableCell key={index} className={classes.group_style}>
              {data.group}
            </TableCell>
            <TableCell key={index} className={classes.cycle_style}>
              {data.cycle}
            </TableCell>
            <TableCell key={index} className={classes.sku_style}>
              {data.sku}
            </TableCell>
            <TableCell key={index} className={classes.sn_style}>
              <span
                onClick={() => {
                  window.open(`/machine_record/?sn=${data.sn}`);
                }}
                style={{ cursor: "pointer", color: "darkblue", fontWeight: "bold", opacity: 0.8 }}
              >
                {data.sn}
              </span>
            </TableCell>
            <TableCell key={index} className={classes.borrower_style}>
              {data.borrower}
            </TableCell>
            <TableCell key={index} className={classes.status_style}>
              {data.status}
            </TableCell>
            <TableCell key={index} className={classes.position_style}>
              {data.position}
            </TableCell>
            <TableCell key={index} className={classes.remark_style}>
              {data.remark}
            </TableCell>
            <TableCell key={index} className={classes.update_time_style}>
              {formatTimeForFrontend(data.update_time)}
            </TableCell>
          </TableRow>
        </>
      ) : (
        <>
          <TableRow className={classes.table_row_style}>
            <TableCell key={index} className={classes.platform_style}>
              {data.platform}
            </TableCell>
            <TableCell key={index} className={classes.phase_style}>
              {data.phase}
            </TableCell>
            <TableCell key={index} className={classes.target_style}>
              {data.target}
            </TableCell>
            <TableCell key={index} className={classes.group_style}>
              {data.group}
            </TableCell>
            <TableCell key={index} className={classes.cycle_style}>
              {data.cycle}
            </TableCell>
            <TableCell key={index} className={classes.sku_style}>
              {data.sku}
            </TableCell>
            <TableCell key={index} className={classes.sn_style}>
              <span
                onClick={() => {
                  window.open(`/machine_record/?sn=${data.sn}`);
                }}
                style={{ cursor: "pointer", color: "darkblue", fontWeight: "bold", opacity: 0.8 }}
              >
                {data.sn}
              </span>
            </TableCell>
            <TableCell key={index} className={classes.borrower_style}>
              {data.borrower}
            </TableCell>
            <TableCell key={index} className={classes.status_style}>
              {data.status}
            </TableCell>
            <TableCell key={index} className={classes.position_style}>
              {data.position}
            </TableCell>
            <TableCell key={index} className={classes.remark_style}>
              {data.remark}
            </TableCell>
            <TableCell key={index} className={classes.update_time_style}>
              {formatTimeForFrontend(data.update_time)}
            </TableCell>
          </TableRow>
        </>
      );
    } else {
      return (
        <>
          <TableRow className={classes.table_row_style}>
            <TableCell key={index} className={classes.platform_style}>
              {data.platform}
            </TableCell>
            <TableCell key={index} className={classes.phase_style}>
              {data.phase}
            </TableCell>
            <TableCell key={index} className={classes.target_style}>
              {data.target}
            </TableCell>
            <TableCell key={index} className={classes.group_style}>
              {data.group}
            </TableCell>
            <TableCell key={index} className={classes.cycle_style}>
              {data.cycle}
            </TableCell>
            <TableCell key={index} className={classes.sku_style}>
              {data.sku}
            </TableCell>
            <TableCell key={index} className={classes.sn_style}>
              {data.sn}
            </TableCell>
            <TableCell key={index} className={classes.borrower_style}>
              {data.borrower}
            </TableCell>
            <TableCell key={index} className={classes.status_style}>
              {data.status}
            </TableCell>
            <TableCell key={index} className={classes.position_style}>
              {data.position}
            </TableCell>
            <TableCell key={index} className={classes.remark_style}>
              {data.remark}
            </TableCell>
            <TableCell key={index} className={classes.update_time_style}>
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
  const containerStyle = {
    display: "flex",
  };
  useEffect(() => {}, [machine_data]);
  const get_machine_status_report = async () => {
    setLoading(true);
    set_select_iur_machine([]);
    let response = await IURAPI.filtersearch({
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
    });
    if (response.data) {
      console.log(response.data);
      set_machine_data(response.data.finaldata);
    } else if (response.data.error) {
      alert(response.data.error);
    }
    setLoading(false);
  };

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
    const option_data = async () => {
      const requestData = {
        target: selectoption.target.map((option) => option.title),
        group: selectoption.group.map((option) => option.title),
        cycle: selectoption.cycle.map((option) => option.title),
        platform: selectoption.platform.map((option) => option.title),
        phase: selectoption.phase.map((option) => option.title),
        status: selectoption.status.map((option) => option.title),
      };
      if (button_name) {
        requestData[button_name] = [];
      }
      console.log(requestData);
      let response = await IURAPI.filter_option(requestData);
      if (response.data.finaldata) {
        for (let key in response.data.finaldata) {
          setoption_list((prevOptionList) => ({
            ...prevOptionList,
            [key]: response.data.finaldata[key],
          }));
        }
        console.log(response.data.finaldata);
      }
    };
    option_data();
  }, [selectoption, machine_data, button_name]);

  function pop_filter_content() {
    return (
      <>
        <div style={containerStyle}>
          <div className={classes.leftBlockStyle}>
            <div className={classes.line_form_style}>
              <Filter
                options={option_list.platform}
                selectedOptions={selectoption.platform}
                setSelectedOptions={(newOptions) =>
                  setselectoption({ ...selectoption, platform: newOptions })
                }
                buttonText="Platform"
                setButtonName={set_button_name}
              />
            </div>
            <div className={classes.line_form_style}>
              <Filter
                options={option_list.phase}
                selectedOptions={selectoption.phase}
                setSelectedOptions={(newOptions) =>
                  setselectoption({ ...selectoption, phase: newOptions })
                }
                buttonText="Phase"
                setButtonName={set_button_name}
              />
            </div>
            <div className={classes.line_form_style}>
              <Filter
                options={option_list.cycle}
                selectedOptions={selectoption.cycle}
                setSelectedOptions={(newOptions) =>
                  setselectoption({ ...selectoption, cycle: newOptions })
                }
                buttonText="Cycle"
                setButtonName={set_button_name}
              />
            </div>
            <div className={classes.line_form_style}>
              <Filter
                options={option_list.target}
                selectedOptions={selectoption.target}
                setSelectedOptions={(newOptions) =>
                  setselectoption({ ...selectoption, target: newOptions })
                }
                buttonText="Target"
                setButtonName={set_button_name}
              />
            </div>
            <div className={classes.line_form_style}>
              <Filter
                options={option_list.group}
                selectedOptions={selectoption.group}
                setSelectedOptions={(newOptions) =>
                  setselectoption({ ...selectoption, group: newOptions })
                }
                buttonText="Group"
                setButtonName={set_button_name}
              />
            </div>
            <div className={classes.line_form_style}>
              <Filter
                options={option_list.status}
                selectedOptions={selectoption.status}
                setSelectedOptions={(newOptions) =>
                  setselectoption({ ...selectoption, status: newOptions })
                }
                buttonText="Status"
                setButtonName={set_button_name}
              />
            </div>
            <div className={classes.line_form_style}>
              <DateTimePicker
                startDatetime={startDate}
                endDatetime={endDate}
                setStartDatetime={setStartDate}
                setEndDatetime={setEndDate}
              />
            </div>
            <Inputbox inputList={inputList} setInputList={setInputList} />
          </div>
          <div className={classes.rightBlockStyle}>
            <p>platform</p>
            <div className={classes.line_form_style}>
              <div className={classes.filter_display}>
                <Filterbutton
                  options={Object.values(selectoption.platform).map((option) => option.title)}
                  onClick={(newOptions) =>
                    setselectoption({
                      ...selectoption,
                      platform: selectoption.platform.filter((option) =>
                        newOptions.includes(option.title)
                      ),
                    })
                  }
                />
              </div>
            </div>
            <p>phase</p>
            <div className={classes.line_form_style}>
              <div className={classes.filter_display}>
                <Filterbutton
                  options={Object.values(selectoption.phase).map((option) => option.title)}
                  onClick={(newOptions) =>
                    setselectoption({
                      ...selectoption,
                      phase: selectoption.phase.filter((option) =>
                        newOptions.includes(option.title)
                      ),
                    })
                  }
                />
              </div>
            </div>
            <p>cycle</p>
            <div className={classes.line_form_style}>
              <div className={classes.filter_display}>
                <Filterbutton
                  options={Object.values(selectoption.cycle).map((option) => option.title)}
                  onClick={(newOptions) =>
                    setselectoption({
                      ...selectoption,
                      cycle: selectoption.cycle.filter((option) =>
                        newOptions.includes(option.title)
                      ),
                    })
                  }
                />
              </div>
            </div>
            <p>target</p>
            <div className={classes.line_form_style}>
              <div className={classes.filter_display}>
                <Filterbutton
                  options={Object.values(selectoption.target).map((option) => option.title)}
                  onClick={(newOptions) =>
                    setselectoption({
                      ...selectoption,
                      target: selectoption.target.filter((option) =>
                        newOptions.includes(option.title)
                      ),
                    })
                  }
                />
              </div>
            </div>
            <p>group</p>
            <div className={classes.line_form_style}>
              <div className={classes.filter_display}>
                <Filterbutton
                  options={Object.values(selectoption.group).map((option) => option.title)}
                  onClick={(newOptions) =>
                    setselectoption({
                      ...selectoption,
                      group: selectoption.group.filter((option) =>
                        newOptions.includes(option.title)
                      ),
                    })
                  }
                />
              </div>
            </div>
            <p>status</p>
            <div className={classes.line_form_style}>
              <div className={classes.filter_display}>
                <Filterbutton
                  options={Object.values(selectoption.status).map((option) => option.title)}
                  onClick={(newOptions) =>
                    setselectoption({
                      ...selectoption,
                      status: selectoption.status.filter((option) =>
                        newOptions.includes(option.title)
                      ),
                    })
                  }
                />
              </div>
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
    if (options == 5 || options == 6) {
      machine_length("Keep On");
    }
    if (options == 3 || options == 4) {
      props.iur_option(options);
      setOptions(0);
    }
  }, [options]);
  function lend_content() {
    return (
      <>
        <div style={{ flexDirection: "column", ...containerStyle }}>
          <div className={classes.line_form_style}>
            <Loading_option
              api="polls/lendpersonnel"
              name="user_mail"
              selectedOptions={lendData.lendperson}
              setSelectedOptions={(newOptions) =>
                setlendData({ ...lendData, lendperson: newOptions })
              }
            />
          </div>
          <div className={classes.line_form_style}>
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
          <div className={classes.line_form_style}>
            <label htmlFor="Purpose">Purpose:</label>
          </div>
          <div className={classes.line_form_style}>
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
          <div className={classes.line_form_style}>
            <label htmlFor="cc_mail">cc mail:</label>
          </div>
          <div className={classes.line_form_style}>
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
          <div className={classes.line_form_style}>
            <label htmlFor="message">mail message:</label>
          </div>
          <div className={classes.line_form_style}>
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

  function add_member_content() {
    const member_data = [
      { style: classes.username_style, children: "user name" },
      { style: classes.site_style, children: "site" },
      { style: classes.email_style, children: "mail" },
    ];
    const options = ["TW", "CN"];
    return (
      <>
        <div style={{ flexDirection: "column", ...containerStyle }}>
          <TableContainer>
            <Table row_style={classes.table_row_style} data={member_data}></Table>
            <TableRow className={classes.table_row_style}>
              <TableCell
                className={classes.username_style}
                onClick={() => handleDoubleClick(1, "username")}
              >
                {isEditing[`${1}_username`] ? (
                  <input
                    ref={inputRef}
                    type="text"
                    value={memberData.username}
                    style={{ width: "120px", height: "30px" }}
                    onChange={(e) => {
                      setmemberData((prevData) => ({
                        ...prevData,
                        username: e.target.value,
                      }));
                    }}
                    onBlur={() => handleBlur(1, "username")}
                    onKeyDown={(e) => handleKeyDown(e, 1, "username")}
                  />
                ) : (
                  memberData.username
                )}
              </TableCell>
              <TableCell className={classes.username_style}>
                <select
                  value={memberData.site}
                  onChange={(e) => {
                    setmemberData((prevData) => ({
                      ...prevData,
                      site: e.target.value,
                    }));
                  }}
                  style={{ padding: "5px 1px", marginRight: "10px" }}
                >
                  {options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </TableCell>

              <TableCell
                className={classes.email_style}
                onClick={() => handleDoubleClick(1, "email")}
              >
                {isEditing[`${1}_email`] ? (
                  <input
                    ref={inputRef}
                    type="text"
                    value={memberData.email}
                    style={{ width: "220px", height: "30px" }}
                    onChange={(e) => {
                      setmemberData((prevData) => ({
                        ...prevData,
                        email: e.target.value,
                      }));
                    }}
                    onBlur={() => handleBlur(1, "email")}
                    onKeyDown={(e) => handleKeyDown(e, 1, "email")}
                  />
                ) : (
                  memberData.email
                )}
              </TableCell>
            </TableRow>
          </TableContainer>
        </div>
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

  const clearmodel = () => {
    setselectoption({
      target: [],
      group: [],
      cycle: [],
      platform: [],
      phase: [],
      status: [],
    });
    setInputList([""]);
  };
  const widthsearth_function = async () => {
    let response = await IURAPI.widthsearch({
      keyword: [widthsearch],
    });
    if (response.data.finaldata) {
      console.log(response.data);
      set_machine_data(response.data.finaldata);
    } else if (response.data.error) {
      alert(response.data.error);
    }
    set_select_iur_machine([]);
  };
  const filtersearch = async () => {
    let response = await IURAPI.filtersearch({
      start_time: startDate,
      end_time: endDate,
      target: Object.values(selectoption.target).map((option) => option.title),
      group: Object.values(selectoption.group).map((option) => option.title),
      cycle: Object.values(selectoption.cycle).map((option) => option.title),
      platform: Object.values(selectoption.platform).map((option) => option.title),
      SN: inputList,
      phase: Object.values(selectoption.phase).map((option) => option.title),
      status: Object.values(selectoption.status).map((option) => option.title),
    });
    if (response.data.finaldata) {
      console.log(response.data);
      set_machine_data(response.data.finaldata);
      set_select_iur_machine([]);
      closeModal(1);
    } else if (response.data.error) {
      alert(response.data.error);
    }
  };
  const lend = async () => {
    setLoading(true);
    try {
      const cc_mail_list = lendData.cc_mail.filter(Boolean).map((item) => item.value);
      const response = await IURAPI.lend({
        finaldata: select_iur_machine,
        lendperson: lendData.lendperson == null ? "" : lendData.lendperson.value,
        purpose: lendData.purpose,
        cc_mail: cc_mail_list,
        message: lendData.message,
      });
      if (response.data.finaldata) {
        console.log(response.data.finaldata);
        alert("Successfully borrowed.");
        closeModal(2);
        window.location.reload();
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
  const add_member = async () => {
    setLoading(true);
    try {
      const response = await IURAPI.add_member({
        finaldata: [memberData],
      });
      if (response.data.finaldata) {
        alert(response.data.finaldata);
        closeModal(3);
        window.location.reload();
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
  const downloadFile = (fileData, fileName) => {
    const blob = new Blob([fileData], { type: "application/octet-stream" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };
  const excel_export_function = async () => {
    setLoading(true);
    let request_data = new FormData();
    request_data.append("data", JSON.stringify(machine_data));
    console.log(request_data);
    let response = await IURAPI.excel_export(request_data);
    downloadFile(response.data, "iur.xlsx");
    alert("successful download");
    setLoading(false);
  };
  const Row = ({ index, style }) => (
    <TableRow style={style}>{data_row(index, machine_data[index])}</TableRow>
  );
  Row.propTypes = {
    index: PropTypes.number.isRequired,
    style: PropTypes.object.isRequired,
  };
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", marginLeft: "20px" }}>
        <Loading loading={loading} />
        <div style={{ display: "flex", overflowY: "auto" }}>
          <Modal
            isOpen={popFilters[1]}
            onRequestClose={() => closeModal(1)}
            style={customStyles}
            // style={classes.customStyles}
            contentLabel="filter"
          >
            <h2>Filter</h2>
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
        <div style={{ display: "flex", overflowY: "auto" }}>
          <Modal
            isOpen={popFilters[3]}
            onRequestClose={() => closeModal(3)}
            style={customStyles}
            contentLabel="add member"
          >
            <h2>Add member</h2>
            {add_member_content()}
            <Button onClick={add_member}>Add</Button>
            <Button onClick={() => closeModal(3)}>Close</Button>
          </Modal>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", flexDirection: "row", marginBottom: "20px" }}>
            <Button onClick={() => openModal(1)}>Filter</Button>
            {hasAzureAccess() && (
              <div style={{ marginLeft: "auto", marginRight: "10px" }}>
                <Button onClick={() => openModal(3)}>Add member</Button>
              </div>
            )}
            <Button onClick={excel_export_function}>Excel export</Button>
          </div>
          <div style={{ display: "flex", flexDirection: "row", marginBottom: "20px" }}>
            <input
              type="text"
              value={widthsearch}
              onChange={(event) => setWidthsearch(event.target.value)}
              placeholder=" SN / platform / borrower "
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  widthsearth_function();
                }
              }}
              style={{ marginLeft: "10px" }}
            />
            <button className="search-button" onClick={widthsearth_function}>
              <FontAwesomeIcon icon={faSearch} />
            </button>
            {hasAzureAccess() && (
              <select
                value={option}
                onChange={(event) => {
                  setOption(event.target.value);
                  setOptions(event.target.value);
                }}
                style={{ padding: "5px 25px", marginLeft: "20px", marginRight: "10px" }}
              >
                <option value="">-</option>
                <option value="1">Borrow</option>
                <option value="2">Return</option>
                <option value="3">New Machine In</option>
                <option value="4">Batch Modify</option>
                <option value="5">Batch Delete</option>
                <option value="6">Batch Scrap</option>
              </select>
            )}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <p
              style={{
                marginLeft: "12px",
                fontFamily: "Calibri, sans-serif",
              }}
            >
              Machine amount: {machine_data.length} &nbsp;&nbsp;&nbsp;
              {hasAzureAccess() && <>Select amount: {select_iur_machine.length}</>}
            </p>
            <div style={{ marginRight: "30px", position: "absolute", right: "0" }}>
              {hasAzureAccess() && (
                <button
                  style={{ marginLeft: "40px" }}
                  className={classes.add_new_machine}
                  onClick={() => {
                    history.push("/new_machine/");
                  }}
                >
                  <AddIcon className={classes.icon} />
                  Add new machine
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <TableContainer>
        <div style={{}}>
          <Tablehead>{title_row("1")}</Tablehead>
        </div>
        <div style={{ display: "flex", overflowY: "auto", width: "100%", marginLeft: "15px" }}>
          <FixedSizeList height={600} itemCount={machine_data.length} itemSize={70} width={"100%"}>
            {Row}
          </FixedSizeList>
        </div>
      </TableContainer>
    </>
  );
}
DropdownWithButton.propTypes = {
  iur: PropTypes.func.isRequired,
  iur_option: PropTypes.func.isRequired,
};
export default DropdownWithButton;
