import { Navigate, Outlet, useNavigate } from "react-router-dom";

import React, { useEffect } from "react";
import { PATHS } from "../../constants/path";
import tokenMethod from "../../utils/token";
import { useAuthContext } from "../../context/AuthContext";

const PrivateRoute = ({ redirectPath = "/" }) => {
  const { isLogged, profile } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!!!tokenMethod.get()) {
      navigate(PATHS.LOGIN);
    }
  }, [isLogged]);
  useEffect(() => {
    if (profile) {
      switch (profile.role) {
        case "chef":
          return <Navigate to={PATHS.CHEF} />;
        case "manage":
          return <Navigate to={PATHS.MANAGER} />;
        case "waiter":
          return <Outlet />;
        default:
          return <Navigate to={PATHS.LOGIN} />;
      }
    }
  }, [profile]);

  return <Outlet />;
  // if (!!!tokenMethod.get() && !!!profile) {
  //   if (redirectPath) {
  //     return <Navigate to={redirectPath} />;
  //   } else {
  //     navigate(-1);
  //   }
  // }
  // if (profile && profile.role) {
  //   switch (profile.role) {
  //     case "chef":
  //       return <Navigate to={PATHS.CHEF} />;
  //     case "waiter":
  //       return <Outlet />;
  //     default:
  //       return <Navigate to={PATHS.LOGIN} />;
  //   }
  // }

  // return <Outlet />;
};

export default PrivateRoute;
