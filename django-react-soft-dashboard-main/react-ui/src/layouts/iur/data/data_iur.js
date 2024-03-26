/* eslint-disable react/prop-types */
// Soft UI Dashboard React components
//import SuiBox from "components/SuiBox";
//import SuiTypography from "components/SuiTypography";
//import SuiAvatar from "components/SuiAvatar";
//import SuiBadge from "components/SuiBadge";

// Images

//import team4 from "assets/images/team-4.jpg";

import { useEffect, useState } from "react";
import axios from "axios";
//require("dotenv").config();
//import SuiBadge from "components/SuiBadge";

export default function IUR_Data() {
  const backendServer = process.env.REACT_APP_BACKEND_SERVER;
  const [rows, setRows] = useState([]);
  useEffect(() => {
    const request_data = {
      target: "",
      group: "",
      cycle: "",
      platform: "",
      SN: "",
      phase: "",
      status: "",
      machine_arrive_mail: "",
    };
    axios.post(`${backendServer}polls/api/filtersearch/`, request_data).then((response) => {
      const apiData = response.data.finaldata;
      const mappedRows = apiData.map((item) => ({
        platform: item.platform,
        phase: item.phase,
        target: item.target,
        group: item.group,
        cycle: item.cycle,
        sku: item.sku,
        sn: item.sn,
        borrower: item.borrower,
        status: item.status,
        position: item.position,
        remark: item.remark,
        update_time: formatTimeForFrontend(item.update_time),
      }));
      setRows(mappedRows);
    });
  }, []);

  return { rows };
}

/**

 * @param {string} inputTime - 输入的日期时间字符串
 * @returns {string} 格式化后的日期时间字符串，例如 "January 1, 2023, 2:30 PM"
 */

function formatTimeForFrontend(inputTime) {
  // 月份
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const date = new Date(inputTime);
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  // 格式化时间，包括小时和分钟，使用 12 小时制
  const formattedTime = date.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  // 返回格式化后的日期时间字符串
  return `${month} ${day}, ${year}, ${formattedTime}`;
}
