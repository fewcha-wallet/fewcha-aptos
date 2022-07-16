import React, { useContext, createContext, PropsWithChildren, useState, useEffect } from "react";
import Web3, { Web3ProviderType, Web3Provider, Web3SDK, Web3Token } from "@fewcha/web3";
import { TxnBuilderTypes } from "aptos";
import { TransactionPayload, UserTransactionRequest, SubmitTransactionRequest, PendingTransaction, OnChainTransaction } from "aptos/dist/api/data-contracts";
import { PublicAccount } from "@fewcha/web3/dist/types";

export type Tx = { id: string; hash: string };

type Web3ContextValue = {
  init: boolean;

  account: PublicAccount;
  balance: string;
  // getBalance(): Promise<string>;

  connect: () => Promise<PublicAccount>;
  disconnect: () => Promise<void>;
  isConnected: boolean;
  // isConnected(): Promise<boolean>;

  network: string;
  txs: Tx[];

  sdk: Web3SDK;
  token: Web3Token;

  generateTransaction(payload: TransactionPayload, options?: Partial<UserTransactionRequest>): Promise<UserTransactionRequest>;

  signAndSubmitTransaction(txnRequest: UserTransactionRequest): Promise<PendingTransaction>;
  signTransaction(txnRequest: UserTransactionRequest): Promise<UserTransactionRequest>;
  signMessage(message: string): Promise<string>;
  submitTransaction(signedTxnRequest: SubmitTransactionRequest): Promise<PendingTransaction>;

  simulateTransaction(txnRequest: UserTransactionRequest): Promise<OnChainTransaction>;

  generateBCSTransaction(rawTxn: TxnBuilderTypes.RawTransaction): Uint8Array;
  generateBCSSimulation(rawTxn: TxnBuilderTypes.RawTransaction): Uint8Array;

  submitSignedBCSTransaction(signedTxn: Uint8Array): Promise<PendingTransaction>;
  submitBCSSimulation(bcsBody: Uint8Array): Promise<OnChainTransaction>;
};

export const Web3Context = createContext<Web3ContextValue>(null as any);

export const useWeb3 = () => {
  const { init, account, balance, isConnected, connect, disconnect, network, txs, sdk, token } = useContext(Web3Context);
  return {
    init,
    account,
    balance,
    isConnected,
    connect,
    disconnect,
    network,
    txs,
    sdk,
    token,
  };
};

const Web3ReactProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const emptyAccount = { address: "", publicKey: "" };

  const [init, setInit] = useState(false);
  const [account, setAccount] = useState<PublicAccount>(emptyAccount);
  const [balance, setBalance] = useState("");

  const [isConnected, setIsConnected] = useState(false);

  const [network, setNetwork] = useState("");
  const [txs, setTxs] = useState<Tx[]>([]);

  const [web3, setWeb3] = useState(null as unknown as Web3ProviderType);

  const setWeb3Init = () => {
    const wallet = (window as any).fewcha;

    if (wallet) {
      const provider = new Web3Provider(wallet);
      const w = new Web3(provider);

      setInit(true);
      setWeb3(w.action);
    }
  };

  const connect = async () => {
    if (!web3) throw new Error("404");
    return web3.connect();
  };

  const disconnect = async () => {
    if (!web3) throw new Error("404");
    await web3.disconnect();
  };

  const getAccount = () => {
    if (web3)
      web3.account().then((data) => {
        setAccount(data);
      });
  };

  const changeBalance = () => {
    if (web3)
      web3.getBalance().then((data) => {
        setBalance(data);
      });
  };

  const getNetwork = () => {
    if (web3)
      web3.getNetwork().then((data) => {
        setNetwork(data);
      });
  };

  const connectedEvent = () => {
    setIsConnected(true);
    getAccount();
  };

  const disconnectedEvent = () => {
    setIsConnected(false); // TO-DO: handle correct tab connected
    setAccount(emptyAccount);
  };

  const pushTransaction = (event: Event) => {
    const e = event as CustomEvent;
    if (e.detail) setTxs([...txs, { id: e.detail.id, hash: e.detail.tx }]);
  };

  useEffect(() => {
    setWeb3Init();
  }, []);

  useEffect(() => {
    window.addEventListener("aptos#initialized", setWeb3Init);
    window.addEventListener("aptos#connected", connectedEvent);
    window.addEventListener("aptos#disconnected", disconnectedEvent);
    window.addEventListener("aptos#changeAccount", getAccount);
    window.addEventListener("aptos#changeBalance", changeBalance);
    window.addEventListener("aptos#changeNetwork", getNetwork);
    window.addEventListener("aptos#transaction", pushTransaction);

    return () => {
      window.removeEventListener("aptos#initialized", setWeb3Init);
      window.removeEventListener("aptos#connected", connectedEvent);
      window.removeEventListener("aptos#disconnected", disconnectedEvent);
      window.removeEventListener("aptos#changeAccount", getAccount);
      window.removeEventListener("aptos#changeBalance", changeBalance);
      window.removeEventListener("aptos#changeNetwork", getNetwork);
      window.removeEventListener("aptos#transaction", pushTransaction);
    };
    // eslint-disable-next-line
  }, [web3]);

  let value: Web3ContextValue = { init: false } as Web3ContextValue;

  if (web3) {
    const { generateTransaction, signAndSubmitTransaction, signTransaction, signMessage, submitTransaction, simulateTransaction, generateBCSTransaction, generateBCSSimulation, submitSignedBCSTransaction, submitBCSSimulation } = web3;
    value = {
      init,
      account,
      balance,

      isConnected,
      connect,
      disconnect,

      network,
      txs,

      sdk: web3?.sdk,
      token: web3?.token,

      generateTransaction,
      signAndSubmitTransaction,
      signTransaction,
      signMessage,
      submitTransaction,
      simulateTransaction,
      generateBCSTransaction,
      generateBCSSimulation,
      submitSignedBCSTransaction,
      submitBCSSimulation,
    };
  }

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};

export default Web3ReactProvider;
