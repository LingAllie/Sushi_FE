import React from "react";
import { forwardRef } from "react";
export const InputR = (
  { placeholder, image, error, type = "", name = "", ...inputProps },
  ref
) => {
  return (
    <div className="inputgroup">
      <input
        ref={ref}
        className={`form-control ${error ? "input-error" : ""}`}
        type={type}
        name={name}
        id={name}
        placeholder={placeholder}
        {...inputProps}
      />
      <i className="icon-user">
        <img src={image} alt />
      </i>
      <p className="form-error" style={{ minHeight: 23 }}>
        {error || ""}
      </p>
    </div>
  );
};

export const Input = forwardRef(InputR);
