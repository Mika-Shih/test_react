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

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
// import Collapse from "@mui/material/Collapse";
import ListItem from "@mui/material/ListItem";
// import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
// import Icon from "@mui/material/Icon";

// Soft UI Dashboard React components
import SuiBox from "components/SuiBox";

// Custom styles for the SidenavCollapse
import styles from "examples/Navbars/DashboardNavbar/route/styles/sidenavCollapse";

// Soft UI Dashboard React context
import { useSoftUIController } from "context";
import Menu from "@mui/material/Menu";
import * as React from "react";
import SuiPagination from "components/SuiPagination";
import { NavLink } from "react-router-dom";
import { useEffect } from "react";
function SidenavCollapse({ icon, name, children, active, noCollapse, open, ...rest }) {
  const [controller] = useSoftUIController();
  const { miniSidenav, transparentSidenav, sidenavColor } = controller;
  // console.log(miniSidenav, transparentSidenav, sidenavColor);  // false, true, "info"
  //console.log(children, open, typeof icon); // false, false, object
  // console.log(name, children, typeof icon);
  useEffect(() => {}, [icon]);
  //
  const classes = styles({
    active,
    noCollapse,
    open,
    miniSidenav,
    transparentSidenav,
    sidenavColor,
  });

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  // console.log(anchorEl);
  const openpop = Boolean(anchorEl);

  return (
    <>
      <ListItem
        component="li"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handlePopoverOpen}
      >
        <SuiBox {...rest} customClass={classes.collapse_item}>
          {/* <ListItemIcon className={classes.collapse_iconBox}>
            {typeof icon === "string" ? (
              <Icon className={classes.collapse_icon}>{icon}</Icon>
            ) : (
              icon
            )}
          </ListItemIcon> */}
          <ListItemText primary={name} classes={{ root: classes.collapse_text }} />
        </SuiBox>
      </ListItem>
      <SuiPagination />
      {children && (
        <Menu
          id="basic-menu"
          open={openpop}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          onClose={handlePopoverClose}
          // disableRestoreFocus
        >
          {children.map((child) => (
            // <p key={index}>{child.name}</p>
            <NavLink to={child.route} key={child.key} className={classes.navbar_row}>
              {/* <SidenavCollapse
              name={name}
              icon={icon}
              active={key === route}
              noCollapse={noCollapse}
            /> */}
              <p>{child.name}</p>
            </NavLink>
          ))}
        </Menu>
      )}
      {/* {children && (
        <Collapse in={open} unmountOnExit>
          {children}
        </Collapse>
      )} */}
    </>
  );
}

// Setting default values for the props of SidenavCollapse
SidenavCollapse.defaultProps = {
  active: false,
  noCollapse: false,
  children: false,
  open: false,
};

// Typechecking props for the SidenavCollapse
SidenavCollapse.propTypes = {
  icon: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  children: PropTypes.node,
  active: PropTypes.bool,
  noCollapse: PropTypes.bool,
  open: PropTypes.bool,
};

export default SidenavCollapse;
