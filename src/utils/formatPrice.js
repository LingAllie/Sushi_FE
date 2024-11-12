const formatPrice = (price) => {
  if (typeof price === "number") {
    // Nếu giá trị là một số, thực hiện định dạng trực tiếp và trả về
    return price.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  } else if (typeof price === "string") {
    // Nếu giá trị là một chuỗi, trả về giá trị ban đầu
    return price;
  }
  // Trả về giá trị ban đầu nếu không thể chuyển đổi
  return price;
};

export default formatPrice;
