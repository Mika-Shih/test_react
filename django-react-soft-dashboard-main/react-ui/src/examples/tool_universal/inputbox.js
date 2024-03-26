import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
function InputList({ inputList, setInputList }) {
  const [latestInputRef, setLatestInputRef] = useState(null);
  const handleInputChange = (index, value) => {
    const newList = [...inputList];
    newList[index] = value;
    setInputList(newList);
  };

  const handleInputKeyDown = (index, event) => {
    if (event.key === "Enter") {
      setInputList([...inputList, ""]);
    }
  };

  const handleDeleteClick = (index) => {
    if (inputList.length > 1) {
      const newList = inputList.filter((_, i) => i !== index);
      setInputList(newList);
    } else {
      // 如果只剩一个输入框，清空它的值
      const newList = [""]; // 或者使用 Array(inputList.length).fill("")
      setInputList(newList);
    }
  };
  useEffect(() => {
    if (latestInputRef) {
      latestInputRef.focus();
    }
  }, [latestInputRef]);
  return (
    <div>
      {inputList.map((value, index) => (
        <div key={index} style={inputContainerStyle}>
          <input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onKeyDown={(e) => handleInputKeyDown(index, e)}
            style={inputStyle}
            ref={(el) => {
              if (index === inputList.length - 1) {
                setLatestInputRef(el);
              }
            }}
          />
          <button onClick={() => handleDeleteClick(index)} style={deleteButtonStyle}>
            &#10006;
          </button>
        </div>
      ))}
    </div>
  );
}
const inputContainerStyle = {
  display: "flex",
  alignItems: "center",
  marginBottom: "8px",
};

const inputStyle = {
  marginRight: "8px",
  padding: "8px",
};

const deleteButtonStyle = {
  cursor: "pointer",
  padding: "8px",
  backgroundColor: "lightcoral",
  border: "none",
  color: "white",
};

InputList.propTypes = {
  inputList: PropTypes.array.isRequired,
  setInputList: PropTypes.func.isRequired,
};
export default InputList;
