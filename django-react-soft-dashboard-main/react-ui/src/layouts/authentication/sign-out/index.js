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
import { useEffect } from "react";
// import AuthApi from "../../../api/auth";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../../auth-context/auth.context";
import Cookies from "js-cookie";
function SignOut() {
  const history = useHistory();
  const { setUser } = useAuth();
  // let { user } = useAuth();

  const handleLogout = async () => {
    // await AuthApi.Logout(user);
    Cookies.remove("token");
    await setUser(null);
    localStorage.removeItem("user");
    history.push("/authentication/sign-in");
    window.location.reload();
  };

  useEffect(() => {
    handleLogout();
  }, []);

  return null;
}

export default SignOut;
