import React, { useState } from "react";
import Modal from "react-modal";
import Loading from "examples/tool_universal/loading";
import useStyles from "./styles/account";
import Button from "examples/Icons/Button";
import Auth from "api/auth";
import { useHistory } from "react-router-dom";
function DropdownWithButton() {
  const history = useHistory();
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [popFilters, setPopFilters] = useState({
    1: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
    approve_code: "",
    key_code: "",
  });
  const customStyles = {
    content: {
      maxWidth: "500px",
      minWidth: "500px",
      maxHeight: "200px",
      minHeight: "200px",
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-250px",
      transform: "translate(-50%, -50%)",
      overflowY: "auto",
    },
    overlay: {
      zIndex: 1000,
    },
  };
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  //load module option
  const openModal = (modalNumber) => {
    setPopFilters((prev) => ({ ...prev, [modalNumber]: true }));
  };
  // const closeModal = (modalNumber) => {
  //   setPopFilters((prev) => ({ ...prev, [modalNumber]: false }));
  // };
  const change_password = async () => {
    setLoading(true);
    if (password.newPassword !== password.confirmNewPassword) {
      alert("Password does not match.");
      setLoading(false);
      return;
    }
    try {
      const response = await Auth.change_password({
        old_password: password.oldPassword,
        new_password: password.newPassword,
        confirm_password: password.confirmNewPassword,
      });
      if (response.data.finaldata) {
        setPassword({ ...password, key_code: response.data.finaldata });
        openModal(1);
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
  const active_code = async () => {
    setLoading(true);
    try {
      const response = await Auth.active_code({
        A: password.key_code,
        B: password.approve_code,
        new_password: password.newPassword,
        confirm_password: password.confirmNewPassword,
      });
      if (response.data.finaldata) {
        alert(response.data.finaldata);
        history.push("/authentication/sign-out");
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
  const account_change_content = () => {
    return (
      <>
        <div className={classes.inputContainer}>
          <input
            type="text"
            placeholder=""
            className={classes.textField}
            onChange={(e) => setPassword({ ...password, approve_code: e.target.value })}
          />
          <Button style={{ margin: "10px", padding: "10px" }} onClick={change_password}>
            Code again
          </Button>
        </div>
      </>
    );
  };

  return (
    <div style={{ display: "flex", alignItems: "center", marginLeft: "20px" }}>
      <Loading loading={loading} />
      <div style={{ display: "flex", overflowY: "auto" }}>
        <Modal isOpen={popFilters[1]} style={customStyles} contentLabel="filter">
          <h2>Verification Code</h2>
          {account_change_content()}
          <Button style={{ margin: "10px", padding: "10px" }} onClick={active_code}>
            Approve
          </Button>
        </Modal>
      </div>
      <div style={{ display: "flex", overflowY: "auto" }}>
        <div className={classes.leftBlockStyle}>
          <div className={classes.inputContainer}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Old Password"
              className={classes.textField}
              onChange={(e) => setPassword({ ...password, oldPassword: e.target.value })}
            />
            <button onClick={handleClickShowPassword}>{showPassword ? "Hide" : "Show"}</button>
          </div>
          <div className={classes.inputContainer}>
            <input
              type="password"
              placeholder="New Password"
              className={classes.textField}
              onChange={(e) => setPassword({ ...password, newPassword: e.target.value })}
            />
          </div>
          <div className={classes.inputContainer}>
            <input
              type="password"
              placeholder="Confirm New Password"
              className={classes.textField}
              onChange={(e) => setPassword({ ...password, confirmNewPassword: e.target.value })}
            />
          </div>
        </div>
        <div className={classes.rightBlockStyle}>
          <button onClick={change_password}>Change Password</button>
        </div>
      </div>
    </div>
  );
}

export default DropdownWithButton;
