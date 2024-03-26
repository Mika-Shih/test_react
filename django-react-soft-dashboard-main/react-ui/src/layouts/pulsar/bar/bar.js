import React, { useState } from "react";

function DropdownWithButton() {
  const [selectedOption, setSelectedOption] = useState("");
  const [message, setMessage] = useState("");
  const button_style = {
    padding: "5px 10px",
    transform: "rotate(0deg)", //水平翻轉
    whiteSpace: "nowrap", //禁止換行
    backgroundColor: "#007bff", // 背景颜色
    color: "#fff", // 文本颜色
    border: "none", // 去掉邊框
    borderRadius: "5px", // 圆角
    cursor: "pointer", // 鼠標點擊樣式
    fontSize: "14px",
    fontWeight: "bold", // 字體粗細
    outline: "none", // 去掉聚焦时的邊框
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleButtonClick = () => {
    if (selectedOption) {
      setMessage(`You selected: ${selectedOption}`);
    } else {
      setMessage("Please select an option");
    }
  };
  const handle_new_device_click = () => {
    window.location.href = "/add_device";
  };
  const handle_new_version_click = () => {
    window.location.href = "/add_version";
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
        <button onClick={handleButtonClick} style={button_style}>
          Submit
        </button>
        <p>{message}</p>
      </div>
      <div style={{ display: "flex", alignItems: "center", marginRight: "30px" }}>
        <button onClick={handle_new_device_click} style={button_style}>
          新增device
        </button>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <button onClick={handle_new_version_click} style={button_style}>
          新增version
        </button>
      </div>
    </div>
  );
}

export default DropdownWithButton;
