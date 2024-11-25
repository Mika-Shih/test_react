import React, { useState, useEffect } from "react";
import { Dialog, Box } from "@mui/material";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Tablebody from "@mui/material/TableBody";
import Button from "examples/Icons/Button";
import Loading from "examples/tool_universal/loading";
import PropTypes from "prop-types";
import USERAPI from "api/user";
import useStyles from "layouts/token/table/styles/token_style";
import { useHistory } from "react-router-dom";
function DropdownWithButton() {
  const classes = useStyles();
  const history = useHistory();
  const [token, setToken] = useState([]);
  const [edit, set_edit] = useState({
    email: "",
    appid: "",
    secret: "",
    approve: "",
    signin_url: "",
  });
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
  function title_row(index) {
    return (
      <>
        <TableRow className={classes.title_table_row_style}>
          <TableCell key={index} className={classes.title_email}>
            {"email"}
          </TableCell>
          <TableCell key={index} className={classes.title_appid}>
            {"appid"}
          </TableCell>
          <TableCell key={index} className={classes.title_secret}>
            {"secret"}
          </TableCell>
          <TableCell key={index} className={classes.title_approve}>
            {"approve"}
          </TableCell>
          <TableCell key={index} className={classes.title_signin}>
            {"signin"}
          </TableCell>
        </TableRow>
      </>
    );
  }
  const get_machine_status_report = async () => {
    setLoading(true);
    try {
      let response = await USERAPI.view_token();
      if (response.data) {
        console.log(response.data);
        setToken(response.data.finaldata);
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
  const edit_token = async () => {
    setLoading(true);
    try {
      let response = await USERAPI.edit_token({
        email: edit.email,
        appid: edit.appid,
        secret: edit.secret,
        approve: edit.approve,
        signin_url: edit.signin_url,
      });
      if (response.data.finaldata) {
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
  function data_row(index, data) {
    if (!data) {
      return null;
    }
    return (
      <>
        <TableRow
          className={classes.table_row_style}
          onClick={() => openModal(1, data)}
          style={{ cursor: "pointer" }}
        >
          <TableCell key={index} className={classes.email}>
            <p>{data.email}</p>
          </TableCell>
          <TableCell key={index} className={classes.appid}>
            <p>{data.appid}</p>
          </TableCell>
          <TableCell key={index} className={classes.secret}>
            <p>{data.secret}</p>
          </TableCell>
          <TableCell key={index} className={classes.approve}>
            <p>{data.approve}</p>
          </TableCell>
          <TableCell key={index} className={classes.signin}>
            <p>{data.signin_url}</p>
          </TableCell>
        </TableRow>
      </>
    );
  }
  //load module option
  const openModal = (modalNumber, data = null) => {
    set_edit({
      email: data.email,
      appid: data.appid,
      secret: data.secret,
      approve: data.approve,
      signin_url: data.signin_url,
    });
    setPopFilters((prev) => ({ ...prev, [modalNumber]: true }));
  };
  const closeModal = (modalNumber) => {
    setPopFilters((prev) => ({ ...prev, [modalNumber]: false }));
  };

  function token_content() {
    return (
      <>
        <div className={classes.columns_center}>
          <div className={classes.line_form_style}>
            <div className={classes.columns_center}>
              <label htmlFor="email">Email&nbsp;:&nbsp;&nbsp;</label>
              <label htmlFor="edit_eamil">{edit.email}&nbsp;&nbsp;&nbsp;</label>
            </div>
          </div>
          <div className={classes.line_form_style}>
            <div className={classes.columns_center}>
              <label htmlFor="appid">Appid&nbsp;:&nbsp;&nbsp;</label>
              <input
                id="appid"
                name="appid"
                style={{
                  width: "480px",
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                }}
                value={edit.appid}
                onChange={(e) => {
                  set_edit({
                    ...edit,
                    appid: e.target.value,
                  });
                }}
              />
            </div>
          </div>
          <div className={classes.line_form_style}>
            <div className={classes.columns_center}>
              <label htmlFor="secret">Secret&nbsp;:&nbsp;&nbsp;</label>
              <input
                id="secret"
                name="secret"
                style={{
                  width: "480px",
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                }}
                value={edit.secret}
                onChange={(e) => {
                  set_edit({
                    ...edit,
                    secret: e.target.value,
                  });
                }}
              />
            </div>
          </div>
          <div className={classes.line_form_style}>
            <div className={classes.columns_center}>
              <label htmlFor="approve">Approve&nbsp;:&nbsp;&nbsp;</label>
              <textarea
                id="approve"
                name="approve"
                rows={8}
                style={{
                  width: "480px",
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                }}
                value={edit.approve}
                onChange={(e) => {
                  set_edit({
                    ...edit,
                    approve: e.target.value,
                  });
                }}
              />
            </div>
          </div>
          <div className={classes.line_form_style}>
            <div className={classes.columns_center}>
              <label htmlFor="signin_url">Signin Url&nbsp;:&nbsp;&nbsp;</label>
              <input
                id="signin_url"
                name="signin_url"
                style={{
                  width: "480px",
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                }}
                value={edit.signin_url}
                onChange={(e) => {
                  set_edit({
                    ...edit,
                    signin_url: e.target.value,
                  });
                }}
              />
            </div>
          </div>
          <div style={{ marginBottom: "30px" }}></div>
          <div className={classes.line_form_style}>
            <Button onClick={edit_token}>Edit Token</Button>
            <Button onClick={() => closeModal(1)}>Close</Button>
          </div>
        </div>
      </>
    );
  }

  const Row = ({ index, style }) => (
    <TableRow style={style}>{data_row(index, token[index])}</TableRow>
  );
  Row.propTypes = {
    index: PropTypes.number.isRequired,
    style: PropTypes.object.isRequired,
  };
  return (
    <div style={{ display: "flex", alignItems: "center", marginLeft: "20px" }}>
      <Loading loading={loading} />
      <Dialog open={popFilters[1]} onClose={() => closeModal(1)} fullWidth maxWidth="md">
        <Box sx={{ padding: "20px" }}>{token_content()}</Box>
      </Dialog>
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
