import React, { useState } from "react";
import { IconButton, FormControl, Menu, MenuItem } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";

const MyDropdown = ({ options }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const history = useHistory();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOptionSelect = (path) => {
    history.push(path);
    handleClose();
  };
  const signOutOption = { name: "Sign Out", path: "/authentication/sign-out" };
  const allOptions = [...options, signOutOption];
  return (
    <FormControl
      variant="outlined"
      style={{
        display: "flex",
        alignItems: "center",
        position: "relative",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <IconButton onClick={handleClick} style={{ marginLeft: "auto" }}>
          <SettingsIcon />
        </IconButton>
      </div>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {allOptions.map((option, index) => (
          <MenuItem
            key={index}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: 900,
              color: "#333333",
            }}
            onClick={() => handleOptionSelect(option.path)}
          >
            {option.name}
          </MenuItem>
        ))}
      </Menu>
    </FormControl>
  );
};

MyDropdown.propTypes = {
  options: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        path: PropTypes.string.isRequired,
      })
    ),
    PropTypes.array,
  ]),
};
MyDropdown.defaultProps = {
  options: [],
};

export default MyDropdown;
