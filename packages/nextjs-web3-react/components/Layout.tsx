import React from "react";
import dynamic from "next/dynamic";

// https://nextjs.org/docs/advanced-features/dynamic-import#with-no-ssr
const Web3Provider = dynamic(() => import("@fewcha/web3-react"), { ssr: false });

const Layout: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  return <Web3Provider>{children}</Web3Provider>;
};

export default Layout;
