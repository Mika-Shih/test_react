import React, { useState } from "react";
import { Dialog, Box } from "@mui/material";
import Button from "examples/Icons/Button";
import useStyles from "layouts/test_driver_validation/table/styles/test_driver_validation_style";
function detail_form({ data }) {
  const classes = useStyles();
  const [pop_filter, set_pop_filter] = useState({
    1: false,
  });
  const openModal = (modalNumber) => {
    set_pop_filter((prev) => ({ ...prev, [modalNumber]: true }));
  };
  const closeModal = (modalNumber) => {
    set_pop_filter((prev) => ({ ...prev, [modalNumber]: false }));
  };
  function formatTimeForFrontend(inputTime) {
    const date = new Date(inputTime);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}/${day}, ${year}`;
  }
  const detail_data = (data) => {
    if (data) {
      return (
        <>
          <div className={classes.columns_center}>
            <div className={classes.line_form_style}>
              <div className={classes.columns_center}>
                <label htmlFor="Requester_name">
                  Requester&nbsp;:&nbsp;&nbsp;{data.requester_name}
                </label>
                <label htmlFor="Requester_email">
                  Email&nbsp;:&nbsp;&nbsp;{data.requester_email}
                </label>
              </div>
            </div>
            <div className={classes.line_form_style}>
              <div className={classes.columns_center}>
                <label htmlFor="driver_release_date">
                  Driver Release Date&nbsp;:&nbsp;&nbsp;{data.date_detail.release_date}
                </label>
                <label htmlFor="duration_date">
                  Validation Duration Date&nbsp;:&nbsp;&nbsp;
                  {formatTimeForFrontend(data.date_detail.validation_start_date) +
                    "~" +
                    formatTimeForFrontend(data.date_detail.validation_end_date)}
                </label>
              </div>
            </div>
            <div className={classes.line_form_style}>
              <div className={classes.columns_center}>
                <label htmlFor="module">Module&nbsp;:&nbsp;&nbsp;{data.task_detail.module}</label>
                <label htmlFor="driver">Driver&nbsp;:&nbsp;&nbsp;{data.task_detail.driver}</label>
                <label htmlFor="os">OS&nbsp;:&nbsp;&nbsp;{data.task_detail.os}</label>
                <label htmlFor="bios_version">
                  BIOS Version&nbsp;:&nbsp;&nbsp;{data.task_detail.bios_version}
                </label>
              </div>
            </div>
            <div className={classes.line_form_style}>
              <div className={classes.columns_center}>
                <label htmlFor="detail">
                  Detail&nbsp;:&nbsp;&nbsp;{data.request_detail.request_detail}
                </label>
                <label htmlFor="message">
                  Message&nbsp;:&nbsp;&nbsp;{data.request_detail.message}
                </label>
              </div>
            </div>
            <div className={classes.line_form_style}>
              <div className={classes.columns_center}>
                <label htmlFor="status">Status&nbsp;:&nbsp;&nbsp;{data.status}</label>
                <label htmlFor="update_time">
                  Update Time&nbsp;:&nbsp;&nbsp;{formatTimeForFrontend(data.update_time)}
                </label>
              </div>
            </div>
            <div style={{ marginBottom: "30px" }}></div>
            <div className={classes.line_form_style}>
              <Button onClick={() => closeModal(1)}>Close</Button>
            </div>
          </div>
        </>
      );
    }
  };
  return (
    <>
      <Dialog open={pop_filter[1]} onClose={() => closeModal(1)} fullWidth maxWidth="md">
        <Box sx={{ padding: "20px" }}>{detail_data(data)}</Box>
      </Dialog>
      <Button onClick={() => openModal(1)}>Detail</Button>
    </>
  );
}
export default detail_form;
