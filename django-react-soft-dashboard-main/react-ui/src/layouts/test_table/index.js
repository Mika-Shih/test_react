/**
=========================================================
* Soft UI Dashboard React - v2.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-material-ui
* Copyright 2021 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// Soft UI Dashboard React example components
//import IUR from "examples/Table/iur";

// Custom styles for the Tables
import React, { useState, useEffect } from "react";
// Data
// import iur_data from "layouts/iur/data/iur_data";

function Tables() {
  const [resolution, setResolution] = useState(`${window.innerWidth} x ${window.innerHeight}`);

  useEffect(() => {
    // 更新解析度
    const updateResolution = () => {
      setResolution(`${window.innerWidth} x ${window.innerHeight}`);
    };

    // 監聽窗口大小變化，實時更新解析度
    window.addEventListener("resize", updateResolution);

    // 初次加載時更新解析度
    updateResolution();

    // 清除事件監聽器
    return () => {
      window.removeEventListener("resize", updateResolution);
    };
  }, []);

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          padding: "5px",
          background: "#333",
          color: "#fff",
          fontSize: "12px",
          zIndex: 9999,
        }}
      >
        {resolution}
      </div>

      {/* 其他 JSX 內容 */}
    </>
  );
}

export default Tables;
