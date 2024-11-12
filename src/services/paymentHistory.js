import axiosInstance from "../utils/axiosInstance";
export const paymentService = {
  getPaymentHistory() {
    return axiosInstance.get("getPaymentHistory");
  },
};
export default paymentService;
