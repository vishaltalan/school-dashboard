// Reusable Button component
import React from "react";

const Button = ({ children, onClick, style = {}, className = "btn", type = "button", ...props }) => (
  <button
    type={type}
    className={className}
    style={style}
    onClick={onClick}
    {...props}
  >
    {children}
  </button>
);

export default Button;
