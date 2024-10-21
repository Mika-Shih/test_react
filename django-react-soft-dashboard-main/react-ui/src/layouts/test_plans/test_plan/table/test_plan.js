import React, { useState, useEffect } from "react";
import { Dialog, Box } from "@mui/material";
// import { TableRow, TableCell, TableContainer } from "@mui/material";
import Button from "examples/Icons/Button";
// import Loading_option from "examples/tool_universal/loading_option";
// import Loading_option_add_remove from "examples/tool_universal/loading_option_add_remove";
// import Loading from "examples/tool_universal/loading";
// import SuiButton from "components/SuiButton";
// import SuiBox from "components/SuiBox";
// import Icon from "@mui/material/Icon";
import TestCase from "api/test_plans/test_case";
import PropTypes from "prop-types";
function Test_case({ category }) {
  const [pop_filter, set_pop_filter] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
  });
  const [list_case, set_list_case] = useState([]);
  useEffect(() => {
    get_list_case();
  }, [category]);
  useEffect(() => {
    console.log("list_case", list_case);
    list_case.map((item) => {
      console.log(item.data[item.select].case_name);
    });
  }, [list_case]);
  const get_list_case = async () => {
    let response = await TestCase.list_case({
      category: category,
    });
    if (response.data.finaldata) {
      set_list_case(response.data.finaldata);
    }
  };
  const openModal = (modalNumber) => {
    set_pop_filter((prev) => ({ ...prev, [modalNumber]: true }));
  };
  const closeModal = (modalNumber) => {
    set_pop_filter((prev) => ({ ...prev, [modalNumber]: false }));
  };
  const data = () => {
    return (
      <>
        <Box>
          <Button onClick={() => openModal(2)}>Confirm</Button>
        </Box>
      </>
    );
  };
  return (
    <>
      <Dialog open={pop_filter[1]} onClose={() => closeModal(1)} fullWidth maxWidth="md">
        <Box sx={{ padding: "20px" }}>{data()}</Box>
      </Dialog>
      <Dialog open={pop_filter[2]} onClose={() => closeModal(2)} fullWidth maxWidth="md">
        <Box sx={{ padding: "20px" }}>{category}</Box>
      </Dialog>
      <Button onClick={() => openModal(1)}>Add Test Plan</Button>
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
