import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import TOOLAPI from "api/tool";
import PropTypes from "prop-types";

function sleep(duration) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}

export default function Asynchronous({
  api,
  name = [],
  request = null,
  selectedOptions,
  setSelectedOptions,
}) {
  const [options, setOptions] = React.useState([]);
  const loading = options.length === 0;
  const [numberOfOptions, setNumberOfOptions] = React.useState(selectedOptions.length || 1);

  const [openStates, setOpenStates] = React.useState(Array(numberOfOptions).fill(false));

  React.useEffect(() => {
    let active = true;

    const fetchData = async () => {
      try {
        await sleep(1e3);

        let response;

        if (request === null) {
          response = await TOOLAPI.filter_get(api);
        } else {
          response = await TOOLAPI.filter_post(api, request);
        }

        const formattedOptions = response.data[name]
          .filter((item) => item !== "")
          .map((item) => ({
            title: item,
            value: item,
          }));

        if (active) {
          setOptions(formattedOptions);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();

    return () => {
      active = false;
    };
  }, [loading]);

  const handleAddOption = () => {
    setNumberOfOptions((prev) => prev + 1);
    setOpenStates((prev) => [...prev, false]);
  };

  const handleRemoveOption = () => {
    setNumberOfOptions((prev) => Math.max(1, prev - 1));
    setOpenStates((prev) => prev.slice(0, -1));
    const updatedOptions = [...selectedOptions];
    const updatedOptionsWithoutLast = updatedOptions.slice(0, -1);
    setSelectedOptions(updatedOptionsWithoutLast);
  };

  const handleOpenChange = (index, isOpen) => {
    setOpenStates((prev) => {
      const newState = [...prev];
      newState[index] = isOpen;
      return newState;
    });
  };

  React.useEffect(() => {}, [selectedOptions]);

  return (
    <div>
      {[...Array(numberOfOptions)].map((_, index) => (
        <div key={index}>
          <Autocomplete
            id={`asynchronous-demo-${index}`}
            sx={{ width: 300 }}
            open={openStates[index]}
            onOpen={() => handleOpenChange(index, true)}
            onClose={() => handleOpenChange(index, false)}
            isOptionEqualToValue={(option, value) => option.title === value.title}
            getOptionLabel={(option) => option.title}
            options={options}
            loading={loading}
            value={selectedOptions[index] || null}
            onChange={(event, newValue) => {
              const updatedOptions = [...selectedOptions];
              updatedOptions[index] = newValue;
              setSelectedOptions(updatedOptions);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {loading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
              />
            )}
          />
          {index === numberOfOptions - 1 && (
            <>
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                <IconButton onClick={handleAddOption}>
                  <AddIcon />
                </IconButton>
                {numberOfOptions > 1 && (
                  <IconButton onClick={handleRemoveOption}>
                    <RemoveIcon />
                  </IconButton>
                )}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

Asynchronous.propTypes = {
  api: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  request: PropTypes.object,
  selectedOptions: PropTypes.array.isRequired,
  setSelectedOptions: PropTypes.func.isRequired,
};
