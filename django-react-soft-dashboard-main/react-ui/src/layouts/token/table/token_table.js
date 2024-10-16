import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Tablebody from "@mui/material/TableBody";
import DateTimePicker from "examples/tool_universal/calendar_delay";
import Filter from "examples/tool_universal/filter_function";
import Inputbox from "examples/tool_universal/inputbox";
import Button from "examples/Icons/Button";
import Loading from "examples/tool_universal/loading";
import PropTypes from "prop-types";
import USERAPI from "api/user";
import useStyles from "./styles/account";
import { useHistory } from "react-router-dom";
function DropdownWithButton() {
  const classes = useStyles();
  const history = useHistory();
  const [select_token, select_setToken] = useState([]);
  const [token, setToken] = useState([]);
  const [popdata, setPopdata] = useState([]);
  const backendServer = process.env.REACT_APP_BACKEND_SERVER;
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [machine_data, set_machine_data] = useState([]);
  const [loading, setLoading] = useState(false);
  const [popFilters, setPopFilters] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
  });
  useEffect(() => {
    get_machine_status_report();
  }, []);
  const [formData, setFormData] = useState({
    target: [],
    group: [],
    cycle: [],
    platform: [],
    phase: [],
    status: [],
  });
  const [lendData] = useState({
    lendperson: null,
    purpose: "",
    message: "",
    cc_mail: [],
  });
  const [inputList, setInputList] = useState([""]);
  function getCellStyle(width) {
    return {
      minWidth: `${width}px`,
      maxWidth: `${width}px`,
      textAlign: "center",
      // border: "1px solid #ddd",
      fontSize: "12px",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    };
  }
  const checkbox_style = getCellStyle(10);
  const email_style = getCellStyle(200);
  const appid_style = getCellStyle(200);
  const secret_style = getCellStyle(200);
  const approve_style = getCellStyle(300);
  const signin_url__style = getCellStyle(300);
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
            <TableCell key={index} style={email_style}>
              {"email"}
            </TableCell>
            <TableCell key={index} style={appid_style}>
              {"appid"}
            </TableCell>
            <TableCell key={index} style={secret_style}>
              {"secret"}
            </TableCell>
            <TableCell key={index} style={approve_style}>
              {"approve"}
            </TableCell>
            <TableCell key={index} style={signin_url__style}>
              {"signin"}
            </TableCell>
          </TableRow>
        </>
      );
    } else {
      return (
        <>
          <TableRow style={table_row_style}>
            <TableCell key={index} style={email_style}>
              {"email"}
            </TableCell>
            <TableCell key={index} style={appid_style}>
              {"appid"}
            </TableCell>
            <TableCell key={index} style={secret_style}>
              {"secret"}
            </TableCell>
            <TableCell key={index} style={approve_style}>
              {"approve"}
            </TableCell>
            <TableCell key={index} style={signin_url__style}>
              {"signin"}
            </TableCell>
          </TableRow>
        </>
      );
    }
  }
  const get_machine_status_report = async () => {
    setLoading(true);
    select_setToken([]);
    try {
      let response = await USERAPI.view_token();
      if (response.data) {
        console.log(response.data);
        set_machine_data(response.data.finaldata);
      } else if (response.data.error) {
        alert(response.data.error);
      }
    } catch (error) {
      console.log(error);
      alert("Please contact the administrator.");
    } finally {
      setLoading(false);
    }
    let response = await USERAPI.view_token();
    if (response.data) {
      console.log(response.data);
      setToken(response.data.finaldata);
    } else if (response.data.error) {
      alert(response.data.error);
    }
  };
  const handleCheckboxChange = (data) => {
    const updatedselect_token = [...select_token];
    if (updatedselect_token.includes(data)) {
      updatedselect_token.splice(updatedselect_token.indexOf(data), 1);
    } else {
      updatedselect_token.push(data);
    }
    select_setToken(updatedselect_token);
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
                checked={select_token.includes(data)}
                onChange={() => handleCheckboxChange(data)}
              />
            </TableCell>
            <TableCell key={index} style={email_style}>
              <p style={{ cursor: "pointer" }} onClick={() => openModal(2, data.email)}>
                {data.email}
              </p>
            </TableCell>
            <TableCell key={index} style={appid_style}>
              <p style={{ cursor: "pointer" }} onClick={() => openModal(2, data.appid)}>
                {data.appid}
              </p>
            </TableCell>
            <TableCell key={index} style={secret_style}>
              <p style={{ cursor: "pointer" }} onClick={() => openModal(2, data.secret)}>
                {data.secret}
              </p>
            </TableCell>
            <TableCell key={index} style={approve_style}>
              <p style={{ cursor: "pointer" }} onClick={() => openModal(2, data.approve)}>
                {data.approve}
              </p>
            </TableCell>
            <TableCell key={index} style={signin_url__style}>
              <p style={{ cursor: "pointer" }} onClick={() => openModal(2, data.signin_url)}>
                {data.signin_url}
              </p>
            </TableCell>
          </TableRow>
        </>
      );
    } else {
      return (
        <>
          <TableRow style={table_row_style}>
            <TableCell key={index} style={email_style}>
              <p style={{ cursor: "pointer" }} onClick={() => openModal(2, data.email)}>
                {data.email}
              </p>
            </TableCell>
            <TableCell key={index} style={appid_style}>
              <p style={{ cursor: "pointer" }} onClick={() => openModal(2, data.appid)}>
                {data.appid}
              </p>
            </TableCell>
            <TableCell key={index} style={secret_style}>
              <p style={{ cursor: "pointer" }} onClick={() => openModal(2, data.secret)}>
                {data.secret}
              </p>
            </TableCell>
            <TableCell key={index} style={approve_style}>
              <p style={{ cursor: "pointer" }} onClick={() => openModal(2, data.approve)}>
                {data.approve}
              </p>
            </TableCell>
            <TableCell key={index} style={signin_url__style}>
              <p style={{ cursor: "pointer" }} onClick={() => openModal(2, data.signin_url)}>
                {data.signin_url}
              </p>
            </TableCell>
          </TableRow>
        </>
      );
    }
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
  const test = () => {
    setInputList([""]);
    console.log(inputList);
    console.log(select_token);
  };
  useEffect(() => {}, [machine_data]);

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

  function account_change_content() {
    return (
      <>
        <div className={classes.containerStyle}>
          <div className={classes.leftBlockStyle}>
            <div className={classes.inputContainer}>
              {/* <TextField type="password" placeholder="New Password" className={classes.textField} /> */}
            </div>
            <div className={classes.inputContainer}>
              {/* <TextField
                type="password"
                placeholder="Confirm New Password"
                className={classes.textField}
              /> */}
            </div>
          </div>
          <div style={rightBlockStyle}>
            <div style={line_form_style}>
              {formData.target.map((option, index) => (
                <div key={index} style={borderedOptionStyle}>
                  {option}
                </div>
              ))}
            </div>
            <div style={line_form_style}>
              {formData.group.map((option, index) => (
                <div key={index} style={borderedOptionStyle}>
                  {option}
                </div>
              ))}
            </div>
            <div style={line_form_style}>
              {formData.cycle.map((option, index) => (
                <div key={index} style={borderedOptionStyle}>
                  {option}
                </div>
              ))}
            </div>
            <div style={line_form_style}>
              {formData.platform.map((option, index) => (
                <div key={index} style={borderedOptionStyle}>
                  {option}
                </div>
              ))}
            </div>
            <div style={line_form_style}>
              {formData.phase.map((option, index) => (
                <div key={index} style={borderedOptionStyle}>
                  {option}
                </div>
              ))}
            </div>
            <div style={line_form_style}>
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
  function pop_filter_content() {
    return (
      <>
        <div style={containerStyle}>
          <div style={leftBlockStyle}>
            <div style={line_form_style}>
              <Button onClick={test}>get</Button>
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
              {formData.target.map((option, index) => (
                <div key={index} style={borderedOptionStyle}>
                  {option}
                </div>
              ))}
            </div>
            <div style={line_form_style}>
              {formData.group.map((option, index) => (
                <div key={index} style={borderedOptionStyle}>
                  {option}
                </div>
              ))}
            </div>
            <div style={line_form_style}>
              {formData.cycle.map((option, index) => (
                <div key={index} style={borderedOptionStyle}>
                  {option}
                </div>
              ))}
            </div>
            <div style={line_form_style}>
              {formData.platform.map((option, index) => (
                <div key={index} style={borderedOptionStyle}>
                  {option}
                </div>
              ))}
            </div>
            <div style={line_form_style}>
              {formData.phase.map((option, index) => (
                <div key={index} style={borderedOptionStyle}>
                  {option}
                </div>
              ))}
            </div>
            <div style={line_form_style}>
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

  function token_content(data) {
    return (
      <>
        <div style={{ flexDirection: "column", ...containerStyle }}>
          <div style={line_form_style}>
            <p>{data}</p>
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
  const filtersearch = () => {
    const request_data = {
      target: formData.target,
      group: formData.group,
      cycle: formData.cycle,
      platform: formData.platform,
      SN: inputList,
      phase: formData.phase,
      status: formData.status,
    };
    axios
      .post(`${backendServer}polls/api/filtersearch/`, request_data, { timeout: 10000 })
      .then((response) => {
        if (response.data.finaldata) {
          console.log(response.data);
          //window.location.replace(`${frontendServer}pulsar/`);
          set_machine_data(response.data.finaldata);
        } else if (response.data.error) {
          alert(response.data.error);
        }
      });
    select_setToken([]);
    closeModal(1);
  };
  const lend = () => {
    setLoading(true);
    const cc_mail_list = lendData.cc_mail.filter(Boolean).map((item) => item.value);
    const request_data = {
      finaldata: select_token,
      lendperson: lendData.lendperson == null ? "" : lendData.lendperson.value,
      purpose: lendData.purpose,
      cc_mail: cc_mail_list,
      message: lendData.message,
    };
    console.log(request_data);
    axios
      .post(`${backendServer}polls/lendplatform/`, request_data, { timeout: 10000 })
      .then((response) => {
        if (response.data.finaldata) {
          console.log(response.data.finaldata);
          alert("借出成功");
          closeModal(2);
          window.location.reload();
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
          <h2>Change Password</h2>
          {account_change_content()}
          <Button style={{ margin: "10px", padding: "10px" }} onClick={filtersearch}>
            應用篩選
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
          isOpen={popFilters[3]}
          onRequestClose={() => closeModal(3)}
          style={customStyles}
          contentLabel="filter"
        >
          <h2>filter</h2>
          <p>設置內容</p>
          {pop_filter_content()}
          <Button style={{ margin: "10px", padding: "10px" }} onClick={filtersearch}>
            應用篩選
          </Button>
          <Button style={{ margin: "10px", padding: "10px" }} onClick={clearmodel}>
            清除
          </Button>
          <Button style={{ margin: "10px", padding: "10px" }} onClick={() => closeModal(3)}>
            關閉
          </Button>
        </Modal>
      </div>
      <div style={{ display: "flex", overflowY: "auto" }}>
        <Modal
          isOpen={popFilters[2]}
          onRequestClose={() => closeModal(2)}
          style={customStyles}
          contentLabel="token"
        >
          <h2>Token</h2>
          {token_content(popdata)}
          <Button onClick={lend}>借出</Button>
          <Button onClick={() => closeModal(2)}>關閉</Button>
        </Modal>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", flexDirection: "row", marginBottom: "20px" }}>
          <Button
            onClick={() => {
              history.push("/account/change_password");
            }}
          >
            Change Password
          </Button>
        </div>
        <TableContainer>
          <div style={{}}>
            <Tablebody>{title_row("1")}</Tablebody>
            <Tablebody>{token.map((data, index) => data_row(index, data))}</Tablebody>
          </div>
        </TableContainer>
      </div>
    </div>
  );
}

export default DropdownWithButton;
