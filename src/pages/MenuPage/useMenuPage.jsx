import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import useQuery from "../../hooks/useQuery";
import menuService from "../../services/menuService";

const useMenuPage = () => {
  const { search } = useLocation();

  const {
    data: menuData,
    loading: menuLoading,
    errorData: menuError,
    refetch: menuRefetch,
  } = useQuery(menuService.getMenu);
  const menus = menuData?.data || [];
  const menuProps = {
    isLoading: menuLoading,
    isError: menuError,
    menus,
  };
  useEffect(() => {
    menuRefetch(search);
  }, [search]);
  return { menuProps };
};

export default useMenuPage;
