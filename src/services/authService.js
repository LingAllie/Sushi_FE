import axiosInstance from "../utils/axiosInstance";

export const authService = {
  login(payload = {}) {
    return axiosInstance.post("/login", payload);
  },
  getProfile() {
    return axiosInstance.get("/profile");
  },
};

export default authService;
