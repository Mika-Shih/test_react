import React, { useState, useEffect } from "react";

// Soft UI Dashboard React components
import SuiBox from "components/SuiBox";
import SuiTypography from "components/SuiTypography";
import SuiButton from "components/SuiButton";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Box from "@mui/material/Box";

// Layout components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import routes from "routes";
import Footer from "examples/Footer";

function Documentation() {
  // State to track which section is active
  const [activeSection, setActiveSection] = useState("overview");
  const [tabValue, setTabValue] = useState(0);

  // Function to handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Function to scroll to a specific section
  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Create a list of sections for the table of contents - Test Case
  const testCaseSections = [
    { id: "overview", title: "1. Test Case Overview" },
    { id: "creating", title: "2. Creating Test Cases" },
    { id: "viewing", title: "3. Viewing Test Cases" },
    { id: "editing", title: "4. Editing Test Cases" },
    { id: "version", title: "5. Version Management" },
    { id: "deleting", title: "6. Deleting and Restoring Test Cases" },
    { id: "permission", title: "7. Permission Management" },
    { id: "filtering", title: "8. Filtering and Searching" },
  ];

  // Create a list of sections for the table of contents - Test Plan
  const testPlanSections = [
    { id: "plan_overview", title: "1. Test Plan Overview" },
    { id: "plan_creating", title: "2. Creating Test Plans" },
    { id: "plan_viewing", title: "3. Viewing Test Plans" },
    { id: "plan_editing", title: "4. Editing Test Plans" },
    { id: "plan_version", title: "5. Version Management" },
    { id: "plan_filtering", title: "6. Filtering and Searching" },
  ];

  // Get sections based on active tab
  const sections = tabValue === 0 ? testCaseSections : testPlanSections;

  // Handle scroll events to update active section
  useEffect(() => {
    const handleScroll = () => {
      // Find which section is currently most visible
      const currentSectionIds = sections.map((section) => section.id);

      for (const sectionId of currentSectionIds) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          // If element is in viewport and near the top
          if (rect.top >= 0 && rect.top <= 200) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [sections]);

  return (
    <DashboardLayout>
      <DashboardNavbar routes={routes} />
      <SuiBox py={3}>
        {/* Tab navigation */}
        <SuiBox mb={3}>
          <Card>
            <SuiBox p={2}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
                centered
              >
                <Tab label="Test Case Page" />
                <Tab label="Test Plan Page" />
              </Tabs>
            </SuiBox>
          </Card>
        </SuiBox>

        <Grid container spacing={3}>
          {/* Table of Contents - Left Sidebar */}
          <Grid item xs={12} md={3}>
            <Card sx={{ position: "sticky", top: "6rem", zIndex: 1 }}>
              <SuiBox pt={3} px={3}>
                <SuiTypography variant="h6" fontWeight="medium">
                  Table of Contents
                </SuiTypography>
              </SuiBox>
              <Divider sx={{ my: 1 }} />
              <SuiBox p={2}>
                <List component="nav" dense>
                  {sections.map((section) => (
                    <ListItem
                      button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      selected={activeSection === section.id}
                      sx={{
                        borderRadius: "0.5rem",
                        mb: 0.5,
                        backgroundColor:
                          activeSection === section.id ? "primary.light" : "transparent",
                        "&:hover": {
                          backgroundColor: "primary.lighter",
                        },
                        transition: "background-color 0.3s",
                      }}
                    >
                      <ListItemText
                        primary={section.title}
                        primaryTypographyProps={{
                          variant: "body2",
                          fontWeight: activeSection === section.id ? "medium" : "regular",
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </SuiBox>
            </Card>
          </Grid>

          {/* Documentation Content - Right Side */}
          <Grid item xs={12} md={9}>
            <Card>
              <SuiBox pt={3} px={3}>
                <SuiTypography variant="h4" fontWeight="medium">
                  {tabValue === 0
                    ? "Test Plan Management Documentation"
                    : "Test Plan Management Documentation"}
                </SuiTypography>
              </SuiBox>
              <SuiBox p={3}>
                {/* Test Case Content */}
                <Box sx={{ display: tabValue === 0 ? "block" : "none" }}>
                  <SuiTypography variant="body2" color="text">
                    Welcome to the Test Plan Management documentation. This guide will help you
                    understand how to create, edit, view, and manage test cases efficiently.
                  </SuiTypography>

                  <div id="overview">
                    <SuiBox mt={3}>
                      <SuiTypography variant="h5" fontWeight="medium">
                        1. Test Case Overview
                      </SuiTypography>
                      <SuiTypography variant="body2" color="text" mt={1}>
                        Test cases are individual testing scenarios designed to validate specific
                        functionalities. Each test case contains important information such as:
                      </SuiTypography>
                      <SuiBox ml={2} mt={1}>
                        <SuiTypography variant="body2" component="ul">
                          <li>
                            <strong>Case Name:</strong> Descriptive name of the test case
                          </li>
                          <li>
                            <strong>Description:</strong> Detailed explanation of what the test case
                            verifies
                          </li>
                          <li>
                            <strong>Comment:</strong> Additional notes or remarks about the test
                            case
                          </li>
                          <li>
                            <strong>Tag:</strong> Categorization label to group related test cases
                          </li>
                          <li>
                            <strong>Version:</strong> Test case version history for tracking changes
                          </li>
                        </SuiTypography>
                      </SuiBox>
                    </SuiBox>
                  </div>

                  <Divider sx={{ my: 2 }} />

                  <div id="creating">
                    <SuiBox mt={3}>
                      <SuiTypography variant="h5" fontWeight="medium">
                        2. Creating Test Cases
                      </SuiTypography>
                      <SuiTypography variant="body2" color="text" mt={1}>
                        To create a new test case:
                      </SuiTypography>
                      <SuiBox ml={2} mt={1}>
                        <SuiTypography variant="body2" component="ol">
                          <li>
                            Click the <strong>&quot;Create Case&quot;</strong> button on the Test
                            Case page
                          </li>
                          <li>
                            Fill in the required fields:
                            <ul>
                              <li>Test Case Name (required)</li>
                              <li>Description (required)</li>
                              <li>Comment (optional)</li>
                              <li>Tag (required) - Used for grouping and filtering</li>
                            </ul>
                          </li>
                          <li>
                            Click <strong>&quot;Create Case&quot;</strong> to save the new test case
                          </li>
                        </SuiTypography>
                      </SuiBox>
                      <SuiTypography variant="body2" color="text" mt={1}>
                        Note: Only users with admin or editor permissions can create new test cases.
                      </SuiTypography>
                    </SuiBox>
                  </div>

                  <Divider sx={{ my: 2 }} />

                  <div id="viewing">
                    <SuiBox mt={3}>
                      <SuiTypography variant="h5" fontWeight="medium">
                        3. Viewing Test Cases
                      </SuiTypography>
                      <SuiTypography variant="body2" color="text" mt={1}>
                        Test cases can be viewed in three ways:
                      </SuiTypography>
                      <SuiBox ml={2} mt={1}>
                        <SuiTypography variant="body2">
                          <strong>Main Table View:</strong>
                          <ul>
                            <li>All test cases are displayed in a table format</li>
                            <li>
                              The table shows key information like Tag, Case Name, Description, and
                              Version
                            </li>
                            <li>
                              Test cases are grouped by their tag&apos;s first letter for easier
                              navigation
                            </li>
                            <li>Use the dropdown to select a specific tag category</li>
                            <li>
                              Navigate through pages using the pagination controls at the bottom
                            </li>
                            <li>
                              Long descriptions can be viewed in a dedicated dialog by clicking on
                              them
                            </li>
                          </ul>

                          <strong>Detailed View:</strong>
                          <ul>
                            <li>
                              Click the <strong>&quot;View&quot;</strong> button next to any test
                              case to see its complete details
                            </li>
                            <li>
                              The detailed view includes:
                              <ul>
                                <li>All versions of the test case</li>
                                <li>Complete description and comments</li>
                                <li>Last editor information</li>
                                <li>Update timestamps</li>
                                <li>Version history</li>
                              </ul>
                            </li>
                            <li>
                              Switch between &quot;Active Cases&quot; and &quot;Deleted Cases&quot;
                              tabs
                            </li>
                          </ul>

                          <strong>Filtering and Searching:</strong>
                          <ul>
                            <li>Use the search field to find test cases by name or tag</li>
                            <li>
                              Filter test cases by selecting a specific tag category from the
                              dropdown
                            </li>
                          </ul>
                        </SuiTypography>
                      </SuiBox>
                    </SuiBox>
                  </div>

                  <Divider sx={{ my: 2 }} />

                  <div id="editing">
                    <SuiBox mt={3}>
                      <SuiTypography variant="h5" fontWeight="medium">
                        4. Editing Test Cases
                      </SuiTypography>
                      <SuiTypography variant="body2" color="text" mt={1}>
                        To edit an existing test case:
                      </SuiTypography>
                      <SuiBox ml={2} mt={1}>
                        <SuiTypography variant="body2" component="ol">
                          <li>Locate the test case you want to edit in the main table</li>
                          <li>
                            Click the <strong>&quot;Edit&quot;</strong> button in the Action column
                          </li>
                          <li>
                            Modify any of the following fields:
                            <ul>
                              <li>Test Case Name</li>
                              <li>Description</li>
                              <li>Comment</li>
                            </ul>
                          </li>
                          <li>
                            Click <strong>&quot;Edit Case&quot;</strong> to save your changes
                          </li>
                        </SuiTypography>
                      </SuiBox>
                      <SuiTypography variant="body2" color="text" mt={1}>
                        Note: When you edit a test case, a new version is automatically created
                        while preserving the original version. This allows for complete version
                        history tracking and the ability to revert changes if needed.
                      </SuiTypography>
                    </SuiBox>
                  </div>

                  <Divider sx={{ my: 2 }} />

                  <div id="version">
                    <SuiBox mt={3}>
                      <SuiTypography variant="h5" fontWeight="medium">
                        5. Version Management
                      </SuiTypography>
                      <SuiTypography variant="body2" color="text" mt={1}>
                        Our system provides version management capabilities for test cases:
                      </SuiTypography>
                      <SuiBox ml={2} mt={1}>
                        <SuiTypography variant="body2">
                          <strong>Viewing Different Versions:</strong>
                          <ul>
                            <li>Each test case maintains a complete history of all changes</li>
                            <li>
                              Use the Version dropdown in the main table to select and view
                              different versions
                            </li>
                            <li>
                              Each version is labeled as V.1, V.2, etc., with higher numbers being
                              newer versions
                            </li>
                            <li>The current main (active) version is displayed by default</li>
                          </ul>

                          <strong>Setting the Main Version:</strong>
                          <ul>
                            <li>Select any version from the dropdown menu</li>
                            <li>
                              If the selected version is not currently set as the main version, a
                              setting icon appears
                            </li>
                            <li>Click the icon to open the &quot;Setting Main Case&quot; dialog</li>
                            <li>
                              Review the changes and confirm to set the selected version as the new
                              main version
                            </li>
                            <li>
                              This feature allows you to revert to previous versions if needed
                            </li>
                          </ul>

                          <strong>Comparing Versions:</strong>
                          <ul>
                            <li>
                              In the detailed view, select exactly two versions using the checkboxes
                            </li>
                            <li>
                              Click the <strong>&quot;Compare&quot;</strong> button to see
                              differences between versions
                            </li>
                            <li>Differences are highlighted in red for easy identification</li>
                            <li>This helps track what changed between versions</li>
                            {/* <li>
                              This helps track what changed between versions and who made those
                              changes
                            </li> */}
                          </ul>
                        </SuiTypography>
                      </SuiBox>
                    </SuiBox>
                  </div>

                  <Divider sx={{ my: 2 }} />

                  <div id="deleting">
                    <SuiBox mt={3}>
                      <SuiTypography variant="h5" fontWeight="medium">
                        6. Deleting and Restoring Test Cases
                      </SuiTypography>
                      <SuiTypography variant="body2" color="text" mt={1}>
                        Test cases can be temporarily deleted and later restored if needed:
                      </SuiTypography>
                      <SuiBox ml={2} mt={1}>
                        <SuiTypography variant="body2">
                          <strong>Deleting Test Cases:</strong>
                          <ol>
                            <li>
                              In the detailed view, switch to the &quot;Active Cases&quot; tab
                            </li>
                            <li>Select one or more test cases using the checkboxes</li>
                            <li>
                              Click the <strong>&quot;Delete&quot;</strong> button
                            </li>
                            <li>Confirm the deletion when prompted</li>
                            <li>
                              Deleted test cases are moved to the &quot;Deleted Cases&quot; tab
                            </li>
                          </ol>

                          <strong>Restoring Deleted Test Cases:</strong>
                          <ol>
                            <li>
                              In the detailed view, switch to the &quot;Deleted Cases&quot; tab
                            </li>
                            <li>Select one or more deleted test cases using the checkboxes</li>
                            <li>
                              Click the <strong>&quot;Restore&quot;</strong> button
                            </li>
                            <li>Confirm the restoration when prompted</li>
                            <li>Restored test cases return to the &quot;Active Cases&quot; tab</li>
                          </ol>

                          <strong>Delete Status:</strong>
                          <ul>
                            <li>Deleted test cases are not permanently removed from the system</li>
                            <li>
                              They are marked with a &quot;delete&quot; status and hidden from the
                              main view
                            </li>
                          </ul>
                        </SuiTypography>
                      </SuiBox>
                    </SuiBox>
                  </div>

                  <Divider sx={{ my: 2 }} />

                  <div id="permission">
                    <SuiBox mt={3}>
                      <SuiTypography variant="h5" fontWeight="medium">
                        7. Permission Management
                      </SuiTypography>
                      <SuiTypography variant="body2" color="text" mt={1}>
                        Access to test cases is controlled through a permission system:
                      </SuiTypography>
                      <SuiBox ml={2} mt={1}>
                        <SuiTypography variant="body2">
                          <strong>Permission Levels:</strong>
                          <ul>
                            <li>
                              <strong>Admin:</strong> Full access to all test cases, can create,
                              edit, delete, restore, and manage permissions
                            </li>
                            <li>
                              <strong>Editor:</strong> Can create, edit, delete, and restore test
                              cases, but cannot manage permissions
                            </li>
                            <li>
                              <strong>Viewer:</strong> Read-only access to test cases
                            </li>
                          </ul>

                          <strong>Managing Permissions:</strong>
                          <ol>
                            <li>
                              Click the <strong>&quot;Edit Permission&quot;</strong> button (admin
                              only) or <strong>&quot;View Permission&quot;</strong> button
                              (non-admin)
                            </li>
                            <li>
                              In the permission dialog, admins can:
                              <ul>
                                <li>Add or remove users with admin privileges</li>
                                <li>Add or remove users with editor privileges</li>
                                <li>Control whether admins can modify the editor list</li>
                              </ul>
                            </li>
                            <li>Non-admin users can only view the current permission settings</li>
                            <li>
                              Click <strong>&quot;Edit Permission&quot;</strong> to save changes
                              (admin only)
                            </li>
                          </ol>

                          <strong>Special Considerations:</strong>
                          <ul>
                            <li>
                              Admins can choose whether to allow other admins to modify the editor
                              list
                            </li>
                            <li>Permission changes are applied immediately</li>
                            <li>
                              At least one admin must always be assigned to maintain access control
                            </li>
                          </ul>
                        </SuiTypography>
                      </SuiBox>
                    </SuiBox>
                  </div>

                  <Divider sx={{ my: 2 }} />

                  <div id="filtering">
                    <SuiBox mt={3}>
                      <SuiTypography variant="h5" fontWeight="medium">
                        8. Filtering and Searching
                      </SuiTypography>
                      <SuiTypography variant="body2" color="text" mt={1}>
                        The test case management system provides several ways to find specific test
                        cases:
                      </SuiTypography>
                      <SuiBox ml={2} mt={1}>
                        <SuiTypography variant="body2">
                          <strong>Tag Category Filtering:</strong>
                          <ul>
                            <li>Test cases are organized by the first letter of their tags</li>
                            <li>
                              Use the tag dropdown to filter test cases by a specific first letter
                            </li>
                          </ul>

                          <strong>Text Search:</strong>
                          <ul>
                            <li>Use the search field to find test cases by name or tag</li>
                            <li>The search is case-insensitive and matches partial text</li>
                            <li>Results are instantly filtered as you type</li>
                          </ul>

                          <strong>Pagination:</strong>
                          <ul>
                            <li>
                              Navigate through multiple pages of test cases using the pagination
                              controls
                            </li>
                            <li>Jump to specific pages or use previous/next buttons</li>
                            <li>The system displays 10 test cases per page by default</li>
                          </ul>

                          <strong>Navigation Tips:</strong>
                          <ul>
                            <li>
                              Use the &quot;Show [Tag] category&quot; dropdown for quick access to
                              specific tag groups
                            </li>
                            <li>Combine tag filtering with text search for more precise results</li>
                          </ul>
                        </SuiTypography>
                      </SuiBox>
                    </SuiBox>
                  </div>
                </Box>
                {/* Test Plan Content */}
                <Box sx={{ display: tabValue === 1 ? "block" : "none" }}>
                  <SuiTypography variant="body2" color="text">
                    Welcome to the Test Plan Management documentation. This guide will help you
                    understand how to create, edit, view, and manage test cases efficiently.
                  </SuiTypography>

                  <div id="plan_overview">
                    <SuiBox mt={3}>
                      <SuiTypography variant="h5" fontWeight="medium">
                        1. Test Plan Overview
                      </SuiTypography>
                      <SuiTypography variant="body2" color="text" mt={1}>
                        A test plan is a comprehensive document outlining testing objectives,
                        approach, and resources. Key components include:
                      </SuiTypography>
                      <SuiBox ml={2} mt={1}>
                        <SuiTypography variant="body2" component="ul">
                          <li>
                            <strong>Plan Name:</strong> Unique identifier for the test plan
                          </li>
                          <li>
                            <strong>Plan Type:</strong> Categorization (One Day, Full Day, Others)
                          </li>
                          <li>
                            <strong>Test Cases:</strong> Collection of test cases organized by
                            categories
                          </li>
                          <li>
                            <strong>Editors:</strong> Users with permission to modify the test plan
                          </li>
                          <li>
                            <strong>Reviewers:</strong> Personnel assigned to review the test plan
                          </li>
                          <li>
                            <strong>Version:</strong> Plan version history for tracking changes
                          </li>
                        </SuiTypography>
                      </SuiBox>
                    </SuiBox>
                  </div>

                  <Divider sx={{ my: 2 }} />

                  <div id="plan_creating">
                    <SuiBox mt={3}>
                      <SuiTypography variant="h5" fontWeight="medium">
                        2. Creating Test Plans
                      </SuiTypography>
                      <SuiTypography variant="body2" color="text" mt={1}>
                        To create a new test plan:
                      </SuiTypography>
                      <SuiBox ml={2} mt={1}>
                        <SuiTypography variant="body2" component="ol">
                          <li>
                            Click the <strong>&quot;Create Plan&quot;</strong> button on the Test
                            Plan page
                          </li>
                          <li>
                            Fill in the required fields:
                            <ul>
                              <li>
                                <strong>Plan Name</strong> (required): Enter a descriptive name for
                                your test plan
                              </li>
                              <li>
                                <strong>Plan Type</strong> (required): Select from &quot;One
                                Day,&quot; &quot;Full Day,&quot; or &quot;Others&quot;
                              </li>
                              <li>
                                <strong>Editors</strong> (optional): Add users who can edit this
                                test plan
                              </li>
                              <li>
                                <strong>Reviewers</strong> (optional): Assign users to review this
                                test plan
                              </li>
                            </ul>
                          </li>
                          <li>
                            Create test case categories:
                            <ul>
                              <li>
                                Enter a <strong>Category Name</strong> for each group of test cases
                              </li>
                              <li>
                                Select <strong>Test Cases</strong> to include in each category
                              </li>
                              <li>
                                Use the <strong>&quot;Add Category&quot;</strong> button to create
                                additional categories
                              </li>
                              <li>
                                Remove unwanted categories with the{" "}
                                <strong>&quot;Remove Category&quot;</strong> button
                              </li>
                            </ul>
                          </li>
                          <li>
                            Click <strong>&quot;Create Plan&quot;</strong> to save the new test plan
                          </li>
                        </SuiTypography>
                      </SuiBox>
                      <SuiTypography variant="body2" color="text" mt={1}>
                        Note: Only users with admin or editor permissions can create new test plans.
                      </SuiTypography>
                    </SuiBox>
                  </div>

                  <Divider sx={{ my: 2 }} />

                  <div id="plan_viewing">
                    <SuiBox mt={3}>
                      <SuiTypography variant="h5" fontWeight="medium">
                        3. Viewing Test Plans
                      </SuiTypography>
                      <SuiTypography variant="body2" color="text" mt={1}>
                        Test plans can be accessed and viewed in multiple ways:
                      </SuiTypography>
                      <SuiBox ml={2} mt={1}>
                        <SuiTypography variant="body2">
                          <strong>List View:</strong>
                          <ul>
                            <li>
                              All test plans are displayed in a table format showing Plan Name, Plan
                              Type, Update Time, and Actions
                            </li>
                            <li>
                              Use checkboxes to select one or multiple test plans for{" "}
                              <strong>export</strong>
                            </li>
                          </ul>

                          <strong>Detailed View:</strong>
                          <ul>
                            <li>
                              Click the <strong>&quot;View&quot;</strong> button next to any test
                              plan to see its complete details
                            </li>
                            <li>
                              The detailed view includes:
                              <ul>
                                <li>
                                  Basic information (name, type, version, last editor, update time,
                                  editors, reviewers)
                                </li>
                                <li>Categorized test cases with their details</li>
                              </ul>
                            </li>
                            <li>
                              For each test case, you can view:
                              <ul>
                                <li>Tag: Identifier for the test case category</li>
                                <li>Case Name: Name of the test case</li>
                                <li>
                                  Description: Detailed test case description (click to expand long
                                  text)
                                </li>
                                <li>
                                  Comment: Additional notes about the test case (click to expand
                                  long text)
                                </li>
                                <li>Version: Current version of the test case</li>
                              </ul>
                            </li>
                          </ul>
                        </SuiTypography>
                      </SuiBox>
                    </SuiBox>
                  </div>

                  <Divider sx={{ my: 2 }} />

                  <div id="plan_editing">
                    <SuiBox mt={3}>
                      <SuiTypography variant="h5" fontWeight="medium">
                        4. Editing Test Plans
                      </SuiTypography>
                      <SuiTypography variant="body2" color="text" mt={1}>
                        To edit an existing test plan:
                      </SuiTypography>
                      <SuiBox ml={2} mt={1}>
                        <SuiTypography variant="body2" component="ol">
                          <li>Locate the test plan in the list view</li>
                          <li>
                            Click the <strong>&quot;Edit&quot;</strong> button in the Actions column
                          </li>
                          <li>
                            Modify any of the following:
                            <ul>
                              <li>
                                <strong>Plan Name</strong>: Update the name of the test plan
                              </li>
                              <li>
                                <strong>Plan Type</strong>: Change the plan type if needed
                              </li>
                              <li>
                                <strong>Categories</strong>: Add, remove, or modify test case
                                categories
                              </li>
                              <li>
                                <strong>Test Cases</strong>: Add or remove test cases from each
                                category
                              </li>
                            </ul>
                          </li>
                          <li>
                            Click <strong>&quot;Save Changes&quot;</strong> to update the test plan
                          </li>
                        </SuiTypography>
                      </SuiBox>
                      <SuiTypography variant="body2" color="text" mt={1}>
                        Note: When you edit a test plan, a new version is automatically created
                        while preserving previous versions. Only users with admin or editor
                        permissions can edit test plans.
                      </SuiTypography>
                    </SuiBox>
                  </div>

                  <Divider sx={{ my: 2 }} />

                  <div id="plan_version">
                    <SuiBox mt={3}>
                      <SuiTypography variant="h5" fontWeight="medium">
                        5. Version Management
                      </SuiTypography>
                      <SuiTypography variant="body2" color="text" mt={1}>
                        Our system provides version management for test plans:
                      </SuiTypography>
                      <SuiBox ml={2} mt={1}>
                        <SuiTypography variant="body2">
                          <strong>Viewing Different Versions:</strong>
                          <ul>
                            <li>Each test plan maintains a complete history of all changes</li>
                            <li>
                              In the detailed view, use the Version dropdown to select different
                              versions
                            </li>
                            <li>
                              Versions are labeled as V.1, V.2, etc., with higher numbers indicating
                              newer versions
                            </li>
                          </ul>

                          <strong>Version Comparison:</strong>
                          <ul>
                            <li>
                              When switching between versions, changes are automatically highlighted
                              in red
                            </li>
                            <li>
                              The highlighting shows:
                              <ul>
                                <li>Added test cases (not present in previous version)</li>
                                <li>
                                  Removed test cases (present in previous version but not current)
                                </li>
                                <li>Modified test cases (content changes between versions)</li>
                              </ul>
                            </li>
                            <li>
                              This visual comparison helps quickly identify what changed between
                              versions
                            </li>
                          </ul>
                        </SuiTypography>
                      </SuiBox>
                    </SuiBox>
                  </div>

                  <Divider sx={{ my: 2 }} />

                  <div id="plan_filtering">
                    <SuiBox mt={3}>
                      <SuiTypography variant="h5" fontWeight="medium">
                        6. Filtering and Searching
                      </SuiTypography>
                      <SuiTypography variant="body2" color="text" mt={1}>
                        The test plan management system provides several ways to find specific test
                        plans:
                      </SuiTypography>
                      <SuiBox ml={2} mt={1}>
                        <SuiTypography variant="body2">
                          <strong>Search Functionality:</strong>
                          <ul>
                            <li>
                              Use the search field to find test plans by name, type, or test case
                              details
                            </li>
                            <li>Results are filtered instantly as you type</li>
                          </ul>

                          <strong>Pagination:</strong>
                          <ul>
                            <li>
                              Navigate through multiple pages of test plans using the pagination
                              controls
                            </li>
                            <li>Jump to specific pages or use previous/next buttons</li>
                            <li>The system displays 10 test plans per page by default</li>
                          </ul>

                          <strong>Data Export:</strong>
                          <ul>
                            <li>Select one or more test plans using the checkboxes</li>
                            <li>
                              Click the <strong>&quot;Export&quot;</strong> button to export to
                              Excel
                            </li>
                            <li>
                              The exported file includes:
                              <ul>
                                <li>All test cases organized by categories</li>
                                <li>Tags, names, comments, and versions</li>
                                <li>Comments preserved as cell notes for detailed information</li>
                              </ul>
                            </li>
                          </ul>
                        </SuiTypography>
                      </SuiBox>
                    </SuiBox>
                  </div>
                </Box>

                {/* Back to top button */}
                <SuiBox mt={4} textAlign="right">
                  <SuiButton
                    variant="gradient"
                    color="info"
                    size="small"
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  >
                    Back to Top
                  </SuiButton>
                </SuiBox>
              </SuiBox>
            </Card>
          </Grid>
        </Grid>
      </SuiBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Documentation;
