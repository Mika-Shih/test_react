import React from "react";
import PropTypes from "prop-types";
import { Dialog, Box, Button } from "@mui/material";

function ContentDialog({ open, onClose, title, content }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      sx={{
        "& .MuiPaper-root": {
          borderRadius: "12px",
          boxShadow: "0px 5px 15px rgba(0,0,0,0.2)",
        },
      }}
    >
      <Box sx={{ padding: "20px", fontSize: "16px" }}>
        <h3 style={{ textAlign: "center", marginBottom: "10px" }}>{title}</h3>
        <p style={{ textAlign: "left", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
          {content}
        </p>
        <div style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
          <Button
            onClick={onClose}
            style={{
              backgroundColor: "#bbdefb",
              color: "#fff",
              borderRadius: "20px",
              padding: "8px 20px",
              border: "none",
              fontWeight: "500",
              minWidth: "80px",
            }}
          >
            Close
          </Button>
        </div>
      </Box>
    </Dialog>
  );
}

ContentDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string,
};

export default ContentDialog;
