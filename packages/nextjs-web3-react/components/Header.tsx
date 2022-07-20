import React from "react";
import { ConnectWallet, useWeb3 } from "@fewcha/web3-react";

const Account = () => {
  const web3 = useWeb3();
  const { account, balance, isConnected, disconnect, network, txs, sdk, token } = web3;

  return (
    <div>
      <div>
        {isConnected ? (
          <div>
            <div>Address: {account.address}</div>
            <div>Balance: {balance || "0"}</div>
            <div>Network: {network}</div>
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

export default Account;
