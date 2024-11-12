import axiosInstance from "../utils/axiosInstance";

export const menuService = {
  getMenu() {
    return axiosInstance.get("/menus");
  },
  searchMenuByName(foodName) {
    return axiosInstance.get(`/searchMenus?foodName=${foodName}`);
  },
  updateMenu(foodID, status) {
    return axiosInstance.post("/updateMenus", { foodID, status });
  },
};

export default menuService;
