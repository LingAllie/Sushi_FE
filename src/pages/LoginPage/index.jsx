import React from "react";
import LoginForm from "../../component/LoginForm";
import AuthContextProvider from "../../context/AuthContext";

const LoginPage = () => {
  return (
    <AuthContextProvider>
      <div className="loginpage">
        <LoginForm />
      </div>
    </AuthContextProvider>
  );
};

export default LoginPage;
