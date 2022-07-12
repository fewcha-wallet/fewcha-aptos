import React, { useContext, createContext, PropsWithChildren, useState, useEffect } from "react";
import Web3, { Web3Provider, Web3ProviderStandard } from "@fewcha/web3";

const defaultNodeURL = "https://fullnode.devnet.aptoslabs.com";
const defaultWeb3 = new Web3(new Web3Provider(defaultNodeURL));

export type Tx = { id: string; hash: string };

type Web3ContextValue = {
  init: boolean;
  account: string;
  balance: string;
  txs: Tx[];
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  nodeURL: string;
  web3: Web3ProviderStandard;
};

const defaultContext: Web3ContextValue = {
  init: false,
  account: "",
  balance: "",
  txs: [],
  isConnected: false,
  connect: () => {},
  disconnect: () => {},
  nodeURL: "",
  web3: defaultWeb3.action,
};

export const Web3Context = createContext<Web3ContextValue>(defaultContext);

export const useWeb3 = () => {
  const { init, web3, account, balance, txs, isConnected, connect, disconnect } = useContext(Web3Context);
  return { init, web3, account, balance, txs, isConnected, connect, disconnect };
};

const Web3ReactProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [init, setInit] = useState(false);
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("");
  const [txs, setTxs] = useState<Tx[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [nodeURL, setNodeURL] = useState("");
  const [web3, setWeb3] = useState(defaultWeb3);

  const connect = async () => {
    await web3.action.connect();
  };
  const disconnect = async () => {
    await web3.action.disconnect();
  };

  const setWeb3Init = () => {
    const wallet = (window as any).fewcha;

    if (wallet) {
      const provider = new Web3Provider(wallet);
      const web3 = new Web3(provider);
      setWeb3(web3);
      setInit(true);
    }
  };

  const getAccount = () => {
    web3.action.account().then((data) => {
      setAccount(data);
    });
  };

  const changeBalance = () => {};

  const getNodeURL = () => {
    web3.action.getNodeURL().then((data) => {
      setNodeURL(data);
    });
  };

  const connectedEvent = () => {
    setIsConnected(true);
    getAccount();
  };

  const disconnectedEvent = () => {
    setIsConnected(false);
    setAccount("");
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
    window.addEventListener("aptos#changeNetwork", getNodeURL);
    window.addEventListener("aptos#transaction", pushTransaction);

    return () => {
      window.removeEventListener("aptos#initialized", setWeb3Init);
      window.removeEventListener("aptos#connected", connectedEvent);
      window.removeEventListener("aptos#disconnected", disconnectedEvent);
      window.removeEventListener("aptos#changeAccount", getAccount);
      window.removeEventListener("aptos#changeBalance", changeBalance);
      window.removeEventListener("aptos#changeNetwork", getNodeURL);
      window.removeEventListener("aptos#transaction", pushTransaction);
    };
    // eslint-disable-next-line
  }, [web3]);

  return (
    <Web3Context.Provider
      value={{
        init,
        account,
        balance,
        txs,
        isConnected,
        connect,
        disconnect,
        web3: web3.action,
        nodeURL,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export default Web3ReactProvider;
