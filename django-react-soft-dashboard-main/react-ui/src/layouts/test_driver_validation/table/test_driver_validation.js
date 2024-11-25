import React, { useState, useEffect } from "react";
import { Dialog, Box } from "@mui/material";
import { TableRow, TableCell, TableContainer } from "@mui/material";
import Button from "examples/Icons/Button";
import Loading_option from "examples/tool_universal/loading_option";
import Loading_option_add_remove from "examples/tool_universal/loading_option_add_remove";
// import Loading from "examples/tool_universal/loading";
// import SuiButton from "components/SuiButton";
// import SuiBox from "components/SuiBox";
// import Icon from "@mui/material/Icon";
// import { LocalizationProvider } from "@mui/x-date-pickers";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Loading from "examples/tool_universal/loading";
import Datetime from "react-datetime";
import TDVAPI from "api/tdv";
import useStyles from "layouts/test_driver_validation/table/styles/test_driver_validation_style";
import DateTimePicker from "examples/tool_universal/calendar_delay";
import PropTypes from "prop-types";
import Detail_form from "layouts/test_driver_validation/table/form/detail_form";
function Test_driver_validation() {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [pop_filter, set_pop_filter] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
  });
  const [edit, set_edit] = useState({
    email: null,
    driver_release_date: new Date(),
    module: "",
    driver: "",
    detail: "",
    OS: "",
    BIOS_version: "",
    message: "",
    start_date: new Date(Date.now() - 24 * 60 * 60 * 1000),
    end_date: new Date(),
  });
  const [modify_edit, set_modify_edit] = useState({
    task_id: null,
    name: null,
    driver_release_date: new Date(),
    module: "",
    dirver: "",
    detail: "",
    OS: "",
    BIOS_version: "",
    start_date: new Date(Date.now() - 24 * 60 * 60 * 1000),
    end_date: new Date(),
  });
  const [assgin, set_assgin] = useState({
    assgin: null,
    email: [],
    cc_mail: [],
    task_id: null,
  });
  const [list_task, set_list_task] = useState([]);
  const [permission, set_permission] = useState();
  useEffect(() => {
    get_list_task();
  }, []);
  const get_list_task = async () => {
    setLoading(true);
    try {
      let response = await TDVAPI.list_task();
      if (response.data.finaldata) {
        set_list_task(response.data.finaldata);
        set_permission(response.data.permission);
        console.log(response.data.finaldata, response.data.permission);
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
  const create_task = async () => {
    setLoading(true);
    try {
      let response = await TDVAPI.create_task({
        email: edit.email.value,
        release_date: edit.driver_release_date,
        module: edit.module,
        driver: edit.driver,
        detail: edit.detail,
        OS: edit.OS,
        BIOS_version: edit.BIOS_version,
        message: edit.message,
        validation_start_time: edit.start_date,
        validation_end_time: edit.end_date,
      });
      if (response.data.finaldata) {
        console.log(response.data.finaldata);
        alert("Successfully created.");
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
  const approve_task = async () => {
    setLoading(true);
    try {
      let response = await TDVAPI.approve_task({
        assgin: assgin.assgin && assgin.assgin.value,
        email: assgin.email.filter(Boolean).map((item) => item.value),
        cc_mail: assgin.cc_mail.filter(Boolean).map((item) => item.value),
        task_id: assgin.task_id,
      });
      if (response.data.finaldata) {
        closeModal(2);
        alert(response.data.finaldata);
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
  //table
  const title_data = [
    { className: classes.title_request_name, children: "Requester" },
    { className: classes.title_module, children: "Module" },
    { className: classes.title_driver, children: "Driver" },
    { className: classes.title_detail, children: "detail" },
    { className: classes.title_release_date, children: "Release Date" },
    { className: classes.title_vaildation_duration, children: "vaildation Duration" },
    { className: classes.title_status, children: "Status" },
    { className: classes.title_action, children: "Action" },
  ];
  function title_row(title_data) {
    return (
      <>
        <TableRow className={classes.title_table_row_style}>
          {title_data.map((item, index) => (
            <MyTableCell key={index} className={item.className}>
              {item.children}
            </MyTableCell>
          ))}
        </TableRow>
      </>
    );
  }
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
  const data_row = (index, data) => {
    return (
      <>
        <TableRow className={classes.table_row_style}>
          <TableCell key={index} className={classes.request_name}>
            {data.requester_name}
          </TableCell>
          <TableCell key={index} className={classes.module}>
            {data.task_detail.module}
          </TableCell>
          <TableCell key={index} className={classes.driver}>
            {data.task_detail.driver}
          </TableCell>
          <TableCell key={index} className={classes.detail}>
            {data.request_detail.request_detail}
          </TableCell>
          <TableCell key={index} className={classes.release_date}>
            {formatTimeForFrontend(data.date_detail.release_date)}
          </TableCell>
          <TableCell key={index} className={classes.vaildation_duration}>
            {formatTimeForFrontend(data.date_detail.validation_start_date) +
              "~" +
              formatTimeForFrontend(data.date_detail.validation_end_date)}
          </TableCell>
          <TableCell key={index} className={classes.status}>
            {data.status}
          </TableCell>
          <TableCell key={index} className={classes.action}>
            {permission && data.status == "Pending" && (
              <Button
                onClick={() => {
                  openModal(2);
                  set_assgin({ ...assgin, task_id: data.id });
                }}
              >
                Approve
              </Button>
            )}
            {(permission || data.edit_access) && (
              <Button
                onClick={() => {
                  openModal(3);
                  set_modify_edit({
                    ...modify_edit,
                    task_id: data.id,
                    name: data.requester_name,
                    driver_release_date: data.date_detail.release_date,
                    module: data.task_detail.module,
                    driver: data.task_detail.driver,
                    detail: data.request_detail.request_detail,
                    OS: data.task_detail.os,
                    BIOS_version: data.task_detail.bios_version,
                    start_date: data.date_detail.validation_start_date,
                    end_date: data.date_detail.validation_end_date,
                  });
                }}
              >
                Edit
              </Button>
            )}
            <Detail_form data={data} />
          </TableCell>
        </TableRow>
      </>
    );
  };
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
    return `${month}/${day}, ${year}`;
  }
  const openModal = (modalNumber) => {
    set_pop_filter((prev) => ({ ...prev, [modalNumber]: true }));
  };
  const closeModal = (modalNumber) => {
    set_pop_filter((prev) => ({ ...prev, [modalNumber]: false }));
  };
  const [errors, setErrors] = useState({});

  const handleSubmit = () => {
    const newErrors = {};

    if (!edit.email) newErrors.email = true;
    if (!edit.driver_release_date) newErrors.driver_release_date = true;
    if (!edit.module) newErrors.module = true;
    if (!edit.driver) newErrors.driver = true;
    if (!edit.detail) newErrors.detail = true;
    if (!edit.OS) newErrors.OS = true;
    if (!edit.BIOS_version) newErrors.BIOS_version = true;
    if (!edit.message) newErrors.message = true;
    if (!edit.start_date || !edit.end_date) newErrors.validation_date = true;
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      create_task();
    } else {
      alert("The fields marked with an asterisk cannot be empty.");
    }
  };
  // create_data
  const data = () => {
    return (
      <>
        <div className={classes.columns_center}>
          <div className={classes.line_form_style}>
            <div className={classes.columns_center}>
              <label htmlFor="driver_release_date">
                Email&nbsp;:&nbsp;&nbsp;
                {errors.email && <span style={{ color: "red" }}>*</span>}
              </label>
              <Loading_option
                api="polls/lendpersonnel"
                name="user_mail"
                selectedOptions={edit.email}
                setSelectedOptions={(newOptions) => set_edit({ ...edit, email: newOptions })}
              />
            </div>
          </div>
          <div className={classes.line_form_style}>
            <div className={classes.columns_center}>
              <label htmlFor="driver_release_date">
                Driver Release Date&nbsp;:&nbsp;&nbsp;
                {errors.driver_release_date && <span style={{ color: "red" }}>*</span>}
              </label>
              <Datetime
                value={edit.driver_release_date}
                onChange={(newDate) =>
                  set_edit((prevEdit) => ({
                    ...prevEdit,
                    driver_release_date: newDate,
                  }))
                }
                input={true}
                dateFormat="MMMM DD, YYYY"
                timeFormat="h:mm A"
                // style={calendar_outward}
                inputProps={{ style: { width: "250px" } }}
              />
            </div>
          </div>
          <div className={classes.line_form_style}>
            <div className={classes.columns_center}>
              <label htmlFor="module">
                Module&nbsp;:&nbsp;&nbsp;{errors.module && <span style={{ color: "red" }}>*</span>}
              </label>
              <input
                id="module"
                name="module"
                style={{
                  width: "480px",
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                }}
                value={edit.module}
                onChange={(e) => {
                  set_edit({
                    ...edit,
                    module: e.target.value,
                  });
                }}
              />
            </div>
          </div>
          <div className={classes.line_form_style}>
            <div className={classes.columns_center}>
              <label htmlFor="driver">
                Driver&nbsp;:&nbsp;&nbsp;{errors.driver && <span style={{ color: "red" }}>*</span>}
              </label>
              <input
                id="driver"
                name="driver"
                style={{
                  width: "480px",
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                }}
                value={edit.driver}
                onChange={(e) => {
                  set_edit({
                    ...edit,
                    driver: e.target.value,
                  });
                }}
              />
            </div>
          </div>
          <div className={classes.line_form_style}>
            <div className={classes.columns_center}>
              <label htmlFor="detail">
                Detail&nbsp;:&nbsp;&nbsp;{errors.detail && <span style={{ color: "red" }}>*</span>}
              </label>
              <textarea
                id="detail"
                name="detail"
                rows={3}
                style={{
                  width: "480px",
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                }}
                value={edit.detail}
                onChange={(e) => {
                  set_edit({
                    ...edit,
                    detail: e.target.value,
                  });
                }}
              />
            </div>
          </div>
          <div className={classes.line_form_style}>
            <div className={classes.columns_center}>
              <label htmlFor="OS">
                OS&nbsp;:&nbsp;&nbsp;{errors.OS && <span style={{ color: "red" }}>*</span>}
              </label>
              <input
                id="OS"
                name="OS"
                style={{
                  width: "200px",
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                }}
                value={edit.OS}
                onChange={(e) => {
                  set_edit({
                    ...edit,
                    OS: e.target.value,
                  });
                }}
              />
            </div>
          </div>
          <div className={classes.line_form_style}>
            <div className={classes.columns_center}>
              <label htmlFor="BIOS_version">
                BIOS Version&nbsp;:&nbsp;&nbsp;
                {errors.BIOS_version && <span style={{ color: "red" }}>*</span>}
              </label>
              <input
                id="BIOS_version"
                name="BIOS_version"
                style={{
                  width: "480px",
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                }}
                value={edit.BIOS_version}
                onChange={(e) => {
                  set_edit({
                    ...edit,
                    BIOS_version: e.target.value,
                  });
                }}
              />
            </div>
          </div>
          <div className={classes.line_form_style}>
            <div className={classes.columns_center}>
              <label htmlFor="message">
                message&nbsp;:&nbsp;&nbsp;
                {errors.message && <span style={{ color: "red" }}>*</span>}
              </label>
              <textarea
                id="message"
                name="message"
                rows={8}
                style={{
                  width: "480px",
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                }}
                value={edit.message}
                onChange={(e) => {
                  set_edit({
                    ...edit,
                    message: e.target.value,
                  });
                }}
              />
            </div>
          </div>
          <div className={classes.line_form_style}>
            <div className={classes.columns_center}>
              <label htmlFor="validation_duration">
                Vaildation Duration&nbsp;:&nbsp;&nbsp;
                {errors.validation_date && <span style={{ color: "red" }}>*</span>}
              </label>
              <DateTimePicker
                startDatetime={edit.start_date}
                endDatetime={edit.end_date}
                setStartDatetime={(newDate) =>
                  set_edit((prevEdit) => ({
                    ...prevEdit,
                    start_date: newDate,
                  }))
                }
                setEndDatetime={(newDate) =>
                  set_edit((prevEdit) => ({
                    ...prevEdit,
                    end_date: newDate,
                  }))
                }
              />
            </div>
          </div>
          <div style={{ marginBottom: "30px" }}></div>
          <div className={classes.line_form_style}>
            <Button onClick={handleSubmit}>Submit</Button>
            <Button onClick={() => closeModal(1)}>Close</Button>
          </div>
        </div>
      </>
    );
  };
  //pending
  const pending = () => {
    return (
      <>
        <div className={classes.columns_center}>
          <label htmlFor="assgin" style={{ fontWeight: "bold" }}>
            Assgin&nbsp;:&nbsp;&nbsp;
          </label>
          <Loading_option
            api="polls/lendpersonnel"
            name="user_mail"
            selectedOptions={assgin.assgin}
            setSelectedOptions={(newOptions) => set_assgin({ ...assgin, assgin: newOptions })}
          />
          <div style={{ marginBottom: "30px" }}></div>
          <label htmlFor="email" style={{ fontWeight: "bold" }}>
            Email&nbsp;:&nbsp;&nbsp;
          </label>
          <Loading_option_add_remove
            api="polls/lendpersonnel"
            name="user_mail"
            selectedOptions={assgin.email}
            setSelectedOptions={(newOptions) => set_assgin({ ...assgin, email: newOptions })}
          />
          <label htmlFor="cc_mail" style={{ fontWeight: "bold" }}>
            CC Mail:
          </label>
          <Loading_option_add_remove
            api="polls/lendpersonnel"
            name="user_mail"
            selectedOptions={assgin.cc_mail}
            setSelectedOptions={(newOptions) => set_assgin({ ...assgin, cc_mail: newOptions })}
          />
          <div style={{ marginBottom: "30px" }}></div>
          <div className={classes.line_form_style}>
            <Button onClick={approve_task}>Assgin</Button>
            <Button onClick={() => closeModal(2)}>Close</Button>
          </div>
        </div>
      </>
    );
  };
  // edit
  const edit_data = () => {
    return (
      <>
        <div className={classes.columns_center}>
          <div className={classes.line_form_style}>
            <div className={classes.columns_center}>
              <label htmlFor="driver_release_date">
                Requester&nbsp;:&nbsp;&nbsp;{modify_edit.name}
              </label>
            </div>
          </div>
          <div className={classes.line_form_style}>
            <div className={classes.columns_center}>
              <label htmlFor="driver_release_date">Driver Release Date&nbsp;:&nbsp;&nbsp;</label>
              <Datetime
                value={modify_edit.driver_release_date}
                onChange={(newDate) =>
                  set_modify_edit((prevEdit) => ({
                    ...prevEdit,
                    driver_release_date: newDate,
                  }))
                }
                input={true}
                dateFormat="MMMM DD, YYYY"
                timeFormat="h:mm A"
                // style={calendar_outward}
                inputProps={{ style: { width: "250px" } }}
              />
            </div>
          </div>
          <div className={classes.line_form_style}>
            <div className={classes.columns_center}>
              <label htmlFor="module">
                Module&nbsp;:&nbsp;&nbsp;{errors.module && <span style={{ color: "red" }}>*</span>}
              </label>
              <input
                id="module"
                name="module"
                style={{
                  width: "480px",
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                }}
                value={modify_edit.module}
                onChange={(e) => {
                  set_modify_edit({
                    ...modify_edit,
                    module: e.target.value,
                  });
                }}
              />
            </div>
          </div>
          <div className={classes.line_form_style}>
            <div className={classes.columns_center}>
              <label htmlFor="driver">
                Driver&nbsp;:&nbsp;&nbsp;{errors.driver && <span style={{ color: "red" }}>*</span>}
              </label>
              <input
                id="driver"
                name="driver"
                style={{
                  width: "480px",
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                }}
                value={modify_edit.driver}
                onChange={(e) => {
                  set_modify_edit({
                    ...modify_edit,
                    driver: e.target.value,
                  });
                }}
              />
            </div>
          </div>
          <div className={classes.line_form_style}>
            <div className={classes.columns_center}>
              <label htmlFor="detail">
                Detail&nbsp;:&nbsp;&nbsp;{errors.detail && <span style={{ color: "red" }}>*</span>}
              </label>
              <textarea
                id="detail"
                name="detail"
                rows={3}
                style={{
                  width: "480px",
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                }}
                value={modify_edit.detail}
                onChange={(e) => {
                  set_modify_edit({
                    ...modify_edit,
                    detail: e.target.value,
                  });
                }}
              />
            </div>
          </div>
          <div className={classes.line_form_style}>
            <div className={classes.columns_center}>
              <label htmlFor="OS">
                OS&nbsp;:&nbsp;&nbsp;{errors.OS && <span style={{ color: "red" }}>*</span>}
              </label>
              <input
                id="OS"
                name="OS"
                style={{
                  width: "200px",
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                }}
                value={modify_edit.OS}
                onChange={(e) => {
                  set_modify_edit({
                    ...modify_edit,
                    OS: e.target.value,
                  });
                }}
              />
            </div>
          </div>
          <div className={classes.line_form_style}>
            <div className={classes.columns_center}>
              <label htmlFor="BIOS_version">
                BIOS Version&nbsp;:&nbsp;&nbsp;
                {errors.BIOS_version && <span style={{ color: "red" }}>*</span>}
              </label>
              <input
                id="BIOS_version"
                name="BIOS_version"
                style={{
                  width: "480px",
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                }}
                value={modify_edit.BIOS_version}
                onChange={(e) => {
                  set_modify_edit({
                    ...modify_edit,
                    BIOS_version: e.target.value,
                  });
                }}
              />
            </div>
          </div>
          <div className={classes.line_form_style}>
            <div className={classes.columns_center}>
              <label htmlFor="validation_duration">Vaildation Duration&nbsp;:&nbsp;&nbsp;</label>
              <DateTimePicker
                startDatetime={modify_edit.start_date}
                endDatetime={modify_edit.end_date}
                setStartDatetime={(newDate) =>
                  set_modify_edit((prevEdit) => ({
                    ...prevEdit,
                    start_date: newDate,
                  }))
                }
                setEndDatetime={(newDate) =>
                  set_modify_edit((prevEdit) => ({
                    ...prevEdit,
                    end_date: newDate,
                  }))
                }
              />
            </div>
          </div>
          <div style={{ marginBottom: "30px" }}></div>
          <div className={classes.line_form_style}>
            <Button onClick={handleSubmit}>Submit</Button>
            <Button onClick={() => closeModal(3)}>Close</Button>
          </div>
        </div>
      </>
    );
  };
  return (
    <>
      <Loading loading={loading} />
      <Dialog open={pop_filter[1]} onClose={() => closeModal(1)} fullWidth maxWidth="md">
        <Box sx={{ padding: "20px" }}>{data()}</Box>
      </Dialog>
      <Dialog open={pop_filter[2]} onClose={() => closeModal(2)} fullWidth maxWidth="md">
        <Box sx={{ padding: "20px" }}>{pending()}</Box>
      </Dialog>
      <Dialog open={pop_filter[3]} onClose={() => closeModal(3)} fullWidth maxWidth="md">
        <Box sx={{ padding: "20px" }}>{edit_data()}</Box>
      </Dialog>
      <Dialog open={pop_filter[4]} onClose={() => closeModal(4)} fullWidth maxWidth="md">
        <Box sx={{ padding: "20px" }}>{pending()}</Box>
      </Dialog>
      <Button onClick={() => openModal(1)}>Test Driver Validation Request</Button>
      <TableContainer>
        {title_row(title_data)}
        {list_task && list_task.map((data, index) => data_row(index, data))}
      </TableContainer>
      <></>
    </>
  );
}
export default Test_driver_validation;
