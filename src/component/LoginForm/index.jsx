import React, { useState } from "react";
import Button from "../Button";
import { Input } from "../Input";
import { MESSAGE } from "../../utils/validate";
import { useForm } from "react-hook-form";
import { useAuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../constants/path";
const LoginForm = () => {
  const { handleLogin } = useAuthContext();
  const [loginData, setLoginData] = useState({ name: "", password: "" });
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    try {
      const loginData = await handleLogin(data);
      if (!!loginData) {
        navigate(PATHS.TABLE);
      }
    } catch (error) {
      console.log("Login error:", error);
    }
  };
  return (
    <div className="loginpage__wrapper">
      <div className="loginpage__wrapper-form">
        <div className="logo">
          <img src="/public/assets/images/Logo1.png" alt="" />
        </div>
        <div className="textbox">
          <h1 className="title">Welcome to Scogem!</h1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="form" method="post">
          <Input
            name="name"
            placeholder="Username"
            image="/assets/images/user-login.svg"
            {...register("name", {
              required: MESSAGE.required,
            })}
            error={errors?.name?.message || ""}
          />
          <Input
            type="password"
            name="password"
            placeholder="Password"
            image="/assets/images/pass-login.svg"
            {...register("password", {
              required: MESSAGE.required,
            })}
            error={errors?.password?.message || ""}
          />
          <div className="btn">
            <Button type="submit" className="btn-text">
              <span>Log in</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
