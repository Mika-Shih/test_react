import React, { useState, useEffect } from "react";
import moment from "moment-timezone";
import { useForm } from "react-hook-form";
import { useLocation, useHistory } from "react-router-dom";
import {
  Button,
  Select,
  MenuItem,
  TextField,
  FormControl,
  InputLabel,
  Box,
  IconButton,
  Switch,
  FormControlLabel,
  CircularProgress,
} from "@mui/material"; // Import the necessary components
import CloseIcon from "@mui/icons-material/Close";

import TestCaseRecordApi from "api/test_plan/testCaseRecord";
import TestCaseApi from "api/test_plan/testCase";
import CategoryApi from "api/test_plan/category";
import AIApi from "api/test_plan/ai";
import PropTypes from "prop-types";

function AddTestItemPage({ onClose, selectedCategory }) {
  const location = useLocation();
  const history = useHistory();
  const { data } = location.state || {};

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [category, setCategory] = useState(
    data?.category || selectedCategory.selectedCategory || "BT"
  );
  console.log(category);
  const [categoryList, setCategoryList] = useState([]);
  const [needsAI, setNeedsAI] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleAINeedsChange = (event) => {
    setNeedsAI(event.target.checked);
  };

  const onSubmit = async (data) => {
    try {
      const newTestItemData = {
        plan_id: 1,
        test_group: 1,
        added_time: moment().tz("Asia/Taipei").format(),
        version: "1.0.0",
        category: categoryList.reduce((acc, category) => {
          acc[category.category_name] = data.category === category.category_name;
          return acc;
        }, {}),
      };
      const newTestItemResponse = await TestCaseApi.create_case(newTestItemData);
      console.log("New test item created:", newTestItemResponse.data);
      const newItemRecordData = {
        ...data,
        item_details: {
          test_item_name: data.item_name,
          description: data.description,
        },
        item_status: "Pending",
        item_id: newTestItemResponse.data.id,
        editor_id: 1,
        reviewer_id: 2,
        reviewer_comment: null,
        updated_time: moment().tz("Asia/Taipei").format(),
        version: "1.0.0",
      };

      const newItemRecordResponse = await TestCaseRecordApi.create_case_record(newItemRecordData);
      console.log("New test item record created:", newItemRecordResponse.data);

      if (needsAI) {
        setIsLoading(true);
        const aiResponse = await AIApi.get_case_suggestion({ user_content: data.description }); // This function needs to be implemented
        console.log("AI response:", aiResponse);
        const payload = {
          user_id: 1,
          item_id: newTestItemResponse.data.id,
          user_content: data.description,
          ai_suggestion: aiResponse.data.ai_suggestion,
        };
        console.log(payload);
        history.push("/AIComparison", { data: payload });
      }

      onClose();
    } catch (error) {
      console.error("Error creating new test item:", error);
    }
  };

  const loadCategories = async () => {
    try {
      const categories = await CategoryApi.getCategories();
      setCategoryList(categories.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleCloseIcon = () => {
    onClose();
  };

  useEffect(() => {
    loadCategories();
  }, []);

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
    } else {
      setCategory(value);
    }
  };

  return (
    <Box sx={{ padding: "20px", margin: "auto", maxWidth: 700 }}>
      <IconButton onClick={handleCloseIcon} sx={{ position: "absolute", right: 8, top: 8 }}>
        <CloseIcon />
      </IconButton>
      {isLoading ? (
        <CircularProgress size={24} />
      ) : (
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
                categoryList.map((category) => {
                  if (category.category_name !== "Common") {
                    return (
                      <MenuItem key={category.id} value={category.category_name}>
                        {category.category_name}
                      </MenuItem>
                    );
                  }
                  return null;
                })}
              <MenuItem value="NEW_CATEGORY">New Category</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Case Name"
            variant="outlined"
            fullWidth
            margin="normal"
            {...register("item_name", { required: true })}
            error={errors.item_name != null}
            helperText={errors.item_name && "Item name is required"}
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
          <FormControlLabel
            control={
              <Switch
                checked={needsAI}
                onChange={handleAINeedsChange}
                name="ai-assistance"
                color="primary"
              />
            }
            label="Enable AI assistance"
          />
          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <Button type="submit" variant="contained" color="primary">
              Add Test Item
            </Button>
          </div>
        </form>
      )}
    </Box>
  );
}

AddTestItemPage.propTypes = {
  onClose: PropTypes.func.isRequired,
  selectedCategory: PropTypes.shape({
    selectedCategory: PropTypes.string,
  }),
};

export default AddTestItemPage;
