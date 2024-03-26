import React, { useState, useEffect } from "react";
import Button from "examples/Icons/Button";
import PropTypes from "prop-types";
const frontendServer = process.env.REACT_APP_FRONTEND_SERVER;
function DropdownWithButton(props) {
  const [selectedOption, setSelectedOption] = useState("");
  const [options, setOptions] = useState("option0");
  useEffect(() => {
    props.option(options);
  }, [options]);
  const [message, setMessage] = useState("");

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };
  const handleButtonClick = () => {
    console.log(selectedOption);
    if (selectedOption) {
      setOptions(selectedOption);
      console.log(options);
    } else {
      setMessage("Please select an option");
    }
  };
  const handleAddMachineClick = () => {
    window.location.href = `${frontendServer}new_machine/`;
  };

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <div style={{ display: "flex", alignItems: "center", marginRight: "100px" }}>
        <select
          value={selectedOption}
          onChange={handleOptionChange}
          style={{ padding: "5px 10px", marginLeft: "20px", marginRight: "10px" }}
        >
          <option value="option1">借出</option>
          <option value="option2">歸還</option>
          <option value="option3">新機入庫</option>
          <option value="option4">批次修改</option>
          <option value="option5">批次刪除</option>
          <option value="option6">批次報廢機台</option>
        </select>
        <Button onClick={handleButtonClick}>Submit</Button>
        <p>{message}</p>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Button onClick={handleAddMachineClick}>新增機台</Button>
      </div>
    </div>
  );
}
DropdownWithButton.propTypes = {
  option: PropTypes.func.isRequired,
};
export default DropdownWithButton;
