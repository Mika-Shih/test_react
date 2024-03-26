import React, { useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import axios from "axios";
const backendServer = process.env.REACT_APP_BACKEND_SERVER;
function filter() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [options, setOptions] = useState([]);
  const handleMenuClick = async (event) => {
    setAnchorEl(event.currentTarget);
    try {
      const response = await axios.get(`${backendServer}polls/api/group/`);
      console.log(response.data);
      const groups = response.data.group.reduce((acc, item) => {
        console.log(item);
        if (item.group !== "") {
          acc.push(item.group);
          console.log(item.group);
        }
        return acc;
      }, []);
      console.log("rush");
      console.log(groups);
      setOptions(groups);
    } catch (error) {
      console.error("Error fetching options:", error);
    }
  };

  const handleMenuItemClick = (option) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((item) => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const isOptionSelected = (option) => selectedOptions.includes(option);
  return (
    <div>
      <Button onClick={handleMenuClick}>Open Dropdown</Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        autoFocus={false}
        disableAutoFocusItem
      >
        {options.map((option) => (
          <MenuItem key={option} disableAutoFocusItem onClick={() => handleMenuItemClick(option)}>
            <Checkbox checked={isOptionSelected(option)} />
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}

export default filter;
