import React, { useState, useEffect } from "react";
import useStyles from "./styles/case_styles";
import { Dialog, Box } from "@mui/material";
import { TableRow, TableCell, TableContainer } from "@mui/material";
import Button from "examples/Icons/Button";
import Loading_option from "examples/tool_universal/loading_option";
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
    reviewer: null,
    reviewer_checkbox: false,
    editor: [],
  });
  const [CreateCase, SetCreateCase] = useState({
    category: category,
    name: "",
    description: "",
    comment: "",
    teg: "",
    reviewer: null,
    reviewer_checkbox: false,
    editor: [],
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
      set_case_data(response.data.finaldata);
    } else if (response.data.error) {
      console.log(response.data.error);
      set_case_data([]);
      alert(response.data.error);
    }
    setLoading(false);
  };
  const title_data = [
    { className: classes.title_case_name, children: "Case Name" },
    { className: classes.title_description, children: "Description" },
    { className: classes.title_tag, children: "Tag" },
    // { className: classes.title_position_style, children: "" },
    // { className: classes.title_last_editor, children: "Last Editor" },
    // { className: classes.title_update_time, children: "Update Time" },
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
  function data_row(index, data) {
    return (
      <>
        <TableRow className={classes.table_row_style}>
          <TableCell key={index} className={classes.case_name}>
            {data.data[data.select].case_name}
          </TableCell>
          <TableCell key={index} className={classes.description}>
            {data.data[data.select].description}
          </TableCell>
          <TableCell key={index} className={classes.tag}>
            {data.tag}
          </TableCell>
          {/* <TableCell key={index} className={classes.last_editor}>
            {data.creator_name}
          </TableCell>
          <TableCell key={index} className={classes.update_time}>
            {formatTimeForFrontend(data.data[data.select].update_time)}
          </TableCell> */}
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
              {data.editor && (
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
                      reviewer: data.reviewer_mail
                        ? {
                            title: data.reviewer_mail,
                            value: data.reviewer_mail,
                          }
                        : null,
                      editor: data.editor_mail.map((email) => ({
                        title: email,
                        value: email,
                      })),
                      reviewer_checkbox: data.reviewer_mail ? true : false,
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
  }

  const create_new_case = async () => {
    setLoading(true);
    try {
      const editor_list = CreateCase.editor.filter(Boolean).map((item) => item.value);
      const response = await TESTCASE.create_case({
        category: CreateCase.category,
        name: CreateCase.name,
        description: CreateCase.description,
        comment: CreateCase.comment,
        tag: CreateCase.tag,
        reviewer: CreateCase.reviewer_checkbox
          ? CreateCase.reviewer == null
            ? ""
            : CreateCase.reviewer.value
          : "",
        editor: editor_list,
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
      const editor_list = EditCase.editor.filter(Boolean).map((item) => item.value);
      const response = await TESTCASE.edit_case({
        id: EditCase.id,
        name: EditCase.name,
        description: EditCase.description,
        comment: EditCase.comment,
        reviewer: EditCase.reviewer_checkbox
          ? EditCase.reviewer == null
            ? ""
            : EditCase.reviewer.value
          : "",
        editor: editor_list,
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
            <label htmlFor="category">Category&nbsp;:&nbsp;&nbsp;</label>
            <select
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
            </select>
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
          <div style={{ marginBottom: "30px" }}></div>
          <div className={classes.line_form_style}>
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
          <div style={{ marginBottom: "30px" }}></div>
          <div
            className={`${classes.line_form_style} ${
              CreateCase.reviewer_checkbox ? "" : classes.disabled
            }`}
          >
            <label htmlFor="reviewer">Reviewer&nbsp;:&nbsp;&nbsp;</label>
            <Loading_option
              api="polls/lendpersonnel"
              name="user_mail"
              selectedOptions={CreateCase.reviewer}
              setSelectedOptions={(newOptions) =>
                SetCreateCase({ ...CreateCase, reviewer: newOptions })
              }
              disabled={CreateCase.reviewer_checkbox}
            />
          </div>
          <div className={classes.line_form_style}>
            <input
              type="checkbox"
              checked={CreateCase.reviewer_checkbox}
              style={{ marginRight: "10px" }}
              onChange={() => {
                SetCreateCase((prevState) => ({
                  ...prevState,
                  reviewer_checkbox: !prevState.reviewer_checkbox,
                }));
              }}
            />
            <h15 className={classes.hint_word}>
              If you assign a reviewer, the subsequent revisions will need to be approved before a
              new version is generated.
            </h15>
          </div>
          <label htmlFor="editor">Editor:</label>
          <Loading_option_add_remove
            api="polls/lendpersonnel"
            name="user_mail"
            selectedOptions={CreateCase.editor}
            setSelectedOptions={(newOptions) =>
              SetCreateCase({ ...CreateCase, editor: newOptions })
            }
          />
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
            <div className={classes.line_form_style} style={{ marginBottom: "20px" }}>
              <label htmlFor="category">Creator&nbsp;:&nbsp;&nbsp; {data.creator_name}</label>
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
            <div style={{ marginBottom: "30px" }}></div>
            <div
              className={`${classes.line_form_style} ${
                EditCase.reviewer_checkbox ? "" : classes.disabled
              }`}
            >
              <label htmlFor="reviewer">Reviewer&nbsp;:&nbsp;&nbsp;</label>
              <Loading_option
                api="polls/lendpersonnel"
                name="user_mail"
                selectedOptions={EditCase.reviewer}
                setSelectedOptions={(newOptions) =>
                  SetEditCase({ ...EditCase, reviewer: newOptions })
                }
                disabled={CreateCase.reviewer_checkbox}
              />
            </div>
            <div className={classes.line_form_style}>
              <input
                type="checkbox"
                checked={EditCase.reviewer_checkbox}
                style={{ marginRight: "10px" }}
                onChange={() => {
                  SetEditCase((prevState) => ({
                    ...prevState,
                    reviewer_checkbox: !prevState.reviewer_checkbox,
                  }));
                }}
              />
              <h15 className={classes.hint_word}>
                If you assign a reviewer, the subsequent revisions will need to be approved before a
                new version is generated.
              </h15>
            </div>
            <label htmlFor="editor">Editor:</label>
            <Loading_option_add_remove
              api="polls/lendpersonnel"
              name="user_mail"
              selectedOptions={EditCase.editor}
              setSelectedOptions={(newOptions) => SetEditCase({ ...EditCase, editor: newOptions })}
            />
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
      { className: classes.title_tag, children: "Comment" },
      { className: classes.title_last_editor, children: "Last Editor" },
      { className: classes.title_action, children: "Update Time" },
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
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", marginLeft: "20px" }}>
        <Loading loading={loading} />
        <Dialog open={pop_filter[1]} onClose={() => closeModal(1)} fullWidth maxWidth="false">
          <Box sx={{ padding: "20px" }}>{create_case()}</Box>
        </Dialog>
        <Dialog open={pop_filter[2]} onClose={() => closeModal(2)} fullWidth maxWidth="false">
          <Box sx={{ padding: "20px" }}>{view_case(current_data)}</Box>
        </Dialog>
        <Dialog open={pop_filter[3]} onClose={() => closeModal(3)} fullWidth maxWidth="false">
          <Box sx={{ padding: "20px" }}>{edit_case(current_data)}</Box>
        </Dialog>
        <Button onClick={() => openModal(1)} className={classes.button_style}>
          Create Case
        </Button>
      </div>
      <TableContainer>
        {title_row(title_data)}
        {case_data && case_data.map((data, index) => data_row(index, data))}
      </TableContainer>
    </>
  );
}
Test_case.propTypes = {
  category: PropTypes.string.isRequired,
};
export default Test_case;
