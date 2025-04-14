import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import TOOLAPI from "api/tool";
import Tooltip from "@mui/material/Tooltip";
import PropTypes from "prop-types";

function sleep(duration) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}

export default function Asynchronous({ api, request = null, selectedOptions, setSelectedOptions }) {
  const [options, setOptions] = React.useState([]);
  const loading = options.length === 0;
  const [numberOfOptions, setNumberOfOptions] = React.useState(selectedOptions.length || 1);
  const [openStates, setOpenStates] = React.useState(Array(numberOfOptions).fill(false));

  // 用於加載數據的 useEffect
  React.useEffect(() => {
    let active = true;

    const fetchData = async () => {
      try {
        await sleep(1000);

        console.log("Fetching data from API...");
        let response;

        if (request === null) {
          response = await TOOLAPI.filter_get(api);
        } else {
          response = await TOOLAPI.filter_post(api, request);
        }

        console.log("API response:", response.data);

        let formattedOptions = [];

        if (api === "test_plans/test_case/list_case") {
          // 處理 Test Case 資料
          formattedOptions = response.data.finaldata.flatMap((category) =>
            category.data.map((testCase, index) => ({
              id: testCase.case_id,
              title: testCase.case_name,
              tag: category.tag || "No Tag",
              description: testCase.description || "No Description",
              comment: testCase.comment || "No Comment",
              version: `V.${index + 1}` || "No Version",
            }))
          );
          console.log("Formatted test cases:", formattedOptions);
        } else if (api === "polls/lendpersonnel") {
          // 處理 Editor 資料
          formattedOptions = response.data.user_mail.map((email) => ({
            id: email,
            title: email, // 僅顯示 email
          }));
          console.log("Formatted editor data:", formattedOptions);
        }

        if (active) {
          setOptions(formattedOptions);
          console.log("Options set successfully:", formattedOptions);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    return () => {
      active = false;
    };
  }, [api, request]);

  const handleAddOption = () => {
    setNumberOfOptions((prev) => prev + 1);
    setOpenStates((prev) => [...prev, false]);
  };

  const handleRemoveOption = () => {
    setNumberOfOptions((prev) => Math.max(1, prev - 1));
    setOpenStates((prev) => prev.slice(0, -1));

    const updatedOptions = [...selectedOptions];
    setSelectedOptions(updatedOptions.slice(0, -1));
  };

  const handleOpenChange = (index, isOpen) => {
    setOpenStates((prev) => {
      const newState = [...prev];
      newState[index] = isOpen;
      return newState;
    });
  };

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
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(option) => option.title || ""}
            options={options}
            loading={loading}
            value={selectedOptions[index] || { title: "", id: null }}
            onChange={(event, newValue) => {
              const updatedOptions = [...selectedOptions];
              updatedOptions[index] = newValue || { title: "", id: null };
              setSelectedOptions(updatedOptions);
            }}
            renderOption={(props, option) => (
              <li {...props}>
                {api === "test_plans/test_case/list_case" ? (
                  <Tooltip title={`Description: ${option.description}, Comment: ${option.comment}`}>
                    <div
                      style={{ display: "flex", justifyContent: "space-between", width: "100%" }}
                    >
                      <span>
                        {option.title} ({option.version || "N/A"})
                      </span>
                      <span style={{ fontSize: "12px", color: "#888" }}>{option.tag}</span>
                    </div>
                  </Tooltip>
                ) : (
                  <span>{option.title}</span> // Editor 僅顯示 email
                )}
              </li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />

          {index === numberOfOptions - 1 && (
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
          )}
        </div>
      ))}
    </div>
  );
}

Asynchronous.propTypes = {
  api: PropTypes.string.isRequired,
  name: PropTypes.arrayOf(PropTypes.string),
  request: PropTypes.object,
  selectedOptions: PropTypes.array.isRequired,
  setSelectedOptions: PropTypes.func.isRequired,
};
