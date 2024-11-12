import React from "react";
import { Link } from "react-router-dom";

const Button = ({ children, link, className, disable, type, ...rest }) => {
  if (!!link) {
    return (
      <Link to={link} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} className={`${className || ""}`} {...rest}>
      {children}
    </button>
  );
};

export default Button;
