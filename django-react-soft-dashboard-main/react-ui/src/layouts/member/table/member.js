import React, { useState, useEffect, useRef } from "react";
import Modal from "react-modal";
import TableContainer from "@mui/material/TableContainer";
import TextField from "@mui/material/TextField";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Tablebody from "@mui/material/TableBody";
import Button from "examples/Icons/Button";
import Table from "examples/Table/table_row";
import Loading from "examples/tool_universal/loading";
import USERAPI from "api/user";
import useStyles from "./styles/member";
import { hasAzureAccess } from "../../../auth-context/auth.context";
// import { useHistory } from "react-router-dom";
function DropdownWithButton() {
  const classes = useStyles();
  // const history = useHistory();
  const [popFilters, setPopFilters] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
  });
  const [search_text, set_search_text] = useState("");
  const [member_data, set_member_data] = useState([]);
  const [loading, setLoading] = useState(false);
  const [memberData, setmemberData] = useState({
    username: "",
    site: "TW",
    email: "",
  });
  useEffect(() => {
    get_member_data();
  }, []);
  const customStyles = {
    content: {
      maxWidth: "800px",
      minWidth: "800px",
      maxHeight: "250px",
      minHeight: "250px",
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-400px",
      transform: "translate(-50%, -50%)",
      overflowY: "auto",
    },
    overlay: {
      zIndex: 1200,
    },
  };
  Modal.setAppElement("#root");
  function title_row(index, request = true) {
    if (request) {
      return (
        <>
          <TableRow className={classes.table_row_style}>
            {/* <TableCell key={index} style={checkbox_style}>
              {"/"}
            </TableCell> */}
            <TableCell key={index} className={classes.name}>
              {"name"}
            </TableCell>
            <TableCell key={index} className={classes.email}>
              {"email"}
            </TableCell>
            <TableCell key={index} className={classes.site}>
              {"site"}
            </TableCell>
          </TableRow>
        </>
      );
    } else {
      return (
        <>
          <TableRow className={classes.table_row_style}>
            <TableCell key={index} className={classes.name}>
              {"name"}
            </TableCell>
            <TableCell key={index} className={classes.email}>
              {"email"}
            </TableCell>
            <TableCell key={index} className={classes.site}>
              {"site"}
            </TableCell>
          </TableRow>
        </>
      );
    }
  }
  const get_member_data = async () => {
    setLoading(true);
    try {
      let response = await USERAPI.member();
      if (response.data.finaldata) {
        console.log(response.data);
        set_member_data(response.data.finaldata);
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
  function data_row(index, data, request = true) {
    if (!data) {
      return null;
    }
    if (request) {
      return (
        <>
          <TableRow className={classes.table_row_style}>
            {/* <TableCell key={index} style={checkbox_style}>
              <input
                type="checkbox"
                checked={select_token.includes(data)}
                onChange={() => handleCheckboxChange(data)}
              />
            </TableCell> */}
            <TableCell key={index} className={classes.name}>
              <p>{data.name}</p>
            </TableCell>
            <TableCell key={index} className={classes.email}>
              <p>{data.email}</p>
            </TableCell>
            <TableCell key={index} className={classes.site}>
              <p>{data.site}</p>
            </TableCell>
          </TableRow>
        </>
      );
    } else {
      return (
        <>
          <TableRow className={classes.table_row_style}>
            <TableCell key={index} className={classes.name}>
              <p>{data.name}</p>
            </TableCell>
            <TableCell key={index} className={classes.email}>
              <p>{data.email}</p>
            </TableCell>
            <TableCell key={index} className={classes.site}>
              <p>{data.site}</p>
            </TableCell>
          </TableRow>
        </>
      );
    }
  }
  const add_member = async () => {
    setLoading(true);
    try {
      const response = await USERAPI.add_member({
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
  function add_member_content() {
    const member_data = [
      { style: classes.name, children: "user name" },
      { style: classes.email, children: "email" },
      { style: classes.site, children: "site" },
    ];
    const options = ["TW", "CN"];
    return (
      <>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <TableContainer>
            <Table row_style={classes.table_row_style} data={member_data}></Table>
            <TableRow className={classes.table_row_style}>
              <TableCell className={classes.name} onClick={() => handleDoubleClick(1, "username")}>
                {isEditing[`${1}_username`] ? (
                  <input
                    ref={inputRef}
                    type="text"
                    value={memberData.username}
                    style={{ width: "160px", height: "30px" }}
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
              <TableCell className={classes.email} onClick={() => handleDoubleClick(1, "email")}>
                {isEditing[`${1}_email`] ? (
                  <input
                    ref={inputRef}
                    type="text"
                    value={memberData.email}
                    style={{ width: "200px", height: "30px" }}
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
              <TableCell className={classes.site}>
                <select
                  value={memberData.site}
                  onChange={(e) => {
                    setmemberData((prevData) => ({
                      ...prevData,
                      site: e.target.value,
                    }));
                  }}
                  style={{ padding: "5px 1px" }}
                >
                  {options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
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
  //load module option
  const openModal = (modalNumber) => {
    setPopFilters((prev) => ({ ...prev, [modalNumber]: true }));
  };
  const closeModal = (modalNumber) => {
    setPopFilters((prev) => ({ ...prev, [modalNumber]: false }));
  };
  const filter_data = search_text
    ? member_data.filter((data) => data.email.toLowerCase().includes(search_text.toLowerCase()))
    : member_data;
  return (
    <div style={{ display: "flex", alignItems: "center", marginLeft: "20px" }}>
      <Loading loading={loading} />
      <div style={{ display: "flex", overflowY: "auto" }}>
        <Modal
          isOpen={popFilters[1]}
          onRequestClose={() => closeModal(1)}
          style={customStyles}
          contentLabel="add member"
        >
          <h2>Add member</h2>
          {add_member_content()}
          <div style={{ display: "flex", flexDirection: "row", marginTop: "10px" }}>
            <Button onClick={add_member}>Add</Button>
            <Button onClick={() => closeModal(1)}>Close</Button>
          </div>
        </Modal>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
        {hasAzureAccess() && <Button onClick={() => openModal(1)}>Add member</Button>}
        <TextField
          variant="outlined"
          value={search_text}
          onChange={(event) => set_search_text(event.target.value)}
          placeholder="Search  email..."
          className={classes.search}
        />
        <TableContainer>
          <Tablebody>{title_row("1")}</Tablebody>
          <Tablebody>
            {filter_data && filter_data.map((data, index) => data_row(index, data))}
          </Tablebody>
        </TableContainer>
      </div>
    </div>
  );
}

export default DropdownWithButton;
