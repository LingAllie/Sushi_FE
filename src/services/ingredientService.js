import axiosInstance from "../utils/axiosInstance";

export const ingreService = {
  manageIngre(orderId, childrenOrderId) {
    return axiosInstance.post("/manageIngredient", {
      orderId,
      childrenOrderId,
    });
  },
  getIngre() {
    return axiosInstance.get("/getIngredient");
  },
  searchIngreByName(name) {
    return axiosInstance.get(`/searchIngredient?name=${name}`);
  },
};

export default ingreService;
