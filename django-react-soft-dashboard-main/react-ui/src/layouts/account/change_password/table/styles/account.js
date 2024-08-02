import { makeStyles } from "@mui/styles";

export default makeStyles((theme) => {
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
    leftBlockStyle: {
      maxWidth: "400px",
      minWidth: "400px",
      flex: "0 0 400px", //flex-grow(區域優先級)、flex-shrink(區域空間不夠縮放優先級)、flex-basis
      marginRight: "10px",
      padding: "10px",
      background: "#efefef",
    },
    inputContainer: {
      position: "relative",
      marginBottom: theme.spacing(2),
      marginRight: theme.spacing(2),
      display: "flex",
      alignItems: "center",
    },
    textField: {
      width: "100%",
      padding: "10px",
      fontSize: "16px",
      border: "1px solid #ccc",
      borderRadius: "5px",
      boxSizing: "border-box",
    },
    eyeIcon: {
      position: "absolute",
      top: "50%",
      right: "10px",
      transform: "translateY(-50%)",
    },
    rightBlockStyle: {
      flex: "1",
      padding: "10px",
      background: "#f5f5f5",
    },
    line_form_style: {
      display: "flex",
      alignItems: "center",
      marginBottom: "14px",
      color: "#000000",
      fontSize: "18px",
    },
    customStyles: {
      content: {
        maxWidth: "1000px",
        minWidth: "1000px",
        maxHeight: "800px",
        minHeight: "800px",
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-500px",
        transform: "translate(-50%, -50%)",
        overflowY: "auto",
      },
      overlay: {
        zIndex: 9999,
      },
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
    iur_UI_delete: {
      cursor: "pointer",
      padding: "5px",
      backgroundColor: "#FA8072",
      border: "none",
      color: "white",
      position: "absolute",
      right: "15px",
    },
    filter_display: {
      maxWidth: "600px",
      maxHeight: "115px",
      overflowY: "auto",
    },
  };
});
