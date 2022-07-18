import React from "react";
import { useWeb3 } from "@fewcha/web3-react";

const Account = () => {
  const web3 = useWeb3();
  const { init, account, balance, isConnected, connect, disconnect, network, txs, sdk, token } = web3;

  if (!init) return <div></div>;

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
          <div>
            <button
              onClick={() => {
                connect();
              }}
            >
              Connect
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Account;
