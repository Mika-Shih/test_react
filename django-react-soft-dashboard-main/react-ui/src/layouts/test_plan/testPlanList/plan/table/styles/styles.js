import { makeStyles } from "@mui/styles";

export default makeStyles(({ boxShadows, functions, borders, typography }) => {
  const { navbarBoxShadow } = boxShadows;
  const { rgba, pxToRem } = functions;
  const { borderRadius, borderWidth } = borders;
  const { size } = typography;
  return {
    title_table_row_style: {
      display: "flex",
      justifyContent: "space-between",
      width: "100%",
      textAlign: "center",
      // border: "1px solid black",
      padding: "0 1rem",
      backgroundColor: "#f5f5f5",
    },
    table_row_style: {
      display: "flex",
      justifyContent: "space-between",
      width: "100%",
      textAlign: "center",
      padding: "0 1rem",
      transition: "background-color 0.1s ease",
      "&:hover": {
        backgroundColor: "#f5f5f5",
      },
    },
    title_checkbox_style: {
      width: pxToRem(10),
      textAlign: "center",
      fontSize: pxToRem(16),
      wordWrap: "break-word",
      borderBottom: "none !important",
    },
    title_plan_name_style: {
      maxwidth: pxToRem(250),
      textAlign: "center",
      fontSize: pxToRem(17),
      wordWrap: "break-word",
      borderBottom: "none !important",
      fontWeight: 900,
      color: "#333333",
    },
    title_action_style: {
      width: pxToRem(800),
      textAlign: "center",
      fontSize: pxToRem(17),
      wordWrap: "break-word",
      borderBottom: "none !important",
      fontWeight: 900,
      color: "#333333",
    },
    checkbox_style: {
      width: pxToRem(10),
      textAlign: "center",
      fontSize: pxToRem(16),
      wordWrap: "break-word",
      borderBottom: "none !important",
    },
    plan_name_style: {
      width: pxToRem(250),
      textAlign: "center",
      fontSize: pxToRem(14),
      wordWrap: "break-word",
      borderBottom: "none !important",
    },
    action_style: {
      width: pxToRem(800),
      textAlign: "center",
      fontSize: pxToRem(14),
      wordWrap: "break-word",
      borderBottom: "none !important",
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
