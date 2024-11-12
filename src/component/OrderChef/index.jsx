import React, { useState } from "react";
import { Space, Table, List, Empty } from "antd";

const Orderchef = ({ orderData }) => {
  const [position, setPosition] = useState("bottom");
  const [align, setAlign] = useState("end");
  if (!orderData || !orderData.items) {
    return <Empty></Empty>; 
  }
  return (
    <>
      <div className="grtitle__chef">
        <span className="grtitle__chef-name">Món ăn</span>
        <span className="grtitle__chef-quantity">Số lượng</span>
      </div>
      <List
        pagination={{
          position,
          align,
        }}
        dataSource={orderData.items}
        renderItem={(item, index) => (
          <List.Item>
            <List.Item.Meta
              className="meta__chef"
              title={<p className="title__foodname">{item.foodName}</p>}
            />
            <div className="quantity">{item.quantity}</div>
          </List.Item>
        )}
      />
    </>
  );
};

export default Orderchef;
