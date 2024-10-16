// import React, { useState, useEffect } from "react";
// import { Dialog, Box } from "@mui/material";
// import { TableRow, TableCell, TableContainer } from "@mui/material";
// import Button from "examples/Icons/Button";
// import Loading_option from "examples/tool_universal/loading_option";
// import Loading_option_add_remove from "examples/tool_universal/loading_option_add_remove";
// import Loading from "examples/tool_universal/loading";
// import SuiButton from "components/SuiButton";
// import SuiBox from "components/SuiBox";
// import Icon from "@mui/material/Icon";
import PropTypes from "prop-types";
function Test_case({ category }) {
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", marginLeft: "20px" }}>
        <>{category}</>
      </div>
      {/* <TableContainer>
      </TableContainer> */}
    </>
  );
}
Test_case.propTypes = {
  category: PropTypes.string.isRequired,
};
export default Test_case;
