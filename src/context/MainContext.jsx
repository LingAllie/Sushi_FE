// MainContextProvider.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { cartService } from "../services/cartService";
import priceString from "../utils/priceString";

const MainContext = createContext({});

const MainContextProvider = ({ children }) => {
  const { tableID } = useParams();

  const [cartItems, setCartItems] = useState(() => {
    const storedCartItems = localStorage.getItem("cartItems");
    return storedCartItems ? JSON.parse(storedCartItems) : [];
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const handleAddToCart = async (
    foodID,
    foodName,
    price,
    quantity,
    imageURL,
    tableID
  ) => {
    try {
      const newItem = {
        foodID: foodID,
        foodName: foodName,
        price: priceString(price),
        quantity: quantity,
        imageURL: imageURL,
        tableID: tableID,
      };
      const response = await cartService.addCart(newItem);
      setCartItems([...cartItems, newItem]); // Update local state
      if (quantity === 0) {
        removeItemFromCart(newItem);
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  const removeItemFromCart = async (itemToRemove) => {
    try {
      const foodID = itemToRemove.foodID;

      await cartService.removeItem(tableID, foodID);

      const updatedCartItems = cartItems.filter(
        (item) => item.foodID !== foodID
      );
      setCartItems(updatedCartItems); 
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  return (
    <MainContext.Provider
      value={{
        cartItems,
        handleAddToCart,
      }}
    >
      {children}
    </MainContext.Provider>
  );
};

export default MainContextProvider;

export const useMainContext = () => useContext(MainContext);
