import React, { useState, useEffect, useRef } from "react";
import AddIcon from "@mui/icons-material/Add";
import SuiBox from "components/SuiBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Table from "examples/Table/table_page";
// import Table from "examples/Table/table_row";
import styles from "layouts/test_plan/tables/styles";
import testPlansTableData from "./data/casesData";
import CategoryApi from "api/test_plan/category";
import { Dialog, Button, Card, Tabs, Tab } from "@mui/material";
import AddTestCasePage from "layouts/test_plan/newCase";
import { useLocation } from "react-router-dom";

function Tables() {
  const classes = styles();
  const [selectedTab, setSelectedTab] = useState(0);
  const [categoryList, setCategoryList] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const tabsRef = useRef(null);

  const handleOpenDialog = () => {
    const category = categoryList[selectedTab].category_name;
    setSelectedCategory(category);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const loadCategories = async () => {
    try {
      const categories = await CategoryApi.getCategories();
      const filteredCategories = categories.data.filter(
        (category) => category.category_name !== "Common" //Bill?  why not Common
      );
      setCategoryList(filteredCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  console.log("categoryList", categoryList);

  useEffect(() => {
    loadCategories();
  }, []);

  const getCategoryFromTab = (tabIndex) => {
    const categoryNames = categoryList.map((category) => category.category_name);
    const location = useLocation();
    const defaultCategory = categoryNames[tabIndex] || "BT";
    console.log(location.state);
    if (tabIndex >= 0 && tabIndex < categoryNames.length) {
      return categoryNames[tabIndex];
    } else {
      return defaultCategory;
    }
  };

  const user_id = 1;
  const { columns, rows } = testPlansTableData(user_id, getCategoryFromTab(selectedTab)); // Call the hook
  console.log("columns", columns);
  console.log("rows", rows);
  const modifiedColumns = columns.filter(
    (column) => column.name !== "plan_id" && column.name !== "editor_id" && column.name !== "id" //Bill?  why "plan_id"
  );
  console.log("modifiedColumns", modifiedColumns);
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  useEffect(() => {
    const tabsElement = tabsRef.current;
    if (tabsElement) {
      const tabWidth = tabsElement.offsetWidth;
      const tabOffsetLeft = tabsElement.children[selectedTab].offsetLeft;
      const scrollPosition = tabOffsetLeft - tabWidth / 2;
      tabsElement.scrollTo({ left: scrollPosition, behavior: "smooth" });
    }
  }, [selectedTab]);

  // const title_data = columns.map((row) => ({ children: row.name }));
  // const data_row = (data) => {
  //   const tablebody_data = [
  //     { style: classes.platform_style, children: data.item_name },
  //     { style: classes.phase_style, children: data.description },
  //     { style: classes.target_style, children: data.action },
  //   ];
  //   return (
  //     <>
  //       <Table row_style={classes.table_row_style} data={tablebody_data}></Table>
  //     </>
  //   );
  // };
  // console.log("title_data", title_data);
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SuiBox py={3}>
        <SuiBox mb={3}>
          <Card>
            <Tabs value={selectedTab} onChange={handleTabChange}>
              {Array.isArray(categoryList) &&
                categoryList.map((category) => (
                  <Tab key={category.category_name} label={category.category_name} />
                ))}
            </Tabs>
            <SuiBox display="flex" justifyContent="flex-end" alignItems="center" p={3}>
              <Button
                sx={{ width: "20%" }}
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpenDialog}
              >
                New Test Case
              </Button>
              <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
                <AddTestCasePage
                  onClose={handleCloseDialog}
                  selectedCategory={{ selectedCategory }}
                />
              </Dialog>
            </SuiBox>
            <SuiBox customClass={classes.tables_table}>
              <Table columns={modifiedColumns} rows={rows} />
              {/* <Table row_style={classes.title_table_row_style} data={title_data}></Table>
              {rows.map((data) => data_row(data))} */}
            </SuiBox>
          </Card>
        </SuiBox>
      </SuiBox>
    </DashboardLayout>
  );
}

export default Tables;
