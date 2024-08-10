import { makeStyles } from "@mui/styles";

export default makeStyles(({ functions }) => {
  const { pxToRem } = functions;
  return {
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
  };
});
