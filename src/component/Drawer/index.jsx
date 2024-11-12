// CartSummaryDrawer.js
import {
  GoogleOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Button,
  Drawer,
  Input,
  List,
  Modal,
  Select,
  Tabs,
  message,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMainContext } from "../../context/MainContext";
import ingreService from "../../services/ingredientService";
import orderService from "../../services/orderService";
import formatPrice from "../../utils/formatPrice";
import invoiceService from "../../services/invoiceService";
import formatDate from "../../utils/formatDate";
import { PATHS } from "../../constants/path";

const { TabPane } = Tabs;

const DrawerSummary = ({
  onClose,
  open,
  dataSource,
  updateIsAdded,
  fetchCartItems,
}) => {
  const { tableID } = useParams();
  const [quantity, setQuantity] = useState(1);
  const { handleAddToCart } = useMainContext();
  const [total, setTotal] = useState(0);
  const [allTotal, setAllTotal] = useState(0);
  const [note, setNote] = useState("");
  const [isNoteEnabled, setIsNoteEnabled] = useState(false);
  const [orderSource, setOrderSource] = useState([]);
  const [orderData, setOrderData] = useState([]);
  const [totalOfOrder, setTotalOfOrder] = useState(0);
  const [activeTab, setActiveTab] = useState("1");
  const [showNewDrawer, setShowNewDrawer] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [showCustomerInfo, setShowCustomerInfo] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({ name: "", email: "" });
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [orderID, setOrderID] = useState();
  const [employeeCode, setEmployeeCode] = useState("");
  const [showEmployeeCodeModal, setShowEmployeeCodeModal] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [dataInvoice, setDataInvoice] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    let sum = 0;
    dataSource.forEach((item) => {
      sum += item.subtotal;
    });
    setTotal(sum);
    setIsNoteEnabled(dataSource.length > 0);
  }, [dataSource]);
  const handleNoteChange = (event) => {
    setNote(event.target.value);
  };
  const handleDecrease = (foodID, foodName, price, quantity, imageURL) => {
    const newQuantity = quantity - 1;
    if (newQuantity >= 0) {
      setQuantity(newQuantity);
      handleAddToCart(foodID, foodName, price, newQuantity, imageURL, tableID);
      if (newQuantity === 0) {
        updateIsAdded(foodID, false);
      }
    }
  };
  const handleIncrease = (foodID, foodName, price, quantity, imageURL) => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    handleAddToCart(foodID, foodName, price, newQuantity, imageURL, tableID);
  };
  const handleOrderClick = async () => {
    if (dataSource.length > 0) {
      const noteSend = note || "";
      const orderData = { tableID, noteSend };
      // console.log(orderData);
      try {
        const res = await orderService.createOrder(orderData);
        message.success("Đặt món thành công");
        fetchCartItems();
        const lastOrderID = res.data.lastOrderID;
        await ingreService.manageIngre(tableID, lastOrderID);
      } catch (error) {
        message.error("Đã xảy ra lỗi khi tạo đơn hàng");
        console.error("Đã xảy ra lỗi khi tạo đơn hàng:", error);
      }
    } else {
      console.log("Không có mặt hàng nào trong giỏ hàng.");
    }
  };
  const fetchOrder = async () => {
    try {
      const res = await orderService.getOrder(tableID);
      const orData = res?.data?.order;
      setOrderID(orData.orderID);
      setAllTotal(orData.total);
      const orders = orData?.orders || [];
      setOrderData(orders);
      const total = orData?.total || 0;
      setTotalOfOrder(total);
      const foundOrder = orders.map((item, index) => {
        return item;
      });
      setOrderSource(foundOrder);
    } catch (error) {
      console.error("Error fetching order:", error);
    }
  };
  useEffect(() => {
    fetchOrder();
    fetchInvoice();
  }, [tableID]);
  const onChange = (key) => {
    setActiveTab(key);
    if (key == 2) {
      const tabPane = document.getElementById("rc-tabs-0-panel-1");
      if (tabPane) {
        tabPane.style.display = "none";
      }
      fetchOrder();
    }
    if (key == 1) {
      const tabPane = document.getElementById("rc-tabs-0-panel-1");
      if (tabPane) {
        tabPane.style.display = "block";
      }
    }
  };
  const handleShowNewDrawer = () => {
    setShowNewDrawer(true); // Mở drawer mới khi người dùng click vào nút
  };
  /* START HANDLE GET INFOR CUSTOMER */
  const handleNameChange = (event) => {
    const value = event.target.value;
    setCustomerName(value);
  };
  const handleEmailChange = (event) => {
    const value = event.target.value;
    setCustomerEmail(value);
    if (value.trim() !== "") {
      if (!validateEmail(value)) {
        setEmailError("Email không hợp lệ.");
      } else {
        setEmailError("");
      }
    } else {
      setEmailError("");
    }
  };
  const handleGetInfoClick = () => {
    if (customerName.trim() === "") {
      setNameError("Vui lòng nhập tên khách hàng.");
    } else if (customerEmail && !validateEmail(customerEmail)) {
      setEmailError("Email không hợp lệ.");
    } else {
      setShowCustomerInfo(true);
      setCustomerInfo({
        name: customerName,
        email: customerEmail,
      });
      setCustomerName("");
      setCustomerEmail("");
    }
  };
  const validateEmail = (email) => {
    const regex = /\S+@\S+\.\S+/;
    return regex.test(email);
  };
  const handlePaymentMethodChange = (value) => {
    setPaymentMethod(value);
  };
  /* END HANDLE GET INFOR CUSTOMER */
  useEffect(() => {}, [orderData]);
  const confirmEmployeeCode = () => {
    if (employeeCode === "1005") {
      handlePayment();
      setShowEmployeeCodeModal(false);
    } else {
      message.error("Mã nhân viên không đúng.");
    }
  };
  const handlePaymentClick = () => {
    setShowEmployeeCodeModal(true);
  };
  const handleClickDone = () => {
    navigate(PATHS.TABLE);
  };
  const handlePayment = async () => {
    try {
      if (!showCustomerInfo || !customerInfo.name) {
        message.error("Vui lòng nhập thông tin khách hàng.");
        return;
      }
      if (!orderData || orderData.length === 0) {
        message.error("Không có đơn hàng để thanh toán.");
        return;
      }
      const res = await invoiceService.paymentProcess(
        customerInfo,
        orderID,
        tableID,
        paymentMethod
      );
      const invoice = res.data.invoice;
      message.success("Thanh toán thành công");
      setShowInvoice(true);
      fetchOrder();
      setShowNewDrawer(false);
    } catch (error) {
      console.error("Error processing payment:", error);
      message.error("Đã xảy ra lỗi khi thanh toán");
    }
  };
  const fetchInvoice = async () => {
    try {
      const res = await invoiceService.getInvoice(tableID);
      setDataInvoice(res?.data);
      // console.log(dataInvoice.invoiceInfo);
    } catch (error) {
      console.error("Error fetching order:", error);
    }
  };
  return (
    <>
      <Drawer title="Summary" onClose={onClose} open={open}>
        <Tabs defaultActiveKey="1" activeKey={activeTab} onChange={onChange}>
          <TabPane className="list-top" tab="Món ăn mới thêm" key="1">
            <div className="summary">
              <div className="list-header">
                <span>Món ăn</span>
                <div className="group-title">
                  <span className="title-unit">Số lượng</span>
                  <span className="title-price">Giá</span>
                  <span className="title-sub">Tạm tính</span>
                </div>
              </div>
              <List
                dataSource={dataSource}
                renderItem={(item, index) => (
                  <List.Item>
                    <List.Item.Meta
                      title={<div className="title-food">{item.foodName}</div>}
                    />
                    <div className="group">
                      <div className="button-gr">
                        <Button
                          className="button-minus"
                          type="primary"
                          danger
                          icon={<MinusCircleOutlined />}
                          onClick={() =>
                            handleDecrease(
                              item.foodID,
                              item.foodName,
                              item.price,
                              item.quantity,
                              item.imageURL
                            )
                          }
                        />
                        <p className="number">{item.quantity}</p>
                        <Button
                          className="button-minus"
                          type="primary"
                          danger
                          icon={<PlusCircleOutlined />}
                          onClick={() =>
                            handleIncrease(
                              item.foodID,
                              item.foodName,
                              item.price,
                              item.quantity,
                              item.imageURL
                            )
                          }
                        />
                      </div>
                      <div className="price-or">{formatPrice(item.price)}</div>
                      <div className="sub-or">{formatPrice(item.subtotal)}</div>
                    </div>
                  </List.Item>
                )}
              />
            </div>

            <div className="footer">
              <div className="footer_sing">
                <div className="note-order">
                  <TextArea
                    rows={4}
                    placeholder="Note"
                    value={note}
                    onChange={handleNoteChange}
                    disabled={!isNoteEnabled}
                  ></TextArea>
                </div>
              </div>
              <div className="footer__gr">
                <div className="footer__total">Total: {formatPrice(total)}</div>
                <div className="footer__order">
                  <Button
                    type="primary"
                    className="button-order"
                    disabled={dataSource.length === 0}
                    onClick={handleOrderClick}
                  >
                    Đặt hàng
                  </Button>
                </div>
              </div>
            </div>
          </TabPane>
          <TabPane tab="Đã đặt hàng" key="2">
            <div className="grouporder">
              {orderSource.map((order, orderIndex) => (
                <div key={orderIndex}>
                  <h3 className="number-order">Đơn hàng {orderIndex + 1}</h3>
                  <div className="grouporder__top">
                    <span>Món ăn</span>
                    <div className="grouporder__top-title">
                      <span className="title-uni">Số lượng</span>
                      <span className="title-price">Giá</span>
                      <span className="title-sub">Tạm tính</span>
                    </div>
                  </div>
                  <List
                    dataSource={order.items}
                    renderItem={(item, itemIndex) => (
                      <List.Item key={itemIndex}>
                        <List.Item.Meta
                          title={
                            <div className="title-food-or">{item.foodName}</div>
                          }
                        />
                        <div className="group-or">
                          <div className="quantity">{item.quantity}</div>
                          <div className="price-or">
                            {formatPrice(item.price)}
                          </div>
                          <div className="sub-or">
                            {formatPrice(item.subtotal)}
                          </div>
                        </div>
                      </List.Item>
                    )}
                  />
                </div>
              ))}
            </div>
            <div className="button-payment">
              <button
                class="button type1"
                data-content={`Tổng hoá đơn: ${formatPrice(allTotal)}`}
                onClick={handleShowNewDrawer}
              ></button>
            </div>
          </TabPane>
        </Tabs>
      </Drawer>
      {showInvoice ? (
        <>
          {" "}
          <Drawer
            className="drainvoice"
            title="Xem hoá đơn"
            onClose={() => setShowInvoice(false)}
            open={showInvoice}
          >
            <div className="drainvoice__gr">
              <div className="drainvoice__gr-title">Chi tiết hoá đơn</div>
              <Button onClick={fetchInvoice}>Xem hoá đơn</Button>
              <div className="drainvoice__gr-customer">
                {dataInvoice?.invoiceInfo?.customerInfo?.name} -{" "}
                {dataInvoice?.invoiceInfo?.customerInfo?.email}
              </div>
              <div className="drainvoice__gr-date">
                Thời gian: {formatDate(dataInvoice?.invoiceInfo?.paymentDate)}
              </div>
              <div className="drainvoice__gr-method">
                Phương thức thanh toán:{" "}
                {dataInvoice?.invoiceInfo?.paymentMethod}
              </div>
            </div>
            <div className="drainvoice__list">
              <div className="drainvoice__list-title">
                <div className="title">Tên món ăn</div>
                <div className="quantity">Số lượng</div>
                <div className="price">Giá</div>
              </div>
              {dataInvoice.items &&
                dataInvoice.items.map((item, index) => (
                  <div className="drainvoice__item-title" key={index}>
                    <div className="title">{item.foodName}</div>
                    <div className="quantity">{item.quantity}</div>
                    <div className="price">{formatPrice(item.price)}</div>
                  </div>
                ))}
            </div>
            <div className="drainvoice__total">
              Tổng hoá đơn: {formatPrice(dataInvoice?.total)}
            </div>
            <div className="drainvoice__button">
              <Button
                className="button_done"
                type="primary"
                onClick={handleClickDone}
              >
                Hoàn thành
              </Button>
            </div>
          </Drawer>
        </>
      ) : (
        <Drawer
          className="paymentdra"
          title="Thanh toán"
          onClose={() => setShowNewDrawer(false)}
          open={showNewDrawer}
        >
          <div className="drawer__payment">
            <div className="customer">
              <div className="customer__input">
                <div className="customer__input-name">
                  <Input
                    width={200}
                    size="large"
                    placeholder="Nhập tên khách hàng"
                    prefix={<UserOutlined />}
                    value={customerName}
                    onChange={handleNameChange}
                  />
                  {nameError && <p style={{ color: "red" }}>{nameError}</p>}
                </div>
                <div className="customer__input-email">
                  <Input
                    width={200}
                    size="large"
                    placeholder="Nhập email khách hàng"
                    prefix={<GoogleOutlined />}
                    value={customerEmail}
                    onChange={handleEmailChange}
                  />
                  {emailError && <p style={{ color: "red" }}>{emailError}</p>}
                </div>
                <div className="customer__input-get">
                  <Button onClick={handleGetInfoClick}>Lấy thông tin</Button>
                </div>
              </div>

              <div className="customer__info">
                <div className="customer__info-title">Thông tin khách hàng</div>
                {showCustomerInfo && (
                  <>
                    <div className="customer__info-name">
                      <p>Tên khách hàng: {customerInfo.name}</p>
                    </div>
                    <div className="customer__info-email">
                      <p>Email khách hàng: {customerInfo.email}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="invoice">
              <div className="invoice__title">Thông tin hoá đơn</div>
              <div className="invoice__grouplist">
                <div className="invoice__col">
                  <div className="invoice__col-name">Tên món ăn</div>
                  <div className="invoice__col-quantity">Số lượng</div>
                  <div className="invoice__col-price">Giá tạm tính</div>
                </div>
                {orderData.map((order, orderIndex) => (
                  <div key={orderIndex}>
                    {order.items.map((item, itemIndex) => (
                      <div className="invoice__list" key={itemIndex}>
                        <div className="invoice__list-name">
                          {item.foodName}
                        </div>
                        <div className="invoice__list-quantity">
                          {item.quantity}
                        </div>
                        <div className="invoice__list-price">
                          {formatPrice(item.price)}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div className="invoice__total">
                Tổng hoá đơn: {formatPrice(totalOfOrder)}
              </div>
              <div className="invoice__method">
                <div className="invoice__method-title">
                  Phương thức thanh toán:
                </div>
                <div className="invoice__method-select">
                  <Select
                    defaultValue="Cash"
                    style={{
                      width: 120,
                    }}
                    onChange={handlePaymentMethodChange}
                    options={[
                      {
                        value: "cash",
                        label: "Cash",
                      },
                    ]}
                  />
                </div>
              </div>
            </div>
            <div className="payment">
              <Button onClick={handlePaymentClick}>Thanh toán</Button>
            </div>
          </div>
        </Drawer>
      )}
      <Modal
        title="Nhập mã nhân viên"
        open={showEmployeeCodeModal}
        onOk={confirmEmployeeCode}
        onCancel={() => setShowEmployeeCodeModal(false)}
      >
        <Input
          value={employeeCode}
          onChange={(e) => setEmployeeCode(e.target.value)}
          placeholder="Nhập mã nhân viên"
        />
      </Modal>
    </>
  );
};

export default DrawerSummary;
