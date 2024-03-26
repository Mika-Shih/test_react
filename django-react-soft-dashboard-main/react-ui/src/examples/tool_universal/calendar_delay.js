import React, { useEffect } from "react";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import moment from "moment";
import PropTypes from "prop-types";
function DateTimePicker({ startDatetime, endDatetime, setStartDatetime, setEndDatetime }) {
  useEffect(() => {
    setStartDatetime(startDatetime);
    setEndDatetime(endDatetime);
  }, [startDatetime, endDatetime]);

  const handleStartDatetimeChange = (date) => {
    if (endDatetime) {
      if (date.isBefore(endDatetime)) {
        console.log(endDatetime);
        setStartDatetime(date);
      } else {
        setStartDatetime(moment(endDatetime).subtract(1, "minute"));
      }
    } else {
      if (date.isBefore(moment().subtract(1, "minute"))) {
        setStartDatetime(date);
      } else {
        setStartDatetime(moment().subtract(1, "minute"));
      }
    }
  };
  const handleEndDatetimeChange = (date) => {
    if (startDatetime) {
      if (date.isBefore(startDatetime)) {
        setEndDatetime(moment());
      } else {
        if (date.isBefore(moment())) {
          setEndDatetime(date);
        } else {
          setEndDatetime(moment());
        }
      }
    } else {
      if (date.isBefore(moment())) {
        setEndDatetime(date);
      } else {
        setEndDatetime(moment());
      }
    }
  };

  const calendar_outward = {
    border: "1px solid #ccc",
    backgroundColor: "#f0f0f0",
    fontFamily: "Arial, sans-serif",
    color: "#333",
  };

  return (
    <div>
      <label>Start Time:</label>
      <Datetime
        value={startDatetime}
        onChange={handleStartDatetimeChange}
        input={true}
        dateFormat="MMMM DD, YYYY"
        timeFormat="h:mm A"
        style={calendar_outward}
        inputProps={{ style: { width: "250px" } }}
      />
      <label>End Time:</label>
      <Datetime
        value={endDatetime}
        onChange={handleEndDatetimeChange}
        input={true}
        dateFormat="MMMM DD, YYYY"
        timeFormat="h:mm A"
        style={calendar_outward}
        inputProps={{ style: { width: "250px" } }}
      />
    </div>
  );
}
DateTimePicker.propTypes = {
  startDatetime: PropTypes.instanceOf(Date).isRequired,
  endDatetime: PropTypes.instanceOf(Date).isRequired,
  setStartDatetime: PropTypes.func.isRequired,
  setEndDatetime: PropTypes.func.isRequired,
};
export default DateTimePicker;
