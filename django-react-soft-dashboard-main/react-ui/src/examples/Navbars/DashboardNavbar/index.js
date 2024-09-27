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

import { useState, useEffect } from "react";
import IURAPI from "api/iur";
// react-router components
import { useLocation } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Icon from "@mui/material/Icon";

// Soft UI Dashboard React components
import SuiBox from "components/SuiBox";
// import SuiInput from "components/SuiInput";

// Soft UI Dashboard React example components
// import Breadcrumbs from "examples/Breadcrumbs";
import NotificationItem from "examples/NotificationItem";

// Custom styles for DashboardNavbar
import styles from "examples/Navbars/DashboardNavbar/styles";
import { hasAzureAccess, TestPlanAccess } from "../../../auth-context/auth.context";
// Soft UI Dashboard React context
import { useSoftUIController } from "context";

// Images
// import team2 from "assets/images/team-2.jpg";
// import logoSpotify from "assets/images/small-logos/logo-spotify.svg";

//
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import SidenavCollapse from "examples/Navbars/DashboardNavbar/route/SidenavCollapse";
import SuiTypography from "components/SuiTypography";
import { NavLink } from "react-router-dom";

function DashboardNavbar({ routes, absolute, light, isMini }) {
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useSoftUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar /*openConfigurator*/ } = controller;
  const [openMenu, setOpenMenu] = useState(false);
  const classes = styles({ transparentNavbar, absolute, light, isMini });
  const location = useLocation();
  const { pathname } = location;
  const collapseName = pathname.split("/").slice(1)[0];
  const [machine_arrive_mail_hint, set_machine_arrive_mail_hint] = useState([]);
  if (!Array.isArray(routes)) {
    routes = [];
  }
  // view level
  const level_view_2 = ["Test Plan List", "Test Case List", "Test Case"];
  const level_view = ["CAT", "Pulsar", "Member", "Token"];
  if (!TestPlanAccess()) {
    routes = routes.filter((route) => !level_view_2.includes(route.name));
  }
  if (!hasAzureAccess()) {
    routes = routes.filter((route) => !level_view.includes(route.name));
  }
  // fillter routes
  const namesToFilter = [
    "Dashboard",
    "Billing",
    "RTL",
    "Profile",
    "Virtual Reality",
    "Test table",
    "Tables",
    "Control table",
    //
    "AIComparison",
    "Test Plan Dashboard",
    "Test Item",
    "Create Test Plan",
    "Edit Test Plan",
    "Copy Test Plan",
    "View Test Plan",
    "Create Test Case",
    "Edit Test Case",
    "Test Case History",
  ];
  const titlesToFilter = ["Test", "Account Pages"];
  const rightFilter = ["Token", "Logout"];
  routes = routes.filter((route) => route !== undefined);
  routes = routes.filter((route) => !namesToFilter.includes(route.name));
  routes = routes.filter((route) => !titlesToFilter.includes(route.title));
  const right_routes = routes.filter((route) => rightFilter.includes(route.name));
  routes = routes.filter((route) => !rightFilter.includes(route.name));

  useEffect(() => {
    // Setting the navbar type
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    // A function that sets the transparent state of the navbar.
    function handleTransparentNavbar() {
      dispatch({
        type: "TRANSPARENT_NAVBAR",
        value: (fixedNavbar && window.scrollY === 0) || !fixedNavbar,
      });
    }

    /** 
     The event listener that's calling the handleTransparentNavbar function when 
     scrolling the window.
    */
    window.addEventListener("scroll", handleTransparentNavbar);

    // Call the handleTransparentNavbar function to set the state with the initial value.
    handleTransparentNavbar();

    // Remove event listener on cleanup
    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  const handleMiniSidenav = () => dispatch({ type: "MINI_SIDENAV", value: !miniSidenav });
  // const handleConfiguratorOpen = () =>
  //   dispatch({ type: "OPEN_CONFIGURATOR", value: !openConfigurator });
  const handleOpenMenu = (event) => setOpenMenu(event.currentTarget);
  const handleCloseMenu = () => setOpenMenu(false);

  // Render the notifications menu
  const renderMenu = () => (
    <Menu
      anchorEl={openMenu}
      getContentAnchorEl={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={Boolean(openMenu)}
      onClose={handleCloseMenu}
      style={{ marginTop: "1rem" }}
    >
      {/* <NotificationItem
        image={<img src={team2} alt="person" />}
        title={["New message", "from Laur"]}
        date="13 minutes ago"
        onClick={handleCloseMenu}
      />
      <NotificationItem
        image={<img src={logoSpotify} alt="person" />}
        title={["New album", "by Travis Scott"]}
        date="1 day"
        onClick={handleCloseMenu}
      />
      <NotificationItem
        color="secondary"
        image={
          <Icon fontSize="small" className="material-icon-round text-white">
            payment
          </Icon>
        }
        title={["", "Payment successfully completed"]}
        date="2 days"
        onClick={handleCloseMenu}
      /> */}
      <NotificationItem
        color="secondary"
        image={
          <Icon fontSize="small" className="material-icon-round text-white">
            payment
          </Icon>
        }
        title={["Still have " + machine_arrive_mail_hint + " notification email not sent."]}
        date="2 days"
        onClick={handleCloseMenu}
      />
    </Menu>
  );
  // returnValue != herf
  const renderRoutes = (routes) => {
    return (
      routes &&
      routes.map(({ type, name, icon, title, children, noCollapse, key, route, href }) => {
        let returnValue;
        if (type === "collapse") {
          returnValue = href ? (
            <Link
              href={href}
              key={key}
              target="_blank"
              rel="noreferrer"
              className={classes.navbar_row}
            >
              <SidenavCollapse
                name={name}
                icon={icon}
                active={key === collapseName}
                noCollapse={noCollapse}
              />
            </Link>
          ) : (
            <NavLink to={route} key={key} className={classes.navbar_row}>
              <SidenavCollapse
                name={name}
                icon={icon}
                active={key === collapseName}
                noCollapse={noCollapse}
              />
            </NavLink>
          );
        } else if (type === "title") {
          returnValue = href ? (
            <SuiTypography
              key={key}
              variant="caption"
              fontWeight="bold"
              textTransform="uppercase"
              customClass={classes.sidenav_title}
            >
              {title}
            </SuiTypography>
          ) : (
            <SidenavCollapse
              name={title}
              icon={icon}
              active={key === collapseName}
              noCollapse={noCollapse}
            >
              {children}
            </SidenavCollapse>
          );
        } else if (type === "divider") {
          returnValue = <Divider key={key} />;
        }
        return returnValue;
      })
    );
  };

  return (
    <AppBar
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      className={classes.navbar}
    >
      {/* <List style={{ display: "flex", flexDirection: "row" }}>{renderRoutes}</List> */}
      <Toolbar className={classes.navbar_container}>
        <SuiBox customClass={classes.navbar_row} color="inherit" mb={{ xs: 1, md: 0 }}>
          {/* <Breadcrumbs icon="home" title={route[route.length - 1]} route={route} light={light} /> */}
          <List style={{ display: "flex", flexDirection: "row" }}>{renderRoutes(routes)}</List>
          <List
            style={{ display: "flex", flexDirection: "row", position: "absolute", right: "40px" }}
          >
            {renderRoutes(right_routes)}
          </List>
          {isMini ? null : (
            <SuiBox customClass={classes.navbar_row} style={{ position: "absolute", right: "5px" }}>
              {/* <SuiBox pr={1}>
              <SuiInput
                placeholder="Type here..."
                withIcon={{ icon: "search", direction: "left" }}
                customClass={classes.navbar_input}
              />
            </SuiBox> */}
              <SuiBox
                color={light ? "white" : "inherit"}
                customClass={classes.navbar_section_desktop}
              >
                <IconButton
                  size="small"
                  color="inherit"
                  className={classes.navbar_mobile_menu}
                  onClick={handleMiniSidenav}
                >
                  <Icon>{miniSidenav ? "menu_open" : "menu"}</Icon>
                </IconButton>
                {/* <IconButton
                color="inherit"
                className={classes.navbar_icon_button}
                onClick={handleConfiguratorOpen}
              >
                <Icon>settings</Icon>
              </IconButton> */}
                {hasAzureAccess() &&
                  (useEffect(() => {
                    const fetchData = async () => {
                      try {
                        const response = await IURAPI.hint_machine_mail();
                        const formattedOptions = response.data["record_count"];
                        set_machine_arrive_mail_hint(formattedOptions);
                      } catch (error) {
                        console.log(error);
                      }
                    };
                    fetchData();
                  }, []),
                  (
                    <>
                      <IconButton
                        color="inherit"
                        className={classes.navbar_icon_button}
                        aria-controls="notification-menu"
                        aria-haspopup="true"
                        variant="contained"
                        onClick={handleOpenMenu}
                      >
                        <Icon>notifications</Icon>
                      </IconButton>
                      {renderMenu()}
                    </>
                  ))}
              </SuiBox>
            </SuiBox>
          )}
        </SuiBox>
      </Toolbar>
    </AppBar>
  );
}

// Setting default values for the props of DashboardNavbar
DashboardNavbar.defaultProps = {
  // routes: PropTypes.arrayOf(PropTypes.object).isRequired,
  absolute: false,
  light: false,
  isMini: false,
};

// Typechecking props for the DashboardNavbar
DashboardNavbar.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;
