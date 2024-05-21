import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import MenuList from "@mui/material/MenuList";
import TOOLAPI from "api/tool";
function filter({
  api,
  item_name = [],
  request = null,
  selectedOptions,
  setSelectedOptions,
  buttonLabel,
}) {
  const itemNames = Array.isArray(item_name) ? item_name : [item_name];
  const [anchorEl, setAnchorEl] = useState(null);
  const [options, setOptions] = useState([]);
  const [searchText, setSearchText] = useState("");
  const handleMenuClick = async (event) => {
    setAnchorEl(event.currentTarget);
    try {
      let optionsDictionary = {};
      if (request == null) {
        const response = await TOOLAPI.filter_get(api);
        for (const name of itemNames) {
          if (response.data[name] != null) {
            const response_item = response.data[name].filter(
              (item) => item != null && item.trim() !== ""
            );
            optionsDictionary[name] = response_item;
          }
        }
        setOptions(optionsDictionary);
      } else {
        const response = await TOOLAPI.filter_post(api, request);
        for (const name of itemNames) {
          if (response.data[name] != null) {
            const response_item = response.data[name].filter(
              (item) => item != null && item.trim() !== ""
            );
            optionsDictionary[name] = response_item;
          }
        }
        setOptions(optionsDictionary);
      }
    } catch (error) {
      console.error("Error fetching options:", error);
    }
  };
  const selectAll = () => {
    if (allOptionsSelected) {
      setSelectedOptions([]);
    } else {
      const allValues = Object.values(options).flat();
      const filteredOptions = allValues.filter((option) =>
        option.toLowerCase().includes(searchText)
      );
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
  const allOptionsSelected = Object.values(options)
    .flat()
    .every((option) => isOptionSelected(option));
  useEffect(() => {}, [selectedOptions]);

  function filter_category() {
    return (
      <>
        {Object.entries(options).map(([title, items]) => (
          <React.Fragment key={title}>
            <MenuItem>
              <strong>{title}</strong>
            </MenuItem>
            {items
              .filter((item) => item.toLowerCase().includes(searchText))
              .map((item) => (
                <MenuItem key={item} onClick={() => handleMenuItemClick(item)}>
                  <Checkbox checked={isOptionSelected(item)} />
                  {item}
                </MenuItem>
              ))}
          </React.Fragment>
        ))}
      </>
    );
  }
  return (
    <div>
      <Button onClick={handleMenuClick}>{buttonLabel}</Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        disableAutoFocusItem={false}
      >
        <TextField
          placeholder="Search..."
          value={searchText}
          onChange={(event) => {
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
        {filter_category()}
      </Menu>
    </div>
  );
}

export default filter;
