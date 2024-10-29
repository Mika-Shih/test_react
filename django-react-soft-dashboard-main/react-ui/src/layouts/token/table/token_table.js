import React, { useState, useEffect } from "react";
import Modal from "react-modal";
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
  const [popdata, setPopdata] = useState([]);
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
  function data_row(index, data) {
    if (!data) {
      return null;
    }
    return (
      <>
        <TableRow className={classes.table_row_style}>
          <TableCell key={index} className={classes.email}>
            <p style={{ cursor: "pointer" }} onClick={() => openModal(2, data.email)}>
              {data.email}
            </p>
          </TableCell>
          <TableCell key={index} className={classes.appid}>
            <p style={{ cursor: "pointer" }} onClick={() => openModal(2, data.appid)}>
              {data.appid}
            </p>
          </TableCell>
          <TableCell key={index} className={classes.secret}>
            <p style={{ cursor: "pointer" }} onClick={() => openModal(2, data.secret)}>
              {data.secret}
            </p>
          </TableCell>
          <TableCell key={index} className={classes.approve}>
            <p style={{ cursor: "pointer" }} onClick={() => openModal(2, data.approve)}>
              {data.approve}
            </p>
          </TableCell>
          <TableCell key={index} className={classes.signin}>
            <p style={{ cursor: "pointer" }} onClick={() => openModal(2, data.signin_url)}>
              {data.signin_url}
            </p>
          </TableCell>
        </TableRow>
      </>
    );
  }
  const line_form_style = {
    display: "flex",
    alignItems: "center",
    marginBottom: "14px",
    color: "#000000",
    fontSize: "18px",
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

  function token_content(data) {
    return (
      <>
        <div style={{ flexDirection: "column" }}>
          <div style={line_form_style}>
            <p>{data}</p>
          </div>
        </div>
      </>
    );
  }

  // const filtersearch = () => {
  //   const request_data = {
  //     target: formData.target,
  //     group: formData.group,
  //     cycle: formData.cycle,
  //     platform: formData.platform,
  //     SN: inputList,
  //     phase: formData.phase,
  //     status: formData.status,
  //   };
  //   axios
  //     .post(`${backendServer}polls/api/filtersearch/`, request_data, { timeout: 10000 })
  //     .then((response) => {
  //       if (response.data.finaldata) {
  //         console.log(response.data);
  //         //window.location.replace(`${frontendServer}pulsar/`);
  //         set_machine_data(response.data.finaldata);
  //       } else if (response.data.error) {
  //         alert(response.data.error);
  //       }
  //     });
  //   select_setToken([]);
  //   closeModal(1);
  // };
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
          isOpen={popFilters[2]}
          onRequestClose={() => closeModal(2)}
          style={customStyles}
          contentLabel="token"
        >
          <h2>Token</h2>
          {token_content(popdata)}
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
