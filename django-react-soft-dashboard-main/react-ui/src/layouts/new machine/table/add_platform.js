import React, { useState, useRef, useEffect } from "react";
import TableContainer from "@mui/material/TableContainer";
import Tablebody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Loading_option_4to1 from "examples/tool_universal/loading_option_4to1";
import axios from "axios";
import Modal from "react-modal";
import Button from "examples/Icons/Button";
import PropTypes from "prop-types";
import Loading from "examples/tool_universal/loading";
import Loading_option from "examples/tool_universal/loading_option";
const backendServer = process.env.REACT_APP_BACKEND_SERVER;
const frontendServer = process.env.REACT_APP_FRONTEND_SERVER;
function InputWithAddAndClearButton(props) {
  const [options, setOptions] = useState([]);
  const [ischeckbox, setcheckbox] = useState({});
  const [platform_combine, set_platform_combine] = useState([]);
  const [popFilters, setPopFilters] = useState({
    1: false,
    2: false,
  });
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    platform: [],
    target: null,
    group: null,
    cycle: [],
  });
  const [machine_data, set_machine_data] = useState([]);
  useEffect(() => {
    const newMachineData = props.serial_number
      .filter((value) => value !== "")
      .map((sn) => ({
        platform: "",
        phase: "OOC", //12/14寫死
        target: "",
        group: "",
        cycle: "",
        sku: "",
        sn: sn,
        position: "",
        remark: "",
      }));
    set_machine_data(newMachineData);
  }, [props.serial_number]);
  useEffect(() => {
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
  const [selectedFile, setSelectedFile] = useState(null);
  function getCellStyle(width) {
    return {
      maxWidth: `${width}px`,
      minWidth: `${width}px`,
      textAlign: "center",
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
  };
  function title_row(index, request = false) {
    if (request) {
      return (
        <>
          <TableRow style={table_row_style}>
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
    } else {
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
  const customStyles = {
    content: {
      maxWidth: "900px",
      maxHeight: "800px",
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-450px",
      transform: "translate(-50%, -50%)",
      overflowY: "auto",
    },
    overlay: {
      zIndex: 1000,
    },
  };
  const check_Styles = {
    content: {
      maxWidth: "1500px",
      maxHeight: "1000px",
      top: "50%",
      left: "60%",
      right: "auto",
      bottom: "auto",
      marginRight: "-750px",
      transform: "translate(-50%, -50%)",
      overflowY: "auto",
    },
    overlay: {
      zIndex: 1000,
    },
  };
  Modal.setAppElement("#root");

  const addplatformmodel = async () => {
    setLoading(true);
    const request_data = {
      platform: formData.platform,
      target: formData.target == null ? "" : formData.target.value,
      group: formData.group == null ? "" : formData.group.value,
      cycle: formData.cycle,
    };
    console.log(request_data);
    try {
      const response = await axios.post(
        `${backendServer}polls/api/addplatformonly/`,
        request_data,
        {
          timeout: 10000,
        }
      );
      if (response.data.successful) {
        alert(response.data.successful);
        closeModal(1);
      } else if (response.data.error) {
        alert(response.data.error);
      }
    } catch (error) {
      console.error("Error in Axios request:", error);
      alert("無法執行 請聯絡管理員");
    } finally {
      setLoading(false);
    }
  };
  const add_new_platform = async () => {
    setLoading(true);
    let request_data = new FormData();
    // const request_data = {
    //   finaldata: JSON.stringify(machine_data),
    //   message: "add new platform",
    //   file: selectedFile,
    // };
    request_data.append("finaldata", JSON.stringify(machine_data));
    request_data.append("message", "add new platform");
    request_data.append("file", selectedFile);
    console.log(request_data);
    axios
      .post(`${backendServer}polls/addnewplatform/`, request_data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (response.data.finaldata) {
          window.location.replace(`${frontendServer}iur/`);
        } else if (response.data.error) {
          alert(response.data.error);
        }
      })
      .catch((error) => {
        console.error("Error in Axios request:", error);
        alert("無法執行 請聯絡管理員");
      })
      .finally(() => {
        setLoading(false);
      });
    // try {
    //   const response = await axios.post(`${backendServer}polls/addnewplatform/`, request_data, {});
    //   if (response.data.finaldata) {
    //     window.location.replace(`${frontendServer}iur/`);
    //   } else if (response.data.error) {
    //     alert(response.data.error);
    //   }
    // } catch (error) {
    //   console.error("Error in Axios request:", error);
    //   alert("無法執行 請聯絡管理員");
    // } finally {
    //   setLoading(false);
    // }
  };
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
  };
  function pop_filter_content() {
    return (
      <>
        <div style={containerStyle}>
          <label>Platform:</label>
          <input
            type="text"
            value={formData.platform}
            onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
            style={{ paddingTop: "8px", paddingBottom: "8px", width: "300px" }}
          />
          <label>Target:</label>
          <Loading_option
            api="polls/api/target"
            name="target"
            selectedOptions={formData.target}
            setSelectedOptions={(newOptions) => setFormData({ ...formData, target: newOptions })}
          />
          <label>Group:</label>
          <Loading_option
            api="polls/api/group"
            name="group"
            selectedOptions={formData.group}
            setSelectedOptions={(newOptions) => setFormData({ ...formData, group: newOptions })}
          />
          <label>Cycle:</label>
          <input
            type="text"
            value={formData.cycle}
            onChange={(e) => setFormData({ ...formData, cycle: e.target.value })}
            style={{ paddingTop: "8px", paddingBottom: "8px", width: "300px" }}
          />
        </div>
      </>
    );
  }
  function check_platform_change() {
    return (
      <>
        <TableContainer>
          <div style={{ overflowY: "auto", maxHeight: "600px", marginLeft: "16px" }}>
            <Tablebody>{title_row("1", true)}</Tablebody>
            <Tablebody>{machine_data.map((data, index) => check_data_row(index, data))}</Tablebody>
          </div>
        </TableContainer>
      </>
    );
  }
  function check_data_row(index, data) {
    if (!data) {
      return null;
    }
    return (
      <>
        <TableRow style={table_row_style}>
          <TableCell key={index} style={platform_style}>
            {data.platform}
          </TableCell>
          <TableCell key={index} style={phase_style}>
            {data.phase}
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
          <TableCell key={index} style={sku_style}>
            {data.sku}
          </TableCell>
          <TableCell key={index} style={sn_style}>
            {data.sn}
          </TableCell>
          <TableCell key={index} style={position_style}>
            {data.position}
          </TableCell>
          <TableCell key={index} style={remark_style}>
            {data.remark}
          </TableCell>
        </TableRow>
      </>
    );
  }
  const openModal = (modalNumber) => {
    setPopFilters((prev) => ({ ...prev, [modalNumber]: true }));
  };
  const closeModal = (modalNumber) => {
    setPopFilters((prev) => ({ ...prev, [modalNumber]: false }));
  };
  const test = () => {
    // console.log(machine_data);
  };
  return (
    <div style={{ marginLeft: "16px" }}>
      <Loading loading={loading} />
      <div style={{ display: "flex", overflowY: "auto" }}>
        <Modal
          isOpen={popFilters[1]}
          onRequestClose={() => closeModal(1)}
          style={customStyles}
          contentLabel="filter"
        >
          <h2>新增platform機台</h2>
          {pop_filter_content()}
          <Button style={{ margin: "10px", padding: "10px" }} onClick={addplatformmodel}>
            新增機台
          </Button>
          <Button style={{ margin: "10px", padding: "10px" }} onClick={() => closeModal(1)}>
            關閉
          </Button>
        </Modal>
      </div>
      <div style={{ display: "flex", overflowY: "auto" }}>
        <Modal
          isOpen={popFilters[2]}
          onRequestClose={() => closeModal(2)}
          style={check_Styles}
          contentLabel="filter"
        >
          <p>確定新增以下機台?</p>
          {check_platform_change()}
          <Button style={{ margin: "10px", padding: "10px" }} onClick={add_new_platform}>
            新增機台
          </Button>
          <Button style={{ margin: "10px", padding: "10px" }} onClick={() => closeModal(2)}>
            關閉
          </Button>
        </Modal>
      </div>
      <div key={user_experience}>
        <Button onClick={checkbox_function} style={{ marginLeft: "16px" }}>
          以勾選處向下套用
        </Button>
        <Button onClick={() => openModal(1)} style={{ marginLeft: "16px" }}>
          新增platform機台
        </Button>
        <TableContainer>
          <div style={{ marginLeft: "16px" }}>
            <Tablebody>{title_row("1")}</Tablebody>
            <Tablebody>{machine_data.map((data, index) => data_row(index, data))}</Tablebody>
          </div>
        </TableContainer>
      </div>
      <div>
        <label htmlFor="file">選擇文件：</label>
        <input
          key={user_experience}
          type="file"
          onChange={(event) => {
            const file = event.target.files[0];
            setSelectedFile(file);
          }}
        />
        <button
          style={deleteButtonStyle}
          onClick={() => {
            setSelectedFile(null);
            set_user_experience((prevKey) => prevKey + 1);
          }}
        >
          X
        </button>
      </div>
      <div>
        <Button onClick={test()}>test</Button>
        <Button onClick={() => openModal(2)} style={{ marginLeft: "16px" }}>
          新增機台
        </Button>
      </div>
    </div>
  );
}
const deleteButtonStyle = {
  cursor: "pointer",
  padding: "5px",
  backgroundColor: "lightcoral",
  border: "none",
  color: "white",
};
InputWithAddAndClearButton.propTypes = {
  serial_number: PropTypes.array.isRequired,
};
export default InputWithAddAndClearButton;
