import {
  MinusCircleOutlined,
  PlusCircleFilled,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { Button, Card } from "antd";
import React, { useEffect, useState } from "react";
import { useMainContext } from "../../context/MainContext";
import formatPrice from "../../utils/formatPrice";
import priceString from "../../utils/priceString";
const { Meta } = Card;

const CardFood = ({
  imageURL,
  title,
  price,
  foodID,
  foodName,
  tableID,
  updateQuantity,
  dataSource,
  added,
  updateIsAdded,
  status,
}) => {
  const [isAdded, setIsAdded] = useState(false);
  const [number, setNumber] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { handleAddToCart } = useMainContext();
  const handleAddItem = () => {
    handleAddToCart(
      foodID,
      foodName,
      priceString(price),
      quantity,
      imageURL,
      tableID
    );
    setIsAdded(true);
    localStorage.setItem(`isAdded_${foodID}`, true);
  };
  const handleDecrease = () => {
    const newQuantity = quantity - 1;

    if (newQuantity >= 0) {
      setQuantity(newQuantity);
      updateQuantity(foodID, newQuantity);
      if (newQuantity === 0) {
        updateIsAdded(foodID, false);
        setIsAdded(false);
        handleAddToCart(
          foodID,
          foodName,
          priceString(price),
          newQuantity,
          imageURL,
          tableID
        );
        localStorage.removeItem(`isAdded_${foodID}`);
        localStorage.removeItem(`quantity_${foodID}`);
      } else {
        setQuantity(newQuantity);
        handleAddToCart(
          foodID,
          foodName,
          priceString(price),
          newQuantity,
          imageURL,
          tableID
        );
        localStorage.setItem("quantity", newQuantity.toString());
      }
    }
  };

  const handleIncrease = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    updateQuantity(foodID, newQuantity);
    handleAddToCart(foodID, foodName, price, newQuantity, imageURL, tableID);
    localStorage.setItem("quantity", newQuantity);
  };
  useEffect(() => {
    const savedQuantity = localStorage.getItem("quantity");
    const savedIsAdded = localStorage.getItem(`isAdded_${foodID}`);
    if (savedQuantity !== null) {
      setQuantity(parseInt(savedQuantity));
    }
    if (savedIsAdded !== null) {
      setIsAdded(savedIsAdded === "true");
    }
    if (Array.isArray(dataSource) && dataSource.length === 0) {
      setIsAdded(false);
    } else {
      const foundItem = dataSource.find((item) => item.foodID === foodID);
      if (foundItem) {
        if (foundItem.quantity === 0) {
          setIsAdded(false);
        } else {
          setIsAdded(true);
          setQuantity(foundItem.quantity);
        }
      } else {
        setIsAdded(false);
      }
    }
  }, [foodID, quantity, dataSource]);
  useEffect(() => {
    setIsAdded(added);
  }, [added]);
  return (
    <div>
      <Card
        hoverable
        style={{
          width: 240,
        }}
        cover={<img alt="example" src={imageURL} />}
      >
        <Meta title={title} />
        <div
          style={{
            marginTop: "10px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: "20px" }}>{price}</span>
          {status === "Available" ? (
            isAdded ? (
              <div className="button-gr">
                <Button
                  className="button-minus"
                  type="primary"
                  danger
                  icon={<MinusCircleOutlined />}
                  onClick={handleDecrease}
                />
                <p className="number">{quantity}</p>
                <Button
                  className="button-minus"
                  type="primary"
                  danger
                  icon={<PlusCircleOutlined />}
                  onClick={handleIncrease}
                />
              </div>
            ) : (
              <Button
                type="primary"
                danger
                icon={<PlusCircleFilled />}
                onClick={handleAddItem}
              />
            )
          ) : (
            <span style={{ fontFamily: "pnb", fontSize: "18px", color: "red" }}>
              {status}
            </span>
          )}
        </div>
      </Card>
    </div>
  );
};

export default CardFood;
