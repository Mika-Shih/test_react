import React, { useState, useEffect, useRef } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Box from "@mui/material/Box";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { Button, Select, MenuItem, TextField, FormControl, InputLabel } from "@mui/material"; // Import the necessary components
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useLocation } from "react-router-dom";
import TestPlanRecordApi from "api/test_plan/testPlanRecord";
import TestCaseRrecordApi from "api/test_plan/testCaseRecord";
import CategoryApi from "api/test_plan/category";

function AddTestPlanPage() {
  const location = useLocation();
  const { data } = location.state || {};
  const { editorId, planId, category } = data;
  const [planName, setPlanName] = useState(null);
  const [description, setDescription] = useState(null);

  const {
    register,
    formState: { errors },
  } = useForm();
  const history = useHistory();
  const [items, setItems] = useState([]);
  const [itemOptions, setItemOptions] = useState([]);
  const [itemOrder, setItemOrder] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const indexRef = useRef();

  const fetchData = async () => {
    try {
      const response = await TestPlanRecordApi.get_personal_specific_plan_record({
        editor_id: editorId,
        plan_id: planId,
      });
      console.log(response.data[0]);
      setSelectedCategories(category);
      setDescription(response.data[0].description);
      setPlanName(response.data[0].plan_name);
      const itemOrderString = response.data[0].item_order;
      const itemOrderArray = JSON.parse(itemOrderString);
      setItemOrder(itemOrderArray);
      console.log("itemOrder", itemOrder);
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
  }, []);

  const handleDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    const newItems = [...items];
    const [removed] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, removed);
    setItems(newItems);
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
  }, [selectedCategories]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <form>
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
            InputProps={{
              readOnly: true,
            }}
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
          error={errors.plan_name != null}
          helperText={errors.plan_name && "Item name is required"}
          InputLabelProps={{
            shrink: true,
          }}
          textAlign="center"
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          label="Description"
          variant="outlined"
          value={description}
          fullWidth
          margin="normal"
          multiline
          rows={4}
          InputLabelProps={{
            shrink: true,
          }}
          {...register("description")}
          InputProps={{
            readOnly: true,
          }}
        />
        <Box marginTop={1}>
          <Box marginBottom={1} />
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
                                  InputProps={{
                                    readOnly: true,
                                  }}
                                >
                                  {itemOptions.map((option) => (
                                    <MenuItem key={option.id} value={option.item_name}>
                                      {option.item_name}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
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
          <Button variant="contained" onClick={() => history.push("/test_plan_list")}>
            Back
          </Button>
        </div>
      </form>
    </DashboardLayout>
  );
}

export default AddTestPlanPage;
