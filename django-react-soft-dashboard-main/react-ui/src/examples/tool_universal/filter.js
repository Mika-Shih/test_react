import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import MenuList from "@mui/material/MenuList";
import axios from "axios";
const backendServer = process.env.REACT_APP_BACKEND_SERVER;
function filter() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [options, setOptions] = useState([]);
  const [searchText, setSearchText] = useState("");
  const handleMenuClick = async (event) => {
    setAnchorEl(event.currentTarget);
    try {
      const response = await axios.get(`${backendServer}polls/api/target/`);
      const targets = response.data.target.reduce((acc, item) => {
        if (item.target !== "") {
          acc.push(item.target);
        }
        return acc;
      }, []);
      console.log("rush");
      setOptions(targets);
    } catch (error) {
      console.error("Error fetching options:", error);
    }
  };
  const selectAll = () => {
    if (allOptionsSelected) {
      setSelectedOptions([]);
    } else {
      const filteredOptions = options.filter((option) => option.toLowerCase().includes(searchText));
      const newSelectedOptions = filteredOptions.filter((option) => !isOptionSelected(option));
      const allSelectedOptions = filteredOptions.filter(
        (option) => !newSelectedOptions.includes(option)
      );
      if (filteredOptions.length == allSelectedOptions.length) {
        setSelectedOptions(selectedOptions.filter((item) => !allSelectedOptions.includes(item)));
      } else {
        setSelectedOptions([...selectedOptions, ...newSelectedOptions]); //newSelectedOptions not include selectedOptions
      }
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
  const allOptionsSelected = options.every((option) => isOptionSelected(option));
  useEffect(() => {
    console.log(selectedOptions);
  }, [selectedOptions]);
  return (
    <div>
      <Button onClick={handleMenuClick}>Open Dropdown</Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        disableAutoFocusItem={false}
      >
        <TextField
          placeholder="Search..." // 搜索框的占位符
          value={searchText}
          onChange={(event) => {
            console.log(anchorEl);
            setSearchText(event.target.value.toLowerCase());
            event.stopPropagation();
          }}
          onMouseDown={(event) => {
            event.stopPropagation();
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown" || event.key === "ArrowUp") {
              event.preventDefault();
            }
          }}
          onBlur={(event) => {
            event.preventDefault();
          }}
        />
        <MenuList
          onKeyDown={(event) => {
            if (event.key === "ArrowDown" || event.key === "ArrowUp") {
              event.preventDefault();
            }
          }}
        ></MenuList>
        <MenuItem onClick={selectAll}>
          <Checkbox checked={allOptionsSelected} />
          Select All
        </MenuItem>
        {options
          .filter((option) => option.toLowerCase().includes(searchText))
          .map((option) => (
            <MenuItem key={option} onClick={() => handleMenuItemClick(option)}>
              <Checkbox checked={isOptionSelected(option)} />
              {option}
            </MenuItem>
          ))}
      </Menu>
    </div>
  );
}

export default filter;
