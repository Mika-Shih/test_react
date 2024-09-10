import React, { useState, useEffect } from "react";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import DateTimePicker from "examples/tool_universal/calendar_delay";
import Inputbox from "examples/tool_universal/inputbox";
import { FixedSizeList } from "react-window";
import Button from "examples/Icons/Button";
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
import AddIcon from "@mui/icons-material/Add";
import DownloadIcon from "@mui/icons-material/Download";
import { Dialog, Box } from "@mui/material";
// import SuiBox from "components/SuiBox";
function DropdownWithButton(props) {
  const classes = useStyles();
  const { user } = useAuth();
  const history = useHistory();
  const [option, setOption] = useState();
  const [options, setOptions] = useState(0);
  const [button_name, set_button_name] = useState("");
  const [select_iur_machine, set_select_iur_machine] = useState([]);
  const [shiftKeyPressed, setShiftKeyPressed] = useState(false);
  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === "Shift") {
        setShiftKeyPressed(event.type === "keydown");
      }
    };
    window.addEventListener("keydown", handleKey);
    window.addEventListener("keyup", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("keyup", handleKey);
    };
  }, []);
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
      ? [
          {
            index: "1",
            className: classes.title_checkbox_style,
            children: (
              <input
                type="checkbox"
                checked={select_iur_machine.length === machine_data.length}
                onChange={() => select_all_checkbox()}
              />
            ),
          },
        ]
      : []),
    { index: "1", className: classes.title_platform_style, children: "Platform" },
    { index: "1", className: classes.title_phase_style, children: "Phase" },
    { index: "1", className: classes.title_target_style, children: "Target" },
    { index: "1", className: classes.title_group_style, children: "Group" },
    { index: "1", className: classes.title_cycle_style, children: "Cycle" },
    { index: "1", className: classes.title_sku_style, children: "Sku" },
    { index: "1", className: classes.title_sn_style, children: "Serial Number" },
    { index: "1", className: classes.title_borrower_style, children: "Borrower" },
    { index: "1", className: classes.title_status_style, children: "Status" },
    { index: "1", className: classes.title_position_style, children: "Position" },
    { index: "1", className: classes.title_remark_style, children: "Remark" },
    { index: "1", className: classes.title_update_time_style, children: "Update Time" },
  ];
  function title_row(index, request = true) {
    if (request) {
      return (
        <>
          <TableRow className={classes.title_table_row_style}>
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
          <TableRow className={classes.title_table_row_style}>
            <TableCell key={index} className={classes.title_platform_style}>
              {"Platform"}
            </TableCell>
            <TableCell key={index} className={classes.title_phase_style}>
              {"Phase"}
            </TableCell>
            <TableCell key={index} className={classes.title_target_style}>
              {"Target"}
            </TableCell>
            <TableCell key={index} className={classes.title_group_style}>
              {"Group"}
            </TableCell>
            <TableCell key={index} className={classes.title_cycle_style}>
              {"Cycle"}
            </TableCell>
            <TableCell key={index} className={classes.title_sku_style}>
              {"Sku"}
            </TableCell>
            <TableCell key={index} className={classes.title_sn_style}>
              {"Serial Number"}
            </TableCell>
            <TableCell key={index} className={classes.title_borrower_style}>
              {"Borrower"}
            </TableCell>
            <TableCell key={index} className={classes.title_status_style}>
              {"Status"}
            </TableCell>
            <TableCell key={index} className={classes.title_position_style}>
              {"Position"}
            </TableCell>
            <TableCell key={index} className={classes.title_remark_style}>
              {"Remark"}
            </TableCell>
            <TableCell key={index} className={classes.title_update_time_style}>
              {"Update Time"}
            </TableCell>
          </TableRow>
        </>
      );
    }
  }
  const handleCheckboxChange = (data) => {
    console.log(data);
    const updatedSelect_iur_machine = [...select_iur_machine];
    if (updatedSelect_iur_machine.includes(data)) {
      updatedSelect_iur_machine.splice(updatedSelect_iur_machine.indexOf(data), 1);
    } else {
      if (shiftKeyPressed && updatedSelect_iur_machine.length > 0) {
        const last_index = machine_data.findIndex(
          (item) => item === updatedSelect_iur_machine[updatedSelect_iur_machine.length - 1]
        );
        const new_index = machine_data.findIndex((item) => item === data);
        const start = Math.min(new_index, last_index);
        const end = Math.max(new_index, last_index);
        const newData = machine_data
          .slice(start, end + 1)
          .filter((item) => !updatedSelect_iur_machine.some((existing) => existing === item));
        updatedSelect_iur_machine.push(...newData);
      } else {
        updatedSelect_iur_machine.push(data);
      }
    }
    set_select_iur_machine(updatedSelect_iur_machine);
  };
  useEffect(() => {
    console.log(select_iur_machine);
    [select_iur_machine];
  });
  const select_all_checkbox = () => {
    if (select_iur_machine.length === machine_data.length) {
      set_select_iur_machine([]);
    } else {
      set_select_iur_machine([]);
      set_select_iur_machine(machine_data);
    }
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
    // const months = [
    //   "January",
    //   "February",
    //   "March",
    //   "April",
    //   "May",
    //   "June",
    //   "July",
    //   "August",
    //   "September",
    //   "October",
    //   "November",
    //   "December",
    // ];
    // const month = months[date.getMonth()];
    const date = new Date(inputTime);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();

    const formattedTime = date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    return `${month}/${day}, ${year}, ${formattedTime}`;
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
            <div className={classes.sn_scroll_container}>
              <Inputbox inputList={inputList} setInputList={setInputList} />
            </div>
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
    if (options == 2 || options == 7) {
      machine_length("Rent");
    }
    if (options == 5 || options == 6) {
      machine_length("Keep On");
    }
    if (options == 3 || options == 4) {
      if (select_iur_machine.length > 0) {
        props.iur_option(options);
      } else {
        alert("Please select the machine.");
      }
      setOptions(0);
    }
    setOption("");
  }, [options]);
  function lend_content() {
    return (
      <>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div className={classes.line_form_style}>
            <label htmlFor="lendperson">Borrower&nbsp;:&nbsp;&nbsp;</label>
            <Loading_option
              api="polls/lendpersonnel"
              name="user_mail"
              selectedOptions={lendData.lendperson}
              setSelectedOptions={(newOptions) =>
                setlendData({ ...lendData, lendperson: newOptions })
              }
            />
          </div>
          {title_row("1", false)}
          {select_iur_machine.map((data, index) => data_row(index, data, false))}
          <label htmlFor="Purpose">Purpose:</label>
          <input
            id="Purpose"
            name="Purpose"
            style={{ width: "480px", padding: "8px" }}
            value={lendData.purpose}
            onChange={(e) => {
              setlendData({
                ...lendData,
                purpose: e.target.value,
              });
            }}
          />
          <label htmlFor="message">Mail Message:</label>
          <textarea
            id="message"
            name="message"
            rows={8}
            style={{ width: "480px", padding: "8px" }}
            value={lendData.message}
            onChange={(e) => {
              setlendData({
                ...lendData,
                message: e.target.value,
              });
            }}
          />
          <label htmlFor="cc_mail">CC Mail:</label>
          <Loading_option_add_remove
            api="polls/lendpersonnel"
            name="user_mail"
            selectedOptions={lendData.cc_mail}
            setSelectedOptions={(newOptions) => setlendData({ ...lendData, cc_mail: newOptions })}
          />
          <div className={classes.line_form_style}>
            <Button onClick={lend}>Borrow</Button>
            <Button onClick={() => closeModal(2)}>Close</Button>
          </div>
        </div>
      </>
    );
  }
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
    setLoading(true);
    try {
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
    } catch (error) {
      console.log(error);
      alert("Please contact the administrator.");
    } finally {
      setLoading(false);
    }
  };
  const filtersearch = async () => {
    setLoading(true);
    try {
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
    } catch (error) {
      console.log(error);
      alert("Please contact the administrator.");
    } finally {
      setLoading(false);
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
          <Dialog open={popFilters[1]} onClose={() => closeModal(1)} fullWidth maxWidth="lg">
            <Box sx={{ padding: "30px" }}>
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
            </Box>
          </Dialog>
        </div>
        <div style={{ display: "flex", overflowY: "auto" }}>
          <Dialog open={popFilters[2]} onClose={() => closeModal(2)} fullWidth maxWidth={false}>
            <Box sx={{ padding: "30px" }}>{lend_content()}</Box>
          </Dialog>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div className={classes.title_bottom}>
            <Button onClick={() => openModal(1)}>Filter</Button>
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
              className={classes.width_search}
            />
            <button className="search-button" onClick={widthsearth_function}></button>
            {hasAzureAccess() && (
              <select
                value={option}
                onChange={(event) => {
                  setOption(event.target.value);
                  setOptions(event.target.value);
                }}
                className={classes.select}
              >
                <option value="">Selected Action</option>
                <option value="1">Borrow</option>
                <option value="2">Return</option>
                <option value="3">New Machine In</option>
                <option value="4">Batch Modify</option>
                <option value="5">Batch Delete</option>
                <option value="6">Batch Scrap</option>
                <option value="7">Transfer New Owner</option>
              </select>
            )}
            <div className={classes.title_right}>
              <p
                style={{
                  marginRight: "12px",
                  fontFamily: "Calibri, sans-serif",
                  fontSize: "18px",
                }}
              >
                {hasAzureAccess() && <>Selected Unit : {select_iur_machine.length}</>}
              </p>
              <button className={classes.add_new_machine} onClick={excel_export_function}>
                Excel Export
                <DownloadIcon className={classes.downloadicon} />
              </button>
              {hasAzureAccess() && (
                <button
                  style={{ marginLeft: "10px" }}
                  className={classes.add_new_machine}
                  onClick={() => {
                    history.push("/new_machine/");
                  }}
                >
                  <AddIcon className={classes.addicon} />
                  Add New Machine
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <TableContainer>
        <div style={{ marginLeft: "15px" }}>{title_row("1")}</div>
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
