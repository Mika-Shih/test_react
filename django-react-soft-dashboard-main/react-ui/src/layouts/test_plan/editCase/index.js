import React, { useState, useEffect } from "react";
import moment from "moment-timezone";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { Button, TextField, Chip } from "@mui/material";
import { useLocation } from "react-router-dom";
import TestCaseRecordApi from "api/test_plan/testCaseRecord";
import CategoryApi from "api/test_plan/category";

function EditItemPage() {
  const location = useLocation();
  const { data } = location.state || {};
  console.log("data", data);

  const { editorId, planId, itemId, category } = data;
  console.log("Categ", category);
  const [fetchedData, setFetchedData] = useState(null);
  const [itemName, setItemName] = useState(null);
  const [modifyCategory, setmodifyCategory] = useState(null);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [description, setDescription] = useState(null);
  const [note, setNote] = useState(null);
  const history = useHistory();

  const onSubmit = async () => {
    console.log("Submit clicked");
    try {
      const newItemRecordData = {
        item_details: {
          test_item_name: itemName,
          description: description,
          note: note,
        },
        item_status: "Pending",
        item_id: fetchedData[0].item_id,
        editor_id: fetchedData[0].editor_id,
        reviewer_id: fetchedData[0].reviewer_id,
        reviewer_comment: null,
        updated_time: moment().tz("Asia/Taipei").format(),
        version: Number(fetchedData[0].version) + 1,
      };
      console.log("newItemRecordData", newItemRecordData);
      const newItemRecordResponse = await TestCaseRecordApi.create_case_record(newItemRecordData);
      console.log("New test item record created:", newItemRecordResponse.data);
      history.push({
        pathname: "/test_case_list",
        key: "test_case_list",
        state: { defaultCategory: modifyCategory },
      });
    } catch (error) {
      console.error("Error creating new test item:", error);
    }
  };

  console.log("planId", planId);
  const fetchData = async () => {
    try {
      const response = await TestCaseRecordApi.get_personal_case_specific_record({
        editor_id: editorId,
        item_id: itemId,
      });
      setFetchedData(response.data);
      console.log("response", response.data);

      const itemDetails = JSON.parse(response.data[0].item_details);
      setItemName(itemDetails.test_item_name);
      setmodifyCategory(category);
      setDescription(itemDetails.description);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchData();
    setIsFormDirty(false);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const loadCategories = async () => {
    try {
      const categories = await CategoryApi.getCategories();
      setCategoryList(categories.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleFormChange = () => {
    setIsFormDirty(true);
  };

  console.log(categoryList);
  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Chip label={modifyCategory} variant="outlined" />
        <div style={{ marginTop: "10px" }}>
          <TextField
            label="Item Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={itemName}
            error={errors.item_name != null}
            helperText={errors.item_name && "Item name is required"}
            textAlign="center"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(event) => {
              setItemName(event.target.value);
              handleFormChange();
            }}
          />
        </div>
        <TextField
          label="Description"
          variant="outlined"
          fullWidth
          margin="normal"
          value={description}
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
        <TextField
          label="Change Note"
          variant="outlined"
          fullWidth
          margin="normal"
          multiline
          rows={4}
          InputLabelProps={{
            shrink: true,
          }}
          onChange={(event) => {
            setNote(event.target.value);
            handleFormChange();
          }}
        />
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            type="submit"
            style={{ marginRight: "10px" }}
            disabled={!isFormDirty}
          >
            Modify Test Item
          </Button>
        </div>
      </form>
    </DashboardLayout>
  );
}

export default EditItemPage;
