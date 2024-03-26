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

export default function MachineToolData() {
  const backendServer = process.env.REACT_APP_BACKEND_SERVER;
  const columns = [
    { name: "platform", align: "center" },
    { name: "phase", align: "center" },
    { name: "target", align: "center" },
    { name: "group", align: "center" },
    { name: "cycle", align: "center" },
    { name: "sku", align: "center" },
    { name: "sn", align: "center" },
    { name: "borrower", align: "center" },
    { name: "status", align: "center" },
    { name: "position", align: "center" },
    { name: "remark", align: "center" },
    { name: "update_time", align: "center" },
  ];
  const [rows, setRows] = useState([]);
  const fetchData = () => {
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
      console.log(apiData);
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
      console.log(mappedRows);
    });
  };

  useEffect(() => {
    fetchData();
    // 设置定时器，每隔一段时间重新获取数据
    const intervalId = setInterval(fetchData, 60000); // 60秒更新一次

    // 组件卸载时清除定时器
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return { columns, rows };
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
