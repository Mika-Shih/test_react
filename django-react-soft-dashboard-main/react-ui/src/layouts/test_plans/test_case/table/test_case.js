import React, { useState, useEffect } from "react";
import useStyles from "./styles/case_styles";
import { Dialog, Box, DialogTitle, DialogContent, DialogActions, Typography } from "@mui/material";
import {
  Tab,
  Tabs,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Select,
  MenuItem,
} from "@mui/material";
import Button from "examples/Icons/Button";
// import Loading_option from "examples/tool_universal/loading_option";
import TextField from "@mui/material/TextField";
import Loading_option_add_remove from "examples/tool_universal/loading_option_add_remove";
import Pagination from "layouts/test_plans/test_plan/function/pagination";
import ContentDialog from "layouts/test_plans/test_plan/function/content_dialog";
import ComparisonTool from "layouts/test_plans/test_case/table/function/comparison_tool";
import Loading from "examples/tool_universal/loading";
import SuiButton from "components/SuiButton";
import SuiBox from "components/SuiBox";
import Icon from "@mui/material/Icon";
import TESTCASE from "api/test_plans/test_case";
import PropTypes from "prop-types";
function Test_case({ category }) {
  // =================== 1-1. useState hooks ===================
  const [loading, setLoading] = useState(false);
  const [case_data, set_case_data] = useState([]);
  const [current_data, set_current_data] = useState();
  const [EditCase, SetEditCase] = useState({
    id: null,
    name: "",
    description: "",
    comment: "",
  });
  const [CreateCase, SetCreateCase] = useState({
    name: "",
    description: "",
    comment: "",
    teg: "",
  });
  const classes = useStyles();
  const [pop_filter, set_pop_filter] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
  });
  const [selectedIndex, setSelectedIndex] = useState({});
  const [openDescriptionDialog, setOpenDescriptionDialog] = useState(false);
  const [descriptionContent, setDescriptionContent] = useState("");
  const [permission, set_permission] = useState({
    admin: [],
    editor: [],
    admin_checkbox: false,
    admin_permission: false,
    editor_permission: false,
  });
  const [search_text, set_search_text] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLetter, setCurrentLetter] = useState("");

  // =================== 1-2. useEffect hooks ===================

  useEffect(() => {
    setSelectedIndex({});
    get_test_case();
  }, [category]);

  const groupedData =
    case_data?.reduce((acc, item) => {
      if (item.tag && typeof item.tag === "string") {
        const firstLetter = item.tag.charAt(0).toUpperCase();
        if (!acc[firstLetter]) {
          acc[firstLetter] = [];
        }
        acc[firstLetter].push(item);
      }
      return acc;
    }, {}) || {};

  const availableTags = Object.keys(groupedData).sort();

  useEffect(() => {
    if (availableTags.length > 0 && !availableTags.includes(currentLetter)) {
      setCurrentLetter(availableTags[0]);
    }
  }, [category, availableTags]);

  useEffect(() => {
    setCurrentPage(1);
  }, [currentLetter]);

  // =================== 2. API & Data processing functions ===================

  const getVersionNumber = (data, caseId) => {
    if (!data || !data.data || !Array.isArray(data.data)) {
      return "V.0";
    }

    if (data.item_order && Array.isArray(data.item_order)) {
      const index = data.item_order.findIndex((id) => id === caseId);
      return index >= 0 ? `V.${index + 1}` : "V.0";
    }

    const sortedVersions = [...data.data].sort((a, b) => a.case_id - b.case_id);
    const sortedIndex = sortedVersions.findIndex((item) => item.case_id === caseId);
    return sortedIndex >= 0 ? `V.${sortedIndex + 1}` : "V.0";
  };

  const get_test_case = async () => {
    setLoading(true);
    let response = await TESTCASE.list_case({
      category: category,
    });

    if (response.data.finaldata) {
      const processedData = response.data.finaldata.map((data) => {
        // 將 select 轉為數字 (API返回的实际是在item_order中的索引)
        let selectedIndex = Number(data.select);

        // 先建立版本排序
        let orderedData = [];

        // 根據 case_id 排序
        orderedData = [...data.data].sort((a, b) => a.case_id - b.case_id);

        let selectedCaseId;

        if (selectedIndex >= 0 && selectedIndex < orderedData.length) {
          selectedCaseId = orderedData[selectedIndex]?.case_id;
        } else {
          selectedCaseId = orderedData[0]?.case_id || 0;
        }

        // 檢查轉換後的 case_id 是否有效且未被刪除
        const targetCase = orderedData.find((v) => v.case_id === selectedCaseId);

        if (!targetCase || targetCase.case_status === "delete") {
          const activeVersions = orderedData.filter((item) => item.case_status !== "delete");

          if (activeVersions.length > 0) {
            selectedCaseId = activeVersions[0].case_id;
          } else {
            selectedCaseId = orderedData[0]?.case_id || 0;
          }
        }

        return {
          ...data,
          data: orderedData,
          select: selectedCaseId,
          versionMap: orderedData.reduce((map, item, idx) => {
            map[item.case_id] = idx + 1;
            return map;
          }, {}),
        };
      });

      setSelectedIndex(() => {
        const newIndexes = {};
        processedData.forEach((data) => {
          // 使用處理後的 data.select (case_id) 找到對應的索引
          const index = data.data.findIndex((item) => item.case_id === data.select);
          newIndexes[data.id] = index !== -1 ? index : 0;
        });
        return newIndexes;
      });

      set_case_data(processedData);
      set_permission({
        ...permission,
        admin_permission: response.data.permission.admin_permission,
        editor_permission: response.data.permission.editor_permission,
        admin: response.data.permission.admin.map((email) => ({
          title: email,
          value: email,
        })),
        editor: response.data.permission.editor.map((email) => ({
          title: email,
          value: email,
        })),
      });
    } else if (response.data.error) {
      set_case_data([]);
      set_permission({
        admin: [],
        editor: [],
        admin_checkbox: false,
        admin_permission: false,
        editor_permission: false,
      });
      setSelectedIndex({});
      alert(response.data.error);
    }
    setLoading(false);
  };

  const create_new_case = async () => {
    setLoading(true);
    try {
      const response = await TESTCASE.create_case({
        category: category,
        name: CreateCase.name,
        description: CreateCase.description,
        comment: CreateCase.comment,
        tag: CreateCase.tag,
      });
      if (response.data.finaldata) {
        alert(response.data.finaldata);
        closeModal(1);
        window.location.reload();
      } else if (response.data.error) {
        alert(response.data.error);
      }
    } catch (error) {
      alert("Please contact the administrator.");
    } finally {
      setLoading(false);
    }
  };

  const edit_new_case = async () => {
    setLoading(true);
    try {
      const response = await TESTCASE.edit_case({
        id: EditCase.id,
        name: EditCase.name,
        description: EditCase.description,
        comment: EditCase.comment,
        category: category,
      });
      if (response.data.finaldata) {
        alert(response.data.finaldata);
        closeModal(3);
        window.location.reload();
      } else if (response.data.error) {
        alert(response.data.error);
      }
    } catch (error) {
      alert("Please contact the administrator.");
    } finally {
      setLoading(false);
    }
  };

  const edit_main_case_api = async () => {
    setLoading(true);

    try {
      const selectedCase = current_data.data[selectedIndex[current_data.id]];

      const response = await TESTCASE.edit_main_case({
        id: current_data.id,
        select: selectedCase.case_id,
        category: category,
      });

      if (response.data.finaldata) {
        const updatedCaseData = [...case_data];
        const caseIndex = updatedCaseData.findIndex((item) => item.id === current_data.id);

        if (caseIndex !== -1) {
          updatedCaseData[caseIndex].select = selectedCase.case_id;
          set_case_data(updatedCaseData);
        }

        alert(response.data.finaldata);
        closeModal(6);

        await get_test_case();
      } else if (response.data.error) {
        alert(response.data.error);
      }
    } catch (error) {
      console.error("Error updating main case:", error);
      alert("Please contact the administrator.");
    } finally {
      setLoading(false);
    }
  };

  const edit_permission_api = async () => {
    setLoading(true);
    try {
      const admin_list = permission.admin.filter(Boolean).map((item) => item.value);
      const editor_list = permission.editor.filter(Boolean).map((item) => item.value);
      const response = await TESTCASE.edit_permission({
        category: category,
        admin: admin_list,
        editor: editor_list,
      });
      if (response.data.finaldata) {
        alert(response.data.finaldata);
        closeModal(5);
        window.location.reload();
      } else if (response.data.error) {
        alert(response.data.error);
      }
    } catch (error) {
      alert("Please contact the administrator.");
    } finally {
      setLoading(false);
    }
  };

  // =================== 3. Event Handling Function ===================

  const openModal = (modalNumber) => {
    set_pop_filter((prev) => ({ ...prev, [modalNumber]: true }));
  };

  const closeModal = (modalNumber) => {
    set_pop_filter((prev) => ({ ...prev, [modalNumber]: false }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    } else {
      setCurrentPage(1);
    }
  };

  // =================== 4. Utility Functions ===================
  function formatTimeForFrontend(inputTime) {
    if (!inputTime || isNaN(new Date(inputTime).getTime())) {
      return "Invalid Date";
    }

    const date = new Date(inputTime);

    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    const year = date.getUTCFullYear();

    const formattedTime = date.toLocaleString("en-US", {
      timeZone: "Asia/Taipei",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    return `${month}/${day}, ${year}, ${formattedTime}`;
  }

  const compareText = (text1, text2) => {
    if (text1 === text2) return text1;

    const diffIndex = [...text1].findIndex((char, i) => char !== text2[i]);

    if (diffIndex === -1) return text1;

    return (
      <span>
        {text1.slice(0, diffIndex)}
        <span style={{ color: "red", fontWeight: "bold" }}>{text1.slice(diffIndex)}</span>
      </span>
    );
  };

  // =================== 5-1. Table Structure & Rendering ===================

  const title_data = [
    // { className: classes.title_no, children: "NO." },
    { className: classes.title_tag, children: "Tag" },
    { className: classes.title_case_name, children: "Case Name" },
    { className: classes.title_description, children: "Description" },
    // { className: classes.title_position_style, children: "" },
    // { className: classes.title_last_editor, children: "Last Editor" },
    // { className: classes.title_update_time, children: "Update Time" },
    { className: classes.title_version, children: "Version" },
    { className: classes.title_action, children: "Action" },
  ];

  function title_row(title_data) {
    return (
      <>
        <TableRow className={classes.title_table_row_style}>
          {title_data.map((item, index) => (
            <MyTableCell key={index} className={item.className}>
              {item.children}
            </MyTableCell>
          ))}
        </TableRow>
      </>
    );
  }
  function MyTableCell({ index, style, className, children }) {
    return (
      <TableCell key={index} style={style} className={className}>
        {children}
      </TableCell>
    );
  }
  MyTableCell.propTypes = {
    index: PropTypes.number.isRequired,
    style: PropTypes.object,
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
  };

  const data_row = (index, data) => {
    if (!data || !data.data || selectedIndex[data.id] === undefined || data.data.length === 0) {
      return null;
    }

    const safeIndex = selectedIndex[data.id] !== undefined ? selectedIndex[data.id] : 0;

    const rowData = data.data[safeIndex];
    if (!rowData) {
      return null;
    }
    return (
      <>
        <TableRow className={classes.table_row_style}>
          <TableCell key={index} className={classes.tag}>
            {data.tag}
          </TableCell>
          <TableCell key={index} className={classes.case_name}>
            {rowData.case_name}
          </TableCell>
          <TableCell
            key={`${index}-description`}
            className={classes.description}
            style={{
              cursor:
                rowData.description && rowData.description.length > 100 ? "pointer" : "default",
            }}
            onClick={() => {
              const description = rowData.description;
              if (description && description.length > 100) {
                setDescriptionContent(description);
                setOpenDescriptionDialog(true);
              }
            }}
          >
            {rowData.description
              ? rowData.description.length > 100
                ? `${rowData.description.substring(0, 100)}...`
                : rowData.description
              : ""}
          </TableCell>

          <TableCell key={index} className={classes.version}>
            {/* 移除錯誤的嵌套TableCell */}
            {rowData && (
              <Select
                key={`select-${data.id}-${safeIndex}`}
                value={rowData.case_id}
                onChange={(e) => {
                  const selectedCaseId = Number(e.target.value);
                  const originalIndex = data.data.findIndex(
                    (item) => item.case_id === selectedCaseId
                  );
                  setSelectedIndex((prev) => ({ ...prev, [data.id]: originalIndex }));
                }}
              >
                {/* Select的內容不變 */}
                {(() => {
                  const versionMap = {};
                  let orderedData = [];
                  if (
                    data.item_order &&
                    Array.isArray(data.item_order) &&
                    data.item_order.length > 0
                  ) {
                    orderedData = data.item_order
                      .map((orderId) => data.data.find((item) => item.case_id === orderId))
                      .filter((item) => item);
                    data.item_order.forEach((caseId, idx) => {
                      versionMap[caseId] = idx + 1;
                    });
                  } else {
                    orderedData = [...data.data].sort((a, b) => a.case_id - b.case_id);
                    orderedData.forEach((item, idx) => {
                      versionMap[item.case_id] = idx + 1;
                    });
                  }

                  const activeVersions = orderedData.filter(
                    (item) => item.case_status !== "delete"
                  );

                  return activeVersions.map((item) => (
                    <MenuItem key={`${item.case_id}`} value={item.case_id}>
                      {`V.${versionMap[item.case_id]}`}
                    </MenuItem>
                  ));
                })()}
              </Select>
            )}

            {(permission.admin_permission || permission.editor_permission) &&
              data.select !== data.data[selectedIndex[data.id]].case_id && (
                <SuiButton
                  variant="text"
                  buttonColor="dark"
                  onClick={() => {
                    openModal(6);
                    set_current_data(data);
                  }}
                >
                  <Icon>update</Icon>
                </SuiButton>
              )}
          </TableCell>
          <TableCell key={index} className={classes.action}>
            <SuiBox>
              <SuiButton
                variant="text"
                buttonColor="info"
                onClick={() => {
                  openModal(2);
                  set_current_data(data);
                }}
              >
                <Icon className="material-icons-round">visibility</Icon>&nbsp;view
              </SuiButton>
              {(permission.admin_permission || permission.editor_permission) && (
                <SuiButton
                  variant="text"
                  buttonColor="dark"
                  onClick={() => {
                    openModal(3);
                    set_current_data(data);
                    const currentVersion = data.data[selectedIndex[data.id]];

                    SetEditCase({
                      ...EditCase,
                      id: data.id,
                      name: currentVersion.case_name,
                      description: currentVersion.description,
                      comment: currentVersion.comment,
                    });
                  }}
                >
                  <Icon className="material-icons-round">edit</Icon>&nbsp;edit
                </SuiButton>
              )}
            </SuiBox>
          </TableCell>
        </TableRow>
        <ContentDialog
          open={openDescriptionDialog}
          onClose={() => setOpenDescriptionDialog(false)}
          title="Description"
          content={descriptionContent}
        />
      </>
    );
  };

  const create_case = () => {
    return (
      <>
        <div className={classes.columns_center}>
          <div className={classes.line_form_style} style={{ marginBottom: "20px" }}>
            <label htmlFor="category">Technology&nbsp;:&nbsp;&nbsp;{category}</label>
            {/* <select
              id="category"
              name="category"
              style={{
                width: "300px",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "8px",
              }}
              value={CreateCase.category}
              onChange={(e) => {
                SetCreateCase({
                  ...CreateCase,
                  category: e.target.value,
                });
              }}
            >
              <option value="category">{category}</option>
              <option value="common">COMMON</option>
            </select> */}
          </div>
          <div className={classes.line_form_style}>
            <div className={classes.columns_center}>
              <label htmlFor="test_case">
                Test Case Name&nbsp;<span style={{ color: "red" }}>*</span>&nbsp;:&nbsp;&nbsp;
              </label>
              <input
                id="test_case"
                name="test_case"
                style={{
                  width: "480px",
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                }}
                value={CreateCase.name}
                onChange={(e) => {
                  SetCreateCase({
                    ...CreateCase,
                    name: e.target.value,
                  });
                }}
              />
            </div>
          </div>
          <div className={classes.line_form_style}>
            <div className={classes.columns_center}>
              <label htmlFor="description">
                Description&nbsp;<span style={{ color: "red" }}>*</span>&nbsp;:&nbsp;&nbsp;
              </label>
              <textarea
                id="description"
                name="description"
                rows={8}
                style={{
                  width: "480px",
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                }}
                value={CreateCase.description}
                onChange={(e) => {
                  SetCreateCase({
                    ...CreateCase,
                    description: e.target.value,
                  });
                }}
              />
            </div>
          </div>
          <div className={classes.line_form_style}>
            <div className={classes.columns_center}>
              <label htmlFor="comment">Comment&nbsp;:&nbsp;&nbsp;</label>
              <textarea
                id="comment"
                name="comment"
                style={{
                  width: "480px",
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                }}
                value={CreateCase.comment}
                onChange={(e) => {
                  SetCreateCase({
                    ...CreateCase,
                    comment: e.target.value,
                  });
                }}
              />
            </div>
          </div>
          <div className={classes.line_form_style}>
            <div className={classes.columns_center}>
              <label htmlFor="tag">
                Tag&nbsp;<span style={{ color: "red" }}>*</span>&nbsp;:&nbsp;&nbsp;
              </label>
              <input
                id="tag"
                name="tag"
                style={{
                  width: "350px",
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                }}
                value={CreateCase.tag}
                onChange={(e) => {
                  SetCreateCase({
                    ...CreateCase,
                    tag: e.target.value,
                  });
                }}
              />
            </div>
          </div>
          <div style={{ marginBottom: "30px" }}></div>
          <div className={classes.line_form_style}>
            <Button onClick={create_new_case}>Create Case</Button>
            <Button onClick={() => closeModal(1)}>Close</Button>
          </div>
        </div>
      </>
    );
  };

  const edit_case = (data) => {
    if (data) {
      return (
        <>
          <div className={classes.columns_center}>
            <div className={classes.line_form_style} style={{ marginBottom: "20px" }}>
              <label htmlFor="category">Category&nbsp;:&nbsp;&nbsp; {data.category}</label>
            </div>
            {/* <div className={classes.line_form_style} style={{ marginBottom: "20px" }}>
              <label htmlFor="category">Creator&nbsp;:&nbsp;&nbsp; {data.creator_name}</label>
            </div> */}
            <div className={classes.line_form_style}>
              <div className={classes.columns_center}>
                <label htmlFor="test_case">Test Case Name&nbsp;:&nbsp;&nbsp;</label>
                <input
                  id="test_case"
                  name="test_case"
                  style={{
                    width: "480px",
                    padding: "8px",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                  }}
                  value={EditCase.name}
                  onChange={(e) => {
                    SetEditCase({
                      ...EditCase,
                      name: e.target.value,
                    });
                  }}
                />
              </div>
            </div>
            <div className={classes.line_form_style}>
              <div className={classes.columns_center}>
                <label htmlFor="description">Description&nbsp;:&nbsp;&nbsp;</label>
                <textarea
                  id="description"
                  name="description"
                  rows={8}
                  style={{
                    width: "480px",
                    padding: "8px",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                  }}
                  value={EditCase.description}
                  onChange={(e) => {
                    SetEditCase({
                      ...EditCase,
                      description: e.target.value,
                    });
                  }}
                />
              </div>
            </div>
            <div className={classes.line_form_style}>
              <div className={classes.columns_center}>
                <label htmlFor="comment">Comment&nbsp;:&nbsp;&nbsp;</label>
                <textarea
                  id="comment"
                  name="comment"
                  style={{
                    width: "480px",
                    padding: "8px",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                  }}
                  value={EditCase.comment}
                  onChange={(e) => {
                    SetEditCase({
                      ...EditCase,
                      comment: e.target.value,
                    });
                  }}
                />
              </div>
            </div>
            <div className={classes.line_form_style}>
              <Button onClick={edit_new_case}>Edit Case</Button>
              <Button onClick={() => closeModal(3)}>Close</Button>
            </div>
          </div>
        </>
      );
    }
  };

  const edit_main_case = (data) => {
    if (
      !data ||
      !data.data ||
      !Array.isArray(data.data) ||
      data.data.length === 0 ||
      selectedIndex[data.id] === undefined ||
      !data.data[selectedIndex[data.id]]
    ) {
      return (
        <div className={classes.columns_center}>
          <p>Please contact the administrator.</p>
          <Button onClick={() => closeModal(6)}>Close</Button>
        </div>
      );
    }
    if (data) {
      return (
        <>
          <div className={classes.columns_center}>
            <div className={classes.line_form_style} style={{ marginBottom: "20px" }}>
              <label htmlFor="category">Category&nbsp;:&nbsp;&nbsp; {data.category}</label>
            </div>
            <div className={classes.line_form_style}>
              <div className={classes.columns_center}>
                <label htmlFor="test_case">Test Case Name&nbsp;:&nbsp;&nbsp;</label>
                <div>{data.data[selectedIndex[data.id]].case_name}</div>
              </div>
            </div>
            <div className={classes.line_form_style}>
              <div className={classes.columns_center}>
                <label htmlFor="description">Description&nbsp;:&nbsp;&nbsp;</label>
                <div>{data.data[selectedIndex[data.id]].description}</div>
              </div>
            </div>
            <div className={classes.line_form_style}>
              <div className={classes.columns_center}>
                <label htmlFor="comment">Comment&nbsp;:&nbsp;&nbsp;</label>
                <div>{data.data[selectedIndex[data.id]].comment}</div>
              </div>
            </div>
            <div className={classes.line_form_style}>
              <Button onClick={edit_main_case_api}>Setting Main Case</Button>
              <Button onClick={() => closeModal(6)}>Close</Button>
            </div>
          </div>
        </>
      );
    }
  };

  const view_case = (data) => {
    const [selectedCases, setSelectedCases] = useState([]);
    const [, setDeletedCases] = useState([]);
    const [tabIndex, setTabIndex] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const casesPerPage = 5;
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [restoreConfirmOpen, setRestoreConfirmOpen] = useState(false);
    const [sortDirection, setSortDirection] = useState("desc");

    useEffect(() => {
      setCurrentPage(1);
    }, [data]);
    useEffect(() => {
      return () => {
        setSelectedCases([]);
      };
    }, [data, tabIndex]);

    if (!data || !data.data || !Array.isArray(data.data) || data.data.length === 0) {
      return <div>No data available.</div>;
    }

    const toggleSortDirection = () =>
      setSortDirection((prev) => (prev === "desc" ? "asc" : "desc"));

    const titleData = [
      { className: classes.view_title_select, children: "" },
      { className: classes.view_title_case_name, children: "Case Name" },
      { className: classes.view_title_description, children: "Description" },
      { className: classes.view_title_comment, children: "Comment" },
      { className: classes.view_title_last_editor, children: "Last Editor" },
      {
        className: classes.view_title_version,
        children: (
          <div
            style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            onClick={toggleSortDirection}
          >
            Version {sortDirection === "desc" ? "▼" : "▲"}
          </div>
        ),
      },
      { className: classes.view_title_update_time, children: "Update Time" },
    ];

    const filteredData = data.data.filter((rowData) =>
      tabIndex === 1 ? rowData.case_status === "delete" : rowData.case_status !== "delete"
    );

    const sortedData = [...filteredData].sort((a, b) => {
      if (sortDirection === "desc") {
        return b.case_id - a.case_id;
      } else {
        return a.case_id - b.case_id;
      }
    });
    const totalPages = Math.ceil(filteredData.length / casesPerPage);

    const paginatedData = sortedData.slice(
      (currentPage - 1) * casesPerPage,
      currentPage * casesPerPage
    );

    const handlePageChange = (newPage) => {
      setCurrentPage(newPage);
    };

    const handleToggleCaseSelection = (caseId) => {
      setSelectedCases((prev) =>
        prev.includes(caseId) ? prev.filter((id) => id !== caseId) : [...prev, caseId]
      );
    };
    const showRestoreConfirmation = () => {
      if (selectedCases.length === 0) {
        alert("Please select at least one test case to restore.");
        return;
      }
      setRestoreConfirmOpen(true);
    };

    const handleDeleteSelected = () => {
      showDeleteConfirmation();
    };

    const handleRestoreSelected = () => {
      showRestoreConfirmation();
    };

    const showDeleteConfirmation = () => {
      if (selectedCases.length === 0) {
        alert("Please select at least one test case to delete.");
        return;
      }
      setDeleteConfirmOpen(true);
    };

    const cancelDelete = () => {
      setDeleteConfirmOpen(false);
    };

    const cancelRestore = () => {
      setRestoreConfirmOpen(false);
    };

    const executeDelete = async () => {
      setDeleteConfirmOpen(false);

      let successfulDeletes = [];
      let failedDeletes = [];

      for (const caseId of selectedCases) {
        try {
          const response = await TESTCASE.delete_case({ case_id: caseId });

          if (response.data.finaldata === "Successful") {
            successfulDeletes.push(caseId);
          } else {
            failedDeletes.push(caseId);
            console.error("Delete error:", response.data.error);
          }
        } catch (error) {
          console.error("Error deleting test case:", error);
          failedDeletes.push(caseId);
        }
      }

      if (successfulDeletes.length > 0) {
        alert(`Successfully deleted ${successfulDeletes.length} test case(s).`);

        const updatedCaseData = JSON.parse(JSON.stringify(case_data));

        updatedCaseData.forEach((testCase) => {
          testCase.data.forEach((version) => {
            if (successfulDeletes.includes(version.case_id)) {
              version.case_status = "delete";
            }
          });
        });

        const newSelectedIndex = { ...selectedIndex };

        updatedCaseData.forEach((testCase) => {
          const activeVersions = testCase.data.filter((item) => item.case_status !== "delete");

          const currentSelectedVersion = testCase.data[newSelectedIndex[testCase.id]];

          if (!currentSelectedVersion || currentSelectedVersion.case_status === "delete") {
            if (activeVersions.length > 0) {
              const highestVersionItem = activeVersions.sort((a, b) => b.case_id - a.case_id)[0];
              const newIndex = testCase.data.findIndex(
                (item) => item.case_id === highestVersionItem.case_id
              );

              if (newIndex !== -1) {
                newSelectedIndex[testCase.id] = newIndex;
              }
            }
          }
        });

        set_case_data(updatedCaseData);
        setSelectedIndex(newSelectedIndex);

        setSelectedCases([]);

        if (current_data) {
          const updatedCurrentData = updatedCaseData.find((item) => item.id === current_data.id);
          if (updatedCurrentData) {
            set_current_data({ ...updatedCurrentData });
          }
        }

        setSelectedIndex({ ...newSelectedIndex });
      }

      if (failedDeletes.length > 0) {
        alert(`Failed to delete ${failedDeletes.length} test case(s). Please try again.`);
      }
    };

    const executeRestore = async () => {
      setRestoreConfirmOpen(false);

      let successfulRestores = [];
      let failedRestores = [];

      for (const caseId of selectedCases) {
        try {
          const response = await TESTCASE.restore_case({ case_id: caseId }); // 單筆請求

          if (response.data.finaldata === "Successful") {
            successfulRestores.push(caseId);
          } else {
            failedRestores.push(caseId);
            console.error("Restore error:", response.data.error);
          }
        } catch (error) {
          console.error("Error restoring test case:", error);
          failedRestores.push(caseId);
        }
      }

      if (successfulRestores.length > 0) {
        alert(`Successfully restored ${successfulRestores.length} test case(s).`);

        setDeletedCases((prev) => prev.filter((id) => !successfulRestores.includes(id)));

        data.data.forEach((caseItem) => {
          if (successfulRestores.includes(caseItem.case_id)) {
            caseItem.case_status = "approve";
          }
        });
      }

      if (failedRestores.length > 0) {
        alert(`Failed to restore ${failedRestores.length} test case(s). Please try again.`);
      }

      setSelectedCases([]);
    };

    const data_row = (index, rowData, comparisonData = null) => {
      if (!rowData || typeof rowData.case_id === "undefined") {
        console.error("Invalid rowData:", rowData);
        return null;
      }

      // 為每個 case_id 分配版本號
      const versionNumber = getVersionNumber(data, rowData.case_id);

      const isSelected = selectedCases.includes(rowData.case_id);

      return (
        <TableRow className={classes.view_table_row_style} key={index}>
          <TableCell className={classes.checkbox}>
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => handleToggleCaseSelection(rowData.case_id)}
            />
          </TableCell>
          {/* <TableCell className={classes.view_last_editor}>{rowData.case_id}</TableCell> */}
          <TableCell className={classes.view_case_name}>
            {comparisonData
              ? compareText(rowData.case_name, comparisonData.case_name)
              : rowData.case_name}
          </TableCell>
          <TableCell className={classes.view_description} style={{ whiteSpace: "pre-wrap" }}>
            {comparisonData
              ? compareText(rowData.description, comparisonData.description)
              : rowData.description}
          </TableCell>
          <TableCell className={classes.view_comment}>
            {comparisonData
              ? compareText(rowData.comment, comparisonData.comment)
              : rowData.comment}
          </TableCell>
          <TableCell className={classes.view_last_editor}>{rowData.editor_name}</TableCell>
          <TableCell className={classes.view_version}>{versionNumber}</TableCell>
          <TableCell className={classes.view_update_time}>
            {formatTimeForFrontend(rowData.update_time)}
          </TableCell>
        </TableRow>
      );
    };

    return (
      <>
        <Tabs
          value={tabIndex}
          onChange={(event, newValue) => {
            setTabIndex(newValue);
            setCurrentPage(1);
          }}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Active Cases" />
          <Tab label="Deleted Cases" />
        </Tabs>

        <TableContainer>
          <TableRow className={classes.title_table_row_style}>
            {titleData.map((item, index) => (
              <TableCell key={index} className={item.className}>
                {item.children}
              </TableCell>
            ))}
          </TableRow>

          <TableBody>{paginatedData.map((rowData, index) => data_row(index, rowData))}</TableBody>
        </TableContainer>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />

        <div style={{ marginTop: "10px" }}>
          <div style={{ display: "flex", gap: "15px", marginBottom: "10px" }}>
            <div style={{ flex: "0 0 auto" }}>
              {" "}
              <ComparisonTool
                testCaseData={data}
                selectedCases={selectedCases}
                setSelectedCases={setSelectedCases}
                formatTimeForFrontend={formatTimeForFrontend}
                getVersionNumber={getVersionNumber}
                classes={classes}
              />
            </div>
            <div style={{ flex: "0 0 auto" }}>
              {tabIndex === 1 ? (
                <Button
                  variant="contained"
                  onClick={handleRestoreSelected}
                  disabled={selectedCases.length === 0}
                >
                  Restore
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleDeleteSelected}
                  disabled={selectedCases.length === 0}
                >
                  Delete
                </Button>
              )}
            </div>
          </div>

          {/* 刪除確認對話框 */}
          <Dialog
            open={deleteConfirmOpen}
            onClose={cancelDelete}
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-description"
            PaperProps={{
              style: {
                borderRadius: "12px",
                padding: "10px",
              },
            }}
          >
            <DialogTitle
              id="delete-dialog-title"
              style={{ textAlign: "center", fontWeight: "bold" }}
            >
              Confirm Deletion
            </DialogTitle>
            <DialogContent>
              <Typography id="delete-dialog-description">
                {selectedCases.length === 1
                  ? "Are you sure you want to delete the selected test case? This action can be undone later from the Deleted Cases tab."
                  : `Are you sure you want to delete ${selectedCases.length} test cases? This action can be undone later from the Deleted Cases tab.`}
              </Typography>
            </DialogContent>
            <DialogActions style={{ justifyContent: "space-between", padding: "16px 24px" }}>
              <Button
                onClick={cancelDelete}
                variant="outlined"
                color="primary"
                style={{ borderRadius: "8px" }}
              >
                Cancel
              </Button>
              <Button
                onClick={executeDelete}
                variant="contained"
                color="secondary"
                style={{ borderRadius: "8px" }}
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            open={restoreConfirmOpen}
            onClose={cancelRestore}
            aria-labelledby="restore-dialog-title"
            aria-describedby="restore-dialog-description"
            PaperProps={{
              style: {
                borderRadius: "12px",
                padding: "10px",
              },
            }}
          >
            <DialogTitle
              id="restore-dialog-title"
              style={{ textAlign: "center", fontWeight: "bold" }}
            >
              Confirm Restoration
            </DialogTitle>
            <DialogContent>
              <Typography id="restore-dialog-description">
                {selectedCases.length === 1
                  ? "Are you sure you want to restore the selected test case? This will move it back to the Active Cases list."
                  : `Are you sure you want to restore ${selectedCases.length} test cases? This will move them back to the Active Cases list.`}
              </Typography>
            </DialogContent>
            <DialogActions style={{ justifyContent: "space-between", padding: "16px 24px" }}>
              <Button
                onClick={cancelRestore}
                variant="outlined"
                color="primary"
                style={{ borderRadius: "8px" }}
              >
                Cancel
              </Button>
              <Button
                onClick={executeRestore}
                variant="contained"
                color="primary"
                style={{ borderRadius: "8px" }}
              >
                Restore
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </>
    );
  };

  const edit_permission = () => {
    return (
      <>
        <div className={classes.columns_center}>
          <label htmlFor="reviewer" style={{ fontWeight: "bold" }}>
            Admin&nbsp;:&nbsp;&nbsp;
          </label>
          {permission.admin_permission ? (
            <>
              <div className={`${permission.admin_checkbox ? "" : classes.disabled}`}>
                <Loading_option_add_remove
                  api="polls/lendpersonnel"
                  name="user_mail"
                  selectedOptions={permission.admin}
                  setSelectedOptions={(newOptions) =>
                    set_permission({ ...permission, admin: newOptions })
                  }
                  disabled={permission.admin_checkbox}
                />
              </div>
              <div style={{ marginBottom: "30px" }}></div>
              <div className={classes.line_form_style}>
                <input
                  type="checkbox"
                  checked={permission.admin_checkbox}
                  style={{ marginRight: "10px" }}
                  onChange={() => {
                    set_permission((prevState) => ({
                      ...prevState,
                      admin_checkbox: !prevState.admin_checkbox,
                    }));
                  }}
                />
                <h15 className={classes.hint_word}>
                  Modifying personnel with admin privileges will grant them the ability to edit the
                  editors.
                </h15>
              </div>
            </>
          ) : (
            <>
              {permission.admin &&
                permission.admin.map((item, index) => <div key={index}>{item.value}</div>)}
              <div style={{ marginBottom: "30px" }}></div>
            </>
          )}
          <label htmlFor="editor" style={{ fontWeight: "bold" }}>
            Editor:
          </label>
          {permission.admin_permission ? (
            <>
              <Loading_option_add_remove
                api="polls/lendpersonnel"
                name="user_mail"
                selectedOptions={permission.editor}
                setSelectedOptions={(newOptions) =>
                  set_permission({ ...permission, editor: newOptions })
                }
              />
              <div style={{ marginBottom: "30px" }}></div>
            </>
          ) : (
            <>
              {permission.editor &&
                permission.editor.map((item, index) => <div key={index}>{item.value}</div>)}
              <div style={{ marginBottom: "30px" }}></div>
            </>
          )}
          <div className={classes.line_form_style}>
            {permission.admin_permission && (
              <Button onClick={edit_permission_api}>Edit Permission</Button>
            )}
            <Button onClick={() => closeModal(5)}>Close</Button>
          </div>
        </div>
      </>
    );
  };

  // =================== 6. Data Filtering & Pagination Logic ===================

  const filter_data = case_data.filter((data) => {
    // 先檢查是否符合當前選擇的標籤首字母條件
    if (currentLetter && data.tag && !data.tag.startsWith(currentLetter)) {
      return false;
    }

    // 如果有搜尋文字，再進一步過濾
    if (search_text) {
      const caseName = data.data[selectedIndex[data.id]]?.case_name || "";
      const tag = data.tag || "";

      return (
        caseName.toLowerCase().includes(search_text.toLowerCase()) ||
        tag.toLowerCase().includes(search_text.toLowerCase())
      );
    }

    return true;
  });

  const paginatedData = groupedData[currentLetter] || [];

  const itemsPerPage = 10;

  const totalPages = Math.max(1, Math.ceil(paginatedData.length / itemsPerPage));

  // =================== 7. Component Return ===================

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", marginLeft: "20px" }}>
        <Loading loading={loading} />
        <Dialog open={pop_filter[1]} onClose={() => closeModal(1)} fullWidth maxWidth="md">
          <Box sx={{ padding: "20px" }}>{create_case()}</Box>
        </Dialog>
        <Dialog open={pop_filter[2]} onClose={() => closeModal(2)} fullWidth maxWidth="false">
          <Box sx={{ padding: "20px" }}>{view_case(current_data)}</Box>
        </Dialog>
        <Dialog open={pop_filter[3]} onClose={() => closeModal(3)} fullWidth maxWidth="false">
          <Box sx={{ padding: "20px" }}>{edit_case(current_data)}</Box>
        </Dialog>
        {/* <Dialog open={pop_filter[4]} onClose={() => closeModal(4)} fullWidth maxWidth="sm">
          <Box sx={{ padding: "20px" }}>{create_category()}</Box>
        </Dialog> */}
        <Dialog open={pop_filter[5]} onClose={() => closeModal(5)} fullWidth maxWidth="md">
          <Box sx={{ padding: "20px" }}>{edit_permission()}</Box>
        </Dialog>
        <Dialog open={pop_filter[6]} onClose={() => closeModal(6)} fullWidth maxWidth="md">
          <Box sx={{ padding: "20px" }}>{edit_main_case(current_data)}</Box>
        </Dialog>
        {(permission.admin_permission || permission.editor_permission) && (
          <Button onClick={() => openModal(1)} className={classes.button_style}>
            Create Case
          </Button>
        )}
        {/* <Button onClick={() => openModal(4)} className={classes.button_style}>
          Add Technology
        </Button> */}

        <Button onClick={() => openModal(5)} className={classes.button_style}>
          {permission.admin_permission ? "Edit Permission" : "View Permission"}
        </Button>
        <TextField
          variant="outlined"
          value={search_text}
          onChange={(event) => set_search_text(event.target.value)}
          placeholder="Case Name / Tag ..."
          className={classes.search}
        />
        {/* <Button onClick={create_plan} className={classes.button_style}>
          create plan
        </Button> */}
        {/* 分頁控制 - 顯示 A B C D... */}
        {/* 下拉式選單 - 選擇標籤首字母 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            marginRight: "20px",
            width: "100%",
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ marginRight: "5px", fontSize: "14px" }}>Show</span>

          <Select
            value={currentLetter}
            onChange={(event) => setCurrentLetter(event.target.value)}
            displayEmpty
            variant="outlined"
            style={{ maxWidth: "60px", height: "36px" }}
          >
            <MenuItem value="" disabled>
              Select Tag
            </MenuItem>
            {availableTags.length > 0 ? (
              availableTags.map((letter) => (
                <MenuItem key={letter} value={letter}>
                  {letter}
                </MenuItem>
              ))
            ) : (
              <MenuItem value="" disabled>
                No Tags Available
              </MenuItem>
            )}
          </Select>

          <span style={{ marginLeft: "5px", fontSize: "14px" }}>category</span>
        </div>
      </div>
      <TableContainer>
        {title_row(title_data)}
        {filter_data.length > 0 ? (
          filter_data
            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
            .map((data, index) => data_row(index, data))
        ) : (
          <TableRow>
            <TableCell colSpan={5} style={{ textAlign: "center" }}>
              No cases available
            </TableCell>
          </TableRow>
        )}
      </TableContainer>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  );
}

Test_case.propTypes = {
  category: PropTypes.string.isRequired,
};
export default Test_case;
