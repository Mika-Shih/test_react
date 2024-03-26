import React, { useState, useRef, useEffect } from "react";

function InputWithAddAndClearButton() {
  const [inputFields, setInputFields] = useState([{ value: "" }]);
  const [inputFieldsCount, setInputFieldsCount] = useState(1);
  const inputRefs = useRef([]); // 用于存储输入框的引用

  const handleInputChange = (index, event) => {
    const newInputFields = [...inputFields];
    newInputFields[index].value = event.target.value;
    setInputFields(newInputFields);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      const newInputFields = [...inputFields];
      newInputFields.push({ value: "" });
      setInputFields(newInputFields);
    }
  };

  const handleClearInput = (index) => {
    if (inputFields.length > 1) {
      const newInputFields = [...inputFields];
      newInputFields.splice(index, 1);
      setInputFields(newInputFields);
    } else {
      const newInputFields = [...inputFields];
      newInputFields[index].value = "";
      setInputFields(newInputFields);
      if (inputRefs.current[inputFields.length - 1]) {
        inputRefs.current[inputFields.length - 1].focus();
      }
    }
  };

  const handleAddInput = () => {
    const newInputFields = [...inputFields];
    newInputFields.push({ value: "" });
    setInputFields(newInputFields);
  };

  // 当输入框数量变化时，设置焦点到最新的输入框
  useEffect(() => {
    if (inputFieldsCount !== inputFields.length) {
      if (inputRefs.current[inputFields.length - 1]) {
        inputRefs.current[inputFields.length - 1].focus();
      }
      setInputFieldsCount(inputFields.length);
    }
  }, [inputFields]);

  return (
    <div>
      <button onClick={handleAddInput} style={{ marginRight: "5px" }}>
        新增輸入框
      </button>
      <button>新增機台</button>
      {inputFields.map((input, index) => (
        <div key={index} style={{ marginBottom: "10px" }}>
          <input
            style={{ marginRight: "5px" }}
            type="text"
            value={input.value}
            onChange={(event) => handleInputChange(index, event)}
            onKeyDown={handleKeyDown}
            ref={(el) => (inputRefs.current[index] = el)} // 存储输入框引用
          />
          <button
            onClick={() => handleClearInput(index)}
            style={{
              padding: "5px 10px",
              backgroundColor: "pink",
              color: "black",
              border: "none",
              borderRadius: "50%", // 圆形按钮
              cursor: "pointer",
              fontSize: "8px",
            }}
          >
            清除
          </button>
        </div>
      ))}
    </div>
  );
}

export default InputWithAddAndClearButton;
