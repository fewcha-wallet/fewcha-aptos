import React from "react";
import Web3Provider from "@fewcha/web3-react";

const Layout: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  return <Web3Provider>{children}</Web3Provider>;
};

export default Layout;
