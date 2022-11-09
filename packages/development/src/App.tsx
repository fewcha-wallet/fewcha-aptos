import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { BCS, TxnBuilderTypes, Types } from "aptos";
import Web3, { IWeb3AptosToken } from "@fewcha/web3";
import { parseError } from "./utils";

const Web3Js = () => {
  const provider = (window as any).fewcha;

  const [response, setResponse] = useState("");
  const catchResponse = (data: any) => {
    setResponse(JSON.stringify(data, null, 4));
  };

  const web3 = new Web3(provider);

  const signTransaction = () => (
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

        const txnRequest = await web3.action.aptos.generateTransaction(payload);
        catchResponse(txnRequest);
        if (!parseError(txnRequest.status)) return;

        const signedTx = await web3.action.aptos.signTransaction(txnRequest.data);
        catchResponse(signedTx);
        if (!parseError(signedTx.status)) return;
      }}
    >
      Sign Transaction
    </button>
  );

  const signBCSTransaction = () => (
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

        const rawTxn = await web3.action.aptos.generateRawTransaction(s.getBytes());
        catchResponse(rawTxn);
        if (!parseError(rawTxn.status)) return;

        const bcsTxn = await web3.action.aptos.generateBCSTransaction(rawTxn.data);
        catchResponse(bcsTxn);
        if (!parseError(bcsTxn.status)) return;

        const signedTx = await web3.action.aptos.signTransaction(bcsTxn.data);
        catchResponse(signedTx);
        if (!parseError(signedTx.status)) return;
      }}
    >
      Sign BCS Transaction
    </button>
  );

  const generateSignSubmitTransaction = () => (
    <button
      onClick={async () => {
        const receiverAddress = "0xcd2add1ea1db230de04771337d56f154508eac8f03271c87133818005fbe394c";
        const sendBalance = 10000;

        const payload: Types.EntryFunctionPayload = {
          function: "0x1::coin::transfer",
          type_arguments: ["0x1::aptos_coin::AptosCoin"],
          arguments: [receiverAddress, sendBalance],
        };

        const res = await web3.action.aptos.generateSignSubmitTransaction(payload, {});
        catchResponse(res);
        if (!parseError(res.status)) return;
      }}
    >
      Generate and Sign and Submit Transaction
    </button>
  );

  const generateSignSubmitRawTransaction = () => (
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

        const rawTxn = await web3.action.aptos.generateSignSubmitRawTransaction(s.getBytes());
        catchResponse(rawTxn);
        if (!parseError(rawTxn.status)) return;
      }}
    >
      Generate Sign Submit Raw Transaction
    </button>
  );

  const generateSignSubmitWaitForTransaction = () => (
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

        const rawTxn = await web3.action.aptos.generateSignSubmitWaitForTransaction(s.getBytes());
        catchResponse(rawTxn);
        if (!parseError(rawTxn.status)) return;
      }}
    >
      Generate Sign Submit Wait For Transaction
    </button>
  );

  const signMessage = () => (
    <button
      onClick={async () => {
        const signed = await web3.action.aptos.signMessage({
          address: true,
          application: true,
          chainId: true,
          message: "long heo",
          nonce: "1",
        });
        catchResponse(signed);
        if (!parseError(signed.status)) return;
      }}
    >
      Sign Message
    </button>
  );

  const signAndSubmitTransaction = () => (
    <button
      onClick={async () => {
        const receiverAddress = "0xcd2add1ea1db230de04771337d56f154508eac8f03271c87133818005fbe394c";
        const sendBalance = "1";

        const payload = {
          type: "entry_function_payload",
          function: "0x1::aptos_account::transfer",
          type_arguments: [],
          arguments: [receiverAddress, sendBalance],
        };

        const txnRequest = await web3.action.aptos.generateTransaction(payload);
        catchResponse(txnRequest);
        if (!parseError(txnRequest.status)) return;

        const txnHash = await web3.action.aptos.signAndSubmitTransaction(txnRequest.data);
        catchResponse(txnHash);
        if (!parseError(txnHash.status)) return;
      }}
    >
      Sign and Submit Transaction
    </button>
  );

  const submitTransaction = () => (
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

        const txnRequest = await web3.action.aptos.generateTransaction(payload);
        catchResponse(txnRequest);
        if (!parseError(txnRequest.status)) return;

        const signedTx = await web3.action.aptos.signTransaction(txnRequest.data);
        catchResponse(signedTx);
        if (!parseError(signedTx.status)) return;

        const txnHash = await web3.action.aptos.submitTransaction(signedTx.data);
        catchResponse(txnHash);
        if (!parseError(txnHash.status)) return;
      }}
    >
      Submit Transaction
    </button>
  );

  const submitBCSTransaction = () => (
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

        const rawTxn = await web3.action.aptos.generateRawTransaction(s.getBytes());
        catchResponse(rawTxn);
        if (!parseError(rawTxn.status)) return;

        const bcsTxn = await web3.action.aptos.generateBCSTransaction(rawTxn.data);
        catchResponse(bcsTxn);
        if (!parseError(bcsTxn.status)) return;

        const signedTx = await web3.action.aptos.signTransaction(bcsTxn.data);
        catchResponse(signedTx);
        if (!parseError(signedTx.status)) return;

        const txnHash = await web3.action.aptos.submitTransaction(signedTx.data);
        catchResponse(txnHash);
        if (!parseError(txnHash.status)) return;

        catchResponse(txnHash);
      }}
    >
      Submit BCS Transaction
    </button>
  );

  const generateTransaction = () => (
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

        const txnRequest = await web3.action.aptos.generateTransaction(payload);
        catchResponse(txnRequest);
        if (!parseError(txnRequest.status)) return;
      }}
    >
      Generate Transaction
    </button>
  );

  const generateRawTransaction = () => (
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

        const rawTxn = await web3.action.aptos.generateRawTransaction(s.getBytes());
        catchResponse(rawTxn);
        if (!parseError(rawTxn.status)) return;
      }}
    >
      Generate Raw Transaction
    </button>
  );

  const generateBCSTransaction = () => (
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

        const rawTxn = await web3.action.aptos.generateRawTransaction(s.getBytes());
        catchResponse(rawTxn);
        if (!parseError(rawTxn.status)) return;

        const bcsTxn = await web3.action.aptos.generateBCSTransaction(rawTxn.data);
        catchResponse(bcsTxn);
        if (!parseError(bcsTxn.status)) return;
      }}
    >
      Generate BCS Transaction
    </button>
  );

  return (
    <div>
      <div>
        <h1>Web3</h1>
        <h2>Common</h2>
        <div className="grid">
          <button
            onClick={async () => {
              web3.action
                .connect()
                .then((data) => {
                  catchResponse(data);
                  parseError(data.status);
                })
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
                .then((data) => {
                  catchResponse(data);
                  parseError(data.status);
                })
                .catch((err) => console.log(err))
                .finally(console.log);
            }}
          >
            IsConnnect
          </button>

          <button
            onClick={async () => {
              web3.action
                .disconnect()
                .then((data) => {
                  parseError(data.status);
                  catchResponse(data);
                })
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
                .then((data) => {
                  catchResponse(data);
                  parseError(data.status);
                })
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
                .then((data) => {
                  catchResponse(data);
                  parseError(data.status);
                })
                .catch(console.log)
                .finally(console.log);
            }}
          >
            Get Network
          </button>

          <button
            onClick={async () => {
              web3.action
                .getNetworkURL()
                .then((data) => {
                  catchResponse(data);
                  parseError(data.status);
                })
                .catch(console.log)
                .finally(console.log);
            }}
          >
            Get Network URL
          </button>

          <button
            onClick={async () => {
              web3.action
                .getNetworkType()
                .then((data) => {
                  catchResponse(data);
                  parseError(data.status);
                })
                .catch(catchResponse);
            }}
          >
            Get Network Type
          </button>

          <button
            onClick={async () => {
              web3.action
                .getBalance()
                .then((data) => {
                  catchResponse(data);
                  parseError(data.status);
                })
                .catch(console.log)
                .finally(console.log);
            }}
          >
            Get Balance
          </button>
        </div>

        <h2>SDK</h2>
        <h3>Aptos</h3>

        {response && (
          <>
            <h4>Response</h4>
            <div>{response}</div>
            <div>
              <button onClick={() => setResponse("")}>Clear</button>
            </div>
          </>
        )}

        <h4>Get</h4>
        <div className="grid">
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

              const txnHash = await web3.action.aptos.signAndSubmitTransaction(payload as any);
              catchResponse(txnHash);
              if (!parseError(txnHash.status)) return;
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

              const txnRequest = await web3.action.aptos.generateTransaction(payload);
              catchResponse(txnRequest);
              if (!parseError(txnRequest.status)) return;

              const estTx = await web3.action.aptos.simulateTransaction(txnRequest.data);
              catchResponse(estTx);
              if (!parseError(estTx.status)) return;

              const tx = await web3.action.aptos.signTransaction(txnRequest.data);
              catchResponse(tx);
              if (!parseError(tx.status)) return;

              const txnHash = await web3.action.aptos.submitTransaction(tx.data);
              catchResponse(txnHash);
              if (!parseError(txnHash.status)) return;
            }}
          >
            Full Flow Transaction
          </button>

          <button
            onClick={() => {
              web3.action.aptos
                .getAccount("0x110530540a599d5ddbae493fa91140f0656611069279d55c6eed3156cead8a0e")
                .then((data) => {
                  catchResponse(data);
                  parseError(data.status);
                })
                .catch(catchResponse);
            }}
          >
            Get Account
          </button>

          <button
            onClick={() => {
              web3.action.aptos
                .getAccountTransactions("0x110530540a599d5ddbae493fa91140f0656611069279d55c6eed3156cead8a0e")
                .then((data) => {
                  catchResponse(data);
                  parseError(data.status);
                })
                .catch(catchResponse);
            }}
          >
            Get Account Transactions
          </button>

          <button
            onClick={() => {
              web3.action.aptos
                .getAccountModules("0x110530540a599d5ddbae493fa91140f0656611069279d55c6eed3156cead8a0e")
                .then((data) => {
                  catchResponse(data);
                  parseError(data.status);
                })
                .catch(catchResponse);
            }}
          >
            Get Account Modules
          </button>

          <button
            onClick={() => {
              web3.action.aptos
                .getAccountModule("0x110530540a599d5ddbae493fa91140f0656611069279d55c6eed3156cead8a0e", "test")
                .then((data) => {
                  catchResponse(data);
                  parseError(data.status);
                })
                .catch(catchResponse);
            }}
          >
            Get Account Module: test
          </button>

          <button
            onClick={() => {
              web3.action.aptos
                .getAccountResources("0x89c8b1fa5c4eb4310c732f1486cb83505a8a533a6fb367eb3f727d5bdecdaaae")
                .then((data) => {
                  catchResponse(data);
                  parseError(data.status);
                })
                .catch(catchResponse);
            }}
          >
            Get Account Resources
          </button>

          <button
            onClick={() => {
              web3.action.aptos
                .getTransactions()
                .then((data) => {
                  catchResponse(data);
                  parseError(data.status);
                })
                .catch(catchResponse);
            }}
          >
            Get Transsactions
          </button>

          <button
            onClick={() => {
              web3.action.aptos
                .getChainId()
                .then((data) => {
                  catchResponse(data);
                  parseError(data.status);
                })
                .catch(catchResponse);
            }}
          >
            Get Chain Id
          </button>
        </div>

        <h4>Generate</h4>

        <div className="grid">
          {generateTransaction()}
          {generateRawTransaction()}
          {generateBCSTransaction()}
        </div>

        <h4>Sign</h4>

        <div className="grid">
          {signMessage()}
          {signTransaction()}
          {signBCSTransaction()}
        </div>

        <h4>Submit</h4>

        <div className="grid">
          {submitTransaction()}
          {submitBCSTransaction()}
        </div>

        <h4>Mix</h4>

        <div className="grid">
          {signAndSubmitTransaction()}
          {generateSignSubmitTransaction()}
          {generateSignSubmitRawTransaction()}
          {generateSignSubmitWaitForTransaction()}
        </div>

        <h4>Token</h4>
        <div className="grid">
          <button
            onClick={async () => {
              const id = uuidv4();
              const txnHash = await (web3.action.token as IWeb3AptosToken).createCollection(
                `fewcha try ${id}`,
                `fewcha try ${id} desc`,
                "https://fewcha.app/svgs/logo.svg",
                10000,
              );

              catchResponse(txnHash.data);
              if (!parseError(txnHash.status)) return;
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

              catchResponse(txnHash.data);
              if (!parseError(txnHash.status)) return;
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

              catchResponse(txnHash.data);
              if (!parseError(txnHash.status)) return;
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

              catchResponse(txnHash.data);
              if (!parseError(txnHash.status)) return;
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

              catchResponse(txnHash.data);
              if (!parseError(txnHash.status)) return;
            }}
          >
            Cancel Token Offer
          </button>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <div>
      <Web3Js />
    </div>
  );
};

export default App;
