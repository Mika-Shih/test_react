//import React, { useState } from "react";
//import axios from "axios";
function DropdownWithButton() {
  const categoryoption = ["TOOL", "WLAN_BT", "NFC", "LAN", "DOCK_LAN", "WWAN_GPS"];
  const subdeviceoption = [
    "WLAN",
    "BT",
    "NFC",
    "LAN",
    "DOCK",
    "DOCK_LAN",
    "GNSS",
    "WWANNET",
    "USB",
    "MCD",
    "MBIM",
    "PCIE",
  ];

  const device_tool_div = document.getElementById("dvice_tool_div");
  const inputElements = [
    {
      label: "Category:",
      type: "select",
      id: "category",
      name: "category",
      selectOptions: categoryoption,
    },
    { label: "Sub Device:", type: "select", id: "subdevice", name: "subdevice" },
    { label: "Short name:", type: "text", id: "shortname", name: "shortname" },
  ];
  const inputElement_div = [
    { label: "Long name:", type: "text", id: "longname", name: "longname" },
    { label: "Supported HW ID:", type: "textarea", id: "hw_id", name: "hw_id", rows: 4 },
  ];
  inputElements.forEach((input) => {
    const div = document.createElement("div");
    const label = document.createElement("label");
    const inputElement =
      input.type === "select" ? document.createElement("select") : document.createElement("input");
    label.setAttribute("for", input.id);
    label.textContent = input.label;
    if (input.id === "category") {
      input.selectOptions.forEach((optionText) => {
        const option = document.createElement("option");
        option.textContent = optionText;
        inputElement.appendChild(option);
      });
      inputElement.addEventListener("change", function () {
        const subdeviceSelect = document.getElementById("subdevice");
        subdeviceSelect.innerHTML = "";
        let subdeviceoption = [];
        subdeviceoption = categoryoption_decide_subdeviceoption();
        console.log(subdeviceoption);
        subdeviceoption.forEach((optionData) => {
          event.stopPropagation();
          const option = document.createElement("option");
          option.textContent = optionData;
          subdeviceSelect.appendChild(option);
        });
      });
    } else if (input.id === "subdevice") {
      let subdevice_option = subdeviceoption;
      subdevice_option.forEach((optionData) => {
        const option = document.createElement("option");
        option.textContent = optionData;
        inputElement.appendChild(option);
      });
    }
    inputElement.setAttribute("type", "text");
    inputElement.setAttribute("id", input.id);
    inputElement.setAttribute("name", input.name);
    div.appendChild(label);
    div.appendChild(inputElement);
    device_tool_div.appendChild(div);
  });
  document.getElementById("category").addEventListener("change", function () {
    if (document.getElementById("longname")) {
      document.getElementById("longname").parentNode.remove();
      document.getElementById("hw_id").parentNode.remove();
    }
    if (document.getElementById("category").value != "TOOL") {
      inputElement_div.forEach((input) => {
        const div = document.createElement("div");
        //div.id = input.id
        const label = document.createElement("label");
        const inputElement = document.createElement("input");
        label.setAttribute("for", input.id);
        label.textContent = input.label;

        inputElement.setAttribute("type", "text");
        inputElement.setAttribute("id", input.id);
        inputElement.setAttribute("name", input.name);
        div.appendChild(label);
        div.appendChild(inputElement);
        device_tool_div.appendChild(div);
      });
    }
  });

  function categoryoption_decide_subdeviceoption() {
    // ["PowerStressTest", "WLAN", "BT", "NFC", "LAN", "DOCK", "DOCK_LAN", "GNSS", "WWANNET", "USB", "MCD", "MBIM", "PCIE"];
    const category = document.getElementById("category").value;
    if (category == "TOOL") {
      return subdeviceoption;
    } else if (category == "WLAN_BT") {
      return ["WLAN", "BT"];
    } else if (category == "NFC") {
      return ["NFC"];
    } else if (category == "LAN") {
      return ["LAN"];
    } else if (category == "DOCK_LAN") {
      return ["DOCK", "DOCK_LAN"];
    } else if (category == "WWAN_GPS") {
      return ["GNSS", "WWANNET", "USB", "MCD", "MBIM", "PCIE"];
    }
  }

  return (
    <div>
      <div id="dvice_tool_div">
        <button id="add_hwid">送出</button>
      </div>
    </div>
  );
}

export default DropdownWithButton;
