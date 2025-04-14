import React, { useState, useEffect } from "react";
import useStyles from "./styles/plan_styles";
import { Dialog, Box } from "@mui/material";
import { TableRow, TableCell, TableContainer, Select, MenuItem } from "@mui/material";
import Button from "examples/Icons/Button";
//import Loading_option from "examples/tool_universal/loading_option";
import TextField from "@mui/material/TextField";
import Loading_option_add_remove from "layouts/test_plans/test_plan/table/function/list_case_option";
import Loading_option_person_add_remove from "examples/tool_universal/loading_option_add_remove";
import Pagination from "layouts/test_plans/test_plan/function/pagination";
import ContentDialog from "layouts/test_plans/test_plan/function/content_dialog";
import Loading from "examples/tool_universal/loading";
import SuiButton from "components/SuiButton";
import SuiBox from "components/SuiBox";
import Icon from "@mui/material/Icon";
import TESTCASE from "api/test_plans/test_case";
import TESTPLAN from "api/test_plans/test_plan";
import Tooltip from "@mui/material/Tooltip";
import PropTypes from "prop-types";
import ExcelJS from "exceljs";
import Collapsible from "react-collapsible";

function Test_case({ category }) {
  // =================== 1-1. useState hooks ===================
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [plan_data, set_plan_data] = useState([]);
  const [current_data, set_current_data] = useState();
  const [selectedIndex, setSelectedIndex] = useState({});
  const [planVersionIndex, setPlanVersionIndex] = useState({});
  const [editCategories, setEditCategories] = useState([{ name: "", selectedTestCases: [] }]);
  const [highlightedChanges, setHighlightedChanges] = useState({});
  const [selectedPlans, setSelectedPlans] = useState([]);
  const [categories, setCategories] = useState([{ name: "", selectedTestCases: [] }]);
  const [openDescriptionDialog, setOpenDescriptionDialog] = useState(false);
  const [openCommentDialog, setOpenCommentDialog] = useState(false);
  const [descriptionContent, setDescriptionContent] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [search_text, set_search_text] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pop_filter, set_pop_filter] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
  });

  const [permission, set_permission] = useState({
    admin: [],
    editor: [],
    admin_checkbox: false,
    admin_permission: false,
    editor_permission: false,
  });

  const [EditPlan, SetEditPlan] = useState({
    id: null,
    name: "",
    description: "",
    comment: "",
    reviewer: null,
    reviewer_checkbox: false,
    editor: [],
  });
  const [CreatePlan, SetCreatePlan] = useState({
    category: category,
    name: "",
    type: "One Day",
    selectedTestCases: [],
    reviewer: [],
    reviewer_checkbox: false,
    editor: [],
    details: {},
    categoryName: "",
  });
  const itemsPerPage = 10;

  // =================== 1-2. useEffect hooks ===================

  useEffect(() => {
    setCurrentPage(1);
    get_test_plan();
    SetCreatePlan({ ...CreatePlan, category: category });
  }, [category]);

  useEffect(() => {
    if (plan_data && Array.isArray(plan_data)) {
      const initialSelectedIndex = plan_data.reduce((acc, plan) => {
        if (plan.data) {
          plan.data.forEach((item) => {
            acc[item.test_case_id] = item.default_version || 0;
          });
        }
        return acc;
      }, {});
      setSelectedIndex(initialSelectedIndex);
    }
    if (plan_data) {
      const initialIndex = plan_data.reduce((acc, plan) => {
        acc[plan.id] = plan.select || 0;
        return acc;
      }, {});
      setSelectedIndex(initialIndex);
    }
  }, [plan_data]);

  useEffect(() => {
    if (current_data && current_data.data) {
      const categoriesFromData = Object.entries(
        current_data.data[current_data.select]?.plan_details || {}
      ).map(([categoryKey, categoryValue]) => ({
        name: categoryValue.name || categoryKey,
        selectedTestCases: Object.values(categoryValue.details).map((testCase, index) => ({
          id: testCase.test_case_id,
          select: testCase.test_case_select,
          version: `V.${index + 1}`,
        })),
      }));
      setEditCategories(categoriesFromData);
    }
  }, [current_data]);

  useEffect(() => {
    if (current_data && current_data.data) {
      const categoriesFromData = Object.entries(
        current_data.data[current_data.select]?.plan_details || {}
      ).map(([categoryKey, categoryValue]) => {
        const selectedTestCases = Object.values(categoryValue.details).map((testCase) => {
          const testCaseId = testCase.test_case_id;
          const testCaseDetails = CreatePlan.testCaseDetails?.[testCaseId];

          if (!testCaseDetails) {
            console.warn(`Test case details not found for ID: ${testCaseId}`);
          }

          return {
            id: testCaseId,
            select: testCase.test_case_select ?? testCaseId,
            tag: testCaseDetails?.tag || "U",
            title: testCaseDetails?.name || "",
            version: testCaseDetails?.version ? `V.${testCaseDetails.version}` : "N/A",
          };
        });

        return {
          name: categoryValue.name || categoryKey,
          selectedTestCases: selectedTestCases,
        };
      });

      setEditCategories(categoriesFromData);
    }
  }, [current_data, CreatePlan.testCaseDetails]);

  useEffect(() => {
    const fetchTestCases = async () => {
      setLoading(true);
      try {
        const response = await TESTCASE.list_case({ category });

        if (!response.data || !response.data.finaldata) {
          console.error("No finaldata returned in API response.");
          return;
        }

        const filteredData = response.data.finaldata.filter((item) => item.category === category);

        if (filteredData.length === 0) {
          console.warn("No data for selected category:", category);
        }

        const testCaseDetails = {};
        filteredData.forEach((plan) => {
          const caseTag = plan.tag;

          const allSortedCases = [...plan.data].sort((a, b) => a.case_id - b.case_id);

          const versionMap = {};
          allSortedCases.forEach((testCase, idx) => {
            versionMap[testCase.case_id] = idx + 1;
          });

          plan.data.forEach((testCase) => {
            testCaseDetails[testCase.case_id] = {
              name: testCase.case_name,
              description: testCase.description,
              comment: testCase.comment,
              version: versionMap[testCase.case_id],
              tag: caseTag || "No Tag",
            };
          });
        });

        SetCreatePlan((prev) => ({
          ...prev,
          testCaseDetails,
        }));
      } catch (error) {
        console.error("Error fetching test cases:", error);
        alert("Please contact the administrator.");
      } finally {
        setLoading(false);
      }
    };

    fetchTestCases();
  }, [category]);

  // =================== 2. API & Data processing function ===================

  const get_test_plan = async () => {
    setLoading(true);
    try {
      const response = await TESTPLAN.list_plan({ category: category });

      if (response.data && response.data.finaldata) {
        const permissionObject = response.data.finaldata[0]?.permission;

        const newSelectedIndex = response.data.finaldata.reduce((acc, data) => {
          acc[data.id] = data.select || 0;
          return acc;
        }, {});

        setSelectedIndex(newSelectedIndex);
        set_plan_data(response.data.finaldata);

        set_permission({
          ...permission,
          admin_permission: permissionObject?.admin_permission || false,
          editor_permission: permissionObject?.editor_permission || false,
          admin:
            permissionObject?.admin?.map((email) => ({
              title: email,
              value: email,
            })) || [],
          editor:
            permissionObject?.editor?.map((email) => ({
              title: email,
              value: email,
            })) || [],
        });
      } else {
        console.error("Error in data response:", response.data?.error);
        set_plan_data([]);
        alert(response.data?.error || "Please contact the administrator.");
      }
    } catch (error) {
      console.error("Error fetching test plans:", error);
      alert("Please contact the administrator.");
    } finally {
      setLoading(false);
    }
  };

  const create_new_plan = async () => {
    setLoading(true);
    try {
      const editor_list = CreatePlan.editor.filter(Boolean).map((item) => item.value);
      const reviewer_list = CreatePlan.reviewer.filter(Boolean).map((item) => item.value);

      const details = {};

      categories.forEach((category) => {
        if (!category.selectedTestCases.length) {
          console.warn(`Category ${category.name} has no test cases and will be ignored.`);
          return;
        }

        category.selectedTestCases.forEach((testCase) => {
          const categoryTag = testCase.tag ? testCase.tag.charAt(0).toUpperCase() : "X"; // 取得字首
          const testCaseKey = testCase.tag || `X${String(testCase.id).padStart(2, "0")}`; // 測試用例 tag

          if (!details[categoryTag]) {
            details[categoryTag] = {
              name: category.name,
              details: {},
            };
          }

          details[categoryTag].details[testCaseKey] = {
            test_case_id: testCase.id,
            test_case_select:
              testCase.select !== undefined && testCase.select !== null
                ? testCase.select
                : testCase.id,
          };
        });
      });

      const requestData = {
        type: CreatePlan.type,
        name: CreatePlan.name,
        details: details,
        editor: editor_list,
        reviewer: reviewer_list,
        category: CreatePlan.category,
      };

      const response = await TESTPLAN.create_plan(requestData);

      if (response.data && response.data.finaldata) {
        alert(response.data.finaldata);
        closeModal(1);
        get_test_plan();
      } else if (response.data && response.data.error) {
        console.error("API error:", response.data.error);
        alert(response.data.error);
      } else {
        console.error("Unexpected API response:", response);
        alert("Unexpected API response. Please contact the administrator.");
      }
    } catch (error) {
      console.error("Error creating plan:", error.response ? error.response.data : error.message);
      alert(error.response?.data?.message || "Please contact the administrator.");
    } finally {
      setLoading(false);
    }
  };

  const edit_new_plan = async () => {
    setLoading(true);
    try {
      const details = {};
      const usedIds = new Set();

      editCategories.forEach((category) => {
        if (!category.selectedTestCases.length) {
          console.warn(`Category ${category.name} has no test cases and will be ignored.`);
          return;
        }

        const firstTaggedTestCase = category.selectedTestCases.find(
          (tc) => tc.tag && tc.tag.trim() !== ""
        );

        let baseId = "Unknown";
        if (firstTaggedTestCase && firstTaggedTestCase.tag) {
          baseId = firstTaggedTestCase.tag.charAt(0).toUpperCase();
        } else if (category.name) {
          baseId = category.name.charAt(0).toUpperCase();
        }

        let uniqueCategoryId = baseId;
        let counter = 1;
        while (usedIds.has(uniqueCategoryId)) {
          uniqueCategoryId = `${baseId}${counter}`;
          counter++;
        }

        usedIds.add(uniqueCategoryId);

        details[uniqueCategoryId] = {
          name: category.name,
          details: {},
        };

        category.selectedTestCases.forEach((testCase) => {
          const testCaseTag = testCase.tag || "U";
          const testCaseKey = `${testCaseTag}`;

          details[uniqueCategoryId].details[testCaseKey] = {
            test_case_id: testCase.id,
            test_case_select:
              testCase.select !== undefined && testCase.select !== null
                ? testCase.select
                : testCase.id,
          };
        });
      });

      const requestData = {
        plan_id: EditPlan.id,
        name: EditPlan.name,
        type: EditPlan.type,
        details: details,
      };

      const response = await TESTPLAN.edit_plan(requestData);

      if (response.data.finaldata) {
        alert(response.data.finaldata);
        closeModal(3);
        get_test_plan();
      } else if (response.data.error) {
        alert(response.data.error);
      } else {
        console.error("Unexpected API response:", response);
        alert("Unexpected API response. Please contact the administrator.");
      }
    } catch (error) {
      console.error("Error editing plan:", error.response ? error.response.data : error.message);
      alert(error.response?.data?.message || "Please contact the administrator.");
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = async () => {
    const selectedPlanDetails = plan_data.filter((plan) => selectedPlans.includes(plan.id));

    if (selectedPlanDetails.length === 0) {
      alert("Please select at least one Test Plan to export.");
      return;
    }

    const workbook = new ExcelJS.Workbook();

    for (const plan of selectedPlanDetails) {
      const selectedVersionIndex = selectedIndex[plan.id] || 0;
      const selectedVersion = plan.data?.[selectedVersionIndex] || {};
      const planDetails = selectedVersion.plan_details || {};
      const exportData = [];
      const commentData = [];

      Object.entries(planDetails).forEach(([categoryKey, categoryData]) => {
        const categoryName = categoryData.name || categoryKey;

        const firstTestCaseKey = Object.keys(categoryData.details || {})[0];
        const firstTestCase = categoryData.details?.[firstTestCaseKey] || {};
        const testCaseDetail = CreatePlan.testCaseDetails?.[firstTestCase.test_case_id] || {};

        const categoryTag = testCaseDetail.tag ? testCaseDetail.tag.charAt(0) : "N/A";

        exportData.push([categoryTag, categoryName, "", ""]);
        commentData.push(null);
        Object.entries(categoryData.details || {}).forEach(([, testCase]) => {
          const testCaseDetail = CreatePlan.testCaseDetails?.[testCase.test_case_id] || {};

          exportData.push([
            testCaseDetail.tag || "N/A",
            testCaseDetail.name || "N/A",
            testCaseDetail.comment || "N/A",
            testCaseDetail.version ? `V.${testCaseDetail.version}` : "N/A",
          ]);

          commentData.push(testCaseDetail.description || "N/A");
        });
      });

      const worksheet = workbook.addWorksheet(`${plan.name} ${plan.type}` || `Plan ${plan.id}`);

      const headers = ["Tag", "Name", "Comment", "Version"];
      const headerRow = worksheet.addRow(headers);

      headerRow.eachCell((cell) => {
        cell.font = { name: "Calibri", size: 12, bold: true };
      });

      headers.forEach((header, colIndex) => {
        const maxLength =
          Math.max(
            headers[colIndex].length,
            ...exportData.map((row) => (row[colIndex] ? row[colIndex].toString().length : 0))
          ) + 2;
        worksheet.getColumn(colIndex + 1).width = maxLength < 10 ? 10 : maxLength;
      });

      for (let i = 0; i < exportData.length; i++) {
        const rowValues = exportData[i];
        const row = worksheet.addRow(rowValues);

        row.eachCell((cell) => {
          cell.font = { name: "Calibri", size: 12 };
        });

        if (rowValues[1] && rowValues[2] === "" && rowValues[3] === "") {
          row.eachCell((cell, colIndex) => {
            if (colIndex >= 1 && colIndex <= 4) {
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "D9D9D9" },
              };
            }
          });
        }

        const comment = commentData[i];
        if (comment && comment !== "N/A") {
          const formattedComment = comment;
          const cell = row.getCell(2);
          cell.note = {
            texts: [
              {
                text: formattedComment,
                font: {
                  name: "Calibri",
                  size: 11,
                },
              },
            ],
            margins: {
              insetmode: "custom",
              leftInset: 0.2,
              rightInset: 0.2,
              topInset: 0.2,
              bottomInset: 0.2,
            },
          };

          cell.alignment = {
            wrapText: true,
          };
        }
      }

      worksheet.properties.defaultRowHeight = 20;
    }

    const now = new Date();
    const formattedDate = now.toISOString().split("T")[0].replace(/-/g, ""); // YYYYMMDD
    const fileName = `TestPlan_${formattedDate}.xlsx`;

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // =================== 3. Event Handling Function ===================
  const openModal = (modalNumber) => {
    set_pop_filter((prev) => ({ ...prev, [modalNumber]: true }));
  };

  const closeModal = (modalNumber) => {
    set_pop_filter((prev) => ({ ...prev, [modalNumber]: false }));

    if (modalNumber === 2) {
      setHighlightedChanges({});
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedPlans(plan_data.map((plan) => plan.id));
    } else {
      setSelectedPlans([]);
    }
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
  };

  const handleCategoryNameChange = (index, value) => {
    const updatedCategories = [...categories];

    if (!updatedCategories[index]) {
      console.error(`Category at index ${index} is not defined.`);
      return;
    }

    updatedCategories[index].name = value;
    setCategories(updatedCategories);
  };

  const addNewCategory = () => {
    setCategories([...categories, { name: "", selectedTestCases: [] }]);
  };

  const removeCategory = (index) => {
    setCategories((prevCategories) => {
      if (index < 0 || index >= prevCategories.length) {
        console.error(`Invalid index ${index} for removeCategory.`);
        return prevCategories;
      }
      return prevCategories.filter((_, i) => i !== index);
    });
  };

  const handleTestCaseSelection = (categoryIndex, newTestCases) => {
    if (!newTestCases || !Array.isArray(newTestCases)) {
      console.error("Invalid newTestCases:", newTestCases);
      return;
    }

    setCategories((prevCategories) => {
      const updatedCategories = [...prevCategories];
      updatedCategories[categoryIndex].selectedTestCases = newTestCases.map((testCase) => {
        if (!testCase) {
          console.error("Invalid testCase in newTestCases:", testCase);
          return { id: null, title: null, select: null };
        }
        return {
          ...testCase,
          select: testCase.id || null,
        };
      });
      return updatedCategories;
    });
  };

  const handleVersionChange = (newIndex, dataItem) => {
    const selectedVersion = dataItem.data[newIndex] || {};
    const previousVersion = dataItem.data[selectedIndex[dataItem.id]] || {};

    const changes = {};

    Object.keys(selectedVersion.plan_details || {}).forEach((categoryKey) => {
      const selectedDetails = selectedVersion.plan_details[categoryKey]?.details || {};
      const previousDetails = previousVersion.plan_details?.[categoryKey]?.details || {};

      Object.keys(selectedDetails).forEach((testKey) => {
        if (!previousDetails[testKey]) {
          if (!changes[categoryKey]) {
            changes[categoryKey] = {};
          }
          changes[categoryKey][testKey] = true;
        }
      });
    });

    Object.keys(previousVersion.plan_details || {}).forEach((categoryKey) => {
      const previousDetails = previousVersion.plan_details[categoryKey]?.details || {};
      const selectedDetails = selectedVersion.plan_details?.[categoryKey]?.details || {};

      Object.keys(previousDetails).forEach((testKey) => {
        if (!selectedDetails[testKey]) {
          if (!changes[categoryKey]) {
            changes[categoryKey] = {};
          }
          changes[categoryKey][testKey] = true;
        }
      });
    });

    Object.keys(selectedVersion.plan_details || {}).forEach((categoryKey) => {
      const selectedDetails = selectedVersion.plan_details[categoryKey]?.details || {};
      const previousDetails = previousVersion.plan_details?.[categoryKey]?.details || {};

      Object.keys(selectedDetails).forEach((testKey) => {
        if (
          previousDetails[testKey] &&
          !isTestCaseEqual(selectedDetails[testKey], previousDetails[testKey])
        ) {
          if (!changes[categoryKey]) {
            changes[categoryKey] = {};
          }
          changes[categoryKey][testKey] = true;
        }
      });
    });

    setHighlightedChanges(changes);
    setSelectedIndex((prev) => ({
      ...prev,
      [dataItem.id]: newIndex,
    }));
  };

  // =================== 4. Tool function ===================
  const isTestCaseEqual = (latestTest, selectedTest) => {
    if (!latestTest || !selectedTest) return false;

    return (
      latestTest.test_case_id === selectedTest.test_case_id &&
      latestTest.name === selectedTest.name &&
      latestTest.description === selectedTest.description &&
      latestTest.comment === selectedTest.comment &&
      latestTest.tag === selectedTest.tag
    );
  };

  function formatTimeForFrontend(inputTime) {
    const date = new Date(inputTime);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();

    const formattedTime = date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    return `${month}/${day}, ${year}, ${formattedTime}`;
  }

  // =================== 5. Table Rendering function ===================
  const title_data = [
    { className: classes.title_plan_name, children: "Plan Name" },
    { className: classes.title_type, children: "Plan Type" },
    { className: classes.title_update_time, children: "Update Time" },
    { className: classes.title_action, children: "Action" },
  ];

  const title_row = (title_data) => {
    return (
      <>
        <TableRow className={classes.title_table_row_style}>
          <TableCell style={{ borderBottom: "none" }}>
            <input
              type="checkbox"
              className={classes.title_checkbox}
              onChange={(e) => handleSelectAll(e.target.checked)}
            />
          </TableCell>
          {title_data.map((item, index) => (
            <MyTableCell key={index} className={item.className}>
              {item.children}
            </MyTableCell>
          ))}
        </TableRow>
      </>
    );
  };

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
    const handleCheckboxChange = (checked, planId) => {
      setSelectedPlans((prev) =>
        checked ? [...prev, planId] : prev.filter((id) => id !== planId)
      );
    };

    const planName = data?.name || "N/A";
    const planType = data?.type || "N/A";
    const planUpdatetime =
      data?.data?.reduce((latest, current) => (current.id > latest.id ? current : latest), {
        id: -1,
        update_time: "N/A",
      })?.update_time !== "N/A"
        ? new Date(
            data?.data?.reduce((latest, current) => (current.id > latest.id ? current : latest), {
              id: -1,
              update_time: "N/A",
            })?.update_time
          ).toLocaleString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })
        : "N/A";

    return (
      <TableRow className={classes.table_row_style}>
        <TableCell style={{ borderBottom: "none" }}>
          <input
            type="checkbox"
            className={classes.checkbox}
            checked={selectedPlans.includes(data.id)}
            onChange={(e) => handleCheckboxChange(e.target.checked, data.id)}
          />
        </TableCell>

        {/* <TableCell key={`${index}-id`} className={classes.no}>
          {data.id}.
        </TableCell> */}
        <TableCell key={`${index}-name`} className={classes.plan_name}>
          {planName}
        </TableCell>
        <TableCell key={`${index}-type`} className={classes.type}>
          {planType}
        </TableCell>
        <TableCell key={`${index}-updatetime`} className={classes.update_time}>
          {planUpdatetime}
        </TableCell>
        <TableCell key={`${index}-action`} className={classes.action}>
          <SuiBox>
            <SuiButton
              variant="text"
              buttonColor="info"
              onClick={() => {
                set_current_data(data);
                openModal(2);
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
                  SetEditPlan({
                    ...EditPlan,
                    id: data.id,
                    name: data.name,
                    type: data.type,
                  });
                }}
              >
                <Icon className="material-icons-round">edit</Icon>&nbsp;edit
              </SuiButton>
            )}
          </SuiBox>
        </TableCell>
      </TableRow>
    );
  };

  // =================== 6. UI & Modal control Fuction ===================
  const create_plan = () => {
    return (
      <>
        <TableContainer>
          {/* title */}
          <TableRow className={classes.create_title_table_row_style}>
            <TableCell className={classes.create_plan_name}>
              Plan Name&nbsp;<span style={{ color: "red" }}>*</span>
            </TableCell>
            <TableCell className={classes.plan_type}>
              Plan Type&nbsp;<span style={{ color: "red" }}>*</span>
            </TableCell>
            <TableCell className={classes.editor}>Editor</TableCell>
            <TableCell className={classes.reviewer}>Reviewer</TableCell>
          </TableRow>

          {/* input */}
          <TableRow className={classes.input_table_row_style}>
            <TableCell className={classes.plan_name}>
              <input
                id="test_plan"
                name="test_plan"
                placeholder="Enter Plan Name"
                style={{
                  maxWidth: "800px",
                  padding: "12px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  margin: "0 auto",
                }}
                value={CreatePlan.name}
                onChange={(e) => SetCreatePlan({ ...CreatePlan, name: e.target.value })}
              />
            </TableCell>

            <TableCell className={classes.plan_type}>
              <select
                id="type"
                name="type"
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                }}
                value={CreatePlan.type}
                onChange={(e) => SetCreatePlan({ ...CreatePlan, type: e.target.value })}
              >
                <option value="One Day">One Day</option>
                <option value="Full Day">Full Day</option>
                <option value="Others">Others</option>
              </select>
            </TableCell>

            <TableCell className={classes.editor}>
              <Loading_option_person_add_remove
                api="polls/lendpersonnel"
                name="user_mail"
                selectedOptions={CreatePlan.editor}
                setSelectedOptions={(newOptions) =>
                  SetCreatePlan({ ...CreatePlan, editor: newOptions })
                }
              />
            </TableCell>

            <TableCell className={classes.reviewer}>
              <Loading_option_person_add_remove
                api="polls/lendpersonnel"
                name="user_mail"
                selectedOptions={CreatePlan.reviewer}
                setSelectedOptions={(newOptions) =>
                  SetCreatePlan({ ...CreatePlan, reviewer: newOptions })
                }
              />
            </TableCell>
          </TableRow>
        </TableContainer>

        {/* category input and test case selection */}
        {categories.map((category, index) => (
          <div key={index} className={classes.line_form_style}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: "40%",
                gap: "10px",
              }}
            >
              <Button
                onClick={() => removeCategory(index)}
                style={{
                  backgroundColor: "#f44336",
                  color: "#fff",
                  borderRadius: "8px",
                  padding: "8px 16px",
                  border: "none",
                }}
              >
                Remove Category
              </Button>
              <label style={{ whiteSpace: "nowrap" }}>
                Category Name&nbsp;<span style={{ color: "red" }}>*</span>&nbsp;:&nbsp;
              </label>{" "}
              <input
                type="text"
                value={category.name}
                onChange={(e) => handleCategoryNameChange(index, e.target.value)}
                placeholder="Enter Category Name"
                style={{
                  flex: 1,
                  maxWidth: "300px",
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                }}
              />
            </div>

            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <label htmlFor={`test_case_${index}`} className={classes.test_case_label}>
                  Test Case&nbsp;<span style={{ color: "red" }}>*</span>&nbsp;:&nbsp;
                </label>

                <Loading_option_add_remove
                  api="test_plans/test_case/list_case"
                  name="finaldata"
                  request={{ category: CreatePlan.category }}
                  selectedOptions={category.selectedTestCases}
                  options={CreatePlan.allVersions}
                  setSelectedOptions={(newOptions) => handleTestCaseSelection(index, newOptions)}
                  displayOption={(testCase) => (
                    <MenuItem key={testCase.id} value={testCase.id}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>
                          {testCase.name} ({testCase.version || "N/A"})
                        </span>
                        <span style={{ fontSize: "12px", color: "#888" }}>
                          {testCase.tag || "No Tag"}
                        </span>
                      </div>
                      <Tooltip
                        title={`Description: ${
                          testCase.description || "No Description"
                        }, Comment: ${testCase.comment || "No Comment"}`}
                      >
                        <Icon style={{ marginLeft: "8px" }}>info</Icon>
                      </Tooltip>
                    </MenuItem>
                  )}
                  loading={loading}
                  className={classes.dropdownStyle}
                />
              </div>
            </div>
          </div>
        ))}

        {/* Add Category 按鈕保持獨立，並放置在四等分的第三等分 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            marginTop: "20px",
          }}
        >
          {/* 第一等分 (空白) */}
          <div style={{ flex: 1 }}></div>

          {/* 第二等分 (空白) */}
          <div style={{ flex: 1 }}></div>

          {/* 第三等分 (空白) */}
          <div style={{ flex: 1 }}></div>

          {/* 第四等分 (Add Category 按鈕) */}
          <div
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "right",
            }}
          >
            <Button
              onClick={addNewCategory}
              style={{
                backgroundColor: "#4caf50",
                color: "#fff",
                borderRadius: "8px",
                padding: "8px 16px",
                border: "none",
              }}
            >
              Add Category
            </Button>
          </div>
        </div>

        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <Button onClick={() => create_new_plan()}>Create Plan</Button>
          <Button onClick={() => closeModal(1)}>Close</Button>
        </div>
      </>
    );
  };

  const edit_plan = (plan_data) => {
    if (!Array.isArray(plan_data)) {
      plan_data = [plan_data];
    }

    if (plan_data.length === 0) {
      console.error("No valid entries in plan_data");
      return <div>No data available for this plan</div>;
    }

    const title_data = [
      { className: classes.edit_title_plan_name, children: "Plan Name" },
      { className: classes.edit_title_type, children: "Plan Type" },
      { className: classes.edit_title_version, children: "Version" },
      { className: classes.edit_title_last_editor, children: "Last Editor" },
      { className: classes.edit_title_update_time, children: "Update Time" },
    ];

    const addNewCategory = () => {
      setEditCategories([...editCategories, { name: "", selectedTestCases: [] }]);
    };
    const removeCategory = (index) => {
      setEditCategories((prevCategories) => prevCategories.filter((_, i) => i !== index));
    };

    const handleCategoryNameChange = (index, value) => {
      setEditCategories((prevCategories) =>
        prevCategories.map((category, i) => (i === index ? { ...category, name: value } : category))
      );
    };

    const handleTestCaseSelection = (categoryIndex, newTestCases) => {
      setEditCategories((prevCategories) => {
        const updatedCategories = [...prevCategories];
        updatedCategories[categoryIndex].selectedTestCases = newTestCases.map((testCase) => ({
          ...testCase,
          select: testCase.case_id || null,
        }));
        return updatedCategories;
      });
    };

    const renderEditCategories = () => {
      return editCategories.map((category, index) => (
        <div key={index} className={classes.line_form_style}>
          <Button
            onClick={() => removeCategory(index)}
            style={{
              marginTop: "10px",
              backgroundColor: "#f44336",
              color: "#fff",
              borderRadius: "8px",
              padding: "8px 16px",
              border: "none",
            }}
          >
            Remove Category
          </Button>
          <label>Category Name&nbsp;:&nbsp;&nbsp;</label>
          <input
            type="text"
            value={category.name}
            onChange={(e) => handleCategoryNameChange(index, e.target.value)}
            style={{
              width: "300px",
              padding: "8px",
              marginBottom: "10px",
              border: "1px solid #ccc",
              borderRadius: "8px",
            }}
          />
          <label htmlFor={`test_case_${index}`} className={classes.test_case_label}>
            Test Case&nbsp;:&nbsp;
          </label>{" "}
          <Loading_option_add_remove
            api="test_plans/test_case/list_case"
            name="finaldata"
            request={{ category: CreatePlan.category }}
            selectedOptions={category.selectedTestCases}
            options={CreatePlan.allVersions || []}
            setSelectedOptions={(newOptions) => handleTestCaseSelection(index, newOptions)}
            displayOption={(testCase) => (
              <MenuItem key={testCase.id} value={testCase.id}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>
                    {testCase.name} ({testCase.version || "N/A"})
                  </span>
                  <span style={{ fontSize: "12px", color: "#888" }}>
                    {testCase.tag || "No Tag"}
                  </span>
                </div>
                <Tooltip
                  title={`Description: ${testCase.description || "No Description"}, Comment: ${
                    testCase.comment || "No Comment"
                  }`}
                >
                  <Icon style={{ marginLeft: "8px" }}>info</Icon>
                </Tooltip>
              </MenuItem>
            )}
            loading={loading}
            className={classes.dropdownStyle}
          />
        </div>
      ));
    };

    const data_row = (index, dataItem) => {
      if (!dataItem) {
        console.error(`dataItem at index ${index} is undefined or null.`);
        return null;
      }

      const availableVersions = Array.isArray(dataItem.data) ? dataItem.data : [];
      const latestVersionIndex = availableVersions.length > 0 ? availableVersions.length - 1 : 0;
      const selectedVersionIndex =
        dataItem.select !== undefined ? dataItem.select : latestVersionIndex;
      const selectedVersion = availableVersions[selectedVersionIndex] || {};

      const editorName = selectedVersion.editor_name || "N/A";
      const updateTime = selectedVersion.update_time
        ? formatTimeForFrontend(selectedVersion.update_time)
        : "N/A";

      return (
        <TableRow key={`data-row-${index}`} className={classes.table_row_style}>
          <TableCell className={classes.edit_plan_name}>
            <input
              type="text"
              value={EditPlan.name}
              onChange={(e) => SetEditPlan({ ...EditPlan, name: e.target.value })}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "8px",
              }}
            />
          </TableCell>
          <TableCell className={classes.edit_type}>
            <select
              value={EditPlan.type}
              onChange={(e) => SetEditPlan({ ...EditPlan, type: e.target.value })}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "8px",
              }}
            >
              <option value="One Day">One Day</option>
              <option value="Full Day">Full Day</option>
              <option value="Others">Others</option>
            </select>
          </TableCell>
          <TableCell className={classes.edit_version}>{`V.${latestVersionIndex + 1}`}</TableCell>
          <TableCell className={classes.edit_last_editor}>{editorName}</TableCell>
          <TableCell className={classes.edit_update_time}>{updateTime}</TableCell>
        </TableRow>
      );
    };

    return (
      <>
        <TableContainer>
          <TableRow className={classes.title_table_row_style}>
            {title_data.map((item, index) => (
              <MyTableCell key={index} className={item.className}>
                {item.children}
              </MyTableCell>
            ))}
          </TableRow>
          {plan_data.map((dataItem, index) => data_row(index, dataItem))}
        </TableContainer>

        <div>
          {renderEditCategories()}

          <div
            style={{
              marginTop: "20px",
              textAlign: "right",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                marginTop: "20px",
              }}
            >
              <div style={{ flex: 1 }}></div>

              <div style={{ flex: 1 }}></div>

              <div style={{ flex: 1 }}></div>

              <div
                style={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "right",
                }}
              >
                <Button
                  onClick={addNewCategory}
                  style={{
                    backgroundColor: "#4caf50",
                    color: "#fff",
                    borderRadius: "8px",
                    padding: "8px 16px",
                    border: "none",
                  }}
                >
                  Add Category
                </Button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const view_plan = (plan_data, selectedIndex) => {
    if (!pop_filter[2]) {
      return null;
    }

    if (!Array.isArray(plan_data)) {
      plan_data = [plan_data];
    }

    if (plan_data.length === 0) {
      console.error("No valid entries in plan_data");
      return <div>No data available for this plan</div>;
    }

    const title_data = [
      { className: classes.view_title_plan_name, children: "Plan Name" },
      { className: classes.view_title_type, children: "Plan Type" },
      { className: classes.view_title_version, children: "Version" },
      { className: classes.view_title_last_editor, children: "Last Editor" },
      { className: classes.view_title_update_time, children: "Update Time" },
      { className: classes.view_title_editors, children: "Editors" },
      { className: classes.view_title_reviewers, children: "Reviewers" },
    ];

    const data_row = (index, dataItem) => {
      const editors = dataItem?.permission?.editor || [];
      const reviewers = dataItem?.permission?.reviewer || [];
      const renderList = (items, type) => {
        const maxVisible = 1;
        const previewItems = items.slice(0, maxVisible).join(", ");
        const remainingItems = items.slice(maxVisible);

        return (
          <div>
            <span>{previewItems}</span>
            {remainingItems.length > 0 && (
              <Collapsible
                trigger={
                  <span
                    style={{
                      cursor: "pointer",
                      color: "#2196F3",
                      fontWeight: "bold",
                    }}
                  >
                    and {remainingItems.length} more
                  </span>
                }
                triggerWhenOpen={null}
              >
                <ul className={classes.inlineList}>
                  {remainingItems.map((item, idx) => (
                    <li key={`${type}-${idx}`} className={classes.inlineListItem}>
                      {item}
                    </li>
                  ))}
                  <li
                    style={{
                      cursor: "pointer",
                      color: "#2196F3",
                      fontWeight: "bold",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      const collapsible = e.target.closest(".Collapsible");
                      if (collapsible) {
                        collapsible.querySelector(".Collapsible__trigger").click(); // 模擬點擊觸發折疊
                      }
                    }}
                  >
                    Show less
                  </li>
                </ul>
              </Collapsible>
            )}
          </div>
        );
      };

      if (!dataItem) {
        console.error(`dataItem at index ${index} is undefined or null.`);
        return null;
      }

      const planName = dataItem.name || "N/A";
      const planType = dataItem.type || "N/A";
      const availableVersions = dataItem.data || [];
      const selectedVersionIndex =
        selectedIndex && selectedIndex[dataItem.id] !== undefined ? selectedIndex[dataItem.id] : 0;
      const selectedVersion = availableVersions[selectedVersionIndex] || availableVersions[0] || {};
      const editorName = selectedVersion.editor_name || "N/A";
      const updateTime = selectedVersion.update_time
        ? formatTimeForFrontend(selectedVersion.update_time)
        : "N/A";

      return (
        <>
          <TableRow key={`data-row-${index}`} className={classes.table_row_style}>
            <TableCell className={classes.list_plan_name}>{planName}</TableCell>
            <TableCell className={classes.list_type}>{planType}</TableCell>
            <TableCell className={classes.list_version} style={{ textAlign: "center" }}>
              <Select
                value={selectedVersionIndex}
                onChange={(e) => handleVersionChange(parseInt(e.target.value, 10), dataItem)}
                fullWidth
                style={{
                  textAlign: "center",
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                  maxWidth: "80px",
                }}
              >
                {availableVersions.map((_, i) => (
                  <MenuItem
                    key={i}
                    value={i}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      textAlign: "center",
                    }}
                  >
                    V.{i + 1}
                  </MenuItem>
                ))}
              </Select>
            </TableCell>

            <TableCell className={classes.last_editor}>{editorName}</TableCell>
            <TableCell className={classes.update_time}>{updateTime}</TableCell>
            <TableCell className={classes.editors}>{renderList(editors, "editor")}</TableCell>
            <TableCell className={classes.reviewers}>{renderList(reviewers, "reviewer")}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={7} style={{ paddingLeft: "20px" }}>
              {renderTestCases(selectedVersion)}
            </TableCell>
          </TableRow>
          <ContentDialog
            open={openDescriptionDialog}
            onClose={() => setOpenDescriptionDialog(false)}
            title="Description"
            content={descriptionContent}
          />

          <ContentDialog
            open={openCommentDialog}
            onClose={() => setOpenCommentDialog(false)}
            title="Comment"
            content={commentContent}
          />
        </>
      );
    };

    return (
      <TableContainer>
        <TableRow className={classes.title_table_row_style}>
          {title_data.map((item, index) => (
            <MyTableCell key={index} className={item.className}>
              {item.children}
            </MyTableCell>
          ))}
        </TableRow>
        {plan_data.map((dataItem, index) => data_row(index, dataItem))}
      </TableContainer>
    );
  };

  // =================== 6.1 Test Case Rendering Function===================
  const renderTestCases = (selectedVersion) => {
    const planDetails = selectedVersion?.plan_details || {};

    if (!planDetails || Object.keys(planDetails).length === 0) {
      return <div>No test cases available</div>;
    }

    return Object.entries(planDetails).map(([categoryKey, categoryData]) => (
      <div key={categoryKey}>
        <h4 style={{ fontWeight: "bold" }}>{categoryData?.name || "Unnamed Category"}</h4>

        <TableContainer
          style={{
            width: "135%",
          }}
        >
          <TableRow className={classes.test_case_table}>
            <TableCell className={classes.test_case_header}>Tag</TableCell>
            <TableCell className={classes.test_case_header}>Case Name</TableCell>
            <TableCell className={classes.test_case_header}>Description</TableCell>
            <TableCell className={classes.test_case_header}>Comment</TableCell>
            <TableCell className={classes.test_case_header}>Version</TableCell>
          </TableRow>
          {categoryData?.details &&
            Object.entries(categoryData.details).map(([testKey, testData]) => {
              const testCaseId = testData.test_case_id;

              const detail = CreatePlan.testCaseDetails?.[testCaseId];
              if (!detail) {
                console.warn(`No details found for test_case_id ${testCaseId}`);
                return null;
              }

              const isHighlighted = highlightedChanges?.[categoryKey]?.[testKey] || false; // 保留高亮邏輯

              return (
                <TableRow key={testKey} className={classes.test_case_table}>
                  <TableCell
                    className={classes.test_case_cell}
                    style={{ color: isHighlighted ? "red" : "inherit" }}
                  >
                    {detail.tag || "N/A"}
                  </TableCell>
                  <TableCell
                    className={classes.test_case_cell}
                    style={{ color: isHighlighted ? "red" : "inherit", textAlign: "left" }}
                  >
                    {detail.name || "N/A"}
                  </TableCell>
                  <TableCell
                    className={classes.test_case_cell}
                    style={{
                      color: isHighlighted ? "red" : "inherit",
                      cursor:
                        detail.description && detail.description.length > 60
                          ? "pointer"
                          : "default",
                      textAlign: "left",
                    }}
                    onClick={() => {
                      if (detail.description && detail.description.length > 60) {
                        setDescriptionContent(detail.description);
                        setOpenDescriptionDialog(true);
                      }
                    }}
                  >
                    {detail.description
                      ? detail.description.length > 60
                        ? `${detail.description.substring(0, 60)}...`
                        : detail.description
                      : ""}
                  </TableCell>

                  <TableCell
                    className={classes.test_case_cell}
                    style={{
                      color: isHighlighted ? "red" : "inherit",
                      cursor: detail.comment && detail.comment.length > 60 ? "pointer" : "default", // 只有超過 60 字才變為 pointer
                      textAlign: "left",
                    }}
                    onClick={() => {
                      if (detail.comment && detail.comment.length > 60) {
                        setCommentContent(detail.comment);
                        setOpenCommentDialog(true);
                      }
                    }}
                  >
                    {detail.comment
                      ? detail.comment.length > 60
                        ? `${detail.comment.substring(0, 60)}...`
                        : detail.comment
                      : ""}
                  </TableCell>

                  <TableCell
                    className={classes.test_case_cell}
                    style={{ color: isHighlighted ? "red" : "inherit" }}
                  >
                    {detail.version ? `V.${detail.version}` : "N/A"}
                  </TableCell>
                </TableRow>
              );
            })}
        </TableContainer>
      </div>
    ));
  };
  // =================== 7. Data filter & Pagination Function ===================
  // 搜尋功能: 過濾符合搜尋條件的 Test Plan
  const filteredData = search_text
    ? plan_data.filter((plan) => {
        const lowerSearchText = search_text.toLowerCase();

        return (
          plan.name.toLowerCase().includes(lowerSearchText) ||
          plan.type.toLowerCase().includes(lowerSearchText) ||
          plan.permission?.editor?.some((editor) =>
            editor.toLowerCase().includes(lowerSearchText)
          ) ||
          plan.permission?.reviewer?.some((reviewer) =>
            reviewer.toLowerCase().includes(lowerSearchText)
          ) ||
          (plan.data &&
            plan.data.length > 0 &&
            plan.data.some((version) => {
              if (!version.plan_details) {
                return false;
              }

              return Object.values(version.plan_details).some((category) => {
                if (!category.details) {
                  return false;
                }

                return Object.values(category.details).some((testCase) => {
                  const testCaseId = testCase.test_case_id;
                  const testCaseDetails = CreatePlan.testCaseDetails?.[testCaseId];

                  if (!testCaseDetails) {
                    return false;
                  }

                  return [
                    testCaseDetails.name,
                    testCaseDetails.description,
                    testCaseDetails.comment,
                    testCaseDetails.tag,
                    testCase.test_case_id?.toString(),
                    testCase.test_case_select?.toString(),
                  ]
                    .filter(Boolean)
                    .some((field) => field.toLowerCase().includes(lowerSearchText));
                });
              });
            }))
        );
      })
    : plan_data;

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // =================== 8. Component Return ===================
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", marginLeft: "20px" }}>
        <Loading loading={loading} />
        <Dialog open={pop_filter[1]} onClose={() => closeModal(1)} fullWidth maxWidth="false">
          <Box sx={{ padding: "20px" }}>{create_plan()}</Box>
        </Dialog>
        <Dialog open={pop_filter[2]} onClose={() => closeModal(2)} fullWidth maxWidth="false">
          <Box sx={{ padding: "20px" }}>{view_plan(current_data, selectedIndex)}</Box>
        </Dialog>

        <Dialog open={pop_filter[3]} onClose={() => closeModal(3)} fullWidth maxWidth="false">
          <Box sx={{ padding: "20px" }}>
            {current_data ? (
              <>
                {edit_plan(current_data, selectedIndex, planVersionIndex, setPlanVersionIndex)}
                <div style={{ marginTop: "20px", textAlign: "center" }}>
                  <Button onClick={() => edit_new_plan()}>Save Changes</Button>
                  <Button onClick={() => closeModal(3)}>Close</Button>
                </div>
              </>
            ) : (
              <div>No data available</div>
            )}
          </Box>
        </Dialog>

        <Button onClick={() => openModal(1)} className={classes.button_style}>
          Create Plan
        </Button>
        <Button
          onClick={() => exportToExcel()}
          style={{
            backgroundColor: "#2196F3",
            color: "#fff",
            marginLeft: "10px",
            borderRadius: "8px",
            padding: "8px 16px",
          }}
        >
          Export
        </Button>
        <TextField
          variant="outlined"
          value={search_text}
          onChange={(event) => set_search_text(event.target.value)}
          placeholder="Plan / Case Name ..."
          className={classes.search}
        />
      </div>

      <TableContainer>
        {title_row(title_data)}
        {paginatedData.map((data, index) => data_row(index, data))}
      </TableContainer>

      {/* 使用引入的 Pagination 組件 */}
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
