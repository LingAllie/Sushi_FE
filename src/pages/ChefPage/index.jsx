// ChefPage.jsx
import { DownOutlined, UnorderedListOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Dropdown,
  Layout,
  Menu,
  Modal,
  Switch,
  Tabs,
  theme,
} from "antd";
import React, { useEffect, useState } from "react";
import "../../../src/assets/styles.css";
import Orderchef from "../../component/OrderChef";
import { useAuthContext } from "../../context/AuthContext";
import orderChef from "../../services/orderChef";
import { Drawer } from "antd";
import ingreService from "../../services/ingredientService";
import TabPane from "antd/es/tabs/TabPane";
import Search from "antd/es/input/Search";
import menuService from "../../services/menuService";
import formatDate from "../../utils/formatDate";
const { Header, Content, Sider } = Layout;

const ChefPage = () => {
  const { profile } = useAuthContext();
  const role = profile ? profile.role : "";
  const [menuItems, setMenuItems] = useState([]);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [open, setOpen] = useState(false);
  const [ingredientData, setIngredientData] = useState([]);
  const [menuData, setMenuData] = useState([]);
  const [activeTab, setActiveTab] = useState("1");
  const [searchedIngredients, setSearchedIngredients] = useState([]);
  const [displayedIngredients, setDisplayedIngredients] = useState([]);
  const [searchedMenus, setSearchedMenus] = useState([]);
  const [displayedMenus, setDisplayedMenus] = useState([]);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    fetchListOrder();
    fetchIngredient();
    fetchMenu();
  }, []);
  useEffect(() => {
    if (selectedMenuItem) {
      setOrderData(selectedMenuItem.orderData);
    }
  }, [selectedMenuItem]);
  const fetchListOrder = async () => {
    try {
      const listOrderData = await orderChef.getListOrder();
      const listOrder = listOrderData?.data;
      if (listOrder) {
        const items = [
          {
            key: "sub1",
            icon: <UnorderedListOutlined />,
            label: listOrder.length > 0 ? "List Order" : "List Order",
            children: listOrder.map((order, index) => ({
              key: order.orderID,
              label: `Đơn hàng ${index + 1}`,
              orderData: order,
            })),
          },
        ];
        setMenuItems(items);
        if (
          !selectedMenuItem &&
          items.length > 0 &&
          items[0].children.length > 0
        ) {
          setSelectedMenuItem(items[0].children[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching list order:", error);
    }
  };
  const handleMenuItemClick = ({ key }) => {
    const selectedItem = menuItems.find((menuItem) =>
      menuItem.children.find((child) => child.key === key)
    );
    const selectedOrder = selectedItem.children.find(
      (child) => child.key === key
    );
    setSelectedMenuItem(selectedOrder);
  };

  const handleClickUpdate = async () => {
    try {
      const { status, orderID } = selectedMenuItem.orderData;
      let newStatus;
      switch (status) {
        case "Chưa hoàn thành":
          newStatus = "Đang thực hiện";
          break;
        case "Đang thực hiện":
          newStatus = "Đã hoàn thành";
          break;
        default:
          throw new Error("Invalid order status");
      }
      await orderChef.updateStatus(orderID);

      const updatedMenuItem = { ...selectedMenuItem };

      updatedMenuItem.orderData.status = newStatus;
      setSelectedMenuItem(updatedMenuItem);
      fetchListOrder();
    } catch (error) {
      console.error("Error updating order status:", error);
    }
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
    <Layout className="layout__chef">
      <Header
        className="header__chef"
        style={{
          display: "flex",
          alignItems: "center",
        }}
      ></Header>
      <Content
        className="content__chef"
        style={{
          padding: "0 48px",
        }}
      >
        <Layout
          className="layout__chef1"
          style={{
            padding: "24px 0",
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Sider
            className="sider__chef"
            style={{
              background: colorBgContainer,
            }}
            width={200}
          >
            <Menu
              className="menu__chef"
              mode="inline"
              defaultSelectedKeys={["0"]}
              defaultOpenKeys={["sub1"]}
              style={{
                height: "100%",
              }}
              items={menuItems}
              onClick={handleMenuItemClick}
            />
          </Sider>
          <Content
            className="content__chef1"
            style={{
              padding: "0 24px",
              minHeight: 280,
            }}
          >
            {selectedMenuItem && (
              <div className="contentorder">
                <div className="contentorder__tableInfo">
                  <div className="contentorder__tableInfo-number">
                    {selectedMenuItem?.label}
                  </div>
                  <div className="contentorder__tableInfo-id">
                    Bàn: {selectedMenuItem?.orderData?.tableID}
                  </div>
                  <div className="contentorder__tableInfo-date">
                    Ngày giờ: {formatDate(selectedMenuItem?.orderData?.date)}
                  </div>
                  <div className="contentorder__tableInfo-status">
                    Trạng thái:{" "}
                    <Button
                      className={
                        selectedMenuItem?.orderData?.status ===
                        "Chưa hoàn thành"
                          ? "button-red"
                          : selectedMenuItem?.orderData?.status ===
                            "Đang thực hiện"
                          ? "button-yellow"
                          : "button-green"
                      }
                      onClick={handleClickUpdate}
                    >
                      {selectedMenuItem?.orderData?.status}
                    </Button>
                  </div>
                  <div className="contentorder__tableInfo-note">
                    Ghi chú đơn hàng: {selectedMenuItem?.orderData?.note}
                  </div>
                </div>
                <div className="contentorder__detail">
                  <Orderchef orderData={orderData} />
                </div>
              </div>
            )}
          </Content>
        </Layout>
        <div className="ingredientlist">
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
      </Content>
    </Layout>
  );
};

export default ChefPage;
