import React from "react";
import { v4 as uuidv4 } from "uuid";
import { ConnectWallet, useWeb3 } from "@fewcha/web3-react";
import Web3 from "@fewcha/web3";
import "./App.css";

const Web3Raw = () => {
  const { account, balance, isConnected, network, fewcha, martian } = useWeb3();

  const web3 = new Web3();

  const parseError = (status: number): boolean => {
    switch (status) {
      case 200:
        return true;
      case 400:
        alert("bad request");
        return false;
      case 401:
        alert("User cancelled");
        return false;
      case 403:
        alert("Forbidden: please connect wallet");
        return false;
      case 404:
        alert("Not Found");
        return false;
      case 500:
        alert("Internal Server Error");
        return false;
      case 502:
        alert("Bad Gateway");
        return false;
      case 503:
        alert("Service Unavailable");
        return false;
      default:
        alert("Unknown Error");
        return false;
    }
  };

  return (
    <div>
      <div>
        {/* Common */}
        <div>Common</div>
        <button
          onClick={() => {
            web3.action
              .connect()
              .then((data) => parseError(data.status) && console.log(data))
              .catch(console.log)
              .finally(console.log);
          }}
        >
          Connnect
        </button>
        <button
          onClick={() => {
            web3.action
              .isConnected()
              .then((data) => parseError(data.status) && console.log(data))
              .catch(console.log)
              .finally(console.log);
          }}
        >
          IsConnnect
        </button>
        <button
          onClick={() => {
            web3.action
              .disconnect()
              .then((data) => parseError(data.status) && console.log(data))
              .catch(console.log)
              .finally(console.log);
          }}
        >
          Disconnect
        </button>
        <button
          onClick={() => {
            web3.action
              .account()
              .then((data) => parseError(data.status) && console.log(data))
              .catch(console.log)
              .finally(console.log);
          }}
        >
          Account
        </button>
        <button
          onClick={() => {
            web3.action
              .getNetwork()
              .then((data) => parseError(data.status) && console.log(data))
              .catch(console.log)
              .finally(console.log);
          }}
        >
          Get Network
        </button>
        <button
          onClick={() => {
            web3.action
              .getBalance()
              .then((data) => parseError(data.status) && console.log(data))
              .catch(console.log)
              .finally(console.log);
          }}
        >
          Get Balance
        </button>
        <button
          onClick={async () => {
            const receiverAddress = "0xcca3338dfda1b5e9bab0d744c3b50a9a24e3fe55bba48917307e813a4535e034";
            const sendBalance = "1000";
            const payload = {
              type: "script_function_payload",
              function: "0x1::coin::transfer",
              type_arguments: ["0x1::aptos_coin::AptosCoin"],
              arguments: [receiverAddress, sendBalance],
            };

            const txnRequest = await web3.action.generateTransaction(payload);
            if (!parseError(txnRequest.status)) {
              return;
            }
            const transactionEstRes = await web3.action.simulateTransaction(txnRequest.data);
            console.log(transactionEstRes, "loghelo");
            if (!parseError(transactionEstRes.status)) {
              return;
            }

            if (transactionEstRes.data.success) {
              console.log(transactionEstRes.data.gas_used, "gas_used");
            } else {
              console.log(transactionEstRes.data.vm_status, "vm_status");
            }

            const txnHash = await web3.action.signAndSubmitTransaction(txnRequest.data);
            if (!parseError(txnHash.status)) {
              return;
            }

            console.log(txnHash, "txnHash");
          }}
        >
          Sign and submit TX
        </button>
        <button
          onClick={async () => {
            const receiverAddress = "0xcca3338dfda1b5e9bab0d744c3b50a9a24e3fe55bba48917307e813a4535e034";
            const sendBalance = "1000";
            const payload = {
              type: "script_function_payload",
              function: "0x1::coin::transfer",
              type_arguments: ["0x1::aptos_coin::AptosCoin"],
              arguments: [receiverAddress, sendBalance],
            };

            const txnRequest = await web3.action.generateTransaction(payload);
            if (!parseError(txnRequest.status)) {
              return;
            }
            const transactionEstRes = await web3.action.simulateTransaction(txnRequest.data);
            if (!parseError(transactionEstRes.status)) {
              return;
            }

            if (transactionEstRes.data.success) {
              console.log(transactionEstRes.data.gas_used, "gas_used");
            } else {
              console.log(transactionEstRes.data.vm_status, "vm_status");
            }

            const txnHash = await web3.action.signTransaction(txnRequest.data);
            if (!parseError(txnHash.status)) {
              return;
            }

            console.log("tx", txnHash);
          }}
        >
          Sign TX
        </button>
        <button
          onClick={async () => {
            const signed = await web3.action.signMessage("longheo");
            console.log(signed);
          }}
        >
          Sign Message
        </button>
        <button
          onClick={async () => {
            const receiverAddress = "0xcca3338dfda1b5e9bab0d744c3b50a9a24e3fe55bba48917307e813a4535e034";
            const sendBalance = "1000";
            const payload = {
              type: "script_function_payload",
              function: "0x1::coin::transfer",
              type_arguments: ["0x1::aptos_coin::AptosCoin"],
              arguments: [receiverAddress, sendBalance],
            };

            const txnRequest = await web3.action.generateTransaction(payload);
            if (!parseError(txnRequest.status)) {
              return;
            }
            const transactionEstRes = await web3.action.simulateTransaction(txnRequest.data);
            if (!parseError(transactionEstRes.status)) {
              return;
            }

            if (transactionEstRes.data.success) {
              console.log(transactionEstRes.data.gas_used, "gas_used");
            } else {
              console.log(transactionEstRes.data.vm_status, "vm_status");
            }

            const tx = await web3.action.signTransaction(txnRequest.data);
            if (!parseError(tx.status)) {
              return;
            }

            const txnHash = await web3.action.submitTransaction(tx.data);

            if (!parseError(txnHash.status)) {
              return;
            }

            console.log("tx", txnHash);
          }}
        >
          Submit TX
        </button>
      </div>
      <div>
        <div>Token</div>
        <button
          onClick={async () => {
            const id = uuidv4();
            const txnHash = await web3.action.token.createCollection(`fewcha try ${id}`, `fewcha try ${id} desc`, "https://fewcha.app/svgs/logo.svg");
            if (!parseError(txnHash.status)) {
              return;
            }

            console.log(txnHash.data, "txnHash");
          }}
        >
          Create Collection
        </button>
        <button
          onClick={async () => {
            const id = uuidv4();
            const txnHash = await web3.action.token.createToken("fewcha try 2703a9d1-402b-4014-9b1d-a6a9e792aecf", `nft ${id}`, `fewcha try ${id} desc`, 1000, "https://fewcha.app/svgs/logo.svg", 1);
            if (!parseError(txnHash.status)) {
              return;
            }

            console.log(txnHash.data, "txnHash");
          }}
        >
          Create Token
        </button>
        <button
          onClick={async () => {
            console.log(web3.action.token);
            const txnHash = await web3.action.token.offerToken("0xcca3338dfda1b5e9bab0d744c3b50a9a24e3fe55bba48917307e813a4535e034", "0x20364f4121f608f2a09830bc0ab6980fdccff45c2f5df6c41c17f40e511fe80e", `fewcha try 2703a9d1-402b-4014-9b1d-a6a9e792aecf`, `nft 59e4b6ad-9c05-4aa9-8d6d-efc0b55ee4d0`, 1);
            if (!parseError(txnHash.status)) {
              return;
            }

            console.log(txnHash.data, "txnHash");
          }}
        >
          Offer Token
        </button>
        <button
          onClick={async () => {
            console.log(web3.action.token);
            const txnHash = await web3.action.token.claimToken("0xcca3338dfda1b5e9bab0d744c3b50a9a24e3fe55bba48917307e813a4535e034", "0x20364f4121f608f2a09830bc0ab6980fdccff45c2f5df6c41c17f40e511fe80e", `fewcha try 2703a9d1-402b-4014-9b1d-a6a9e792aecf`, `nft 59e4b6ad-9c05-4aa9-8d6d-efc0b55ee4d0`);
            if (!parseError(txnHash.status)) {
              return;
            }

            console.log(txnHash.data, "txnHash");
          }}
        >
          Claim Token
        </button>
        <button
          onClick={async () => {
            console.log(web3.action.token);
            const txnHash = await web3.action.token.cancelTokenOffer("0xcca3338dfda1b5e9bab0d744c3b50a9a24e3fe55bba48917307e813a4535e034", "0x20364f4121f608f2a09830bc0ab6980fdccff45c2f5df6c41c17f40e511fe80e", `fewcha try 2703a9d1-402b-4014-9b1d-a6a9e792aecf`, `nft 59e4b6ad-9c05-4aa9-8d6d-efc0b55ee4d0`);
            if (!parseError(txnHash.status)) {
              return;
            }

            console.log(txnHash.data, "txnHash");
          }}
        >
          Cancel Token Offer
        </button>
      </div>
      {/* SDK Get functions */}
      <div>
        <div>SDK Get functions</div>
        <button
          onClick={() => {
            web3.action.sdk
              .getAccount("0x20364f4121f608f2a09830bc0ab6980fdccff45c2f5df6c41c17f40e511fe80e")
              .then((data) => parseError(data.status) && console.log(data))
              .catch(console.log)
              .finally(console.log);
          }}
        >
          Get Account
        </button>
        <button
          onClick={() => {
            web3.action.sdk
              .getAccountTransactions("0x20364f4121f608f2a09830bc0ab6980fdccff45c2f5df6c41c17f40e511fe80e")
              .then((data) => parseError(data.status) && console.log(data))
              .catch(console.log)
              .finally(console.log);
          }}
        >
          Get Account Transactions
        </button>
        <button
          onClick={() => {
            web3.action.sdk
              .getAccountModules("0x20364f4121f608f2a09830bc0ab6980fdccff45c2f5df6c41c17f40e511fe80e")
              .then((data) => parseError(data.status) && console.log(data))
              .catch(console.log)
              .finally(console.log);
          }}
        >
          Get Account Modules
        </button>
        <button
          onClick={() => {
            web3.action.sdk
              .getAccountModule("0x20364f4121f608f2a09830bc0ab6980fdccff45c2f5df6c41c17f40e511fe80e", "test")
              .then((data) => parseError(data.status) && console.log(data))
              .catch(console.log)
              .finally(console.log);
          }}
        >
          Get Account Module: test
        </button>
        <button
          onClick={() => {
            web3.action.sdk
              .getAccountResources("0x20364f4121f608f2a09830bc0ab6980fdccff45c2f5df6c41c17f40e511fe80e")
              .then((data) => parseError(data.status) && console.log(data))
              .catch(console.log)
              .finally(console.log);
          }}
        >
          Get Account Resources
        </button>
        <button
          onClick={() => {
            web3.action.sdk
              .getTransactions()
              .then((data) => parseError(data.status) && console.log(data))
              .catch(console.log)
              .finally(console.log);
          }}
        >
          Get Transsactions
        </button>
        <button
          onClick={() => {
            web3.action.sdk
              .getChainId()
              .then((data) => parseError(data.status) && console.log(data))
              .catch(console.log)
              .finally(console.log);
          }}
        >
          Get Chain Id
        </button>
      </div>
      {/* Coin */}
      <div>
        <div>Coin</div>
        <button
          onClick={async () => {
            const txnHash = await web3.action.coin.initializeCoin("moon_coin::MoonCoin", "Fewcha1", "FWC", "18");
            if (!parseError(txnHash.status)) {
              return;
            }

            console.log(txnHash.data, "initializeCoin");
          }}
        >
          Initialize coin
        </button>
        <button
          onClick={async () => {
            const txnHash = await web3.action.coin.registerCoin("0x1::moon_coin::MoonCoin");
            if (!parseError(txnHash.status)) {
              return;
            }

            console.log(txnHash.data, "initializeCoin");
          }}
        >
          Register coin
        </button>
        <button
          onClick={async () => {
            const txnHash = await web3.action.coin.mintCoin("0x1::aptos_coin::AptosCoin", "0x20364f4121f608f2a09830bc0ab6980fdccff45c2f5df6c41c17f40e511fe80e", 100);
            if (!parseError(txnHash.status)) {
              return;
            }

            console.log(txnHash.data, "mintCoin");
          }}
        >
          Mint coin
        </button>
        <button
          onClick={async () => {
            const transfer = await web3.action.coin.transferCoin("0x1::aptos_coin::AptosCoin", "0x20364f4121f608f2a09830bc0ab6980fdccff45c2f5df6c41c17f40e511fe80e", 1);
            if (!parseError(transfer.status)) {
              return;
            }

            console.log(transfer.data, "transfer");
          }}
        >
          Transfer coin
        </button>
        <button
          onClick={async () => {
            const coinData = await web3.action.coin.getCoinData("0x1::aptos_coin::AptosCoin");
            if (!parseError(coinData.status)) {
              return;
            }

            console.log(coinData.data, "coinData");
          }}
        >
          Get coin data
        </button>
        <button
          onClick={async () => {
            const balance = await web3.action.coin.getCoinBalance("0x20364f4121f608f2a09830bc0ab6980fdccff45c2f5df6c41c17f40e511fe80e", "0x1::aptos_coin::AptosCoin");
            if (!parseError(balance.status)) {
              return;
            }

            console.log(balance.data, "balance");
          }}
        >
          Get coin balance
        </button>
        <button
          onClick={async () => {
            const coins = await web3.action.coin.getCoins("0x20364f4121f608f2a09830bc0ab6980fdccff45c2f5df6c41c17f40e511fe80e");
            if (!parseError(coins.status)) {
              return;
            }

            console.log(coins.data, "coins");
          }}
        >
          Get coins
        </button>
      </div>
      <div>
        {isConnected ? (
          <div>
            <div>Address: {account.address}</div>
            <div>Balance: {balance || "0"}</div>
            <div>Network: {network}</div>
            <div>Connect: </div>
            <button
            // onClick={() => {
            //   web3.signMessage("hello world").then((data) => {
            //     setSigned(data);
            //   });
            // }}
            >
              Sign
            </button>
            <button
            // onClick={() => {
            //   web3.sdk
            //     .getTransaction("0xea2bc550356432d3e2ff23f12a859e5c5824aa61e469da9fe02539beabc55490")
            //     .then((data) => console.log(data, "longheo"))
            //     .catch((e) => console.log("error longheo", e));
            //   (web3.submitTransaction as any)();
            // }}
            >
              tx
            </button>

            {/* <div>
              <button
                onClick={() => {
                  disconnect();
                }}
              >
                Disconnect
              </button>
            </div> */}
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
        <Web3Raw />
      </header>
    </>
  );
};

export default App;
