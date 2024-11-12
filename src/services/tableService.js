import axiosInstance from "../utils/axiosInstance";

export const tableService = {
  getTables() {
    return axiosInstance.get("/tables");
  },
  openTable(tableId) {
    return axiosInstance.post(`/opentable/${tableId}`);
  },
  reservationTable(reservationData) {
    return axiosInstance.post("/reservationData", reservationData);
  },
  cancleTable(tableId) {
    return axiosInstance.put(`/cancelReservationData/${tableId}`);
  },
};

export default tableService;
