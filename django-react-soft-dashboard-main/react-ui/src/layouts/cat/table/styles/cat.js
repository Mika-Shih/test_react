import { makeStyles } from "@mui/styles";

export default makeStyles(({ boxShadows = {}, functions = {}, borders = {}, typography = {} }) => {
  const { navbarBoxShadow } = boxShadows;
  const { rgba, pxToRem } = functions;
  const { borderRadius, borderWidth } = borders;
  const { size } = typography;
  return {
    table_row_style: {
      display: "flex",
      justifyContent: "space-between",
      width: "100%",
      textAlign: "center",
      // border: "1px solid black",
      padding: "0 1rem",
    },
    borderedOptionStyle: {
      border: "1px solid #000",
      padding: "3px",
      margin: "4px",
      maxWidth: "500px",
    },
    containerStyle: {
      display: "flex",
    },
    upperBlockStyle: {
      flex: 1,
      minHeight: "300px",
      maxHeight: "300px",
      overflowY: "auto",
    },
    lowerBlockStyle: {
      flex: 1,
      display: "flex",
      minHeight: "300px",
      maxHeight: "300px",
    },
    //flex-grow(區域優先級)、flex-shrink(區域空間不夠縮放優先級)、flex-basis(width & height)
    leftBlockStyle: {
      flex: 1,
      background: "#efefef",
    },
    leftBlockStyle_assign: {
      flex: 1,
      background: "#efefef",
    },
    leftBlockStyle_assign_value: {
      flex: 1,
      background: "#efefef",
      overflowY: "auto",
      maxHeight: "200px",
    },
    rightBlockStyle: {
      flex: 1,
      background: "#f5f5f5",
    },
    selected: {
      backgroundColor: "#ccc",
      display: "inline-block",
      padding: "5px",
      borderRadius: "3px",
      margin: "5px",
    },
    checkbox_style: {
      width: pxToRem(10),
      textAlign: "center",
      fontSize: pxToRem(12),
      wordWrap: "break-word",
    },
    platform_style: {
      width: pxToRem(150),
      textAlign: "center",
      fontSize: pxToRem(12),
      wordWrap: "break-word",
    },
    phase_style: {
      width: pxToRem(80),
      textAlign: "center",
      fontSize: pxToRem(12),
      wordWrap: "break-word",
    },
    sn_style: {
      width: pxToRem(150),
      textAlign: "center",
      fontSize: pxToRem(12),
      wordWrap: "break-word",
    },
    remark_style: {
      width: pxToRem(90),
      textAlign: "center",
      fontSize: pxToRem(12),
      wordWrap: "break-word",
    },
    update_time_style: {
      width: pxToRem(200),
      textAlign: "center",
      fontSize: pxToRem(12),
      wordWrap: "break-word",
    },
    pending_task_mode: {
      width: pxToRem(200),
      textAlign: "center",
      fontSize: pxToRem(12),
      wordWrap: "break-word",
    },
    pending_task_tool: {
      width: pxToRem(200),
      textAlign: "center",
      fontSize: pxToRem(12),
      wordWrap: "break-word",
    },
    pending_task_count: {
      width: pxToRem(200),
      textAlign: "center",
      fontSize: pxToRem(12),
      wordWrap: "break-word",
    },
    textStyle: {
      fontWeight: "1000",
      color: "#99bceb", // water-blue color
      fontFamily: "Calibri",
    },
    line_form_style: {
      display: "flex",
      alignItems: "center",
      marginBottom: "14px",
      color: "#000000",
      fontSize: "18px",
    },
    button_style: {
      display: "flex",
      width: "100px",
      padding: "5px 10px",
      transform: "rotate(0deg)",
      whiteSpace: "nowrap",
      backgroundColor: "#007bff",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "bold",
      outline: "none",
    },
    deleteButtonStyle: {
      cursor: "pointer",
      padding: "5px",
      backgroundColor: "lightcoral",
      border: "none",
      color: "white",
    },
    test: {
      display: "flex",
      justifyContent: "space-between",
      width: "100%",
      textAlign: "center",
      boxShadow: navbarBoxShadow,
      color: rgba(0, 0, 0, 0.5),
      fontSize: pxToRem(size),
      borderRadius: borderRadius,
      borderWidth: borderWidth,
    },
  };
});
