import MainContextProvider from "../../context/MainContext";
import AuthContextProvider from "../../context/AuthContext";
import { Outlet } from "react-router-dom";
const MainLayout = () => {
  return (
    <MainContextProvider>
      <AuthContextProvider>
        <div className="page__wrapper">
          <Outlet />
        </div>
      </AuthContextProvider>
    </MainContextProvider>
  );
};

export default MainLayout;
