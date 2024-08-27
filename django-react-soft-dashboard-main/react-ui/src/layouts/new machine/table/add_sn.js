import React, { useState, useEffect } from "react";
import Inputbox from "examples/tool_universal/inputbox";
import PropTypes from "prop-types";
function InputWithAddAndClearButton(props) {
  const [inputList, setInputList] = useState([""]);
  useEffect(() => {
    props.serial_number_get(inputList);
    console.log(inputList);
  }, [inputList]);
  useEffect(() => {
    const Data = props.serial_number;
    console.log(Data);
  }, [props.serial_number]);
  return (
    <div style={{ marginLeft: "16px" }}>
      <div>
        <p>Add serial number</p>
        <Inputbox inputList={inputList} setInputList={setInputList} />
      </div>
    </div>
  );
}
InputWithAddAndClearButton.propTypes = {
  serial_number_get: PropTypes.func.isRequired,
  serial_number: PropTypes.array,
};
export default InputWithAddAndClearButton;
