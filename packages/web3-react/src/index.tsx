import React, { useContext, createContext, PropsWithChildren, useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { Web3ProviderType } from "@fewcha/web3";
import { PublicAccount } from "@fewcha/web3/dist/types";
import { wallets } from "./config/wallet";
import { PopupBackground, PopupBackgroundScreen, PopupBackgroundWrapper, PopupBackgroundBackground, ConnectWalletButton, Popup, PopupClose, PopupTitle, WalletList, WalletItem, WalletTitleWrapper, WalletIcon, WalletTitle, WalletDetected } from "./style/main";

export const Web3Context = createContext<Web3ContextValue>(null as any);
type PopupProps = {};
type PopupType = (props: { Component: React.FC<PopupProps>; callback?: (key: string) => void }) => string;

export const useWeb3 = () => {
  const { account, balance, disconnect, isConnected, network, fewcha, martian } = useContext(Web3Context);
  return { account, balance, disconnect, isConnected, network, fewcha, martian };
};

type Web3ContextValue = {
  account: PublicAccount;
  balance: string;

  isConnected: boolean;

  disconnect: () => void;

  network: string;

  addPopup: PopupType;
  removePopup: (key: string) => void;
  removeAll: () => void;

  fewcha: Web3ProviderType;
  martian: any;

  currentWallet: "fewcha" | "martian";
  setCurrentWallet: (wallet: "fewcha" | "martian") => void;
  chooseWeb3: (walletCodename: "fewcha" | "martian", callback: () => void) => Promise<void>;
};

const emptyAccount = { address: "", publicKey: "" };

const Web3ReactProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [account, setAccount] = useState<PublicAccount>(emptyAccount);
  const [balance, setBalance] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [network, setNetwork] = useState("");
  const [popups, changePopups] = useState<{ key: string; Component: React.FC<{}> }[]>([]);
  const [currentWallet, setCurrentWallet] = useState<"fewcha" | "martian">("fewcha");

  let fewcha = (window as any).fewcha as Web3ProviderType;
  const martian = (window as any).martian;

  const popupBackgroundService = useRef<HTMLDivElement | null>(null);

  const addPopup: PopupType = ({ Component, callback }): string => {
    const key = uuidv4();
    changePopups([...popups, { key, Component }]);
    if (callback) callback(key);
    return key;
  };

  const removePopup = (key: string) => {
    changePopups(popups.filter((popup) => popup.key !== key));
  };

  const removeAll = () => {
    changePopups([]);
  };

  const chooseWeb3 = async (walletCodename: "fewcha" | "martian", callback: () => void): Promise<void> => {
    callback && callback();
    setCurrentWallet(walletCodename);

    const account = await (window as any)[walletCodename].connect();

    if (account.status === 200) {
      setIsConnected(true);

      switch (walletCodename) {
        case "fewcha":
          setAccount({ ...emptyAccount, ...account.data });
          break;

        case "martian":
          setAccount({ ...emptyAccount, address: account.address, publicKey: account.publicKey });
          break;
      }
    }
  };

  const clear = () => {
    setAccount(emptyAccount);
    setNetwork("");
    setBalance("0");
    setIsConnected(false);
  };

  const connectedEvent = () => {
    setIsConnected(true);
  };

  const disconnectedEvent = () => {
    clear();
  };

  const changeAccount = (event: Event) => {
    const e = event as CustomEvent;
    if (e.detail) {
      setAccount(e.detail);
    }
  };

  const changeBalance = (event: Event) => {
    const e = event as CustomEvent;
    if (e.detail) {
      setBalance(e.detail);
    }
  };

  const changeNetwork = (event: Event) => {
    const e = event as CustomEvent;
    if (e.detail) {
      setNetwork(e.detail);
    }
  };

  const initialized = (event: Event) => {
    fewcha = (window as any).fewcha as Web3ProviderType;
    fewcha &&
      fewcha.isConnected().then((isConnected) => {
        setIsConnected(isConnected.data);
      });
  };

  const disconnect = () => {
    fewcha && fewcha.disconnect();
    martian && martian.disconnect();
  };

  useEffect(() => {
    window.addEventListener("aptos#initialized", initialized);
    window.addEventListener("aptos#connected", connectedEvent);
    window.addEventListener("aptos#disconnected", disconnectedEvent);
    window.addEventListener("aptos#changeAccount", changeAccount);
    window.addEventListener("aptos#changeBalance", changeBalance);
    window.addEventListener("aptos#changeNetwork", changeNetwork);

    return () => {
      window.removeEventListener("aptos#initialized", initialized);
      window.removeEventListener("aptos#connected", connectedEvent);
      window.removeEventListener("aptos#disconnected", disconnectedEvent);
      window.removeEventListener("aptos#changeAccount", changeAccount);
      window.removeEventListener("aptos#changeBalance", changeBalance);
      window.removeEventListener("aptos#changeNetwork", changeNetwork);
    };
    // eslint-disable-next-line
  }, []);

  const Component = popups.length > 0 ? popups[popups.length - 1].Component : () => <></>;

  return (
    <Web3Context.Provider value={{ currentWallet, setCurrentWallet, chooseWeb3, disconnect, account, balance, isConnected, addPopup, removePopup, removeAll, network, fewcha, martian }}>
      {children}
      {/* popup */}
      {popups.length > 0 && (
        <PopupBackground
          onClick={(e) => {
            if (e.target !== popupBackgroundService.current) return;
            removePopup(popups[popups.length - 1].key);
          }}
        >
          <PopupBackgroundScreen>
            <PopupBackgroundWrapper aria-hidden="true">
              {/* background */}
              <PopupBackgroundBackground ref={popupBackgroundService}></PopupBackgroundBackground>
            </PopupBackgroundWrapper>
            <span className="sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <Component />
          </PopupBackgroundScreen>
        </PopupBackground>
      )}
    </Web3Context.Provider>
  );
};

