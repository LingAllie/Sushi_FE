import { createContext, useContext, useState, useEffect } from "react";
import authService from "../services/authService";
import tokenMethod from "../utils/token";
import { message } from "antd";

const AuthContext = createContext({});
const AuthContextProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [profile, setProfile] = useState(null);
  const [roleUser, setRoleUser] = useState(null);
  const handleLogin = async (loginData, callback) => {
    try {
      const res = await authService.login(loginData);
      const {
        token: { accessToken, refreshToken },
      } = res?.data || {};
      const role = res?.data?.role;
      tokenMethod.set({ accessToken, refreshToken });
      if (!!tokenMethod) {
        message.success("Login successful");
        setIsLogged(true);
        setRoleUser(role);
        handleGetProfile();
        return true;
      }
    } catch (error) {
      message.error("Login failed");
      return false;
    } finally {
      callback?.();
    }
  };
  const handleGetProfile = async () => {
    try {
      const res = await authService.getProfile();
      if (res?.data) {
        setProfile(res.data);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };
  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập sau khi tải lại trang
    if (!!tokenMethod.get()) {
      setIsLogged(true);
      handleGetProfile();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isLogged, profile, roleUser, handleLogin }}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContextProvider;
export const useAuthContext = () => useContext(AuthContext);
