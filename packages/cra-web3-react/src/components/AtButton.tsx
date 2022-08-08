import React from "react";

const AtButton: React.FC<any> = ({ children, className, ...props }) => {
  return (
    <button className={`button ${className}`} {...props}>
      {children}
    </button>
  );
};

export default AtButton;
