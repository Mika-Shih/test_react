import React, { useState } from "react";
import Loading_option from "./loading_option";
// import TextField from "@mui/material/TextField";
// import Autocomplete from "@mui/material/Autocomplete";
// import CircularProgress from "@mui/material/CircularProgress";
// import IconButton from "@mui/material/IconButton";
// import AddIcon from "@mui/icons-material/Add";
// import RemoveIcon from "@mui/icons-material/Remove";
// import Option from "./loading_option";
// import axios from "axios";
// import PropTypes from "prop-types";

// function sleep(duration) {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve();
//     }, duration);
//   });
// }

export default function Asynchronous() {
  const [formData, setFormData] = useState({ folder: [{ title: "", value: "" }] });

  const test = () => {
    console.log(formData.folder);
    console.log(formData.folder.map((option) => option.value).filter((value) => value !== ""));
  };
  return (
    <>
      <div>
        <Loading_option
          api="polls/sharepoint_name_user"
          name="folder_name"
          request={{
            folder_choose: formData.folder
              .map((option) => option.value)
              .filter((value) => value !== ""),
          }}
          selectedOptions={formData.folder.value}
          setSelectedOptions={(newOptions) =>
            setFormData({ ...formData, folder: [...formData.folder, newOptions] })
          }
        />
        <button onClick={test}>test</button>
      </div>
      <div>
        <p>
          config address&nbsp;:&nbsp;
          {formData.folder
            .map((option) => option.value)
            .filter((value) => value !== "")
            .join(" → ")}
        </p>
      </div>
    </>
  );
}

// Asynchronous.propTypes = {
//   api: PropTypes.string.isRequired,
//   name: PropTypes.string.isRequired,
//   selectedOptions: PropTypes.array.isRequired,
//   setSelectedOptions: PropTypes.func.isRequired,
// };
