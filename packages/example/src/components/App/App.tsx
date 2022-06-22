import React from "react";
import Web3Provider from "components/Provider/Provider";
import Header2 from "components/Header/Header2";
import { Fragment } from "react";
import { NFTs } from "components/NFT/NFT";

const App: React.FC = () => {
  return (
    <Web3Provider>
      <Fragment>
        <Header2 />
        <NFTs />
      </Fragment>
    </Web3Provider>
  );
};

export default App;
