import axiosInstance from "../utils/axiosInstance";

export const cartService = {
  getCart() {
    return axiosInstance.get("/getcart");
  },
  addCart(newItem) {
    return axiosInstance.post("/cart", newItem);
  },
  removeItem(cartID, foodID) {
    return axiosInstance.delete("/removeItem", { data: { cartID, foodID } });
  },
};

export default cartService;
