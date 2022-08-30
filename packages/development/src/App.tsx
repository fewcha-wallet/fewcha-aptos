import React from "react";
import { v4 as uuidv4 } from "uuid";
import { BCS, TxnBuilderTypes } from "aptos";
import Web3 from "@fewcha/web3";
import { parseError } from "./utils";

const Web3Js = () => {
  const web3 = new Web3((window as any).fewcha);
  console.log(web3.action);
  return (
    <div>
      {/* Common */}
      <div>
        <div>Common</div>
        <button
          onClick={async () => {
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
          onClick={async () => {
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
          onClick={async () => {
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
          onClick={async () => {
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
          onClick={async () => {
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
          onClick={async () => {
            web3.action
              .getBalance()
              .then((data) => parseError(data.status) && console.log(data))
              .catch(console.log)
              .finally(console.log);
          }}
        >
          Get Balance
        </button>
      </div>

      {/* Transaction */}
      <div>
        <div>Transaction</div>

        <button
          onClick={async () => {
            const receiverAddress = "0xcca3338dfda1b5e9bab0d744c3b50a9a24e3fe55bba48917307e813a4535e034";
            const sendBalance = 1000;

            const payload = {
              type: "entry_function_payload",
              function: "0x1::coin::transfer",
              type_arguments: ["0x1::aptos_coin::AptosCoin"],
              arguments: [receiverAddress, sendBalance],
            };

            const txnRequest = await web3.action.generateTransaction(payload);
            if (!parseError(txnRequest.status)) return;

            console.log("txnRequest", txnRequest);
          }}
        >
          Generate Transaction
        </button>

        <button
          onClick={async () => {
            const receiverAddress = TxnBuilderTypes.AccountAddress.fromHex(
              "0xcca3338dfda1b5e9bab0d744c3b50a9a24e3fe55bba48917307e813a4535e034",
            );
            const sendBalance = 1000;

            const token = new TxnBuilderTypes.TypeTagStruct(
              TxnBuilderTypes.StructTag.fromString("0x1::aptos_coin::AptosCoin"),
            );
            const entryFunctionPayload = new TxnBuilderTypes.TransactionPayloadEntryFunction(
              TxnBuilderTypes.EntryFunction.natural(
                "0x1::coin",
                "transfer",
                [token],
                [BCS.bcsToBytes(receiverAddress), BCS.bcsSerializeUint64(sendBalance)],
              ),
            );

            const s = new BCS.Serializer();
            entryFunctionPayload.serialize(s);

            const rawTxn = await web3.action.generateRawTransaction(s.getBytes());

            console.log(rawTxn);
          }}
        >
          Generate Raw Transaction
        </button>

        <button
          onClick={async () => {
            const receiverAddress = TxnBuilderTypes.AccountAddress.fromHex(
              "0xcca3338dfda1b5e9bab0d744c3b50a9a24e3fe55bba48917307e813a4535e034",
            );
            const sendBalance = 1000;

            const token = new TxnBuilderTypes.TypeTagStruct(
              TxnBuilderTypes.StructTag.fromString("0x1::aptos_coin::AptosCoin"),
            );
            const entryFunctionPayload = new TxnBuilderTypes.TransactionPayloadEntryFunction(
              TxnBuilderTypes.EntryFunction.natural(
                "0x1::coin",
                "transfer",
                [token],
                [BCS.bcsToBytes(receiverAddress), BCS.bcsSerializeUint64(sendBalance)],
              ),
            );

            const s = new BCS.Serializer();
            entryFunctionPayload.serialize(s);

            const rawTxn = await web3.action.generateRawTransaction(s.getBytes());
            if (!parseError(rawTxn.status)) return;

            const bcsTxn = await web3.action.generateBCSTransaction(rawTxn.data);

            console.log(bcsTxn);
          }}
        >
          Generate BCS Transaction
        </button>

        <button
          onClick={async () => {
            const receiverAddress = "0xcca3338dfda1b5e9bab0d744c3b50a9a24e3fe55bba48917307e813a4535e034";
            const sendBalance = 1000;

            const payload = {
              type: "entry_function_payload",
              function: "0x1::coin::transfer",
              type_arguments: ["0x1::aptos_coin::AptosCoin"],
              arguments: [receiverAddress, sendBalance],
            };

            const txnRequest = await web3.action.generateTransaction(payload);
            if (!parseError(txnRequest.status)) return;

            const siTx = await web3.action.simulateTransaction(txnRequest.data);
            if (!parseError(siTx.status)) return;

            console.log("siTx", siTx);
          }}
        >
          Simulate Transaction
        </button>

        <button
          onClick={async () => {
            const receiverAddress = "0xcca3338dfda1b5e9bab0d744c3b50a9a24e3fe55bba48917307e813a4535e034";
            const sendBalance = 1000;

            const payload = {
              type: "entry_function_payload",
              function: "0x1::coin::transfer",
              type_arguments: ["0x1::aptos_coin::AptosCoin"],
              arguments: [receiverAddress, sendBalance],
            };

            const txnRequest = await web3.action.generateTransaction(payload);
            const signedTx = await web3.action.signTransaction(txnRequest.data);
            if (!parseError(signedTx.status)) {
              return;
            }

            console.log("signedTx", signedTx);
          }}
        >
          Sign Transaction
        </button>

        <button
          onClick={async () => {
            const receiverAddress = TxnBuilderTypes.AccountAddress.fromHex(
              "0xcca3338dfda1b5e9bab0d744c3b50a9a24e3fe55bba48917307e813a4535e034",
            );
            const sendBalance = 1000;

            const token = new TxnBuilderTypes.TypeTagStruct(
              TxnBuilderTypes.StructTag.fromString("0x1::aptos_coin::AptosCoin"),
            );
            const entryFunctionPayload = new TxnBuilderTypes.TransactionPayloadEntryFunction(
              TxnBuilderTypes.EntryFunction.natural(
                "0x1::coin",
                "transfer",
                [token],
                [BCS.bcsToBytes(receiverAddress), BCS.bcsSerializeUint64(sendBalance)],
              ),
            );

            const s = new BCS.Serializer();
            entryFunctionPayload.serialize(s);

            const rawTxn = await web3.action.generateRawTransaction(s.getBytes());
            if (!parseError(rawTxn.status)) return;

            const bcsTxn = await web3.action.generateBCSTransaction(rawTxn.data);
            if (!parseError(bcsTxn.status)) return;

            const signedTx = await web3.action.signTransaction(bcsTxn.data);
            if (!parseError(signedTx.status)) return;

            console.log("signedTx", signedTx);
          }}
        >
          Sign BCS Transaction
        </button>

        <br />

        <button
          onClick={async () => {
            const receiverAddress = "0xcca3338dfda1b5e9bab0d744c3b50a9a24e3fe55bba48917307e813a4535e034";
            const sendBalance = 1000;

            const payload = {
              type: "entry_function_payload",
              function: "0x1::coin::transfer",
              type_arguments: ["0x1::aptos_coin::AptosCoin"],
              arguments: [receiverAddress, sendBalance],
            };

            const txnRequest = await web3.action.generateTransaction(payload);
            if (!parseError(txnRequest.status)) return;

            const signedTx = await web3.action.signTransaction(txnRequest.data);
            if (!parseError(signedTx.status)) return;

            const txnHash = await web3.action.submitTransaction(signedTx.data);
            if (!parseError(txnHash.status)) return;

            console.log("tx", txnHash);
          }}
        >
          Submit Transaction
        </button>

        <button
          onClick={async () => {
            const receiverAddress = TxnBuilderTypes.AccountAddress.fromHex(
              "0xcca3338dfda1b5e9bab0d744c3b50a9a24e3fe55bba48917307e813a4535e034",
            );
            const sendBalance = 1000;

            const token = new TxnBuilderTypes.TypeTagStruct(
              TxnBuilderTypes.StructTag.fromString("0x1::aptos_coin::AptosCoin"),
            );
            const entryFunctionPayload = new TxnBuilderTypes.TransactionPayloadEntryFunction(
              TxnBuilderTypes.EntryFunction.natural(
                "0x1::coin",
                "transfer",
                [token],
                [BCS.bcsToBytes(receiverAddress), BCS.bcsSerializeUint64(sendBalance)],
              ),
            );

            const s = new BCS.Serializer();
            entryFunctionPayload.serialize(s);

            const rawTxn = await web3.action.generateRawTransaction(s.getBytes());
            if (!parseError(rawTxn.status)) return;

            const bcsTxn = await web3.action.generateBCSTransaction(rawTxn.data);
            if (!parseError(bcsTxn.status)) return;

            const signedTx = await web3.action.signTransaction(bcsTxn.data);
            if (!parseError(signedTx.status)) return;

            const txnHash = await web3.action.submitTransaction(signedTx.data);
            if (!parseError(txnHash.status)) return;

            console.log("tx", txnHash);
          }}
        >
          Submit BCS Transaction
        </button>

        <button
          onClick={async () => {
            const receiverAddress = "0xcca3338dfda1b5e9bab0d744c3b50a9a24e3fe55bba48917307e813a4535e034";
            const sendBalance = 1000;

            const payload = {
              type: "entry_function_payload",
              function: "0x1::coin::transfer",
              type_arguments: ["0x1::aptos_coin::AptosCoin"],
              arguments: [receiverAddress, sendBalance],
            };

            const txnRequest = await web3.action.generateTransaction(payload);
            if (!parseError(txnRequest.status)) return;

            const txnHash = await web3.action.signAndSubmitTransaction(txnRequest.data);
            if (!parseError(txnHash.status)) return;

            console.log("txnHash", txnHash);
          }}
        >
          Sign and Submit Transaction
        </button>

        <button
          onClick={async () => {
            const receiverAddress = "0xcca3338dfda1b5e9bab0d744c3b50a9a24e3fe55bba48917307e813a4535e034";
            const sendBalance = 1000;

            const payload = {
              type: "entry_function_payload",
              function: "0x1::coin::transfer",
              type_arguments: ["0x1::aptos_coin::AptosCoin"],
              arguments: [receiverAddress, sendBalance],
            };

            const txnRequest = await web3.action.generateTransaction(payload);
            if (!parseError(txnRequest.status)) return;

            const estTx = await web3.action.simulateTransaction(txnRequest.data);
            if (!parseError(estTx.status)) return;

            const estTx1 = estTx.data[0];

            if (estTx1.success) {
              console.log(estTx1.gas_used, "gas_used");
            } else {
              console.log(estTx1.vm_status, "vm_status");
            }

            const tx = await web3.action.signTransaction(txnRequest.data);
            if (!parseError(tx.status)) return;

            const txnHash = await web3.action.submitTransaction(tx.data);
            if (!parseError(txnHash.status)) return;

            console.log("tx", txnHash);
          }}
        >
          Full Flow Transaction
        </button>

        <button
          onClick={async () => {
            const signed = await web3.action.signMessage("random message");
            console.log(signed);
          }}
        >
          Sign Message
        </button>
      </div>

      {/* Token */}
      <div>
        <div>Token</div>
        <button
          onClick={async () => {
            const id = uuidv4();
            const txnHash = await web3.action.token.createCollection(
              `fewcha try ${id}`,
              `fewcha try ${id} desc`,
              "https://fewcha.app/svgs/logo.svg",
            );
            if (!parseError(txnHash.status)) {
              return;
            }

            //console.log(txnHash.data, "txnHash");
          }}
        >
          Create Collection
        </button>

        <button
          onClick={async () => {
            const id = uuidv4();
            const txnHash = await web3.action.token.createToken(
              "fewcha try 180fb0f4-aadf-49ba-bfa9-571f1b69be58",
              `nft ${id}`,
              `fewcha try ${id} desc`,
              1,
              "https://fewcha.app/svgs/logo.svg",
              1,
            );
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
            const txnHash = await web3.action.token.offerToken(
              "0xcca3338dfda1b5e9bab0d744c3b50a9a24e3fe55bba48917307e813a4535e034",
              "0x20364f4121f608f2a09830bc0ab6980fdccff45c2f5df6c41c17f40e511fe80e",
              `fewcha try 180fb0f4-aadf-49ba-bfa9-571f1b69be58`,
              `nft 32182451-9852-4425-9d70-b76534b8672f`,
              1,
            );
            if (!parseError(txnHash.status)) return;

            console.log(txnHash.data, "txnHash");
          }}
        >
          Offer Token
        </button>

        <button
          onClick={async () => {
            console.log(web3.action.token);
            const txnHash = await web3.action.token.claimToken(
              "0xcca3338dfda1b5e9bab0d744c3b50a9a24e3fe55bba48917307e813a4535e034",
              "0x20364f4121f608f2a09830bc0ab6980fdccff45c2f5df6c41c17f40e511fe80e",
              `fewcha try 180fb0f4-aadf-49ba-bfa9-571f1b69be58`,
              `nft 32182451-9852-4425-9d70-b76534b8672f`,
            );
            if (!parseError(txnHash.status)) return;

            console.log(txnHash.data, "txnHash");
          }}
        >
          Claim Token
        </button>

        <button
          onClick={async () => {
            console.log(web3.action.token);
            const txnHash = await web3.action.token.cancelTokenOffer(
              "0xcca3338dfda1b5e9bab0d744c3b50a9a24e3fe55bba48917307e813a4535e034",
              "0x20364f4121f608f2a09830bc0ab6980fdccff45c2f5df6c41c17f40e511fe80e",
              `fewcha try 180fb0f4-aadf-49ba-bfa9-571f1b69be58`,
              `nft 32182451-9852-4425-9d70-b76534b8672f`,
            );

            if (!parseError(txnHash.status)) return;

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
            const txnHash = await web3.action.fewchaCoin.initializeCoin("moon_coin::MoonCoin", "Fewcha1", "FWC", "18");
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
            const txnHash = await web3.action.fewchaCoin.registerCoin("0x1::moon_coin::MoonCoin");
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
            const txnHash = await web3.action.fewchaCoin.mintCoin(
              "0x1::aptos_coin::AptosCoin",
              "0x20364f4121f608f2a09830bc0ab6980fdccff45c2f5df6c41c17f40e511fe80e",
              100,
            );
            if (!parseError(txnHash.status)) return;

            console.log(txnHash.data, "mintCoin");
          }}
        >
          Mint coin
        </button>
        <button
          onClick={async () => {
            const transfer = await web3.action.fewchaCoin.transferCoin(
              "0x1::aptos_coin::AptosCoin",
              "0x20364f4121f608f2a09830bc0ab6980fdccff45c2f5df6c41c17f40e511fe80e",
              1,
            );
            if (!parseError(transfer.status)) return;

            console.log(transfer.data, "transfer");
          }}
        >
          Transfer coin
        </button>
        <button
          onClick={async () => {
            const coinData = await web3.action.fewchaCoin.getCoinData("0x1::aptos_coin::AptosCoin");
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
            const balance = await web3.action.fewchaCoin.getCoinBalance(
              "0x20364f4121f608f2a09830bc0ab6980fdccff45c2f5df6c41c17f40e511fe80e",
              "0x1::aptos_coin::AptosCoin",
            );
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
            const coins = await web3.action.fewchaCoin.getCoins(
              "0x20364f4121f608f2a09830bc0ab6980fdccff45c2f5df6c41c17f40e511fe80e",
            );
            if (!parseError(coins.status)) {
              return;
            }

            console.log(coins.data, "coins");
          }}
        >
          Get coins
        </button>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return <Web3Js />;
};

export default App;
