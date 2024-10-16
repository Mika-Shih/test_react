import React, { useState, useEffect } from "react";
import TableContainer from "@mui/material/TableContainer";
import TextField from "@mui/material/TextField";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Tablebody from "@mui/material/TableBody";
import Button from "examples/Icons/Button";
import Table from "examples/Table/table_row";
import Loading from "examples/tool_universal/loading";
import Loading_option from "examples/tool_universal/loading_option";
import { Dialog, Box } from "@mui/material";
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
  const [edit_member, set_edit_member] = useState({
    id: null,
    username: "",
    site: "",
    email: "",
  });
  const [select_edit, set_select_edit] = useState();
  useEffect(() => {
    get_member_data();
  }, []);
  useEffect(() => {
    console.log(select_edit);
  }, [select_edit]);
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
  const edit_member_api = async () => {
    setLoading(true);
    try {
      const response = await USERAPI.edit_member({
        id: edit_member.id,
        name: edit_member.username,
        email: edit_member.email,
        site: edit_member.site,
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
  function add_member_content() {
    const member_data = [
      { style: classes.name, children: "User Name" },
      { style: classes.email, children: "Email" },
      { style: classes.site, children: "Site" },
    ];
    const options = ["TW", "CN"];
    return (
      <>
        <div className={classes.columns_center}>
          <h2>Add member</h2>
          <div style={{ marginBottom: "16px" }}></div>
          <TableContainer>
            <Table row_style={classes.title_table_row_style} data={member_data}></Table>
            <TableRow className={classes.table_row_style}>
              <TableCell className={classes.name}>
                <input
                  type="text"
                  value={memberData.username}
                  style={{ width: "160px", height: "30px" }}
                  onChange={(e) => {
                    setmemberData((prevData) => ({
                      ...prevData,
                      username: e.target.value,
                    }));
                  }}
                />
              </TableCell>
              <TableCell className={classes.email}>
                <input
                  type="text"
                  value={memberData.email}
                  style={{ width: "200px", height: "30px" }}
                  onChange={(e) => {
                    setmemberData((prevData) => ({
                      ...prevData,
                      email: e.target.value,
                    }));
                  }}
                />
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
          <div style={{ marginBottom: "16px" }}></div>
          <div className={classes.line_form_style}>
            <Button onClick={add_member}>Add</Button>
            <Button onClick={() => closeModal(1)}>Close</Button>
          </div>
        </div>
      </>
    );
  }
  function edit_member_content() {
    return (
      <>
        <div className={classes.columns_center}>
          <label htmlFor="old_email">Please Choose User&nbsp;:&nbsp;&nbsp;</label>
          <div style={{ marginBottom: "16px" }}></div>
          <Loading_option
            api="polls/lendpersonnel"
            name="user_mail"
            selectedOptions={select_edit}
            setSelectedOptions={(newOptions) => set_select_edit(newOptions)}
          />
          <div style={{ marginBottom: "16px" }}></div>
          <div className={classes.line_form_style}>
            <div className={classes.columns_center}>
              <label htmlFor="user_name">User Name&nbsp;:&nbsp;&nbsp;</label>
              <input
                id="user_name"
                name="user_name"
                style={{
                  width: "450px",
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  textAlign: "center",
                }}
                value={edit_member.username}
                onChange={(e) => {
                  set_edit_member({
                    ...edit_member,
                    username: e.target.value,
                  });
                }}
              />
            </div>
          </div>
          <div className={classes.line_form_style}>
            <div className={classes.columns_center}>
              <label htmlFor="email">Email&nbsp;:&nbsp;&nbsp;</label>
              <input
                id="email"
                name="email"
                style={{
                  width: "450px",
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  textAlign: "center",
                }}
                value={edit_member.email}
                onChange={(e) => {
                  set_edit_member({
                    ...edit_member,
                    email: e.target.value,
                  });
                }}
              />
            </div>
          </div>
          <div className={classes.line_form_style}>
            <div className={classes.columns_center}>
              <label htmlFor="site">Site&nbsp;:&nbsp;&nbsp;</label>
              <input
                id="site"
                name="site"
                style={{
                  width: "450px",
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  textAlign: "center",
                }}
                value={edit_member.site}
                onChange={(e) => {
                  set_edit_member({
                    ...edit_member,
                    site: e.target.value,
                  });
                }}
              />
            </div>
          </div>
          <div style={{ marginBottom: "16px" }}></div>
          <div className={classes.line_form_style}>
            <Button onClick={edit_member_api}>Edit</Button>
            <Button onClick={() => closeModal(2)}>Close</Button>
          </div>
        </div>
      </>
    );
  }
  useEffect(() => {
    if (select_edit) {
      const filteredMember = member_data.find((member) => member.email === select_edit.value);
      if (filteredMember) {
        set_edit_member({
          id: filteredMember.id,
          username: filteredMember.name,
          site: filteredMember.site,
          email: filteredMember.email,
        });
      }
    } else {
      set_edit_member({
        id: null,
        username: "",
        site: "",
        email: "",
      });
    }
  }, [select_edit]);
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
      <Dialog open={popFilters[1]} onClose={() => closeModal(1)} fullWidth maxWidth="lg">
        <Box sx={{ padding: "30px" }}>{add_member_content()}</Box>
      </Dialog>
      <Dialog open={popFilters[2]} onClose={() => closeModal(2)} fullWidth maxWidth="lg">
        <Box sx={{ padding: "30px" }}>{edit_member_content()}</Box>
      </Dialog>
      <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
        <div className={classes.line_form_style}>
          {hasAzureAccess() && <Button onClick={() => openModal(1)}>Add Member</Button>}
          {hasAzureAccess() && <Button onClick={() => openModal(2)}>Edit member</Button>}
        </div>
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
