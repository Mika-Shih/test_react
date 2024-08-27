import React from "react";
import PropTypes from "prop-types";
// import Cookies from "js-cookie";
const AuthContext = React.createContext(null);

export const AuthProvider = ({ userData, children }) => {
  let [user, setUser] = React.useState(userData);
  user = typeof user === "string" ? JSON.parse(user) : user;
  // const checkTokenExpiration = () => {
  //   const token = Cookies.get("token");
  //   const tokenSetTime = Cookies.get("tokenSetTime");
  //   if (token && tokenSetTime) {
  //     const currentTime = new Date().getTime();
  //     console.log(tokenSetTime, currentTime);
  //     if (currentTime - tokenSetTime > 60000) {
  //       setUser(null);
  //       Cookies.remove("token");
  //       Cookies.remove("tokenSetTime");
  //     }
  //   }
  // };
  // useEffect(() => {
  //   checkTokenExpiration();
  // }, []);

  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  userData: PropTypes.any,
  children: PropTypes.any,
};

export const useAuth = () => React.useContext(AuthContext);

export const hasAzureAccess = () => {
  const { user } = useAuth();
  return (
    user &&
    (user.username === "bill.chang@hp.com" ||
      user.username === "catherine.jia@hp.com" ||
      user.username === "timothy.wang1@hp.com" ||
      user.username === "seanl@hp.com" ||
      user.username === "yvonne.lai@hp.com" ||
      user.username === "raizel.lee@hp.com")
  );
};

export const TestPlanAccess = () => {
  const { user } = useAuth();
  return (
    user &&
    (user.username === "bill.chang@hp.com" ||
      user.username === "catherine.jia@hp.com" ||
      user.username === "timothy.wang1@hp.com" ||
      user.username === "seanl@hp.com" ||
      user.username === "yvonne.lai@hp.com" ||
      user.username === "raizel.lee@hp.com" ||
      user.username === "mike.cheng@hp.com" ||
      user.username === "cindy.chou@hp.com" ||
      user.username === "emma.lu@hp.com" ||
      user.username === "mika.shih@hp.com")
  );
};

export const hasEditorAccess = (user) => {
  return user && (user.role === "admin" || user.role === "editor");
};
