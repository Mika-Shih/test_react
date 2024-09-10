import React, { useState, useEffect, useRef } from "react";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Button from "examples/Icons/Button";
import Loading_option from "examples/tool_universal/loading_option";
import Loading_option_4to1 from "examples/tool_universal/loading_option_4to1";
import Loading from "examples/tool_universal/loading";
import Table from "examples/Table/table_row";
import useStyles from "layouts/iur/table/styles/iur";
import { Box, Dialog } from "@mui/material";
import IURAPI from "api/iur";
function DropdownWithButton(iur_data) {
  const [machine_data, set_machine_data] = useState([]);
  const [platform_combine, set_platform_combine] = useState([]);
  const [options, setOptions] = useState([]);
  const classes = useStyles();
  useEffect(() => {
    console.log(iur_data["iur_data"]);
    set_machine_data(iur_data["iur_data"]);
    const fetchData = async () => {
      try {
        const response = await IURAPI.phase();
        const formattedOptions = response.data["phase"].filter((item) => item !== "");
        setOptions(formattedOptions);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
    const transformed_data = iur_data["iur_data"].map((item) => ({
      title: `${item["platform"]} - ${item["target"]} - ${item["group"]} - ${item["cycle"]}`,
      value: `${item["platform"]} - ${item["target"]} - ${item["group"]} - ${item["cycle"]}`,
    }));
    console.log(transformed_data);
    set_platform_combine(transformed_data);
  }, []);
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
  useEffect(() => {}, [formData, options]);
  const title_data = [
    { style: classes.title_platform_style, children: "Platform" },
    { style: classes.title_phase_style, children: "Phase" },
    { style: classes.title_target_style, children: "Target" },
    { style: classes.title_group_style, children: "Group" },
    { style: classes.title_cycle_style, children: "Cycle" },
    { style: classes.title_sku_style, children: "Sku" },
    { style: classes.title_sn_style, children: "Serial Number" },
    { style: classes.title_borrower_style, children: "Borrower" },
    { style: classes.title_status_style, children: "Status" },
    { style: classes.title_position_style, children: "Position" },
    { style: classes.title_remark_style, children: "Remark" },
    { style: classes.title_update_time_style, children: "Update Time" },
  ];
  useEffect(() => {
    console.log(platform_combine);
    console.log(formData);
  }, [platform_combine]);
  function data_row(index, data) {
    if (!data) {
      return null;
    }
    return (
      <>
        <TableRow className={classes.table_row_style}>
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
                  // set_platform_combine({ index: newOptions });
                  // set_platform_combine({ ...platform_combine, index: newOptions });
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
            {
              <input
                // ref={inputRef}
                type="text"
                value={machine_data[index].sku}
                style={{ width: "30px", alignItems: "center" }}
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
            }
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
            {
              <input
                // ref={inputRef}
                type="text"
                value={machine_data[index].position}
                style={{ width: "120px", height: "25px", alignItems: "center" }}
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
            }
          </TableCell>
          <TableCell key={index} className={classes.remark_style}>
            {
              <input
                // ref={inputRef}
                type="text"
                value={machine_data[index].remark}
                style={{ width: "120px", height: "25px", alignItems: "center" }}
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
            }
          </TableCell>
          <TableCell key={index} className={classes.update_time_style}>
            {formatTimeForFrontend(data.update_time)}
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
    console.log(isEditing);
    console.log(inputRef);
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
          <Table row_style={classes.table_row_style} data={title_data}></Table>
          {machine_data.map((data) => check_data_row(data))}
        </TableContainer>
      </>
    );
  }
  function check_data_row(data) {
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
      { style: classes.borrower_style, children: data.borrower },
      { style: classes.status_style, children: data.status },
      { style: classes.position_style, children: data.position },
      { style: classes.remark_style, children: data.remark },
      { style: classes.update_time_style, children: formatTimeForFrontend(data.update_time) },
    ];
    return (
      <>
        <Table row_style={classes.table_row_style} data={tablebody_data}></Table>
      </>
    );
  }

  function formatTimeForFrontend(inputTime) {
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
  useEffect(() => {}, [machine_data]);
  const openModal = (modalNumber) => {
    setPopFilters((prev) => ({ ...prev, [modalNumber]: true }));
  };
  const closeModal = (modalNumber) => {
    setPopFilters((prev) => ({ ...prev, [modalNumber]: false }));
  };

  const addplatformmodel = async () => {
    setLoading(true);
    try {
      const response = await IURAPI.addplatformonly({
        platform: formData.platform,
        target: formData.target == null ? "" : formData.target.value,
        group: formData.group == null ? "" : formData.group.value,
        cycle: formData.cycle,
      });
      if (response.data.successful) {
        alert(response.data.successful);
        closeModal(2);
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
  const clearmodel = async () => {
    setLoading(true);
    try {
      const response = await IURAPI.change({
        finaldata: machine_data,
      });
      if (response.data.finaldata) {
        alert(response.data.finaldata);
        window.location.reload();
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
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", marginLeft: "20px" }}>
        <Loading loading={loading} />
        <Dialog open={popFilters[1]} onClose={() => closeModal(1)} fullWidth maxWidth={false}>
          <Box sx={{ padding: "20px" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "30px",
              }}
            >
              <p>Confirm modifying the following machines?</p>
              {check_platform_change()}
              <div claasName={classes.line_form_style}>
                <Button style={{ margin: "10px", padding: "10px" }} onClick={clearmodel}>
                  Modify
                </Button>
                <Button style={{ margin: "10px", padding: "10px" }} onClick={() => closeModal(1)}>
                  Close
                </Button>
              </div>
            </div>
          </Box>
        </Dialog>
        <Dialog open={popFilters[2]} onClose={() => closeModal(2)} fullWidth maxWidth="xs">
          <Box sx={{ padding: "20px" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "30px",
              }}
            >
              <h2>Add New Platform</h2>
              {pop_filter_content()}
              <div claasName={classes.line_form_style}>
                <Button style={{ margin: "10px", padding: "10px" }} onClick={addplatformmodel}>
                  Add machine
                </Button>
                <Button style={{ margin: "10px", padding: "10px" }} onClick={() => closeModal(2)}>
                  Close
                </Button>
              </div>
            </div>
          </Box>
        </Dialog>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Button onClick={() => openModal(2)}>Add new platform</Button>
        </div>
      </div>
      <TableContainer>
        <Table row_style={classes.title_table_row_style} data={title_data}></Table>
        {machine_data.map((data, index) => data_row(index, data))}
      </TableContainer>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "20px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "10px" }}>
          <Button onClick={() => openModal(1)}>Change</Button>
          <Button onClick={() => window.location.reload()}>Cancel</Button>
        </div>
      </div>
    </>
  );
}
export default DropdownWithButton;
