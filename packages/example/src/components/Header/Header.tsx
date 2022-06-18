// Copyright 2022 Fewcha. All rights reserved.

import React from "react";
import Web3, { Web3Provider } from "@fewcha/web3";

const Header: React.FC = () => {
  return (
    <div>
      <button
        onClick={() => {
          // https://github.com/aptos-labs/aip/issues
          const wallet = (window as any).aptos; // window.aptosWallet.fewcha, window.aptosWallet. // <--- fewcha, standard, which wallet <---- define, isFewchaWallet, is.... implement web3 provider to chooose ...etc...
          const provider = new Web3Provider(wallet); // <--- web3js
          const web3 = new Web3(provider); // <-- web3js

          web3.action.connect().then().catch(console.error);
          // web3.action.account();
          // web3.action; // <-- web3js support all aptos sdk

          // web3 react provider -> react provider <---
          // const {connect, address, balance} = useWeb3() // <- easy to get out | vue | angular
        }}
      >
        Connect
      </button>
    </div>
  );
};

// w3 -> html, css, ... standard <---  ERC, BIP, ...
// protocol

export default Header;
