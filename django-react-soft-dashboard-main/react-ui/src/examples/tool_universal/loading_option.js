import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import PropTypes from "prop-types";
const backendServer = process.env.REACT_APP_BACKEND_SERVER;
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
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const loading = open && options.length === 0;
  React.useEffect(() => {
    let active = true;
    const fetchData = async () => {
      try {
        if (open) {
          await sleep(1e3);
          if (request == null) {
            const response = await axios.get(`${backendServer}${api}/`);
            const formattedOptions = response.data[name]
              .filter((item) => item !== "")
              .map((item) => ({
                title: item,
                value: item,
              }));
            if (active) {
              setOptions(formattedOptions);
            }
          } else {
            const response = await axios.post(`${backendServer}${api}/`, request);
            const formattedOptions = response.data[name]
              .filter((item) => item !== "")
              .map((item) => ({
                title: item,
                value: item,
              }));
            if (active) {
              setOptions(formattedOptions);
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();

    // if (!loading) {
    //   return undefined;
    // }

    // (async () => {
    //   await sleep(1e3);

    //   if (active) {
    //     setOptions([...topFilms]);
    //   }
    // })();

    return () => {
      active = false;
    };
  }, [loading]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);
  React.useEffect(() => {}, [selectedOptions]);

  return (
    <Autocomplete
      id="asynchronous-demo"
      sx={{ width: 300 }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      isOptionEqualToValue={(option, value) => option.title === value.title}
      getOptionLabel={(option) => option.title}
      options={options}
      loading={loading}
      value={selectedOptions}
      s
      onChange={(event, newValue) => {
        setSelectedOptions(newValue);
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
  );
}
Asynchronous.propTypes = {
  api: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  request: PropTypes.object,
  selectedOptions: PropTypes.array.isRequired,
  setSelectedOptions: PropTypes.func.isRequired,
};
