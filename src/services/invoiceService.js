import axiosInstance from "../utils/axiosInstance";

export const invoiceService = {
  paymentProcess(customerInfo, orderID, tableID, paymentMethod) {
    return axiosInstance.post("/payment", {
      customerInfo,
      orderID,
      tableID,
      paymentMethod,
    });
  },
  getInvoice(orderID) {
    return axiosInstance.get(`/getInvoice/${orderID}`);
  },
  getAllInvoice() {
    return axiosInstance.get("/getAllInvoice");
  },
};
export default invoiceService;
