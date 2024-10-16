import React, { useState, useEffect } from "react";
import useStyles from "./styles/case_styles";
import { Dialog, Box } from "@mui/material";
import { TableRow, TableCell, TableContainer, Select, MenuItem } from "@mui/material";
import Button from "examples/Icons/Button";
// import Loading_option from "examples/tool_universal/loading_option";
import TextField from "@mui/material/TextField";
import Loading_option_add_remove from "examples/tool_universal/loading_option_add_remove";
import Loading from "examples/tool_universal/loading";
import SuiButton from "components/SuiButton";
import SuiBox from "components/SuiBox";
import Icon from "@mui/material/Icon";
import TESTCASE from "api/test_plans/test_case";
import PropTypes from "prop-types";
function Test_case({ category }) {
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
  const [add_category, set_add_category] = useState("");
  const [permission, set_permission] = useState({
    admin: [],
    editor: [],
    admin_checkbox: false,
    admin_permission: false,
    editor_permission: false,
  });
  const [search_text, set_search_text] = useState("");
  useEffect(() => {
    console.log("category", category);
    get_test_case();
  }, [category]);
  const get_test_case = async () => {
    setLoading(true);
    let response = await TESTCASE.list_case({
      category: category,
    });
    if (response.data.finaldata) {
      setSelectedIndex((prev) => ({
        ...prev,
        ...response.data.finaldata.reduce((acc, data) => {
          acc[data.id] = data.select;
          return acc;
        }, {}),
      }));
      set_case_data(response.data.finaldata);
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
      console.log(response.data.error);
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
  const title_data = [
    { className: classes.title_no, children: "NO." },
    { className: classes.title_case_name, children: "Case Name" },
    { className: classes.title_description, children: "Description" },
    { className: classes.title_tag, children: "Tag" },
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
  useEffect(() => {
    console.log("selectedIndex", selectedIndex);
  }, [selectedIndex]);
  const data_row = (index, data) => {
    // setSelectedIndex((prev) => ({ ...prev, [index]: data.data.length }));
    return (
      <>
        <TableRow className={classes.table_row_style}>
          <TableCell key={index} className={classes.no}>
            {data.id}.
          </TableCell>
          <TableCell key={index} className={classes.case_name}>
            {data.data[selectedIndex[data.id]].case_name}
          </TableCell>
          <TableCell key={index} className={classes.description}>
            {data.data[selectedIndex[data.id]].description}
          </TableCell>
          <TableCell key={index} className={classes.tag}>
            {data.tag}
          </TableCell>
          <TableCell key={index} className={classes.version}>
            <Select
              value={selectedIndex[data.id]}
              onChange={(e) => {
                setSelectedIndex((prev) => ({ ...prev, [data.id]: Number(e.target.value) }));
              }}
              fullWidth
              inputProps={{
                style: { textAlign: "center" },
              }}
            >
              {data.data.map((item, i) => (
                <MenuItem
                  key={i}
                  value={i}
                  style={{
                    width: "10px",
                    textAlign: "center",
                  }}
                >
                  V.{i + 1}
                </MenuItem>
              ))}
            </Select>
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
                    SetEditCase({
                      ...EditCase,
                      id: data.id,
                      name: data.data[data.select].case_name,
                      description: data.data[data.select].description,
                      comment: data.data[data.select].comment,
                    });
                  }}
                >
                  <Icon className="material-icons-round">edit</Icon>&nbsp;edit
                </SuiButton>
              )}
            </SuiBox>
          </TableCell>
        </TableRow>
      </>
    );
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
      console.log(error);
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
      console.log(error);
      alert("Please contact the administrator.");
    } finally {
      setLoading(false);
    }
  };
  const create_case = () => {
    return (
      <>
        <div className={classes.columns_center}>
          <div className={classes.line_form_style} style={{ marginBottom: "20px" }}>
            <label htmlFor="category">Category&nbsp;:&nbsp;&nbsp;{category}</label>
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
              <input
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
              <label htmlFor="tag">Tag&nbsp;:&nbsp;&nbsp;</label>
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
  useEffect(() => {
    console.log("case_data", case_data);
  }, [case_data]);
  useEffect(() => {
    console.log(EditCase);
  }, [EditCase]);
  useEffect(() => {
    console.log(CreateCase);
  }, [CreateCase]);
  const edit_case = (data) => {
    console.log("data", data);
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
                <input
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
  const view_case = (data) => {
    console.log("data", data);
    const title_data = [
      { className: classes.title_case_name, children: "Case Name" },
      { className: classes.title_description, children: "Description" },
      { className: classes.title_comment, children: "Comment" },
      { className: classes.title_last_editor, children: "Last Editor" },
      { className: classes.title_update_time, children: "Update Time" },
    ];
    function data_row(index, data) {
      return (
        <>
          <TableRow className={classes.table_row_style}>
            <TableCell key={index} className={classes.case_name}>
              {data.case_name}
            </TableCell>
            <TableCell key={index} className={classes.description}>
              {data.description}
            </TableCell>
            <TableCell key={index} className={classes.comment}>
              {data.comment}
            </TableCell>
            <TableCell key={index} className={classes.last_editor}>
              {data.editor_name}
            </TableCell>
            <TableCell key={index} className={classes.update_time}>
              {formatTimeForFrontend(data.update_time)}
            </TableCell>
          </TableRow>
        </>
      );
    }
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
          {data && data.data.map((data, index) => data_row(index, data))}
        </TableContainer>
      </>
    );
  };
  const create_category = () => {
    return (
      <>
        <div className={classes.columns_center}>
          <div className={classes.line_form_style}>
            <div className={classes.columns_center}>
              <label htmlFor="add category">Add Category Name&nbsp;:&nbsp;&nbsp;</label>
              <input
                id="add_category"
                name="add_category"
                style={{
                  width: "480px",
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                }}
                value={add_category}
                onChange={(e) => {
                  set_add_category(e.target.value);
                }}
              />
            </div>
          </div>
          <div className={classes.line_form_style}>
            <Button onClick={create_new_category}>Create Category</Button>
            <Button onClick={() => closeModal(4)}>Close</Button>
          </div>
        </div>
      </>
    );
  };
  const edit_permission = () => {
    return (
      <>
        <div className={classes.columns_center}>
          <label htmlFor="reviewer">Admin&nbsp;:&nbsp;&nbsp;</label>
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
          <label htmlFor="editor">Editor:</label>
          <Loading_option_add_remove
            api="polls/lendpersonnel"
            name="user_mail"
            selectedOptions={permission.editor}
            setSelectedOptions={(newOptions) =>
              set_permission({ ...permission, editor: newOptions })
            }
          />
          <div className={classes.line_form_style}>
            <Button onClick={edit_permission_api}>Edit Permission</Button>
            <Button onClick={() => closeModal(5)}>Close</Button>
          </div>
        </div>
      </>
    );
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
      console.log(error);
      alert("Please contact the administrator.");
    } finally {
      setLoading(false);
    }
  };
  const create_new_category = async () => {
    setLoading(true);
    try {
      const response = await TESTCASE.add_category({
        category: add_category,
      });
      if (response.data.finaldata) {
        alert(response.data.finaldata);
        closeModal(4);
        window.location.reload();
      } else if (response.data.error) {
        alert(response.data.error);
      }
    } catch (error) {
      console.log(error);
      alert("Please contact the administrator.");
    } finally {
      setLoading(false);
    }
  };
  // test plan
  const create_plan = async () => {
    setLoading(true);
    try {
      const editor = ["bill.chang@hp.com", "seanl@hp.com"];
      const reviewer = ["bill.chang@hp.com"];
      const type = "Full Day";
      const name = "9/30 Test Plan";
      const details = {
        A: {
          name: "uninstall",
          details: {
            A01: {
              test_case_id: 1,
              test_case_select: 1,
            },
            A02: {
              test_case_id: 5,
              test_case_select: 12,
            },
            A03: {
              test_case_id: 3,
              test_case_select: 9,
            },
          },
        },
        B: {
          name: "LED",
          details: {
            B01: {
              test_case_id: 1,
              test_case_select: 1,
            },
            B02: {
              test_case_id: 5,
              test_case_select: 12,
            },
            B03: {
              test_case_id: 3,
              test_case_select: 9,
            },
          },
        },
      };
      const response = await TESTCASE.create_plan({
        category: category,
        name: name,
        details: details,
        editor: editor,
        reviewer: reviewer,
        type: type,
      });
      if (response.data.finaldata) {
        alert(response.data.finaldata);
        window.location.reload();
      } else if (response.data.error) {
        alert(response.data.error);
      }
    } catch (error) {
      console.log(error);
      alert("Please contact the administrator.");
    } finally {
      setLoading(false);
    }
  };
  //load module option
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

    const formattedTime = date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    return `${month}/${day}, ${year}, ${formattedTime}`;
  }
  const filter_data = search_text
    ? case_data.filter((data) => {
        const caseName = data.data[data.select]?.case_name;
        const tag = data.tag;

        return (
          (caseName && caseName.toLowerCase().includes(search_text.toLowerCase())) ||
          (tag && tag.toLowerCase().includes(search_text.toLowerCase()))
        );
      })
    : case_data;
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
        <Dialog open={pop_filter[4]} onClose={() => closeModal(4)} fullWidth maxWidth="sm">
          <Box sx={{ padding: "20px" }}>{create_category()}</Box>
        </Dialog>
        <Dialog open={pop_filter[5]} onClose={() => closeModal(5)} fullWidth maxWidth="md">
          <Box sx={{ padding: "20px" }}>{edit_permission()}</Box>
        </Dialog>
        {(permission.admin_permission || permission.editor_permission) && (
          <Button onClick={() => openModal(1)} className={classes.button_style}>
            Create Case
          </Button>
        )}
        <Button onClick={() => openModal(4)} className={classes.button_style}>
          Add Category
        </Button>
        {permission.admin_permission && (
          <Button onClick={() => openModal(5)} className={classes.button_style}>
            Edit Permission
          </Button>
        )}
        <TextField
          variant="outlined"
          value={search_text}
          onChange={(event) => set_search_text(event.target.value)}
          placeholder="Case Name / Tag ..."
          className={classes.search}
        />
        <Button onClick={create_plan} className={classes.button_style}>
          create plan
        </Button>
      </div>
      <TableContainer>
        {title_row(title_data)}
        {filter_data && filter_data.map((data, index) => data_row(index, data))}
      </TableContainer>
    </>
  );
}
Test_case.propTypes = {
  category: PropTypes.string.isRequired,
};
export default Test_case;
