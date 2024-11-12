import axiosInstance from "../utils/axiosInstance";

export const orderService = {
  createOrder(cartID, note) {
    return axiosInstance.post("/order", { cartID, note });
  },
  getOrder(orderID) {
    return axiosInstance.get(`/order/${orderID}`);
  },
};
export default orderService;
