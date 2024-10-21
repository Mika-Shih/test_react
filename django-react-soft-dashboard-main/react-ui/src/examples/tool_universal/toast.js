import React, { useState, useImperativeHandle, forwardRef } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import PropTypes from "prop-types";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Box } from "@mui/material";
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ToastNotification = forwardRef((props, ref) => {
  const [open, setOpen] = useState(false);
  const { message, setMessage } = useState("");
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const showToast = (msg) => {
    setMessage(msg);
    setOpen(true);
  };

  useImperativeHandle(ref, () => ({
    showToast,
  }));
  console.log("message", message);
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        onClose={handleClose}
        severity="info"
        sx={{
          width: "100%",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          "& .MuiAlert-message": { color: "black" },
          fontSize: "1rem",
          display: "flex",
          alignItems: "center",
        }}
        action={null}
      >
        <CheckCircleIcon sx={{ color: "green", marginRight: 1 }} />
        {message || "Successfully"}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <CheckCircleIcon sx={{ color: "green", marginRight: 1 }} />
          {message || "Successfully"}
        </Box>
      </Alert>
    </Snackbar>
  );
});
ToastNotification.propTypes = {
  message: PropTypes.string,
};
ToastNotification.displayName = "ToastNotification";
export default ToastNotification;