export default Web3ReactProvider;

type ConnectWalletProps = {
  theme?: "light" | "dark";
  type?: "list" | "grid";
  label?: React.ReactElement;
  padding?: "15px 30px";
};

export const ConnectWallet: React.FC<ConnectWalletProps> = ({ theme = "dark", type = "grid", label = "Connect Wallet" }) => {
  const { addPopup, isConnected } = useContext(Web3Context);

  if (isConnected) return null;

  return (
    <ConnectWalletButton
      onClick={() => {
        const key = addPopup({
          Component: () => <SelectWalletPopup popupKey={key} type={type} />,
        });
      }}
    >
      {label}
    </ConnectWalletButton>
  );
};

const SelectWalletPopup: React.FC<{ type?: "list" | "grid"; popupKey: string }> = ({ type, popupKey }) => {
  const grid = type === "grid";
  const { removePopup, chooseWeb3 } = useContext(Web3Context);
  const [loading, setLoading] = useState(false);

  const close = () => {
    removePopup(popupKey);
  };

  return (
    <Popup>
      <PopupClose
        onClick={() => {
          close();
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 4L9 9" stroke="#BEC4CE" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" />
          <path d="M12 12L20 20" stroke="#BEC4CE" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" />
          <path d="M20 4L4 20" stroke="#BEC4CE" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" />
        </svg>
      </PopupClose>
      <PopupTitle>Connect a wallet on Aptos to continue</PopupTitle>
      <WalletList grid={grid}>
        {wallets.map((item, index) => (
          <WalletItem
            grid={grid}
            key={index}
            onClick={() => {
              chooseWeb3(item.code, () => {
                close();
              });
            }}
          >
            <WalletTitleWrapper grid={grid}>
              <WalletIcon grid={grid}> {grid ? item.icon60 : item.icon36}</WalletIcon>
              <WalletTitle>{item.title}</WalletTitle>
            </WalletTitleWrapper>
            {(window as any)[item.code] && <WalletDetected grid={grid}>Detected</WalletDetected>}
          </WalletItem>
        ))}
      </WalletList>
    </Popup>
  );
};
