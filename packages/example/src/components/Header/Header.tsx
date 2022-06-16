// Copyright 2022 Fewcha. All rights reserved.

import React from "react";
import Web3, { Web3Provider } from "@fewcha/web3";

const Header: React.FC = () => {
  return (
    <div>
      <button
        onClick={() => {
          const wallet = (window as any).aptos;
          const provider = new Web3Provider(wallet);
          const web3 = new Web3(provider);

          web3.action.connect().then(console.log).catch(console.error);
        }}
      >
        Connect
      </button>
    </div>
  );
};

export default Header;
