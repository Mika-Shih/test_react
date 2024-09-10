import React, { useState, useEffect, useRef } from "react";
import moment from "moment-timezone";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import {
  Button,
  Select,
  MenuItem,
  TextField,
  FormControl,
  InputLabel,
  Box,
  Dialog,
} from "@mui/material"; // Import the necessary components
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useLocation } from "react-router-dom";
import TestPlanRecordApi from "api/test_plan/testPlanRecord";
import TestCaseRrecordApi from "api/test_plan/testCaseRecord";
import CategoryApi from "api/test_plan/category";
import AddTestCasePage from "layouts/test_plan/newCase";

function AddTestPlanPage() {
  const location = useLocation();
  const { data } = location.state || {};
  const { editorId, planId, category } = data;
  const [planName, setPlanName] = useState(null);
  const [description, setDescription] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const history = useHistory();
  const [items, setItems] = useState([]);
  const [modifyCategory, setModifyCategory] = useState(category);
  const [itemOptions, setItemOptions] = useState([]);
  const [itemOrder, setItemOrder] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [showItemCategory, setShowItemCategory] = useState(false);
  const indexRef = useRef();

  const fetchData = async () => {
    try {
      const response = await TestPlanRecordApi.get_personal_specific_plan_record({
        editor_id: editorId,
        plan_id: planId,
      });
      setDescription(response.data[0].description);
      setPlanName(response.data[0].plan_name);
      const itemOrderString = response.data[0].item_order;
      const itemOrderArray = JSON.parse(itemOrderString);
      setItemOrder(itemOrderArray);
      const items = await TestCaseRrecordApi.get_personal_plan_cases({
        item_order: itemOrderArray,
      });
      setItems(items.data);
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    fetchData();
    setIsFormDirty(false);
  }, []);

  const onSubmit = async (data) => {
    try {
      const newPlanRecordData = {
        ...data,
        plan_details: {
          category: modifyCategory,
          item_order: itemOrder,
          description: description,
          test_plan_name: data.plan_name,
        },
        plan_status: "Pending",
        plan_id: planId,
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
    console.log("items", items);
  };

  const handleFormChange = () => {
    setIsFormDirty(true);
  };

  const handleItemCategoryChange = (index, value) => {
    setSelectedCategories((prevCategories) => {
      const updatedCategories = [...prevCategories];
      updatedCategories[index] = value;
      console.log("updatedCategories", updatedCategories);
      return updatedCategories;
    });
  };

  const handleItemNameChange = (index, value) => {
    const newItems = [...items];
    const selectedItem = itemOptions.find((option) => option.item_name === value);
    newItems[index] = { item_id: selectedItem.id, test_item_name: value };
    setItems(newItems);

    const newItemOrder = newItems.map((item) => item.item_id); // 假设每个项目有唯一的 id
    setItemOrder(newItemOrder);
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
  }, [modifyCategory, selectedCategories]);

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
      setModifyCategory("Common");
    } else {
      setShowItemCategory(false);
      setModifyCategory(value);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
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
          </Select>
        </FormControl>
        <TextField
          label="Plan Name"
          variant="outlined"
          value={planName}
          fullWidth
          margin="normal"
          {...register("plan_name", { required: true })}
          InputLabelProps={{
            shrink: true,
          }}
          textAlign="center"
          onChange={(event) => {
            setPlanName(event.target.value);
            handleFormChange();
          }}
        />
        <TextField
          label="Description"
          variant="outlined"
          value={description}
          fullWidth
          margin="normal"
          multiline
          rows={8}
          InputLabelProps={{
            shrink: true,
          }}
          {...register("description")}
          onChange={(event) => {
            setDescription(event.target.value);
            handleFormChange();
          }}
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
            onClick={() => {
              handleAddItemClick();
              handleFormChange();
            }}
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
                                    {items.data.map(
                                      (itemData) => (
                                        console.log("itemData", itemData),
                                        (
                                          <MenuItem key={itemData.id} value={itemData.item_name}>
                                            {itemData.item_name}
                                          </MenuItem>
                                        )
                                      )
                                    )}
                                  </Select>
                                </FormControl>
                              )}
                              {!showItemCategory && (
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
                                    value={item.test_item_name}
                                    onChange={(event) => {
                                      handleItemNameChange(index, event.target.value);
                                      handleFormChange();
                                    }}
                                  >
                                    {itemOptions.map((option) => (
                                      <MenuItem key={option.id} value={option.item_name}>
                                        {option.item_name}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              )}
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
            disabled={!isFormDirty}
          >
            Modify Test Plan
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
