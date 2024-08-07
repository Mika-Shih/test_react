import { makeStyles } from "@mui/styles";

export default makeStyles(({ boxShadows, functions, borders, typography }) => {
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
    leftBlockStyle: {
      maxWidth: "400px",
      minWidth: "400px",
      flex: "0 0 400px", //flex-grow(區域優先級)、flex-shrink(區域空間不夠縮放優先級)、flex-basis
      marginRight: "10px",
      padding: "10px",
      background: "#efefef",
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
    title_checkbox_style: {
      width: pxToRem(10),
      textAlign: "center",
      fontSize: pxToRem(16),
      wordWrap: "break-word",
    },
    title_platform_style: {
      width: pxToRem(150),
      textAlign: "center",
      fontSize: pxToRem(17),
      wordWrap: "break-word",
    },
    title_phase_style: {
      width: pxToRem(80),
      textAlign: "center",
      fontSize: pxToRem(17),
      wordWrap: "break-word",
    },
    title_target_style: {
      width: pxToRem(80),
      textAlign: "center",
      fontSize: pxToRem(17),
      wordWrap: "break-word",
    },
    title_group_style: {
      width: pxToRem(130),
      textAlign: "center",
      fontSize: pxToRem(17),
      wordWrap: "break-word",
    },
    title_cycle_style: {
      width: pxToRem(90),
      textAlign: "center",
      fontSize: pxToRem(17),
      wordWrap: "break-word",
    },
    title_sku_style: {
      width: pxToRem(70),
      textAlign: "center",
      fontSize: pxToRem(17),
      wordWrap: "break-word",
    },
    title_sn_style: {
      width: pxToRem(150),
      textAlign: "center",
      fontSize: pxToRem(17),
      wordWrap: "break-word",
    },
    title_borrower_style: {
      width: pxToRem(100),
      textAlign: "center",
      fontSize: pxToRem(16),
      wordWrap: "break-word",
    },
    title_status_style: {
      width: pxToRem(100),
      textAlign: "center",
      fontSize: pxToRem(17),
      wordWrap: "break-word",
    },
    title_position_style: {
      width: pxToRem(100),
      textAlign: "center",
      fontSize: pxToRem(17),
      wordWrap: "break-word",
    },
    title_remark_style: {
      width: pxToRem(100),
      textAlign: "center",
      fontSize: pxToRem(17),
      wordWrap: "break-word",
    },
    title_update_time_style: {
      width: pxToRem(200),
      textAlign: "center",
      fontSize: pxToRem(17),
      wordWrap: "break-word",
    },
    checkbox_style: {
      width: pxToRem(10),
      textAlign: "center",
      fontSize: pxToRem(16),
      wordWrap: "break-word",
    },
    platform_style: {
      width: pxToRem(150),
      textAlign: "center",
      fontSize: pxToRem(14),
      wordWrap: "break-word",
    },
    phase_style: {
      width: pxToRem(80),
      textAlign: "center",
      fontSize: pxToRem(14),
      wordWrap: "break-word",
    },
    target_style: {
      width: pxToRem(80),
      textAlign: "center",
      fontSize: pxToRem(14),
      wordWrap: "break-word",
    },
    group_style: {
      width: pxToRem(130),
      textAlign: "center",
      fontSize: pxToRem(14),
      wordWrap: "break-word",
    },
    cycle_style: {
      width: pxToRem(90),
      textAlign: "center",
      fontSize: pxToRem(14),
      wordWrap: "break-word",
    },
    sku_style: {
      width: pxToRem(70),
      textAlign: "center",
      fontSize: pxToRem(14),
      wordWrap: "break-word",
    },
    sn_style: {
      width: pxToRem(150),
      textAlign: "center",
      fontSize: pxToRem(14),
      wordWrap: "break-word",
    },
    borrower_style: {
      width: pxToRem(100),
      textAlign: "center",
      fontSize: pxToRem(14),
      wordWrap: "break-word",
    },
    status_style: {
      width: pxToRem(100),
      textAlign: "center",
      fontSize: pxToRem(14),
      wordWrap: "break-word",
    },
    position_style: {
      width: pxToRem(100),
      textAlign: "center",
      fontSize: pxToRem(14),
      wordWrap: "break-word",
    },
    remark_style: {
      width: pxToRem(100),
      textAlign: "center",
      fontSize: pxToRem(14),
      wordWrap: "break-word",
    },
    update_time_style: {
      width: pxToRem(200),
      textAlign: "center",
      fontSize: pxToRem(14),
      wordWrap: "break-word",
    },
    username_style: {
      width: pxToRem(150),
      textAlign: "center",
      fontSize: pxToRem(12),
      wordWrap: "break-word",
    },
    site_style: {
      width: pxToRem(70),
      textAlign: "center",
      fontSize: pxToRem(12),
      wordWrap: "break-word",
    },
    email_style: {
      width: pxToRem(250),
      textAlign: "center",
      fontSize: pxToRem(12),
      wordWrap: "break-word",
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
    add_new_machine: {
      display: "flex",
      alignItems: "center",
      backgroundColor: "#d32f2f", // 按钮背景色，深红色
      color: "#fff", // 按钮文字颜色，白色
      border: "none", // 移除按钮边框
      borderRadius: "4px", // 按钮圆角
      padding: "8px 16px", // 按钮内边距
      boxShadow: "none",
      "&:hover": {
        backgroundColor: "#b71c1c", // 按钮悬停背景色，深红色
        color: "#fff", // 按钮悬停文字颜色，白色
        boxShadow: "none",
      },
    },
    icon: {
      marginRight: "8px", // 图标与文本之间的间距
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
