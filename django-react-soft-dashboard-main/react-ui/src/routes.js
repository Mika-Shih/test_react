/**
=========================================================
* Soft UI Dashboard React - v2.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-material-ui
* Copyright 2021 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

/** 
  All of the routes for the Soft UI Dashboard React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Soft UI Dashboard React layouts
import Change_password from "layouts/account/change_password";
import Machine_report from "layouts/cat/table/machine_report_download";
import Dashboard from "layouts/dashboard";
import Cat from "layouts/cat";
import Tables from "layouts/tables";
import test_table from "layouts/test_table";
import control_table from "layouts/control_table";
import token from "layouts/token";
import Iur from "layouts/iur";
import Iur_new_machine from "layouts/new machine";
import Iur_machine_record from "layouts/machine record";
import Billing from "layouts/billing";
import VirtualReality from "layouts/virtual-reality";
import RTL from "layouts/rtl";
import Member from "layouts/member";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import TestPlan from "layouts/test_plans/test_plan";
import TestCase from "layouts/test_plans/test_case";
// import SignUp from "layouts/authentication/sign-up";
import SignOut from "layouts/authentication/sign-out";

//
import TestPlanDashboard from "layouts/test_plan/TestPlanDashboard";
import PersonalItem from "layouts/test_plan/testPlanList/case";
import TestPlanList from "layouts/test_plan/testPlanList/plan";
import TestItemList from "layouts/test_plan/testCaseList";
import NewPlan from "layouts/test_plan/newPlan";
import NewCase from "layouts/test_plan/newCase";
import EditCase from "layouts/test_plan/editCase";
import HistoryCase from "layouts/test_plan/historyCase";
import EditPlan from "layouts/test_plan/editPlan";
import CopyPlan from "layouts/test_plan/copyPlan";
import ViewPlan from "layouts/test_plan/viewPlan";
import AIComparison from "layouts/test_plan/AIComparisonPage";
//

//pulsar
import pulsar from "layouts/pulsar";
import add_device from "layouts/pulsar/add_device";
import add_version from "layouts/pulsar/add_version";

// Soft UI Dashboard React icons
import Shop from "examples/Icons/Shop";
import Office from "examples/Icons/Office";
import Settings from "examples/Icons/Settings";
import Document from "examples/Icons/Document";
import SpaceShip from "examples/Icons/SpaceShip";
import CustomerSupport from "examples/Icons/CustomerSupport";
import CreditCard from "examples/Icons/CreditCard";
import Cube from "examples/Icons/Cube";

const routes = [
  {
    key: "machine_report",
    route: "/machine_report",
    component: Machine_report,
    noCollapse: true,
    protected: true,
  },
  {
    key: "change password",
    route: "/account/change_password",
    component: Change_password,
    noCollapse: true,
    protected: true,
  },
  {
    type: "collapse",
    name: "IUR",
    key: "iur",
    route: "/iur",
    icon: <Shop size="16px" />,
    component: Iur,
    noCollapse: true,
    protected: true,
  },
  {
    key: "new_machine",
    route: "/new_machine",
    component: Iur_new_machine,
    noCollapse: true,
    protected: true,
  },
  {
    key: "machine_record",
    route: "/machine_record",
    component: Iur_machine_record,
    noCollapse: true,
    protected: true,
  },
  {
    type: "collapse",
    name: "CAT",
    key: "cat",
    route: "/cat",
    icon: <Shop size="12px" />,
    component: Cat,
    noCollapse: true,
    protected: true,
  },
  {
    type: "collapse",
    name: "Test Plan",
    key: "testplan",
    route: "/test_plan",
    icon: <Shop size="16px" />,
    component: TestPlan,
    noCollapse: true,
    protected: true,
  },
  {
    type: "collapse",
    name: "Test Case",
    key: "testcase",
    route: "/test_case",
    icon: <Shop size="16px" />,
    component: TestCase,
    noCollapse: true,
    protected: true,
  },
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    route: "/dashboard",
    icon: <Shop size="12px" />,
    component: Dashboard,
    noCollapse: true,
    protected: true,
  },
  {
    type: "collapse",
    name: "Pulsar",
    key: "pulsar",
    route: "/pulsar",
    icon: <Shop size="12px" />,
    component: pulsar,
    noCollapse: true,
    protected: true,
  },
  {
    key: "add_device",
    route: "/add_device",
    component: add_device,
    noCollapse: true,
    protected: true,
  },
  {
    key: "add_version",
    route: "/add_version",
    component: add_version,
    noCollapse: true,
    protected: true,
  },
  {
    type: "collapse",
    name: "Tables",
    key: "tables",
    route: "/tables",
    icon: <Office size="12px" />,
    component: Tables,
    noCollapse: true,
    protected: true,
  },
  {
    type: "collapse",
    name: "Control table",
    key: "control_table",
    route: "/control_table",
    icon: <Office size="12px" />,
    component: control_table,
    noCollapse: true,
    protected: true,
  },
  {
    type: "collapse",
    name: "Token",
    key: "token",
    route: "/token",
    icon: <Office size="12px" />,
    component: token,
    noCollapse: true,
    protected: true,
  },
  {
    type: "collapse",
    name: "Test table",
    key: "test_table",
    route: "/test_table",
    icon: <Office size="12px" />,
    component: test_table,
    noCollapse: true,
    protected: true,
  },
  {
    type: "title",
    title: "Test",
    key: "test",
    route: "/test_table",
    icon: <Office size="12px" />,
    component: test_table,
    noCollapse: true,
    protected: true,
    children: [
      {
        type: "item",
        name: "fake_iur",
        key: "fake_iur",
        route: "/iur",
        icon: <Office size="12px" />,
        component: Iur,
        noCollapse: true,
        protected: true,
      },
      {
        type: "item",
        name: "fake_cat",
        key: "fake_cat",
        route: "/cat",
        icon: <Office size="12px" />,
        component: Cat,
        noCollapse: true,
        protected: true,
      },
    ],
  },
  {
    type: "collapse",
    name: "Billing",
    key: "billing",
    route: "/billing",
    icon: <CreditCard size="12px" />,
    component: Billing,
    noCollapse: true,
    protected: true,
  },
  {
    type: "collapse",
    name: "Virtual Reality",
    key: "virtual-reality",
    route: "/virtual-reality",
    icon: <Cube size="12px" />,
    component: VirtualReality,
    noCollapse: true,
    protected: true,
  },
  {
    type: "collapse",
    name: "RTL",
    key: "rtl",
    route: "/rtl",
    icon: <Settings size="12px" />,
    component: RTL,
    noCollapse: true,
    protected: true,
  },
  //
  {
    type: "collapse",
    name: "AIComparison",
    key: "AIComparison",
    route: "/AIComparison",
    icon: <Office size="12px" />,
    component: AIComparison,
    noCollapse: true,
    protected: true,
  },
  {
    type: "collapse",
    name: "Test Plan List",
    key: "test_plan_list",
    route: "/test_plan_list",
    icon: <Office size="12px" />,
    component: TestPlanList,
    noCollapse: true,
    protected: true,
  },
  {
    type: "collapse",
    name: "Test Case List",
    key: "test_case_list",
    route: "/test_case_list",
    icon: <Office size="12px" />,
    component: TestItemList,
    noCollapse: true,
    protected: true,
  },
  {
    type: "collapse",
    name: "Test Plan Dashboard",
    key: "test_plan_dashboard",
    route: "/test_plan_dashboard",
    icon: <Office size="12px" />,
    component: TestPlanDashboard,
    noCollapse: true,
    protected: true,
  },
  {
    type: "collapse",
    name: "Test Item",
    key: "personal_test_item",
    route: "/personal_test_item",
    icon: <Office size="12px" />,
    component: PersonalItem,
    noCollapse: true,
    protected: true,
  },
  {
    type: "collapse",
    name: "Create Test Plan",
    key: "new_plan",
    route: "/new_plan",
    icon: <Office size="12px" />,
    component: NewPlan,
    noCollapse: true,
    protected: true,
  },
  {
    type: "collapse",
    name: "Edit Test Plan",
    key: "edit_plan",
    route: "/edit_plan",
    icon: <Office size="12px" />,
    component: EditPlan,
    noCollapse: true,
    protected: true,
  },
  {
    type: "collapse",
    name: "Copy Test Plan",
    key: "copy_plan",
    route: "/copy_plan",
    icon: <Office size="12px" />,
    component: CopyPlan,
    noCollapse: true,
    protected: true,
  },
  {
    type: "collapse",
    name: "View Test Plan",
    key: "view_plan",
    route: "/view_plan",
    icon: <Office size="12px" />,
    component: ViewPlan,
    noCollapse: true,
    protected: true,
  },
  {
    type: "collapse",
    name: "Create Test Case",
    key: "new_case",
    route: "/new_case",
    icon: <Office size="12px" />,
    component: NewCase,
    noCollapse: true,
    protected: true,
  },
  {
    type: "collapse",
    name: "Edit Test Case",
    key: "edit_case",
    route: "/edit_case",
    icon: <Office size="12px" />,
    component: EditCase,
    noCollapse: true,
    protected: true,
  },
  {
    type: "collapse",
    name: "Test Case History",
    key: "history_case",
    route: "/history_case",
    icon: <Office size="12px" />,
    component: HistoryCase,
    noCollapse: true,
    protected: true,
  },
  //
  {
    type: "collapse",
    name: "Member",
    key: "member",
    route: "/member",
    icon: <Shop size="16px" />,
    component: Member,
    noCollapse: true,
    protected: true,
  },
  { type: "title", title: "Account Pages", key: "account-pages" },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    route: "/profile",
    icon: <CustomerSupport size="12px" />,
    component: Profile,
    noCollapse: true,
    protected: true,
  },
  {
    type: "none",
    name: "Sign In",
    key: "sign-in",
    route: "/authentication/sign-in",
    icon: <Document size="12px" />,
    component: SignIn,
    noCollapse: true,
  },
  // {
  //   type: "none",
  //   name: "Sign Up",
  //   key: "sign-up",
  //   route: "/authentication/sign-up",
  //   icon: <SpaceShip size="12px" />,
  //   component: SignUp,
  //   noCollapse: true,
  // },
  {
    type: "collapse",
    name: "Logout",
    key: "sign-out",
    route: "/authentication/sign-out",
    icon: <SpaceShip size="12px" />,
    component: SignOut,
    noCollapse: true,
  },
];

export default routes;
