import React, { useState, useRef, useEffect } from "react";
import Inputbox from "examples/tool_universal/inputbox";
import TableContainer from "@mui/material/TableContainer";
import Tablebody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Loading_option_4to1 from "examples/tool_universal/loading_option_4to1";
import axios from "axios";
const backendServer = process.env.REACT_APP_BACKEND_SERVER;
function InputWithAddAndClearButton() {
  const [isStep, setIsStep] = useState(false);
  const [options, setOptions] = useState([]);
  const [ischeckbox, setcheckbox] = useState({});
  const [platform_combine, set_platform_combine] = useState([]);
  const [inputList, setInputList] = useState([""]);
  const [machine_data, set_machine_data] = useState([]);
  useEffect(() => {
    const newMachineData = inputList
      .filter((value) => value !== "")
      .map((sn) => ({
        platform: "",
        phase: "",
        target: "",
        group: "",
        cycle: "",
        sku: "",
        sn: sn,
        position: "",
        remark: "",
      }));
    set_machine_data(newMachineData);
  }, [inputList]);
  useEffect(() => {
    const newMachineData = inputList
      .filter((value) => value !== "")
      .map((sn) => ({
        platform: "",
        phase: "",
        target: "",
        group: "",
        cycle: "",
        sku: "",
        sn: sn,
        position: "",
        remark: "",
      }));
    set_machine_data(newMachineData);
    const fetchData = async () => {
      try {
        const response = await axios.get(`${backendServer}polls/api/phase/`);
        const formattedOptions = response.data["phase"].filter((item) => item !== "");
        setOptions(formattedOptions);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
    const transformed_data = machine_data.map((item) => ({
      title: `${item["platform"]} - ${item["target"]} - ${item["group"]} - ${item["cycle"]}`,
      value: `${item["platform"]} - ${item["target"]} - ${item["group"]} - ${item["cycle"]}`,
    }));
    console.log(transformed_data);
    set_platform_combine(transformed_data);
  }, []);
  const [user_experience, set_user_experience] = useState(0);
  function getCellStyle(width) {
    return {
      maxWidth: `${width}px`,
      minWidth: `${width}px`,
      textAlign: "center",
      border: "1px solid #ddd",
      fontSize: "12px",
    };
  }
  const checkbox_style = getCellStyle(10);
  const platform_style = getCellStyle(150);
  const phase_style = getCellStyle(160);
  const target_style = getCellStyle(80);
  const group_style = getCellStyle(120);
  const cycle_style = getCellStyle(80);
  const sku_style = getCellStyle(60);
  const sn_style = getCellStyle(150);
  const position_style = getCellStyle(100);
  const remark_style = getCellStyle(90);
  const table_row_style = {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    textAlign: "center",
    border: "1px solid black",
  };
  function title_row(index) {
    return (
      <>
        <TableRow style={table_row_style}>
          <TableCell key={index} style={checkbox_style}>
            {"/"}
          </TableCell>
          <TableCell key={index} style={platform_style}>
            {"platform"}
          </TableCell>
          <TableCell key={index} style={phase_style}>
            {"phase"}
          </TableCell>
          <TableCell key={index} style={target_style}>
            {"target"}
          </TableCell>
          <TableCell key={index} style={group_style}>
            {"group"}
          </TableCell>
          <TableCell key={index} style={cycle_style}>
            {"cycle"}
          </TableCell>
          <TableCell key={index} style={sku_style}>
            {"sku"}
          </TableCell>
          <TableCell key={index} style={sn_style}>
            {"serial_number"}
          </TableCell>
          <TableCell key={index} style={position_style}>
            {"position"}
          </TableCell>
          <TableCell key={index} style={remark_style}>
            {"remark"}
          </TableCell>
        </TableRow>
      </>
    );
  }
  function data_row(index, data) {
    if (!data) {
      return null;
    }
    return (
      <>
        <TableRow style={table_row_style}>
          <TableCell key={index} style={checkbox_style}>
            <input
              type="checkbox"
              checked={ischeckbox[`${index}`] || false}
              onChange={() => {
                setcheckbox((prevIsCheckbox) => {
                  const updatedCheckboxState = Object.fromEntries(
                    // 陣列數組轉成新對象鍵值對  Object.fromEntries([['a', 1], ['b', 2], ['c', 3]]) = { a: 1, b: 2, c: 3 }
                    Object.entries(prevIsCheckbox).map(([key]) => [key, false]) //對象鍵值對轉成陣列數組 Object.fromEntries({ a: 1, b: 2, c: 3 }) = [['a', 1], ['b', 2], ['c', 3]]
                  );
                  updatedCheckboxState[`${index}`] = !prevIsCheckbox[`${index}`]; //舊的!checkbox狀態傳給新的checkbox狀態
                  return updatedCheckboxState;
                });
              }}
            />
          </TableCell>
          <TableCell
            key={index}
            style={platform_style}
            onClick={() => handleDoubleClick(index, "platform")}
            ref={inputRef}
            onBlur={() => handleBlur(index, "platform")}
          >
            {isEditing[`${index}_platform`] ? (
              <Loading_option_4to1
                api="polls/api/addplatformcombination"
                name="platform"
                selectedOptions={platform_combine[index]}
                setSelectedOptions={(newOptions) => {
                  set_platform_combine((prevPlatformCombine) => ({
                    ...prevPlatformCombine,
                    [index]: newOptions,
                  }));
                  console.log(newOptions);
                  const [platform, target, group, cycle] = newOptions
                    ? newOptions.value.split(" - ")
                    : ["", "", "", ""];
                  machine_data[index].platform = platform || "";
                  machine_data[index].target = target || "";
                  machine_data[index].group = group || "";
                  machine_data[index].cycle = cycle || "";
                }}
              />
            ) : (
              machine_data[index].platform
            )}
          </TableCell>
          <TableCell key={index} style={phase_style}>
            <select
              value={machine_data[index].phase}
              onChange={(e) => {
                set_machine_data((prevData) => {
                  const newData = [...prevData];
                  newData[index] = { ...newData[index], phase: e.target.value };
                  return newData;
                });
              }}
              style={{ padding: "5px 5px", marginLeft: "20px", marginRight: "10px" }}
            >
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </TableCell>
          <TableCell key={index} style={target_style}>
            {data.target}
          </TableCell>
          <TableCell key={index} style={group_style}>
            {data.group}
          </TableCell>
          <TableCell key={index} style={cycle_style}>
            {data.cycle}
          </TableCell>
          <TableCell key={index} style={sku_style} onClick={() => handleDoubleClick(index, "sku")}>
            {isEditing[`${index}_sku`] ? (
              <input
                ref={inputRef}
                type="text"
                value={machine_data[index].sku}
                style={{ width: "30px" }}
                onChange={(e) => {
                  set_machine_data((prevData) => {
                    const newData = [...prevData];
                    newData[index] = { ...newData[index], sku: e.target.value };
                    return newData;
                  });
                }}
                onBlur={() => handleBlur(index, "sku")}
                onKeyDown={(e) => handleKeyDown(e, index, "sku")}
              />
            ) : (
              machine_data[index].sku
            )}
          </TableCell>
          <TableCell key={index} style={sn_style}>
            {machine_data[index].sn}
          </TableCell>
          <TableCell
            key={index}
            style={position_style}
            onClick={() => handleDoubleClick(index, "position")}
          >
            {isEditing[`${index}_position`] ? (
              <input
                ref={inputRef}
                type="text"
                value={machine_data[index].position}
                style={{ width: "50px" }}
                onChange={(e) => {
                  set_machine_data((prevData) => {
                    const newData = [...prevData];
                    newData[index] = { ...newData[index], position: e.target.value };
                    return newData;
                  });
                }}
                onBlur={() => handleBlur(index, "position")}
                onKeyDown={(e) => handleKeyDown(e, index, "position")}
              />
            ) : (
              machine_data[index].position
            )}
          </TableCell>
          <TableCell
            key={index}
            style={remark_style}
            onClick={() => handleDoubleClick(index, "remark")}
          >
            {isEditing[`${index}_remark`] ? (
              <input
                ref={inputRef}
                type="text"
                value={machine_data[index].remark}
                style={{ width: "50px" }}
                onChange={(e) => {
                  set_machine_data((prevData) => {
                    const newData = [...prevData];
                    newData[index] = { ...newData[index], remark: e.target.value };
                    return newData;
                  });
                }}
                onBlur={() => handleBlur(index, "remark")}
                onKeyDown={(e) => handleKeyDown(e, index, "remark")}
              />
            ) : (
              machine_data[index].remark
            )}
          </TableCell>
        </TableRow>
      </>
    );
  }
  const inputRef = useRef(null);
  const [isEditing, setIsEditing] = useState({});
  const indexRef = useRef(null);
  useEffect(() => {
    if (isEditing[indexRef.current] && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);
  const handleDoubleClick = (index, data) => {
    indexRef.current = `${index}_${data}`;
    setIsEditing((prevIsEditing) => ({
      ...prevIsEditing,
      [`${index}_${data}`]: true,
    }));
    console.log(isEditing);
    console.log(inputRef);
  };
  const handleBlur = (index, data) => {
    setIsEditing((prevIsEditing) => ({
      ...prevIsEditing,
      [`${index}_${data}`]: false,
    }));
    console.log(isEditing);
  };
  const handleKeyDown = (e, index, data) => {
    if (e.key === "Enter") {
      handleBlur(index, data);
    }
  };
  const checkbox_function = () => {
    console.log(ischeckbox);
    const trueIndex = Object.keys(ischeckbox).find((index) => ischeckbox[index]);
    if (trueIndex !== undefined) {
      for (let i = trueIndex; i < machine_data.length; i++) {
        machine_data[i] = { ...machine_data[trueIndex], sn: machine_data[i].sn };
      }
    }
    console.log(trueIndex);
    console.log(machine_data);
    set_user_experience((prevKey) => prevKey + 1);
  };
  const handleNext = () => {
    set_user_experience((prevKey) => prevKey + 1);
    setIsStep(true);
  };
  const handlePrev = () => {
    setIsStep(false);
  };
  const test = () => {
    console.log(inputList);
    console.log(machine_data);
  };
  return (
    <div style={{ marginLeft: "16px" }}>
      {!isStep && (
        <div>
          <p>新增 serial number</p>
          <Inputbox inputList={inputList} setInputList={setInputList} />
          <button onClick={handleNext}>下一步</button>
        </div>
      )}
      {isStep && (
        <div key={user_experience}>
          <button onClick={checkbox_function} style={{ marginLeft: "16px" }}>
            以勾選處向下套用
          </button>
          <TableContainer>
            <div style={{ marginLeft: "16px" }}>
              <Tablebody>{title_row("1")}</Tablebody>
              <Tablebody>{machine_data.map((data, index) => data_row(index, data))}</Tablebody>
            </div>
          </TableContainer>
          <button onClick={handlePrev}>上一步</button>
          <button onClick={test()}>test</button>
        </div>
      )}
    </div>
  );
}

export default InputWithAddAndClearButton;
