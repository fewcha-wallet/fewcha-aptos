import React from "react";
import { ConnectWallet, useWeb3 } from "@fewcha/web3-react";

const Account = () => {
  const web3 = useWeb3();
  //const { account, balance, isConnected, disconnect, network, txs, sdk, token } = web3;
  const { account, balance, isConnected, disconnect, network } = web3;

  return (
    <div>
      <div>
        {isConnected ? (
          <div>
            <div>Address: {account.address}</div>
            <div>Balance: {balance || "0"}</div>
            <div>Network: {network}</div>
            <div
              onClick={() => {
                const receiverAddress = "0x788b3f37e8925b444fafa49becee9bd4489b1ef1a4005fdd6eac47e4e6d71531";
                const sendBalance = "1000";
                const payload = {
                  type: "entry_function_payload",
                  function: "0x1::Coin::transfer",
                  type_arguments: ["0x1::aptos_coin::AptosCoin"],
                  arguments: [receiverAddress, sendBalance],
                };
                // generateTransaction(payload).then((tx) => {
                //   console.log(tx);
                // });
              }}
            >
              gen tx
            </div>
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
