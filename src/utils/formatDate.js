import moment from "moment-timezone";

const formatDate = (dateTimeString) => {
  // Chuyển đổi thời gian sang múi giờ của Hồ Chí Minh
  const dateTime = moment(dateTimeString).tz("Asia/Ho_Chi_Minh");

  // Định dạng theo "dd/mm/yyyy hh:mm:ss"
  const formattedDateTime = dateTime.format("DD/MM/YYYY HH:mm:ss");

  return formattedDateTime;
};
export default formatDate;
