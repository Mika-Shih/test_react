import { makeStyles } from "@mui/styles";

export default makeStyles(({ functions }) => {
  const { pxToRem } = functions;
  return {
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
