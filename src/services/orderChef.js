import axiosInstance from "../utils/axiosInstance";

export const orderChef = {
  getListOrder() {
    return axiosInstance.get("/listorder");
  },
  updateStatus(orderID) {
    return axiosInstance.put("/orderUpdate", { orderID });
  },
};
export default orderChef;
