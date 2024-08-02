import React, { useState, useEffect } from "react";
import TableContainer from "@mui/material/TableContainer";
import TextField from "@mui/material/TextField";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Tablebody from "@mui/material/TableBody";
// import Button from "examples/Icons/Button";
import Loading from "examples/tool_universal/loading";
import USERAPI from "api/user";
import useStyles from "./styles/member";
// import { useHistory } from "react-router-dom";
function DropdownWithButton() {
  const classes = useStyles();
  // const history = useHistory();
  const [search_text, set_search_text] = useState("");
  const [member_data, set_member_data] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    get_member_data();
  }, []);
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
          <TableRow style={table_row_style}>
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
          <TableRow style={table_row_style}>
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
          <TableRow style={table_row_style}>
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
  const filter_data = search_text
    ? member_data.filter((data) => data.email.toLowerCase().includes(search_text.toLowerCase()))
    : member_data;
  return (
    <div style={{ display: "flex", alignItems: "center", marginLeft: "20px" }}>
      <Loading loading={loading} />
      <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
        <TextField
          variant="outlined"
          value={search_text}
          onChange={(event) => set_search_text(event.target.value)}
          placeholder="Search  eamil..."
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
