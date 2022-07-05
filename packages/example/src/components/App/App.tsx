import React from "react";
// import Web3Provider from "@fewcha/web3-react";
import Web3Provider from "components/Provider";
import Header from "components/Header/Header";
import { NFTs } from "components/NFT/NFT";

const App: React.FC = () => {
  return (
    <Web3Provider>
      <Header />
      <NFTs />
    </Web3Provider>
  );
};

export default App;
