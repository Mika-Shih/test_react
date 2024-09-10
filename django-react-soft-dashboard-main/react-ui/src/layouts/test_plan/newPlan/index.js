import React, { useState, useEffect, useRef } from "react";
import Icon from "@mui/material/Icon";
import moment from "moment-timezone";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Box from "@mui/material/Box";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import AddTestCasePage from "layouts/test_plan/newCase";
import {
  Dialog,
  Button,
  Select,
  MenuItem,
  TextField,
  FormControl,
  InputLabel,
} from "@mui/material"; // Import the necessary components
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import TestPlanRecordApi from "api/test_plan/testPlanRecord";
import TestPlanApi from "api/test_plan/testPlan";
import TestCaseRrecordApi from "api/test_plan/testCaseRecord";
import CategoryApi from "api/test_plan/category";
import { useLocation } from "react-router-dom";

function AddTestPlanPage() {
  const location = useLocation();
  const { data } = location.state || {};
  console.log(data?.category);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const history = useHistory();
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState(data?.category || "BT");
  const [itemOptions, setItemOptions] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [showItemCategory, setShowItemCategory] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const indexRef = useRef();

  const onSubmit = async (data) => {
    console.log(items);
    const selectedItems = items.map((item) => {
      const selectedItem = itemOptions.find((option) => option.item_name === item);
      console.log(selectedItem);
      return selectedItem.id;
    });
    console.log(selectedItems);
    try {
      const newTestPlanData = {
        creator_id: 1,
        reviewer_id: 2,
        added_time: moment().tz("Asia/Taipei").format(),
        version: "1.0.0",
        category: {
          BT: data.category === "BT",
          WIFI: data.category === "WIFI",
          WWAN: data.category === "WWAN",
          Common: data.category === "Common",
        },
      };
      const newTestPlanResponse = await TestPlanApi.create_plan(newTestPlanData);
      console.log("New test plan created:", newTestPlanResponse.data);
      const newPlanRecordData = {
        ...data,
        plan_details: {
          test_plan_name: data.plan_name,
          item_order: selectedItems,
          category: data.category,
          description: data.description,
        },
        plan_status: "Pending",
        plan_id: newTestPlanResponse.data.id,
        editor_id: 1,
        reviewer_id: 2,
        reviewer_comment: null,
        updated_time: moment().tz("Asia/Taipei").format(),
        version: "1.0.0",
      };
      const newPlanRecordResponse = await TestPlanRecordApi.create_plan_record(newPlanRecordData);
      console.log("New test plan record created:", newPlanRecordResponse.data);
      history.push("/test_plan_list");
    } catch (error) {
      console.error("Error creating new test plan:", error);
    }
  };

  const handleAddItemClick = () => {
    setItems([...items, ""]);
  };

  const handleItemCategoryChange = (index, value) => {
    setSelectedCategories((prevCategories) => {
      const updatedCategories = [...prevCategories];
      updatedCategories[index] = value;
      console.log("updatedCategories", updatedCategories);
      return updatedCategories;
    });
  };

  const handleDelete = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleItemNameChange = (index, value) => {
    const newItems = [...items];
    newItems[index] = value;
    setItems(newItems);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    const newItems = [...items];
    const [removed] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, removed);
    setItems(newItems);
  };

  const loadCategories = async () => {
    try {
      const categories = await CategoryApi.getCategories();
      setCategoryList(categories.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, itemOptionsResponse] = await Promise.all([
          CategoryApi.getCategories(),
          TestCaseRrecordApi.get_category_all_case({
            category_name: selectedCategories[indexRef.current] || category,
          }),
        ]);

        const categoriesData = categoriesResponse.data;
        const itemOptionsData = itemOptionsResponse.data;

        setCategoryList(categoriesData);
        setItemOptions(itemOptionsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [category, selectedCategories]);

  const handleCategoryChange = async (event) => {
    const value = event.target.value;
    if (value === "NEW_CATEGORY") {
      const newCategoryName = window.prompt("Enter new category name:");
      if (newCategoryName) {
        console.log("newCategoryName", newCategoryName);
        await CategoryApi.update_plan_category({ category_name: newCategoryName });
        await CategoryApi.update_item_category({ category_name: newCategoryName });
        await loadCategories();
      }
    } else if (value === "Common") {
      setShowItemCategory(true);
      setCategory("Common");
    } else {
      setShowItemCategory(false);
      setCategory(value);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl fullWidth margin="normal" variant="outlined" sx={{ width: "100%" }}>
          <InputLabel htmlFor="category">Category</InputLabel>
          <Select
            label="Category"
            {...register("category", { required: true })}
            error={errors.category != null}
            inputProps={{
              name: "category",
              id: "category",
            }}
            value={category}
            onChange={handleCategoryChange}
          >
            {Array.isArray(categoryList) &&
              categoryList
                .filter((category) => category.category_name !== "Common")
                .map((category) => (
                  <MenuItem key={category.id} value={category.category_name}>
                    {category.category_name}
                  </MenuItem>
                ))}
            {Array.isArray(categoryList) &&
              categoryList
                .filter((category) => category.category_name === "Common")
                .map((category) => (
                  <MenuItem key={category.id} value={category.category_name}>
                    {category.category_name}
                  </MenuItem>
                ))}
            <MenuItem value="NEW_CATEGORY">New Category</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Plan Name"
          variant="outlined"
          fullWidth
          margin="normal"
          {...register("plan_name", { required: true })}
          error={errors.plan_name != null}
          helperText={errors.plan_name && "Item name is required"}
          textAlign="center"
        />
        <TextField
          label="Description"
          variant="outlined"
          fullWidth
          margin="normal"
          multiline
          rows={8}
          {...register("description")}
        />
        <Box marginTop={2}>
          <Button
            variant="contained"
            size="small"
            sx={{
              fontSize: "12px",
              padding: "6px 12px",
              borderRadius: "4px",
              backgroundColor: "white",
              marginRight: "10px",
            }}
            onClick={handleAddItemClick}
          >
            Add Existing Item
          </Button>
          <Button
            variant="contained"
            size="small"
            sx={{
              fontSize: "12px",
              padding: "6px 12px",
              borderRadius: "4px",
              backgroundColor: "white",
            }}
            onClick={handleOpenDialog}
          >
            Create New Item
          </Button>
          <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
            <AddTestCasePage onClose={handleCloseDialog} />
          </Dialog>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="items">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {items.map(
                    (item, index) => (
                      (indexRef.current = index),
                      (
                        <Draggable key={index} draggableId={index.toString()} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              {showItemCategory && (
                                <FormControl
                                  fullWidth
                                  margin="normal"
                                  variant="outlined"
                                  sx={{ width: "100%" }}
                                >
                                  <InputLabel id={`item-${index}-category-label`}>{`Item ${
                                    index + 1
                                  } Category`}</InputLabel>
                                  <Select
                                    labelId={`item-${index}-category-label`}
                                    value={selectedCategories[index] || ""}
                                    onChange={(event) =>
                                      handleItemCategoryChange(index, event.target.value)
                                    }
                                  >
                                    {Array.isArray(categoryList) &&
                                      categoryList.map((category) => {
                                        if (category.category_name !== "Common") {
                                          return (
                                            <MenuItem
                                              key={category.id}
                                              value={category.category_name}
                                            >
                                              {category.category_name}
                                            </MenuItem>
                                          );
                                        }
                                        return null;
                                      })}
                                  </Select>
                                </FormControl>
                              )}
                              {showItemCategory && (
                                <FormControl
                                  fullWidth
                                  margin="normal"
                                  variant="outlined"
                                  sx={{ width: "100%" }}
                                >
                                  <InputLabel id={`item-${index}-label`}>{`Item ${
                                    index + 1
                                  }`}</InputLabel>
                                  <Select
                                    labelId={`item-${index}-label`}
                                    value={item.item_name}
                                    onChange={(event) =>
                                      handleItemNameChange(index, event.target.value)
                                    }
                                  >
                                    {itemOptions.map((option) => (
                                      <MenuItem key={option.id} value={option.item_name}>
                                        {option.item_name}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              )}
                              {!showItemCategory && (
                                <FormControl
                                  fullWidth
                                  margin="normal"
                                  variant="outlined"
                                  sx={{ width: "97%" }}
                                >
                                  <InputLabel id={`item-${index}-label`}>{`Item ${
                                    index + 1
                                  }`}</InputLabel>
                                  <Select
                                    labelId={`item-${index}-label`}
                                    value={item.item_name}
                                    onChange={(event) =>
                                      handleItemNameChange(index, event.target.value)
                                    }
                                  >
                                    {itemOptions.map((option) => (
                                      <MenuItem key={option.id} value={option.item_name}>
                                        {option.item_name}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              )}
                              <Icon
                                className="material-icons-round"
                                onClick={() => handleDelete(index)}
                              >
                                delete
                              </Icon>
                            </div>
                          )}
                        </Draggable>
                      )
                    )
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Box>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            onClick={handleSubmit(onSubmit)}
            style={{ marginRight: "10px" }}
          >
            Save Test Plan
          </Button>
          <Button variant="contained" onClick={() => history.push("/test_plan_list")}>
            Cancel
          </Button>
        </div>
      </form>
    </DashboardLayout>
  );
}

export default AddTestPlanPage;
