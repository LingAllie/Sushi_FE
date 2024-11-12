import { UserOutlined } from "@ant-design/icons";
import {
  Collapse,
  DatePicker,
  Layout,
  Menu,
  Modal,
  Tabs,
  theme,
  Button,
  Drawer,
  Switch,
} from "antd";
const { Header, Content, Sider } = Layout;
import TabPane from "antd/es/tabs/TabPane";
import React, { useEffect, useState } from "react";
import invoiceService from "../../services/invoiceService";
import formatDate from "../../utils/formatDate";
import formatPrice from "../../utils/formatPrice";
import ingreService from "../../services/ingredientService";
import menuService from "../../services/menuService";
import Search from "antd/es/input/Search";

const ManagerPage = () => {
  const [dataFetch, setDataFetch] = useState([]);
  const [selectedRange, setSelectedRange] = useState([]);
  const [open, setOpen] = useState(false);
  const [ingredientData, setIngredientData] = useState([]);
  const [menuData, setMenuData] = useState([]);
  const [activeTab, setActiveTab] = useState("1");
  const [searchedIngredients, setSearchedIngredients] = useState([]);
  const [displayedIngredients, setDisplayedIngredients] = useState([]);
  const [searchedMenus, setSearchedMenus] = useState([]);
  const [displayedMenus, setDisplayedMenus] = useState([]);
  const items = [UserOutlined].map((icon, index) => ({
    key: String(index + 1),
    label: `List invoices`,
  }));
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  useEffect(() => {
    fetchPaymentHistory();
    fetchIngredient();
  }, []);

  const fetchPaymentHistory = async () => {
    try {
      const res = await invoiceService.getAllInvoice();
      setDataFetch(res?.data);
    } catch (error) {
      console.error("Error fetching payment history:", error);
    }
  };
  const handleRangeChange = (value) => {
    setSelectedRange(value);
  };
  const filterInvoicesByRange = () => {
    if (!selectedRange || selectedRange.length === 0) {
      return dataFetch?.allInvoices;
    }
    return dataFetch?.allInvoices.filter(
      (invoice) =>
        new Date(invoice.paymentDate).getTime() >=
          selectedRange[0].startOf("day").toDate().getTime() &&
        new Date(invoice.paymentDate).getTime() <=
          selectedRange[1].endOf("day").toDate().getTime()
    );
  };
  const fetchIngredient = async () => {
    try {
      const res = await ingreService.getIngre();
      setIngredientData(res?.data.ingredients);
    } catch (error) {
      console.error("Error fetching ingredient:", error);
    }
  };

  const fetchMenu = async () => {
    try {
      const res = await menuService.getMenu();
      setMenuData(res?.data?.data);
      const initialSwitchStates = res.data.data.map(
        (menu) => menu.status === "Available"
      );
      setSwitchStates(initialSwitchStates);
    } catch (error) {
      console.error("Error fetching menu:", error);
    }
  };
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const onChange = (key) => {
    setActiveTab(key);
    if (key == 2) {
      const tabPane = document.getElementById("rc-tabs-0-panel-1");
      if (tabPane) {
        tabPane.style.display = "none";
      }
      fetchMenu();
      setDisplayedMenus(menuData);
    }
    if (key == 1) {
      const tabPane = document.getElementById("rc-tabs-0-panel-1");
      if (tabPane) {
        tabPane.style.display = "block";
      }
    }
  };
  const onSearchIngre = async (value) => {
    try {
      const res = await ingreService.searchIngreByName(value);
      setSearchedIngredients(res?.data.ingredients);
    } catch (error) {
      console.error("Error searching ingredient:", error);
    }
  };
  const onSearchMenu = async (value) => {
    try {
      const res = await menuService.searchMenuByName(value);
      setSearchedMenus(res?.data.menus);
    } catch (error) {
      console.error("Error searching ingredient:", error);
    }
  };
  useEffect(() => {
    if (searchedIngredients.length > 0) {
      setDisplayedIngredients(searchedIngredients);
    } else {
      setDisplayedIngredients(ingredientData);
    }
    if (searchedMenus.length > 0) {
      setDisplayedMenus(searchedMenus);
    } else {
      setDisplayedMenus(menuData);
    }
  }, [searchedIngredients, ingredientData, searchedMenus, menuData]);

  const [switchStates, setSwitchStates] = useState([]);
  useEffect(() => {
    if (menuData.length > 0) {
      const initialSwitchStates = menuData.map(
        (menu) => menu.status === "Available"
      );
      setSwitchStates(initialSwitchStates);
    }
  }, [menuData]);
  const handleStatusChange = (checked, index, foodID) => {
    const newSwitchStates = [...switchStates];
    newSwitchStates[index] = checked;

    Modal.confirm({
      title: "Confirmation",
      content: `Are you sure you want to set the status to ${
        checked ? "Available" : "Sold out"
      }?`,
      onOk() {
        menuService
          .updateMenu(foodID, checked ? "Available" : "Sold out")
          .then(() => {
            console.log("Menu status updated successfully");
            setSwitchStates(newSwitchStates);
          })
          .catch((error) => {
            console.error("Error updating menu status:", error);
          });
      },
      onCancel() {
        console.log("Status change canceled");
        // No action needed if status change is canceled
      },
    });
  };
  return (
    <div className="managerpage">
      <Layout className="manager__layout">
        <Sider className="manager__menu" breakpoint="lg" collapsedWidth="0">
          <div className="demo-logo-vertical" />
          <Menu
            className="manager__menu"
            theme="dark"
            mode="inline"
            defaultSelectedKeys={["4"]}
            items={items}
          />
        </Sider>
        <Layout>
          <Content
            className="manager__content"
            style={{
              margin: "24px 16px 0",
            }}
          >
            <div
              className="sub-content"
              style={{
                padding: 24,
                minHeight: 360,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              <DatePicker.RangePicker
                onChange={handleRangeChange}
                style={{ marginBottom: "30px" }}
              />
              <Collapse accordion>
                {filterInvoicesByRange()?.map((invoice, index) => (
                  <Collapse.Panel key={index} header={`Hoá đơn ${index + 1}`}>
                    <p style={{ fontSize: "17px" }}>
                      <strong>Thông tin khách hàng:</strong>{" "}
                      {invoice.customerInfo.name}, {invoice.customerInfo.email}
                    </p>
                    <p style={{ fontSize: "17px" }}>
                      <strong>Ngày thanh toán:</strong>{" "}
                      {formatDate(invoice.paymentDate)}
                    </p>
                    <p style={{ fontSize: "17px" }}>
                      <strong>Phương thức thanh toán:</strong>{" "}
                      {invoice.paymentMethod}
                    </p>
                    <ul>
                      {dataFetch &&
                        dataFetch.orders &&
                        dataFetch.orders.map((order, orderIndex) => {
                          if (order.orderID === invoice.orderID) {
                            return (
                              <li key={orderIndex}>
                                <p style={{ fontSize: "17px" }}>
                                  <strong>Tổng tiền:</strong>{" "}
                                  {formatPrice(order.total)}
                                </p>
                                <ul className="group-table">
                                  <div className="invoice__gr">
                                    <div className="invoice__gr-title">
                                      Tên món ăn
                                    </div>
                                    <div className="invoice__gr-quantity">
                                      Số lượng
                                    </div>
                                    <div className="invoice__gr-price">Giá</div>
                                  </div>
                                  {order.orders.map(
                                    (orderItem, orderItemIndex) => (
                                      <li
                                        className="list-food"
                                        key={orderItemIndex}
                                        style={{ fontSize: "16px" }}
                                      >
                                        <ul>
                                          {orderItem.items.map(
                                            (item, itemIndex) => (
                                              <div className="invoice__gr1">
                                                <div className="invoice__gr1-title">
                                                  {item.foodName}
                                                </div>
                                                <div className="invoice__gr1-quantity">
                                                  {item.quantity}
                                                </div>
                                                <div className="invoice__gr1-price">
                                                  {formatPrice(item.price)}
                                                </div>
                                              </div>
                                            )
                                          )}
                                        </ul>
                                      </li>
                                    )
                                  )}
                                </ul>
                              </li>
                            );
                          }
                          return null;
                        })}
                    </ul>
                  </Collapse.Panel>
                ))}
              </Collapse>
            </div>
          </Content>
        </Layout>
        <div className="ingredientlist-manager">
          <Button type="primary" onClick={showDrawer}>
            Xem danh sách Thực đơn & Nguyên Liệu
          </Button>
          <Drawer title="Danh sách" onClose={onClose} open={open}>
            <Tabs
              defaultActiveKey="1"
              activeKey={activeTab}
              onChange={onChange}
            >
              <TabPane className="list-ingre" tab="Nguyên liệu" key="1">
                <Search
                  placeholder="Nhập tên nguyên liệu cần tìm"
                  allowClear
                  onSearch={onSearchIngre}
                  style={{
                    width: 300,
                    marginBottom: "20px",
                  }}
                />
                <div className="listingre">
                  {displayedIngredients.map((ingredient, index) => (
                    <div key={index} className="listingre-item">
                      <div className="listingre-id">
                        {ingredient.ingredientID}
                      </div>
                      <div className="listingre-gr">
                        <div className="listingre-gr-name">
                          {ingredient.name}
                        </div>
                        <div className="listingre-gr-quantity">
                          {ingredient.quantity}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabPane>
              <TabPane className="list-menu" tab="Menu" key="2">
                <Search
                  placeholder="Nhập tên món ăn cần tìm"
                  allowClear
                  onSearch={onSearchMenu}
                  style={{
                    width: 300,
                    marginBottom: "20px",
                  }}
                />
                <div className="listmenu">
                  {displayedMenus.map((menu, index) => (
                    <div key={index} className="listmenu-item">
                      <div className="listmenu-gr-name">
                        <span style={{ fontFamily: "pnb" }}>Tên món:</span>{" "}
                        {menu.foodName}
                      </div>
                      <div className="listingre-gr-ig">
                        <span style={{ fontFamily: "pnb" }}>Nguyên liệu: </span>
                        <ul>
                          {menu.ingredients.map((ingredient, i) => (
                            <li className="item-ig" key={i}>
                              {ingredient}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="listingre-gr-status">
                        <span style={{ fontFamily: "pnb" }}>
                          Trạng thái món:{" "}
                        </span>
                        <Switch
                          checked={switchStates[index]}
                          onChange={(checked) =>
                            handleStatusChange(checked, index, menu.foodID)
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </TabPane>
            </Tabs>
          </Drawer>
        </div>
      </Layout>
    </div>
  );
};

export default ManagerPage;
