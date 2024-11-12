import { ShoppingCartOutlined } from "@ant-design/icons";
import { Badge, Card, Layout, Menu, Pagination, Spin, theme } from "antd";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "../../../src/assets/styles.css";
import CardFood from "../../component/CardFood";
import DrawerSummary from "../../component/Drawer";
import Loading from "../../component/Loading/index";
import { useMainContext } from "../../context/MainContext";
import useQuery from "../../hooks/useQuery";
import cartService from "../../services/cartService";
import menuService from "../../services/menuService";
import formatPrice from "../../utils/formatPrice";

const { Header, Content, Footer, Sider } = Layout;
const { Meta } = Card;
const MenuPage = () => {
  const { search } = useLocation();
  const { tableID } = useParams();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState("bottom");
  const [align, setAlign] = useState("end");
  const {
    data: menuData,
    loading: menuLoading,
    error: menuError,
    refetch: menuRefetch,
  } = useQuery(menuService.getMenu);
  const menus = menuData?.data || [];
  const {
    data: cartData,
    loading: cartLoading,
    errorData: cartError,
    refetch: cartRefetch,
  } = useQuery(cartService.getCart);
  const cart = cartData?.carts || [];
  const foundCart = cart.find((c) => c.cartID === tableID);
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    if (foundCart && foundCart.items) {
      setDataSource(foundCart.items);
    } else {
      console.log("Cart not found");
    }
  }, [foundCart]);

  useEffect(() => {
    menuRefetch(search);
  }, [search]);
  let items = [];
  if (menuData && menus && menus.length > 0) {
    const uniqueCategories = Array.from(
      new Set(menus.map((menu) => menu.category))
    );
    items = uniqueCategories.map((category, index) => ({
      key: String(index),
      label: category,
    }));
  }

  if (!selectedCategory && items.length > 0) {
    setSelectedCategory(items[0].label);
  }
  const handleMenuItemSelect = ({ key }) => {
    setLoading(true);
    setSelectedCategory(items[key].label);
    setCurrentPage(1);
    setTimeout(() => {
      setLoading(false);
    }, 700);
  };

  const indexOfLastItem = currentPage * 8;
  const indexOfFirstItem = indexOfLastItem - 8;

  const currentMenus = menus
    .filter((menu) => menu.category === selectedCategory)
    .slice(indexOfFirstItem, indexOfLastItem);

  // console.log(currentMenus);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(
    menus.filter((menu) => menu.category === selectedCategory).length / 8
  );
  // console.log(totalPages);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const { handleAddToCart, cartItems } = useMainContext();
  const [totalItemsInCart, setTotalItemsInCart] = useState(0);
  const [ctItems, setCtItems] = useState([]);

  const fetchCartItems = async () => {
    try {
      const res = await cartService.getCart();
      const cart = res?.data?.carts;
      const foundCart = cart.find((c) => c.cartID === tableID);
      let totalQuantity = 0;
      if (foundCart && foundCart.items) {
        for (const item of foundCart.items) {
          totalQuantity += item.quantity;
        }
      }
      setTotalItemsInCart(totalQuantity);
      setDataSource(foundCart.items);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, [cartItems]);
  const updateQuantityInCardFood = (foodID, newQuantity) => {
    const updatedDataSource = dataSource.map((item) => {
      if (item.foodID === foodID) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setDataSource(updatedDataSource);
  };
  const [isAddedMap, setIsAddedMap] = useState({});

  // Thêm hàm cập nhật trạng thái isAdded vào CardFood
  const updateIsAdded = (foodID, value) => {
    setIsAddedMap({ ...isAddedMap, [foodID]: value });
  };
  return (
    <Layout hasSider>
      <Sider
        style={{
          overflow: "auto",
          height: "100vh",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <Header
          className="site-layout-sub-header-background"
          style={{ padding: "20px 20px 0 20px" }}
        >
          <div slider__logo>
            <img src="/public/assets/images/Logo.png" alt="" />
          </div>
        </Header>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["0"]}
          items={items}
          onSelect={handleMenuItemSelect}
        />
      </Sider>
      <Layout>
        <Content
          style={{
            margin: "15px 16px 10px",
            overflow: "initial",
          }}
        >
          <div
            style={{
              padding: "24px 45px 10px 45px",
              background: "#FBF9F5",
              borderRadius: borderRadiusLG,
              height: "100%",
            }}
          >
            {loading ? (
              <Spin />
            ) : (
              <div className="listfood" style={{ marginTop: "20px" }}>
                {menus ? (
                  currentMenus.map((currentItem) => {
                    if (currentItem.category === selectedCategory) {
                      return (
                        <CardFood
                          key={currentItem._id}
                          imageURL={currentItem.imageURL}
                          title={currentItem.foodName}
                          price={formatPrice(currentItem.retail)}
                          foodID={currentItem.foodID}
                          foodName={currentItem.foodName}
                          tableID={tableID}
                          handleAddToCart={handleAddToCart}
                          updateQuantity={updateQuantityInCardFood}
                          dataSource={dataSource}
                          added={isAddedMap[currentItem._id]}
                          updateIsAdded={updateIsAdded}
                          status={currentItem.status}
                        />
                      );
                    }
                  })
                ) : (
                  <>
                    <Loading></Loading>
                  </>
                )}
              </div>
            )}
            <div className="pagination" style={{ marginTop: "40px" }}>
              <Pagination
                style={{ textAlign: "right", marginTop: "10px" }}
                defaultCurrent={1}
                total={totalPages}
                pageSize={1}
                current={currentPage}
                onChange={paginate}
              />
            </div>
          </div>
        </Content>
        <Footer
          style={{
            textAlign: "center",
            position: "fixed",
            bottom: 0,
            width: "87%",
            display: "flex",
            gap: "20px",
            justifyContent: "flex-end",
            alignItems: "center",
            marginRight: "20px",
          }}
        >
          <div
            style={{ fontSize: "18px", border: "1px solid", padding: "8px" }}
            className="tableInfo"
          >
            Table {tableID}
          </div>
          <div className="shopping-cart">
            <Badge count={totalItemsInCart}>
              <ShoppingCartOutlined onClick={showDrawer} />
            </Badge>
          </div>
        </Footer>
      </Layout>
      <DrawerSummary
        onClose={onClose}
        open={open}
        dataSource={dataSource}
        updateIsAdded={updateIsAdded}
        fetchCartItems={fetchCartItems}
      />
    </Layout>
  );
};

export default MenuPage;
