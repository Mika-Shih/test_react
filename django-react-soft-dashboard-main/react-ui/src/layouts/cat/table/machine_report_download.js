import React from "react";
import PropTypes from "prop-types";
const MachineReportDownload = ({ data }) => {
  console.log(data);
  const container_style = {
    paddingLeft: "100px",
  };

  const content_style = {
    width: "500px",
    backgroundColor: "#f0f0f0",
    padding: "20px",
  };

  const title_text_style = {
    fontSize: "60px",
    color: "#64b5f6",
    fontFamily: "Calibri",
    fontWeight: "500",
  };
  const text_style = {
    fontSize: "20px",
    fontFamily: "Calibri",
  };
  const length = data.length;
  const all_machine_data = () => {
    const tdstyle = {
      border: "1px solid #ddd",
      padding: "18px",
      textAlign: "center",
      verticalAlign: "middle",
      width: "20%",
    };
    return (
      <table>
        <tbody>
          <tr>
            <td style={tdstyle}>Total UUT</td>
            <td style={tdstyle}>Msc</td>
            <td style={tdstyle}>Msc To S4</td>
            <td style={tdstyle}>Restart</td>
            <td style={tdstyle}>S4</td>
          </tr>
          <tr>
            <td style={tdstyle} rowSpan={3}>
              unit
            </td>
            <td style={tdstyle}>cycles</td>
            <td style={tdstyle}>cycles</td>
            <td style={tdstyle}>cycles</td>
            <td style={tdstyle}>cycles</td>
          </tr>
          <tr>
            <td style={tdstyle}>Airplanemode</td>
            <td style={tdstyle}>Idle</td>
            <td style={tdstyle}>Onlinestreaming-test</td>
            <td style={tdstyle}>Dock</td>
          </tr>
          <tr>
            <td style={tdstyle}>round</td>
            <td style={tdstyle}>round</td>
            <td style={tdstyle}>round</td>
            <td style={tdstyle}>round</td>
          </tr>
        </tbody>
      </table>
    );
  };
  return (
    <div style={container_style}>
      <div style={content_style}>
        <p style={title_text_style}>C.A.T Test Report</p>
      </div>
      <div style={content_style}>
        <p style={text_style}>Total UUT</p>
        <p style={text_style}>{length}</p> <p style={text_style}>{length}</p>
      </div>
      <div>
        {data &&
          data.map((item, index) => (
            <p key={index}>
              {item.serial_number} {item.bt_name}
            </p>
          ))}
      </div>
      <div>{all_machine_data()}</div>
    </div>
  );
};
MachineReportDownload.propTypes = {
  data: PropTypes.array,
};
export default MachineReportDownload;
