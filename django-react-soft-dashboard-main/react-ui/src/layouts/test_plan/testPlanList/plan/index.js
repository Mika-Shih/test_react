import React, { useState, useEffect, useRef } from "react";
import { Card, Tabs, Tab, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SuiBox from "components/SuiBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
// import Table from "layouts/test_plan/table/test_plan_list_table";
import Planlist from "layouts/test_plan/testPlanList/plan/table/plan_list";
import styles from "layouts/tables/styles";
// import testPlansTableData from "./data/PlansData";
import CategoryApi from "api/test_plan/category";
import { useHistory } from "react-router-dom";

function Tables() {
  const classes = styles();
  const [selectedTab, setSelectedTab] = useState(0);
  const [categoryList, setCategoryList] = useState([]);
  const tabsRef = useRef(null);
  const history = useHistory();

  const loadCategories = async () => {
    try {
      const categories = await CategoryApi.getCategories();
      const filteredCategories = categories.data.filter(
        (category) => category.category_name !== "Common"
      );
      setCategoryList(filteredCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  const handleNewTestPlan = () => {
    const selectedCategory = getCategoryFromTab(selectedTab);
    console.log("selectedCategory", selectedCategory);
    history.push("/new_plan", { data: { category: selectedCategory } });
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const getCategoryFromTab = (tabIndex) => {
    const categoryNames = categoryList.map((category) => category.category_name);
    const defaultCategory = "BT";

    if (tabIndex >= 0 && tabIndex < categoryNames.length) {
      return categoryNames[tabIndex];
    } else {
      return defaultCategory;
    }
  };
  // const user_id = 1;
  // const { columns, rows } = testPlansTableData(user_id, getCategoryFromTab(selectedTab));
  // const modifiedColumns = columns.filter(
  //   (column) => column.name !== "plan_id" && column.name !== "editor_id"
  // );
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
                onClick={handleNewTestPlan}
              >
                New Test Plan
              </Button>
            </SuiBox>
            <SuiBox customClass={classes.tables_table}>
              <Planlist category={getCategoryFromTab(selectedTab)} />
            </SuiBox>
          </Card>
        </SuiBox>
      </SuiBox>
    </DashboardLayout>
  );
}

export default Tables;
