import React from "react";
import { ConnectWallet, useWeb3 } from "@fewcha/web3-react";
import "./App.css";

const Account = () => {
  const aptos = useWeb3();
  const [signed, setSigned] = React.useState("");
  const { account, balance, isConnected, disconnect, network, web3 } = aptos;

  return (
    <div>
      <div>
        {isConnected ? (
          <div>
            <div>Address: {account.address}</div>
            <div>Balance: {balance || "0"}</div>
            <div>Network: {network}</div>
            <div>Signed: {signed}</div>
            <button
              onClick={() => {
                web3.signMessage("hello world").then((data) => {
                  setSigned(data);
                });
              }}
            >
              Sign
            </button>
            <button
              onClick={() => {
                web3.sdk
                  .getTransaction("0xea2bc550356432d3e2ff23f12a859e5c5824aa61e469da9fe02539beabc55490")
                  .then((data) => console.log(data, "longheo"))
                  .catch((e) => console.log("error longheo", e));
                (web3.submitTransaction as any)();
              }}
            >
              tx
            </button>

            <div>
              <button
                onClick={() => {
                  disconnect();
                }}
              >
                Disconnect
              </button>
            </div>
          </div>
        ) : (
          <ConnectWallet type="list" />
        )}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <>
      <header>
        <Account />
      </header>
    </>
  );
};

export default App;
