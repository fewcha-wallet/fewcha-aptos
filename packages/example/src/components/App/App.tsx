import React from "react";
// import Web3Provider from "@fewcha/web3-react";
import Web3Provider from "components/Provider/Provider";
import Header from "components/Header/Header";

const App: React.FC = () => {
  return (
    <Web3Provider>
      <Header />
    </Web3Provider>
  );
};

export default App;
