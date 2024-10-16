import { makeStyles } from "@mui/styles";

export default makeStyles(({ functions }) => {
  const { pxToRem } = functions;
  return {
    title_table_row_style: {
      display: "flex",
      justifyContent: "space-between",
      width: "100%",
      textAlign: "center",
      // border: "1px solid black",
      padding: "0 1rem",
    },
    table_row_style: {
      display: "flex",
      justifyContent: "space-between",
      width: "100%",
      textAlign: "center",
      // border: "1px solid black",
      padding: "0 1rem",
    },
    checkbox_style: {
      width: pxToRem(10),
      textAlign: "center",
      fontSize: pxToRem(13),
      wordWrap: "break-word",
    },
    name: {
      width: pxToRem(250),
      textAlign: "center",
      fontFamily: "Calibri",
      fontSize: pxToRem(14),
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    email: {
      width: pxToRem(250),
      textAlign: "center",
      fontFamily: "Calibri",
      fontSize: pxToRem(14),
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    site: {
      width: pxToRem(250),
      textAlign: "center",
      fontFamily: "Calibri",
      fontSize: pxToRem(14),
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    search: {
      width: pxToRem(300),
      fontSize: pxToRem(14),
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    line_form_style: {
      display: "flex",
      alignItems: "center",
      marginBottom: "14px",
      color: "#000000",
      fontSize: "18px",
    },
    columns_center: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
  };
});
