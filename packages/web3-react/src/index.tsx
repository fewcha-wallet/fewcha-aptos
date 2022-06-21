import React, {
  useContext,
  createContext,
  PropsWithChildren,
  useState,
} from "react";
import { Web3ProviderStandard, providers, Aptos } from "@fewcha/web3";

type Web3ContextType = {
  account: string;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  action: Web3ProviderStandard;
};

export const Web3Context = createContext<Web3ContextType>({
  account: "",
  isConnected: false,
  connect: () => {},
  disconnect: () => {},
  action: new providers.AptosProvider(
    new Aptos.AptosClient(""),
    new Aptos.AptosAccount()
  ),
});

export const useWeb3 = () => {
  const { account, isConnected, connect, disconnect } = useContext(Web3Context);
  return { account, isConnected, connect, disconnect };
};

const { Provider } = Web3Context;

const Web3Provider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [account, setAccount] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  const connect = () => {};
  const disconnect = () => {};
  const action = new providers.AptosProvider(
    new Aptos.AptosClient(""),
    new Aptos.AptosAccount()
  );

  return (
    <Provider
      value={{
        account,
        isConnected,
        connect,
        disconnect,
        action,
      }}
    >
      {children}
    </Provider>
  );
};

export default Web3Provider;
