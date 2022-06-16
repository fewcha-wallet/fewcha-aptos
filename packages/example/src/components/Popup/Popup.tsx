// Copyright 2022 Fewcha. All rights reserved.

import React, { PropsWithChildren } from "react";
import styled from "styled-components";
import cn from "../../services/cn";

const PopupStyle = styled.div`
  width: 320px;
`;

const Popup: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <PopupStyle
      className={cn(
        "inline-block align-bottom bg-white overflow-hidden",
        "shadow-xl transform transition-all sm:my-8 sm:align-middle",
        "rounded-lg",
        "w-full sm:max-w-lg",
        "px-6 py-4",
        "text-left",
        "z-50"
      )}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-headline"
    >
      {children}
    </PopupStyle>
  );
};

export default Popup;
