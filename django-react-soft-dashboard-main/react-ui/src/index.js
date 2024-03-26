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

import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import App from "App";

// Soft UI Dashboard React Context Provider
import { SoftUIControllerProvider } from "context";
import axios from "axios";
import Cookies from "js-cookie";
import { AuthProvider } from "auth-context/auth.context";

let user = localStorage.getItem("user");
user = JSON.parse(user);
ReactDOM.render(
  <Router>
    <SoftUIControllerProvider>
      <AuthProvider userData={user}>
        {(() => {
          axios.interceptors.request.use(
            (config) => {
              const token = Cookies.get("token");
              if (token) {
                config.headers.Authorization = `Bearer ${token}`;
                return config;
              } else {
                handleLogout();
                return null;
              }
            },
            (error) => {
              return Promise.reject(error);
            }
          );
          return <App />;
        })()}
      </AuthProvider>
    </SoftUIControllerProvider>
  </Router>,
  document.getElementById("root")
);

const handleLogout = () => {
  Cookies.remove("token");
  localStorage.removeItem("user");
  window.location.reload();
};
