// Copyright 2022 Fewcha. All rights reserved.

import React, { useEffect, useState } from "react";
import Web3, { Web3Provider } from "@fewcha/web3";

const Header: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInit, setIsInit] = useState(false);
  const [network, setNetwork] = useState("");

  useEffect(() => {
    setTimeout(async () => {
      const wallet = (window as any).aptos;
      const provider = new Web3Provider(wallet);
      const web3 = new Web3(provider);

      const isConnected = await web3.action.isConnected();
      const network = await web3.action.getNodeURL();

      setIsLoggedIn(isConnected);
      setNetwork(network);
      setIsInit(true);
    }, 200);
  }, []);

  if (!isInit) {
    return <>Loading...</>;
  }

  return (
    <div>
      <div>{isLoggedIn ? "logged" : "not logged"}</div>
      <div>{network}</div>
      {!isLoggedIn ? (
        <div>
          <button
            onClick={async () => {
              // https://github.com/aptos-labs/aip/issues need define standard -> select on which wallet
              const wallet = (window as any).aptos; // window.aptosWallet.fewcha, window.aptosWallet.martian, window.aptosWallet. // <--- fewcha, need define standard, which wallet <---- define, isFewchaWallet, is.... implement web3 provider to chooose ...etc...
              const provider = new Web3Provider(wallet); // <--- web3js
              const web3 = new Web3(provider); // <-- web3js

              await web3.action.connect();

              setTimeout(async () => {
                const isConnected = await web3.action.isConnected();
                const network = await web3.action.getNodeURL();

                setIsLoggedIn(isConnected);
                setNetwork(network);
              }, 2000);
            }}
          >
            Connect
          </button>
        </div>
      ) : (
        <button
          onClick={async () => {
            const wallet = (window as any).aptos;
            const provider = new Web3Provider(wallet);
            const web3 = new Web3(provider);

            await web3.action.disconnect();

            setTimeout(async () => {
              const isConnected = await web3.action.isConnected();
              const network = await web3.action.getNodeURL();

              setIsLoggedIn(isConnected);
              setNetwork(network);
            }, 2000);
          }}
        >
          Disconnect
        </button>
      )}
    </div>
  );
};

export default Header;
