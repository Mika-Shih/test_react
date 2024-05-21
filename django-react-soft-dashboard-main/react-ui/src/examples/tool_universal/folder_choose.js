import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Option from "./loading_option";
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
    const [lendData, setlendData] = useState({
        lendperson: null,
        purpose: "",
        message: "",
        cc_mail: [],
        });
  const [options, setOptions] = React.useState([]);
  const loading = options.length === 0;
  const [numberOfOptions, setNumberOfOptions] = React.useState(1);

  const [openStates, setOpenStates] = React.useState(Array(numberOfOptions).fill(false));

  React.useEffect(() => {
    let active = true;

    const fetchData = async () => {
      try {
        await sleep(1e3);

        let response;

        if (request === null) {
          response = await axios.get(`${backendServer}${api}/`);
        } else {
          response = await axios.post(`${backendServer}${api}/`, request);
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
      {/* <div className={classes.line_form_style}>
        <Loading_option
            api="polls/lendpersonnel"
            name="folder_choose"
            request={null}
            selectedOptions={lendData.lendperson}
            setSelectedOptions={(newOptions) =>
            setlendData({ ...lendData, lendperson: newOptions })
            }
        />
      </div> */}
      <input
            id="cc_mail"
            name="cc_mail"
            style={{ width: "200px", padding: "8px" }}
            value={lendData.cc_mail}
            onChange={(e) => {
            setlendData({
                ...lendData,
                cc_mail: e.target.value,
            });
            }}
        />
    </div>
  );
}

Asynchronous.propTypes = {
  api: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  selectedOptions: PropTypes.array.isRequired,
  setSelectedOptions: PropTypes.func.isRequired,
};
