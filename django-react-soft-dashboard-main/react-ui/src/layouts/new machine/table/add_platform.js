import React, { useState, useRef, useEffect } from "react";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Loading_option_4to1 from "examples/tool_universal/loading_option_4to1";
import Button from "examples/Icons/Button";
import PropTypes from "prop-types";
import Loading from "examples/tool_universal/loading";
import Loading_option from "examples/tool_universal/loading_option";
import Table from "examples/Table/table_row";
import useStyles from "./styles/new_machine_style";
import IURAPI from "api/iur";
import { Box, Dialog } from "@mui/material";
import { useHistory } from "react-router-dom";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
function InputWithAddAndClearButton(props) {
  const history = useHistory();
  const [options, setOptions] = useState([]);
  const [ischeckbox, setcheckbox] = useState({});
  const [platform_combine, set_platform_combine] = useState([]);
  const [popFilters, setPopFilters] = useState({
    1: false,
    2: false,
  });
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    platform: [],
    target: null,
    group: null,
    cycle: [],
  });
  const [machine_data, set_machine_data] = useState([]);
  const classes = useStyles();
  useEffect(() => {
    const newMachineData = props.serial_number
      .filter((value) => value !== "")
      .map((sn) => ({
        platform: "",
        phase: "OOC", //12/14寫死
        target: "",
        group: "",
        cycle: "",
        sku: "",
        sn: sn,
        acquirer: null,
        position: "",
        remark: "",
      }));
    set_machine_data(newMachineData);
  }, [props.serial_number]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await IURAPI.phase();
        const formattedOptions = response.data["phase"].filter((item) => item !== "");
        setOptions(formattedOptions);
      } catch (error) {
        console.error("Error in Axios request:", error);
        alert("Please contact the administrator.");
      }
    };
    fetchData();
    const transformed_data = machine_data.map((item) => ({
      title: `${item["platform"]} - ${item["target"]} - ${item["group"]} - ${item["cycle"]}`,
      value: `${item["platform"]} - ${item["target"]} - ${item["group"]} - ${item["cycle"]}`,
    }));
    console.log(transformed_data);
    set_platform_combine(transformed_data);
  }, []);
  const [user_experience, set_user_experience] = useState(0);
  function title_row(request = false) {
    const title_data = [
      ...(!request ? [{ style: classes.title_checkbox_style, children: "/" }] : []),
      { style: classes.title_platform_style, children: "platform" },
      { style: classes.title_phase_style, children: "phase" },
      { style: classes.title_target_style, children: "target" },
      { style: classes.title_group_style, children: "group" },
      { style: classes.title_cycle_style, children: "cycle" },
      { style: classes.title_sku_style, children: "sku" },
      { style: classes.title_sn_style, children: "serial_number" },
      { style: classes.title_acquirer_style, children: "acquirer" },
      { style: classes.title_position_style, children: "position" },
      { style: classes.title_remark_style, children: "remark" },
    ];
    return (
      <>
        <Table row_style={classes.title_table_row_style} data={title_data}></Table>
      </>
    );
  }
  const acquire_data = [
    "WWAN",
    "WLAN_Intel",
    "WLAN_Realtek",
    "Ethernet",
    "NFC",
    "Lab all functional test 24hrs",
    "Antenna & Radio NUD",
    "HW development",
    "Carrier sample - EMEA",
    "Carrier sample - APJ",
    "Field Test (EMEA)",
    "Field Test (TDC)",
    "Field Test for TC",
    "COMMs Storage/5G testing/dogfood/Donatiog to Kevin Lab",
    "Carrier sample -(NA/LA)",
    "Field Test (NA/LA)",
    "WLAN_QCOM",
    "CAT-M",
    "WLAN MediaTek",
    "R&D innovation Programs",
    "Field Test (NA/LA)",
    "COMMs Houston Lab",
    "Field Test",
    "Factory Support",
  ];
  function data_row(index, data) {
    if (!data) {
      return null;
    }
    return (
      <>
        <TableRow className={classes.table_row_style}>
          <TableCell key={index} className={classes.checkbox_style}>
            <input
              type="checkbox"
              checked={ischeckbox[`${index}`] || false}
              onChange={() => {
                setcheckbox((prevIsCheckbox) => {
                  const updatedCheckboxState = Object.fromEntries(
                    // 陣列數組轉成新對象鍵值對  Object.fromEntries([['a', 1], ['b', 2], ['c', 3]]) = { a: 1, b: 2, c: 3 }
                    Object.entries(prevIsCheckbox).map(([key]) => [key, false]) //對象鍵值對轉成陣列數組 Object.fromEntries({ a: 1, b: 2, c: 3 }) = [['a', 1], ['b', 2], ['c', 3]]
                  );
                  updatedCheckboxState[`${index}`] = !prevIsCheckbox[`${index}`]; //舊的!checkbox狀態傳給新的checkbox狀態
                  return updatedCheckboxState;
                });
              }}
            />
          </TableCell>
          <TableCell
            key={index}
            className={classes.platform_style}
            onClick={() => handleDoubleClick(index, "platform")}
            ref={inputRef}
            onBlur={() => handleBlur(index, "platform")}
          >
            {isEditing[`${index}_platform`] ? (
              <Loading_option_4to1
                api="polls/api/addplatformcombination"
                name="platform"
                selectedOptions={platform_combine[index]}
                setSelectedOptions={(newOptions) => {
                  set_platform_combine((prevPlatformCombine) => ({
                    ...prevPlatformCombine,
                    [index]: newOptions,
                  }));
                  console.log(newOptions);
                  const [platform, target, group, cycle] = newOptions
                    ? newOptions.value.split(" - ")
                    : ["", "", "", ""];
                  machine_data[index].platform = platform || "";
                  machine_data[index].target = target || "";
                  machine_data[index].group = group || "";
                  machine_data[index].cycle = cycle || "";
                }}
              />
            ) : (
              machine_data[index].platform
            )}
          </TableCell>
          <TableCell key={index} className={classes.phase_style}>
            <select
              value={machine_data[index].phase}
              onChange={(e) => {
                set_machine_data((prevData) => {
                  const newData = [...prevData];
                  newData[index] = { ...newData[index], phase: e.target.value };
                  return newData;
                });
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
            <input
              // ref={inputRef}
              type="text"
              value={machine_data[index].sku}
              style={{ width: "30px" }}
              onChange={(e) => {
                set_machine_data((prevData) => {
                  const newData = [...prevData];
                  newData[index] = { ...newData[index], sku: e.target.value };
                  return newData;
                });
              }}
              // onBlur={() => handleBlur(index, "sku")}
              // onKeyDown={(e) => handleKeyDown(e, index, "sku")}
            />
          </TableCell>
          <TableCell key={index} className={classes.sn_style}>
            {machine_data[index].sn}
          </TableCell>
          <TableCell key={index} className={classes.acquirer_style}>
            <Autocomplete
              id="combo-box-demo"
              options={acquire_data}
              sx={{ width: 220, height: 20 }}
              MenuProps={{
                MenuListProps: {
                  "aria-labelledby": "combo-box-demo",
                  position: "fixed",
                },
              }}
              onChange={(e, selectedOption) => {
                set_machine_data((prevData) => {
                  const newData = [...prevData];
                  newData[index] = { ...newData[index], acquirer: selectedOption };
                  return newData;
                });
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </TableCell>
          <TableCell key={index} className={classes.position_style}>
            <input
              // ref={inputRef}
              type="text"
              value={machine_data[index].position}
              style={{ width: "80px", alignItems: "center" }}
              onChange={(e) => {
                set_machine_data((prevData) => {
                  const newData = [...prevData];
                  newData[index] = { ...newData[index], position: e.target.value };
                  return newData;
                });
              }}
              // onBlur={() => handleBlur(index, "position")}
              // onKeyDown={(e) => handleKeyDown(e, index, "position")}
            />
          </TableCell>
          <TableCell key={index} className={classes.remark_style}>
            <input
              // ref={inputRef}
              type="text"
              value={machine_data[index].remark}
              style={{ width: "80px", alignItems: "center" }}
              onChange={(e) => {
                set_machine_data((prevData) => {
                  const newData = [...prevData];
                  newData[index] = { ...newData[index], remark: e.target.value };
                  return newData;
                });
              }}
              // onBlur={() => handleBlur(index, "remark")}
              // onKeyDown={(e) => handleKeyDown(e, index, "remark")}
            />
          </TableCell>
        </TableRow>
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
  // const handleKeyDown = (e, index, data) => {
  //   if (e.key === "Enter") {
  //     handleBlur(index, data);
  //   }
  // };
  const checkbox_function = () => {
    console.log(ischeckbox);
    const trueIndex = Object.keys(ischeckbox).find((index) => ischeckbox[index]);
    if (trueIndex !== undefined) {
      for (let i = trueIndex; i < machine_data.length; i++) {
        machine_data[i] = { ...machine_data[trueIndex], sn: machine_data[i].sn };
      }
    }
    console.log(trueIndex);
    console.log(machine_data);
    set_user_experience((prevKey) => prevKey + 1);
  };
  useEffect(() => {
    console.log(user_experience);
  }),
    [user_experience];
  const addplatformmodel = async () => {
    setLoading(true);
    const request_data = {
      platform: formData.platform,
      target: formData.target == null ? "" : formData.target.value,
      group: formData.group == null ? "" : formData.group.value,
      cycle: formData.cycle,
    };
    console.log(request_data);
    try {
      setLoading(true);
      let response = await IURAPI.addplatformonly(request_data);
      if (response.data.successful) {
        alert(response.data.successful);
        closeModal(1);
        setFormData({
          platform: [],
          target: null,
          group: null,
          cycle: [],
        });
      } else if (response.data.error) {
        alert(response.data.error);
      }
    } catch (error) {
      console.error("Error in Axios request:", error);
      alert("Please contact the administrator.");
    } finally {
      setLoading(false);
    }
  };

  const add_new_platform = async () => {
    try {
      setLoading(true);
      let request_data = new FormData();
      request_data.append("finaldata", JSON.stringify(machine_data));
      request_data.append("message", "add new platform");
      console.log(request_data);
      const response = await IURAPI.addnewplatform(request_data);
      if (response.data.finaldata) {
        history.push("/iur/");
      } else if (response.data.error) {
        alert(response.data.error);
      }
    } catch (error) {
      console.error("Error in Axios request:", error);
      alert("Please contact the administrator.");
    } finally {
      setLoading(false);
    }
  };
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
  };
  function pop_filter_content() {
    return (
      <>
        <div style={containerStyle}>
          <label>Platform:</label>
          <input
            type="text"
            value={formData.platform}
            onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
            style={{ paddingTop: "8px", paddingBottom: "8px", width: "300px" }}
          />
          <label>Target:</label>
          <Loading_option
            api="polls/api/target"
            name="target"
            selectedOptions={formData.target}
            setSelectedOptions={(newOptions) => setFormData({ ...formData, target: newOptions })}
          />
          <label>Group:</label>
          <Loading_option
            api="polls/api/group"
            name="group"
            selectedOptions={formData.group}
            setSelectedOptions={(newOptions) => setFormData({ ...formData, group: newOptions })}
          />
          <label>Cycle:</label>
          <input
            type="text"
            value={formData.cycle}
            onChange={(e) => setFormData({ ...formData, cycle: e.target.value })}
            style={{ paddingTop: "8px", paddingBottom: "8px", width: "300px" }}
          />
        </div>
      </>
    );
  }
  function check_platform_change() {
    return (
      <>
        <TableContainer>
          {title_row(true)}
          {machine_data.map((data, index) => check_data_row(index, data))}
        </TableContainer>
      </>
    );
  }
  function check_data_row(index, data) {
    if (!data) {
      return null;
    }
    const tablebody_data = [
      { style: classes.platform_style, children: data.platform },
      { style: classes.phase_style, children: data.phase },
      { style: classes.target_style, children: data.target },
      { style: classes.group_style, children: data.group },
      { style: classes.cycle_style, children: data.cycle },
      { style: classes.sku_style, children: data.sku },
      { style: classes.sn_style, children: data.sn },
      { style: classes.acquirer_style, children: data.acquirer },
      { style: classes.position_style, children: data.position },
      { style: classes.remark_style, children: data.remark },
    ];
    return (
      <>
        <Table row_style={classes.table_row_style} data={tablebody_data}></Table>
      </>
    );
  }
  const openModal = (modalNumber) => {
    setPopFilters((prev) => ({ ...prev, [modalNumber]: true }));
  };
  const closeModal = (modalNumber) => {
    setPopFilters((prev) => ({ ...prev, [modalNumber]: false }));
  };
  return (
    <>
      <div style={{ marginLeft: "16px" }}>
        <Loading loading={loading} />
        <Dialog open={popFilters[1]} onClose={() => closeModal(1)} fullWidth maxWidth="xs">
          <Box sx={{ padding: "20px" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "30px",
              }}
            >
              <h2>Add new platform</h2>
              {pop_filter_content()}
              <div claasName={classes.line_form_style}>
                <Button style={{ margin: "10px", padding: "10px" }} onClick={addplatformmodel}>
                  Add machine
                </Button>
                <Button style={{ margin: "10px", padding: "10px" }} onClick={() => closeModal(1)}>
                  Close
                </Button>
              </div>
            </div>
          </Box>
        </Dialog>
        <Dialog open={popFilters[2]} onClose={() => closeModal(2)} fullWidth maxWidth={false}>
          <Box sx={{ padding: "20px" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "30px",
              }}
            >
              <p>Confirm adding the following machines?</p>
              {check_platform_change()}
              <div claasName={classes.line_form_style}>
                <Button style={{ margin: "10px", padding: "10px" }} onClick={add_new_platform}>
                  Add machine
                </Button>
                <Button style={{ margin: "10px", padding: "10px" }} onClick={() => closeModal(2)}>
                  Close
                </Button>
              </div>
            </div>
          </Box>
        </Dialog>
        <Button onClick={checkbox_function} style={{ marginLeft: "16px" }}>
          Apply downwards from the checkbox
        </Button>
        <Button onClick={() => openModal(1)} style={{ marginLeft: "16px" }}>
          Add new platform
        </Button>
        <Button onClick={() => openModal(2)} style={{ marginLeft: "16px" }}>
          Add new machine
        </Button>
      </div>
      <TableContainer>
        {title_row()}
        {machine_data.map((data, index) => data_row(index, data))}
      </TableContainer>
    </>
  );
}
InputWithAddAndClearButton.propTypes = {
  serial_number: PropTypes.array.isRequired,
};
export default InputWithAddAndClearButton;
