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
import SuiBadge from "components/SuiBadge";

export default function MachineToolData() {
  const backendServer = process.env.REACT_APP_BACKEND_SERVER;
  const columns = [
    { name: "serial_number", align: "center" },
    { name: "status", align: "center" },
    { name: "last_update_time", align: "center" },
  ];
  const [rows, setRows] = useState([]);
  useEffect(() => {
    axios.get(`${backendServer}cat/machine_tool/`).then((response) => {
      const apiData = response.data;
      const mappedRows = apiData.map((item) => ({
        serial_number: item.serial_number,
        status: (
          <SuiBadge
            variant="gradient"
            badgeContent={item.status}
            color="success"
            size="extra-small"
          />
        ),
        last_update_time: formatTimeForFrontend(item.last_update_time),
      }));
      setRows(mappedRows);
      console.log(mappedRows);
    });
  }, []);

  return { columns, rows };
}

/**
 * 格式化日期时间为前端可读格式
 * @param {string} inputTime - 输入的日期时间字符串
 * @returns {string} 格式化后的日期时间字符串，例如 "January 1, 2023, 2:30 PM"
 */

function formatTimeForFrontend(inputTime) {
  // 月份名称数组
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
