import React from "react";
import { v4 as uuidv4 } from "uuid";
import { BCS, TxnBuilderTypes, Types } from "aptos";
import Web3, { IWeb3AptosToken } from "@fewcha/web3";
import { parseError } from "./utils";

const Web3Js = () => {
  const provider = (window as any).aptos;
  // const provider = (window as any).martian;

  const web3 = new Web3(provider);
  return (
    <div>
      <h1>Common</h1>
      <div className="grid">
        <button
          onClick={async () => {
            web3.action
              .connect()
              .then((data) => parseError(data.status) && alert(data))
              .catch(alert);
          }}
        >
          Connnect
        </button>

        <button
          onClick={async () => {
            web3.action
              .isConnected()
              .then((data) => parseError(data.status) && alert(data))
              .catch((err) => alert(err));
          }}
        >
          IsConnnect
        </button>

        <button
          onClick={async () => {
            web3.action
              .disconnect()
              .then((data) => parseError(data.status) && alert(data))
              .catch(alert);
          }}
        >
          Disconnect
        </button>

        <button
          onClick={async () => {
            web3.action
              .account()
              .then((data) => parseError(data.status) && alert(data))
              .catch(alert);
          }}
        >
          Account
        </button>

        <button
          onClick={async () => {
            web3.action
              .getNetwork()
              .then((data) => parseError(data.status) && alert(data))
              .catch(alert);
          }}
        >
          Get Network
        </button>

        <button
          onClick={async () => {
            web3.action
              .getNetworkURL()
              .then((data) => parseError(data.status) && alert(data))
              .catch(alert);
          }}
        >
          Get Network URL
        </button>

        <button
          onClick={async () => {
            web3.action
              .getNetworkType()
              .then((data) => parseError(data.status) && alert(data))
              .catch(alert);
          }}
        >
          Get Network Type
        </button>

        <button
          onClick={async () => {
            web3.action
              .getBalance()
              .then((data) => parseError(data.status) && alert(data))
              .catch(alert);
          }}
        >
          Get Balance
        </button>
      </div>

      <h1>SDK</h1>
      <h2>Aptos</h2>
      <div className="grid">
        <button
          onClick={async () => {
            const receiverAddress = "0xcd2add1ea1db230de04771337d56f154508eac8f03271c87133818005fbe394c";
            const sendBalance = 1000;

            const payload = {
              type: "entry_function_payload",
              function: "0x1::coin::transfer",
              type_arguments: ["0x1::aptos_coin::AptosCoin"],
              arguments: [receiverAddress, sendBalance],
            };

            const txnRequest = await web3.action.sdk.aptos.generateTransaction(payload);
            if (!parseError(txnRequest.status)) return;

            alert(txnRequest);
          }}
        >
          Generate Transaction
        </button>

        <button
          onClick={async () => {
            const receiverAddress = "0xcd2add1ea1db230de04771337d56f154508eac8f03271c87133818005fbe394c";
            const sendBalance = 10000;
            const payload: Types.EntryFunctionPayload = {
              function: "0x1::coin::transfer",
              type_arguments: ["0x1::aptos_coin::AptosCoin"],
              arguments: [receiverAddress, sendBalance],
            };
            const res = await web3.action.sdk.aptos.generateSignSubmitTransaction(payload);
            if (!parseError(res.status)) return;
            alert(res);
          }}
        >
          Generate Sign Submit Transaction
        </button>

        <button
          onClick={async () => {
            const receiverAddress = "0xcca3338dfda1b5e9bab0d744c3b50a9a24e3fe55bba48917307e813a4535e034";
            const sendBalance = 1000;

            const token = new TxnBuilderTypes.TypeTagStruct(
              TxnBuilderTypes.StructTag.fromString("0x1::aptos_coin::AptosCoin"),
            );

            const entryFunctionPayload = new TxnBuilderTypes.TransactionPayloadEntryFunction(
              TxnBuilderTypes.EntryFunction.natural(
                "0x1::coin",
                "transfer",
                [token],
                [
                  BCS.bcsToBytes(TxnBuilderTypes.AccountAddress.fromHex(receiverAddress)),
                  BCS.bcsSerializeUint64(sendBalance),
                ],
              ),
            );

            const s = new BCS.Serializer();
            entryFunctionPayload.serialize(s);

            const rawTxn = await web3.action.sdk.aptos.generateRawTransaction(s.getBytes());

            alert(rawTxn);
          }}
        >
          Generate Raw Transaction
        </button>

        <button
          onClick={async () => {
            // const receiverAddress = TxnBuilderTypes.AccountAddress.fromHex(
            //   "0xcca3338dfda1b5e9bab0d744c3b50a9a24e3fe55bba48917307e813a4535e034",
            // );
            // const sendBalance = 1000;
            // const token = new TxnBuilderTypes.TypeTagStruct(
            //   TxnBuilderTypes.StructTag.fromString("0x1::aptos_coin::AptosCoin"),
            // );
            // const entryFunctionPayload = new TxnBuilderTypes.TransactionPayloadEntryFunction(
            //   TxnBuilderTypes.EntryFunction.natural(
            //     "0x1::coin",
            //     "transfer",
            //     [token],
            //     [BCS.bcsToBytes(receiverAddress), BCS.bcsSerializeUint64(sendBalance)],
            //   ),
            // );
            // const s = new BCS.Serializer();
            // entryFunctionPayload.serialize(s);
            // const rawTxn = await web3.action.sdk.aptos.generateSignSubmitRawTransaction(s.getBytes());
            // alert(rawTxn);
          }}
        >
          Generate Sign Submit Raw Transaction
        </button>

        <button
          onClick={async () => {
            // const receiverAddress = TxnBuilderTypes.AccountAddress.fromHex(
            //   "0xcca3338dfda1b5e9bab0d744c3b50a9a24e3fe55bba48917307e813a4535e034",
            // );
            // const sendBalance = 1000;
            // const token = new TxnBuilderTypes.TypeTagStruct(
            //   TxnBuilderTypes.StructTag.fromString("0x1::aptos_coin::AptosCoin"),
            // );
            // const entryFunctionPayload = new TxnBuilderTypes.TransactionPayloadEntryFunction(
            //   TxnBuilderTypes.EntryFunction.natural(
            //     "0x1::coin",
            //     "transfer",
            //     [token],
            //     [BCS.bcsToBytes(receiverAddress), BCS.bcsSerializeUint64(sendBalance)],
            //   ),
            // );
            // const s = new BCS.Serializer();
            // entryFunctionPayload.serialize(s);
            // const rawTxn = await web3.action.sdk.aptos.generateSignSubmitWaitForTransaction(s.getBytes());
            // alert(rawTxn);
          }}
        >
          Generate Sign Submit Wait For Transaction
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

            const rawTxn = await web3.action.sdk.aptos.generateRawTransaction(s.getBytes());
            if (!parseError(rawTxn.status)) return;

            const bcsTxn = await web3.action.sdk.aptos.generateBCSTransaction(rawTxn.data);

            alert(bcsTxn);
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

            const txnRequest = await web3.action.sdk.aptos.generateTransaction(payload);
            if (!parseError(txnRequest.status)) return;

            const siTx = await web3.action.sdk.aptos.simulateTransaction(txnRequest.data);
            if (!parseError(siTx.status)) return;

            alert(siTx);
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

            const txnRequest = await web3.action.sdk.aptos.generateTransaction(payload);
            const signedTx = await web3.action.sdk.aptos.signTransaction(txnRequest.data);
            if (!parseError(signedTx.status)) {
              return;
            }

            alert(signedTx);
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

            const rawTxn = await web3.action.sdk.aptos.generateRawTransaction(s.getBytes());
            if (!parseError(rawTxn.status)) return;

            const bcsTxn = await web3.action.sdk.aptos.generateBCSTransaction(rawTxn.data);
            if (!parseError(bcsTxn.status)) return;

            const signedTx = await web3.action.sdk.aptos.signTransaction(bcsTxn.data);
            if (!parseError(signedTx.status)) return;

            alert(signedTx);
          }}
        >
          Sign BCS Transaction
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

            const txnRequest = await web3.action.sdk.aptos.generateTransaction(payload);
            if (!parseError(txnRequest.status)) return;

            const signedTx = await web3.action.sdk.aptos.signTransaction(txnRequest.data);
            if (!parseError(signedTx.status)) return;

            const txnHash = await web3.action.sdk.aptos.submitTransaction(signedTx.data);
            if (!parseError(txnHash.status)) return;

            alert(txnHash);
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

            const rawTxn = await web3.action.sdk.aptos.generateRawTransaction(s.getBytes());
            if (!parseError(rawTxn.status)) return;

            const bcsTxn = await web3.action.sdk.aptos.generateBCSTransaction(rawTxn.data);
            if (!parseError(bcsTxn.status)) return;

            const signedTx = await web3.action.sdk.aptos.signTransaction(bcsTxn.data);
            if (!parseError(signedTx.status)) return;

            const txnHash = await web3.action.sdk.aptos.submitTransaction(signedTx.data);
            if (!parseError(txnHash.status)) return;

            alert(txnHash);
          }}
        >
          Submit BCS Transaction
        </button>

        <button
          onClick={async () => {
            const receiverAddress = "0xcd2add1ea1db230de04771337d56f154508eac8f03271c87133818005fbe394c";
            const sendBalance = 20000;

            const payload = {
              type: "entry_function_payload",
              function: "0x1::coin::transfer",
              type_arguments: ["0x1::aptos_coin::AptosCoin"],
              arguments: [receiverAddress, sendBalance],
            };

            const txnRequest = await web3.action.sdk.aptos.generateTransaction(payload);
            if (!parseError(txnRequest.status)) return;

            const txnHash = await web3.action.sdk.aptos.signAndSubmitTransaction(txnRequest.data);

            if (!parseError(txnHash.status)) return;

            alert(txnHash);
          }}
        >
          Sign and Submit Transaction
        </button>

        <button
          onClick={async () => {
            const receiverAddress = "0xcd2add1ea1db230de04771337d56f154508eac8f03271c87133818005fbe394c";
            const sendBalance = 20000;

            const payload = {
              type: "entry_function_payload",
              function: "0x1::coin::transfer",
              type_arguments: ["0x1::aptos_coin::AptosCoin"],
              arguments: [receiverAddress, sendBalance],
            };

            const txnHash = await web3.action.sdk.aptos.signAndSubmitTransaction(payload as any);

            if (!parseError(txnHash.status)) return;

            alert(txnHash);
          }}
        >
          Petra Sign and Submit Transaction
        </button>

        <button
          onClick={async () => {
            const receiverAddress = "0xcd2add1ea1db230de04771337d56f154508eac8f03271c87133818005fbe394c";
            const sendBalance = 1000;

            const payload = {
              type: "entry_function_payload",
              function: "0x1::coin::transfer",
              type_arguments: ["0x1::aptos_coin::AptosCoin"],
              arguments: [receiverAddress, sendBalance],
            };

            const txnRequest = await web3.action.sdk.aptos.generateTransaction(payload);
            if (!parseError(txnRequest.status)) return;

            const estTx = await web3.action.sdk.aptos.simulateTransaction(txnRequest.data);
            if (!parseError(estTx.status)) return;

            const tx = await web3.action.sdk.aptos.signTransaction(txnRequest.data);
            if (!parseError(tx.status)) return;

            const txnHash = await web3.action.sdk.aptos.submitTransaction(tx.data);
            if (!parseError(txnHash.status)) return;

            alert(txnHash);
          }}
        >
          Full Flow Transaction
        </button>

        <button
          onClick={async () => {
            const signed = await web3.action.sdk.aptos.signMessage({
              address: true,
              application: true,
              chainId: true,
              message: "long heo",
              nonce: "1",
            });
            alert(signed);
          }}
        >
          Sign Message
        </button>

        <button
          onClick={() => {
            web3.action.sdk.aptos
              .getAccount("0x110530540a599d5ddbae493fa91140f0656611069279d55c6eed3156cead8a0e")
              .then((data) => parseError(data.status) && alert(data))
              .catch(alert);
          }}
        >
          Get Account
        </button>

        <button
          onClick={() => {
            web3.action.sdk.aptos
              .getAccountTransactions("0x110530540a599d5ddbae493fa91140f0656611069279d55c6eed3156cead8a0e")
              .then((data) => parseError(data.status) && alert(data))
              .catch(alert);
          }}
        >
          Get Account Transactions
        </button>

        <button
          onClick={() => {
            web3.action.sdk.aptos
              .getAccountModules("0x110530540a599d5ddbae493fa91140f0656611069279d55c6eed3156cead8a0e")
              .then((data) => parseError(data.status) && alert(data))
              .catch(alert);
          }}
        >
          Get Account Modules
        </button>

        <button
          onClick={() => {
            web3.action.sdk.aptos
              .getAccountModule("0x110530540a599d5ddbae493fa91140f0656611069279d55c6eed3156cead8a0e", "test")
              .then((data) => parseError(data.status) && alert(data))
              .catch(alert);
          }}
        >
          Get Account Module: test
        </button>

        <button
          onClick={() => {
            web3.action.sdk.aptos
              .getAccountResources("0x89c8b1fa5c4eb4310c732f1486cb83505a8a533a6fb367eb3f727d5bdecdaaae")
              .then((data) => parseError(data.status) && alert(data))
              .catch(alert);
          }}
        >
          Get Account Resources
        </button>

        <button
          onClick={() => {
            web3.action.sdk.aptos
              .getTransactions()
              .then((data) => parseError(data.status) && alert(data))
              .catch(alert);
          }}
        >
          Get Transsactions
        </button>

        <button
          onClick={() => {
            web3.action.sdk.aptos
              .getChainId()
              .then((data) => parseError(data.status) && alert(data))
              .catch(alert);
          }}
        >
          Get Chain Id
        </button>
      </div>

      <h1>Token</h1>
      <div className="grid">
        <button
          onClick={async () => {
            const id = uuidv4();
            const txnHash = await (web3.action.token as IWeb3AptosToken).createCollection(
              `fewcha try ${id}`,
              `fewcha try ${id} desc`,
              "https://fewcha.app/svgs/logo.svg",
              10000
            );
            if (!parseError(txnHash.status)) {
              return;
            }
            alert(txnHash.data);
          }}
        >
          Create Collection
        </button>

        <button
          onClick={async () => {
            const id = uuidv4();
            const txnHash = await (web3.action.token as IWeb3AptosToken).createToken(
              "fewcha try 5818bdb9-2809-4add-ae2a-a24182cd4528",
              `nft ${id}`,
              `fewcha try ${id} desc`,
              1,
              "https://fewcha.app/svgs/logo.svg",
              1,
            );
            if (!parseError(txnHash.status)) {
              return;
            }

            alert(txnHash.data);
          }}
        >
          Create Token
        </button>

        <button
          onClick={async () => {
            const txnHash = await (web3.action.token as IWeb3AptosToken).offerToken(
              "0xcca3338dfda1b5e9bab0d744c3b50a9a24e3fe55bba48917307e813a4535e034",
              "0x110530540a599d5ddbae493fa91140f0656611069279d55c6eed3156cead8a0e",
              `fewcha try 180fb0f4-aadf-49ba-bfa9-571f1b69be58`,
              `nft 32182451-9852-4425-9d70-b76534b8672f`,
              1,
            );
            if (!parseError(txnHash.status)) return;

            alert(txnHash.data);
          }}
        >
          Offer Token
        </button>

        <button
          onClick={async () => {
            const txnHash = await (web3.action.token as IWeb3AptosToken).claimToken(
              "0xcca3338dfda1b5e9bab0d744c3b50a9a24e3fe55bba48917307e813a4535e034",
              "0x110530540a599d5ddbae493fa91140f0656611069279d55c6eed3156cead8a0e",
              `fewcha try 180fb0f4-aadf-49ba-bfa9-571f1b69be58`,
              `nft 32182451-9852-4425-9d70-b76534b8672f`,
            );
            if (!parseError(txnHash.status)) return;

            alert(txnHash.data);
          }}
        >
          Claim Token
        </button>

        <button
          onClick={async () => {
            const txnHash = await (web3.action.token as IWeb3AptosToken).cancelTokenOffer(
              "0xcca3338dfda1b5e9bab0d744c3b50a9a24e3fe55bba48917307e813a4535e034",
              "0x110530540a599d5ddbae493fa91140f0656611069279d55c6eed3156cead8a0e",
              `fewcha try 180fb0f4-aadf-49ba-bfa9-571f1b69be58`,
              `nft 32182451-9852-4425-9d70-b76534b8672f`,
            );

            if (!parseError(txnHash.status)) return;

            alert(txnHash.data);
          }}
        >
          Cancel Token Offer
        </button>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return <Web3Js />;
};

export default App;
