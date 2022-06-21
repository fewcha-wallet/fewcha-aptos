import React, {
  useContext,
  createContext,
  PropsWithChildren,
  useState,
} from "react";
import Web3, { Web3Provider, Web3ProviderStandard } from "@fewcha/web3";
import { useEffect } from "react";

const defaultNodeURL = "https://fullnode.devnet.aptoslabs.com";
const defaultWeb3 = new Web3(new Web3Provider(defaultNodeURL));

type Web3ContextType = {
  init: boolean;
  account: string;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  nodeURL: string;
  web3: Web3ProviderStandard;
};

export const Web3Context = createContext<Web3ContextType>({
  init: false,
  account: "",
  isConnected: false,
  connect: () => {},
  disconnect: () => {},
  nodeURL: "",
  web3: defaultWeb3.action,
});

export const useWeb3 = () => {
  const { init, web3, account, isConnected, connect, disconnect } =
    useContext(Web3Context);
  return { init, web3, account, isConnected, connect, disconnect };
};

const { Provider } = Web3Context;

const Web3ReactProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [account, setAccount] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [nodeURL, setNodeURL] = useState("");
  const [web3, setWeb3] = useState(defaultWeb3);
  const [init, setInit] = useState(false);

  const connect = async () => {
    await web3.action.connect();
  };
  const disconnect = async () => {
    await web3.action.disconnect();
  };

  const setWeb3Init = () => {
    const wallet = (window as any).aptos;

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

  useEffect(() => {
    setWeb3Init();
  }, []);

  useEffect(() => {
    window.addEventListener("aptos#initialized", setWeb3Init);
    window.addEventListener("aptos#connected", connectedEvent);
    window.addEventListener("aptos#disconnected", disconnectedEvent);
    window.addEventListener("aptos#changeAccount", getAccount);
    window.addEventListener("aptos#changeNetwork", getNodeURL);

    return () => {
      window.removeEventListener("aptos#initialized", setWeb3Init);
      window.removeEventListener("aptos#connected", connectedEvent);
      window.removeEventListener("aptos#disconnected", disconnectedEvent);
      window.addEventListener("aptos#changeAccount", getAccount);
      window.addEventListener("aptos#changeNetwork", getNodeURL);
    };
    // eslint-disable-next-line
  }, [web3]);

  return (
    <Provider
      value={{
        account,
        isConnected,
        connect,
        disconnect,
        web3: web3.action,
        nodeURL,
        init,
      }}
    >
      {children}
    </Provider>
  );
};

export default Web3ReactProvider;
