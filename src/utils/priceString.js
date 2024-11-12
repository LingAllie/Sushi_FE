const priceString = (price) => {
  const priceString = String(price); // Ensure price is a string
  const priceWithoutSymbol = parseInt(priceString.replace(/\D/g, ""));

  return priceWithoutSymbol;
};

export default priceString;
