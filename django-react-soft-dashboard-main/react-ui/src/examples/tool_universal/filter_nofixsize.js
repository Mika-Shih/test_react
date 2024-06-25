import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import PropTypes from "prop-types";

const theme = createTheme();

const App = ({
  options = [],
  selectedOptions,
  setSelectedOptions,
  buttonText = "Select",
  setButtonName,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [formattedOptions, setFormattedOptions] = useState([]);
  const [visibleOptions, setVisibleOptions] = useState([]);

  useEffect(() => {
    const formatted = options.map((option, index) => ({
      title: option,
      value: `option${index + 1}`,
      checked: selectedOptions.some((selected) => selected.title === option),
    }));
    setFormattedOptions(formatted);
    setVisibleOptions(formatted);
  }, [options, selectedOptions]);

  const handleButtonClick = (event) => {
    setAnchorEl(event.currentTarget);
    if (setButtonName) {
      setButtonName(buttonText.toLowerCase());
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleToggle = (option) => () => {
    const currentIndex = selectedOptions.findIndex((selected) => selected.title === option.title);
    const newChecked = [...selectedOptions];

    if (currentIndex === -1) {
      newChecked.push(option);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setSelectedOptions(newChecked);
  };

  const handleSelectAll = () => {
    const filteredOptions = visibleOptions.filter((option) =>
      option.title.toLowerCase().includes(searchText.toLowerCase())
    );

    const allSelected = filteredOptions.every((option) =>
      selectedOptions.some((selected) => selected.title === option.title)
    );

    if (allSelected) {
      setSelectedOptions(
        selectedOptions.filter(
          (option) => !filteredOptions.some((filtered) => filtered.title === option.title)
        )
      );
    } else {
      const newSelection = filteredOptions.filter(
        (option) => !selectedOptions.some((selected) => selected.title === option.title)
      );
      setSelectedOptions([...selectedOptions, ...newSelection]);
    }
  };

  const handleSearchChange = (event) => {
    const searchText = event.target.value.toLowerCase();
    setSearchText(searchText);

    const filteredOptions = formattedOptions.filter((option) =>
      option.title.toLowerCase().includes(searchText)
    );
    setVisibleOptions(filteredOptions);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const allFilteredSelected =
    visibleOptions.length > 0 &&
    visibleOptions.every((option) =>
      selectedOptions.some((selected) => selected.title === option.title)
    );
  const someFilteredSelected =
    visibleOptions.some((option) =>
      selectedOptions.some((selected) => selected.title === option.title)
    ) && !allFilteredSelected;

  return (
    <ThemeProvider theme={theme}>
      <Button variant="contained" color="primary" onClick={handleButtonClick}>
        {buttonText}
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <div style={{ width: 300, padding: 10 }}>
          <TextField
            variant="outlined"
            label="Search..."
            fullWidth
            onChange={handleSearchChange}
            value={searchText}
          />
          <List style={{ maxHeight: "400px", overflow: "auto" }}>
            <ListItem button onClick={handleSelectAll}>
              <Checkbox checked={allFilteredSelected} indeterminate={someFilteredSelected} />
              <ListItemText primary="Select All" />
            </ListItem>
            {visibleOptions.map((option) => (
              <ListItem key={option.value} button onClick={handleToggle(option)}>
                <Checkbox checked={option.checked} />
                <ListItemText primary={option.title} />
              </ListItem>
            ))}
          </List>
        </div>
      </Popover>
    </ThemeProvider>
  );
};

App.propTypes = {
  options: PropTypes.array,
  selectedOptions: PropTypes.array.isRequired,
  setSelectedOptions: PropTypes.func.isRequired,
  buttonText: PropTypes.string,
  setButtonName: PropTypes.func,
};

export default App;
