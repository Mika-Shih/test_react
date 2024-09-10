import React, { useState, useEffect } from "react";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Button from "examples/Icons/Button";
import Loading_option from "examples/tool_universal/loading_option";
import Loading_option_add_remove from "examples/tool_universal/loading_option_add_remove";
import Loading from "examples/tool_universal/loading";
import Table from "examples/Table/table_row";
import useStyles from "layouts/iur/table/styles/iur";
import { Box, Dialog } from "@mui/material";
import IURAPI from "api/iur";
function DropdownWithButton(iur_data) {
  const [machine_data, set_machine_data] = useState([]);
  useEffect(() => {
    console.log(iur_data["iur_data"]);
    set_machine_data(iur_data["iur_data"]);
  }, []);
  const [popFilters, setPopFilters] = useState({
    1: false,
    2: false,
  });
  const [lendData, setlendData] = useState({
    lendperson: null,
    purpose: "",
    message: "",
    cc_mail: [],
  });
  const [loading, setLoading] = useState(false);
  const classes = useStyles();
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
  function data_row(index, data) {
    if (!data) {
      return null;
    }
    return (
      <>
        <TableRow className={classes.table_row_style}>
          <TableCell key={index} className={classes.platform_style}>
            {machine_data[index].platform}
          </TableCell>
          <TableCell key={index} className={classes.phase_style}>
            {machine_data[index].phase}
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
            {machine_data[index].sku}
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
            {/* {
              <input
                ref={inputRef}
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
                onBlur={() => handleBlur(index, "position")}
                onKeyDown={(e) => handleKeyDown(e, index, "position")}
              />
            } */}
            {data.position}
          </TableCell>
          <TableCell key={index} className={classes.remark_style}>
            {/* {
              <input
                ref={inputRef}
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
                onBlur={() => handleBlur(index, "remark")}
                onKeyDown={(e) => handleKeyDown(e, index, "remark")}
              />
            } */}
            {data.remark}
          </TableCell>
          <TableCell key={index} className={classes.update_time_style}>
            {formatTimeForFrontend(data.update_time)}
          </TableCell>
        </TableRow>
      </>
    );
  }
  //   const inputRef = useRef(null);
  //   const [isEditing, setIsEditing] = useState({});
  //   const indexRef = useRef(null);

  //   useEffect(() => {
  //     if (isEditing[indexRef.current] && inputRef.current) {
  //       inputRef.current.focus();
  //     }
  //   }, [isEditing]);

  // const handleDoubleClick = (index, data) => {
  //   indexRef.current = `${index}_${data}`;
  //   setIsEditing((prevIsEditing) => ({
  //     ...prevIsEditing,
  //     [`${index}_${data}`]: true,
  //   }));
  //   console.log(isEditing);
  //   console.log(inputRef);
  // };

  //   const handleBlur = (index, data) => {
  //     setIsEditing((prevIsEditing) => ({
  //       ...prevIsEditing,
  //       [`${index}_${data}`]: false,
  //     }));
  //     console.log(isEditing);
  //   };
  //   const handleKeyDown = (e, index, data) => {
  //     if (e.key === "Enter") {
  //       handleBlur(index, data);
  //     }
  //   };

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

  const clearmodel = async () => {
    setLoading(true);
    try {
      const cc_mail_list = lendData.cc_mail.filter(Boolean).map((item) => item.value);
      const response = await IURAPI.return({
        finaldata: machine_data,
        message: lendData.message,
        purpose: lendData.purpose,
      });
      if (response.data.finaldata) {
        try {
          const response_lend = await IURAPI.lend({
            finaldata: machine_data,
            lendperson: lendData.lendperson == null ? "" : lendData.lendperson.value,
            purpose: lendData.purpose,
            message: lendData.message,
            cc_mail: cc_mail_list,
          });
          if (response_lend.data.finaldata) {
            alert("Successfully transferred.");
            window.location.reload();
          } else if (response_lend.data.error) {
            alert(response_lend.data.error);
          }
        } catch (error) {
          console.error("Error in Axios request:", error);
          alert(
            "Return completed, but there was an error when lending to the new user. Please contact the administrator."
          );
        }
      } else if (response.data.error) {
        alert(response.data.error);
      }
    } catch (error) {
      console.error("Error in Axios request:", error);
      alert("Please contact the administrator.");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TableContainer>
        <Table row_style={classes.title_table_row_style} data={title_data}></Table>
        {machine_data.map((data, index) => data_row(index, data))}
      </TableContainer>
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
              <p>Confirm transferring the following machines?</p>
              {check_platform_change()}
              <div claasName={classes.line_form_style}>
                <Button
                  style={{ margin: "10px", padding: "10px" }}
                  onClick={() => {
                    if (lendData.lendperson == null) {
                      alert("User cannot be empty.");
                    } else {
                      clearmodel();
                    }
                  }}
                >
                  Transfer
                </Button>
                <Button style={{ margin: "10px", padding: "10px" }} onClick={() => closeModal(1)}>
                  Close
                </Button>
              </div>
            </div>
          </Box>
        </Dialog>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "20px",
        }}
      >
        <label htmlFor="new_owner">New Owner:</label>
        <Loading_option
          api="polls/lendpersonnel"
          name="user_mail"
          selectedOptions={lendData.lendperson}
          setSelectedOptions={(newOptions) => setlendData({ ...lendData, lendperson: newOptions })}
        />
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
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "10px",
            marginTop: "20px",
          }}
        >
          <Button onClick={() => openModal(1)}>Transfer Machine</Button>
          <Button onClick={() => window.location.reload()}>Cancel</Button>
        </div>
      </div>
    </>
  );
}
export default DropdownWithButton;
