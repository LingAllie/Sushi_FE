// App.jsx
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import { PATHS } from "./constants/path";
import MainLayout from "./layout/MainLayout";
import TablePage from "./pages/TablePage";
import PrivateRoute from "./component/PrivateRoute";
import MenuPage from "./pages/MenuPage";
import ChefPage from "./pages/ChefPage";
import ManagerPage from "./pages/ManagerPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/" element={<PrivateRoute redirectPath={PATHS.LOGIN} />}>
          <Route element={<MainLayout />}>
            <Route path={PATHS.TABLE} element={<TablePage />} />
            <Route path={`${PATHS.MENU}/:tableID`} element={<MenuPage />} />
            <Route path={PATHS.CHEF} element={<ChefPage />} />
            <Route path={PATHS.MANAGER} element={<ManagerPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
export default App;
