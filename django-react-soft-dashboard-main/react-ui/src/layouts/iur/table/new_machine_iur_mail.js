import React, { useState, useEffect } from "react";
import TableContainer from "@mui/material/TableContainer";
import Button from "examples/Icons/Button";
import Loading from "examples/tool_universal/loading";
import Table from "examples/Table/table_row";
import FolderChoose from "examples/tool_universal/folder_choose";
import FileChoose from "examples/tool_universal/file_choose";
import FilterButton from "examples/Icons/Filter_button";
import useStyles from "layouts/iur/table/styles/iur";
import IURAPI from "api/iur";
import PropTypes from "prop-types";
import { Tabs, Tab, Box, Typography, Dialog } from "@mui/material";
function DropdownWithButton(iur_data) {
  useEffect(() => {
    console.log(iur_data["iur_data"]);
    set_machine_data(iur_data["iur_data"]);
  }, []);
  const [machine_data, set_machine_data] = useState([]);
  const [folder_choose, set_folder_choose] = useState([]);
  const [folder, set_folder] = useState([]);
  const [file_choose, set_file_choose] = useState([]);
  const [file, set_file] = useState([]);
  const [pop_filter, set_pop_filter] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
  });
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
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
  function data_row(data) {
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

  const TabPanel = (props) => {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  };
  TabPanel.propTypes = {
    children: PropTypes.node.isRequired,
    value: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
  };

  const choose_attach_file = () => {
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
    return (
      <>
        <div>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Choose Attach File" />
            <Tab label="Choose Upload File" />
          </Tabs>
          <TabPanel value={value} index={0}>
            <div style={{ display: "flex", flexDirection: "column" }}>{attach_file()}</div>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <div style={{ display: "flex", flexDirection: "column" }}>{upload_file()}</div>
          </TabPanel>
        </div>
      </>
    );
  };
  const attach_file = () => {
    return (
      <>
        <div className={classes.choose_container}>
          <FileChoose data={file_choose} setData={set_file_choose}></FileChoose>
          <p>config address&nbsp;:&nbsp;</p>
          <FilterButton
            options={Object.values(file_choose).map((option) => option.title)}
            onClick={(newOptions) => {
              const index = file_choose.findIndex((option) => !newOptions.includes(option.title));
              console.log(index, newOptions);
              if (index !== -1) {
                set_file_choose(file_choose.slice(0, index));
              }
            }}
          />
          <div className={classes.file_add_button}>
            <Button
              onClick={() => {
                if (file_choose.length > 0) {
                  set_file((prevFile) => [...prevFile, file_choose]);
                  set_file_choose([]);
                } else {
                  alert("Please select file path.");
                }
              }}
            >
              + Add
            </Button>
          </div>
        </div>
        <div className={classes.choose_view_container}>
          {file.map((file_row, index) => (
            <>
              <div className={classes.row}>
                <p key={index}>
                  {Object.values(file_row)
                    .map((option) => option.title)
                    .join(" → ")}
                </p>
                <button
                  className={classes.delete_button}
                  onClick={() => set_file(file.filter((_, i) => i !== index))}
                >
                  X
                </button>
              </div>
            </>
          ))}
        </div>
      </>
    );
  };
  useEffect(() => {
    console.log(file);
  }, [file]);
  useEffect(() => {
    console.log(folder);
  }, [folder]);
  const upload_file = () => {
    return (
      <>
        <div className={classes.choose_container}>
          <FolderChoose data={folder_choose} setData={set_folder_choose}></FolderChoose>
          <p>config address&nbsp;:&nbsp;</p>
          <FilterButton
            options={Object.values(folder_choose).map((option) => option.title)}
            onClick={(newOptions) => {
              const index = folder_choose.findIndex((option) => !newOptions.includes(option.title));
              console.log(index, newOptions);
              if (index !== -1) {
                set_folder_choose(folder_choose.slice(0, index));
              }
            }}
          />
          <div style={{ marginRight: "16px", position: "absolute", right: "0" }}>
            <input
              type="file"
              onChange={(event) => {
                const file = event.target.files[0];
                setSelectedFile(file);
                console.log("Selected file:", file);
              }}
              style={{ display: "none" }}
              id="file-upload"
            />
            <label htmlFor="file-upload" className={classes.fileUploadButton}>
              {selectedFile ? selectedFile.name : "Select a file"}
            </label>
            <button
              className={classes.deleteButtonStyle}
              onClick={() => {
                setSelectedFile(null);
              }}
            >
              X
            </button>
          </div>
          <div className={classes.file_add_button}>
            <Button
              onClick={() => {
                if (folder_choose.length > 0 && selectedFile) {
                  set_folder((prevFolder) => [
                    ...prevFolder,
                    { folder_path: folder_choose, file: selectedFile },
                  ]);
                  set_folder_choose([]);
                  setSelectedFile(null);
                } else {
                  alert("Please select a file and folder path.");
                }
              }}
            >
              + Add
            </Button>
          </div>
        </div>
        <div className={classes.choose_view_container}>
          {folder.map((data, index) => (
            <>
              <div className={classes.row}>
                <p key={index}>
                  {Object.values(data.folder_path)
                    .map((option) => option.title)
                    .join(" → ")}
                  {" → "}
                </p>
                <p style={{ color: "darkred" }}>&nbsp;{data.file.name}</p>
                <button
                  className={classes.delete_button}
                  onClick={() => set_folder(folder.filter((_, i) => i !== index))}
                >
                  X
                </button>
              </div>
            </>
          ))}
        </div>
      </>
    );
  };

  const new_machine_mail_model = async () => {
    setLoading(true);
    try {
      let request_data = new FormData();
      request_data.append("finaldata", JSON.stringify(machine_data));
      request_data.append("folder_length", JSON.stringify(folder.length));
      folder.forEach((onefile, index) => {
        const folderPath = Object.values(onefile.folder_path).map((option) => option.title);
        request_data.append(`folder_choose[${index}][folder_path]`, JSON.stringify(folderPath));
        request_data.append(`folder_choose[${index}][file]`, onefile.file);
      });
      request_data.append(
        "file_choose",
        JSON.stringify(file.map((onefile) => Object.values(onefile).map((option) => option.title)))
      );
      let response = await IURAPI.new_machine_mail(request_data);
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
      set_pop_filter(false);
    }
  };

  //load module option
  const openModal = (modalNumber) => {
    set_pop_filter((prev) => ({ ...prev, [modalNumber]: true }));
  };
  const closeModal = (modalNumber) => {
    set_pop_filter((prev) => ({ ...prev, [modalNumber]: false }));
  };
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", marginLeft: "20px" }}>
        <Loading loading={loading} />
        <Dialog open={pop_filter[1]} onClose={() => closeModal(1)} fullWidth maxWidth="md">
          <Box sx={{ padding: "20px" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "20px",
              }}
            >
              <p>Confirm the content of the new machine and send an email?</p>
              <div claasName={classes.line_form_style}>
                <Button
                  style={{ margin: "10px", padding: "10px" }}
                  onClick={new_machine_mail_model}
                >
                  Confirm
                </Button>
                <Button style={{ margin: "10px", padding: "10px" }} onClick={() => closeModal(1)}>
                  Close
                </Button>
              </div>
            </div>
          </Box>
        </Dialog>
        <Dialog open={pop_filter[2]} onClose={() => closeModal(2)} fullWidth maxWidth="xl">
          <Box sx={{ padding: "20px" }}>
            {choose_attach_file()}
            <Button style={{ margin: "10px", padding: "10px" }} onClick={() => closeModal(2)}>
              Close
            </Button>
          </Box>
        </Dialog>
        <Button onClick={() => openModal(2)} className={classes.button_style}>
          Choose Attach File
        </Button>
      </div>
      <TableContainer>
        <Table row_style={classes.title_table_row_style} data={title_data}></Table>
        {machine_data.map((data) => data_row(data))}
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
          <Button onClick={() => openModal(1)} className={classes.button_style}>
            Send email
          </Button>
          <Button onClick={() => window.location.reload()}>Cancel</Button>
        </div>
      </div>
    </>
  );
}

export default DropdownWithButton;
