import React, { useContext, createContext, PropsWithChildren, useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import styled, { css } from "styled-components";
import Web3, { Web3ProviderType, Web3Provider } from "@fewcha/web3";
import { PublicAccount, Response } from "@fewcha/web3/dist/types";
import { isEmpty } from "lodash";

class LocalStorage<T> {
  private reducerKey: string = "";

  constructor(reducerKey: string) {
    this.reducerKey = reducerKey;
  }

  get(defaultData: T) {
    const data = localStorage.getItem(this.reducerKey);
    if (data) {
      return JSON.parse(data) as T;
    }
    return defaultData;
  }

  set(data: T) {
    localStorage.setItem(this.reducerKey, JSON.stringify(data));
    return data;
  }
}

export const Web3Context = createContext<Web3ContextValue>(null as any);
type PopupProps = {};
type PopupType = (props: { Component: React.FC<PopupProps>; callback?: (key: string) => void }) => string;

export const useWeb3 = () => {
  const { init, account, balance, isConnected, connect, disconnect, network, txs, web3 } = useContext(Web3Context);
  return { init, account, balance, isConnected, connect, disconnect, network, txs, web3 };
};

export type Tx = { id: string; hash: string };
type Web3ContextValue = {
  init: boolean;

  account: PublicAccount;
  balance: string;
  // getBalance(): Promise<string>;

  connect: () => Promise<Response<PublicAccount>>;
  disconnect: () => Promise<void>;
  isConnected: boolean;
  // isConnected(): Promise<boolean>;

  network: string;
  txs: Tx[];

  addPopup: PopupType;
  removePopup: (key: string) => void;
  removeAll: () => void;

  changeWeb3: (walletCodename: string, callback: () => void) => Promise<void>;

  web3: Web3ProviderType;
};

const emptyAccount = { address: "", publicKey: "" };

const store = new LocalStorage<string>("fewcha-web3-react-last-wallet");

const Web3ReactProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [init, setInit] = useState(false);
  const [account, setAccount] = useState<PublicAccount>(emptyAccount);
  const [balance, setBalance] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [network, setNetwork] = useState("");
  const [txs, setTxs] = useState<Tx[]>([]);
  const [web3, setWeb3] = useState<Web3ProviderType>({} as any);
  const [loopId, setLoopId] = useState<NodeJS.Timeout>();
  const [popups, changePopups] = useState<{ key: string; Component: React.FC<{}> }[]>([]);
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

  const changeWeb3 = async (walletCodename: string, callback: () => void): Promise<void> => {
    const wallet = (window as any)[walletCodename];
    if (wallet) {
      const provider = new Web3Provider(wallet);
      const w = new Web3(provider);
      setWeb3(w.action);

      const account = await (w.action.connect as any)((res: any) => {
        if (!isEmpty(res)) {
          // support martian
          if (res.address) setAccount({ address: res.address.toString(), publicKey: "" });
        }
      });

      if (!isEmpty(account)) {
        setAccount(account);
      }

      store.set(walletCodename);

      callback();
    }
  };

  const connect = async (): Promise<Response<PublicAccount>> => {
    if (isEmpty(web3)) throw new Error("404");

    setInit(true);
    return web3.connect();
  };

  const disconnect = async () => {
    if (isEmpty(web3)) throw new Error("404");
    setAccount(emptyAccount);
    setNetwork("");
    setBalance("0");
    setIsConnected(false);
    await web3.disconnect();

    if (window) {
      if (window.location) {
        if (window.location.reload) window.location.reload();
      }
    }
  };

  const getAccount = () => {
    if (!isEmpty(web3)) {
      if (web3.account) {
        web3.account().then((data) => {
          setAccount(data.data);
        });
      }
    }
  };

  const getNetwork = () => {
    if (!isEmpty(web3)) {
      if (web3.getNetwork) {
        web3.getNetwork().then((data) => {
          setNetwork(data.data);
        });
      }
    }
  };

  const getBalance = () => {
    if (!isEmpty(web3)) {
      if (web3.getBalance) {
        web3.getBalance().then((data) => {
          setBalance(data.data);
        });
      } else {
        let func = web3.sdk?.getAccountResources;

        if (!func) {
          // support old versions of wallets
          func = (web3 as any).getAccountResources;
          if (func)
            if (account)
              func(account.address).then((data) => {
                const accountResource = data.data.find((r) => r.type === "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>");
                if (accountResource) {
                  if ((accountResource.data as any).coin) {
                    const balance = (accountResource.data as any).coin.value;
                    setBalance(balance);
                    return;
                  }
                }

                setBalance("0");
              });
        }

        if (!func) {
          // support maritian
          // https://docs.martianwallet.xyz/docs/methods/fetch-account-balance
          func = (web3 as any).getAccountBalance;
          if (func)
            (func as any)((res: { status: number; data: any }) => {
              if (res.status === 200) {
                setBalance(res.data);
              }
            });
          return;
        }
      }
    }
  };

  const connectedEvent = () => {
    setIsConnected(true);
    setTimeout(() => {
      const code = store.get("fewcha-web3-react-last-wallet");
      if (code) {
        changeWeb3(code, () => {
          setInit(true);
          getAccount();

          getNetwork();
        });
      }
    }, 200);
  };

  const disconnectedEvent = () => {
    setIsConnected(false); // TO-DO: handle correct tab connected
    setAccount(emptyAccount);
  };

  const pushTransaction = (event: Event) => {
    const e = event as CustomEvent;
    if (e.detail) setTxs([...txs, { id: e.detail.id, hash: e.detail.tx }]);
  };

  const loop = async (web3: Web3ProviderType, isConnected: boolean) => {
    if (isConnected) {
      if (!account.address) {
        getAccount();
      }
      if (!network) {
        getNetwork();
      }
    } else {
      if (web3) {
        if (typeof web3.isConnected === "function")
          web3.isConnected().then((data) => {
            setIsConnected(data.data);
            getAccount();
            getNetwork();
          });
        // support martian
        if (typeof web3.isConnected === "boolean") setIsConnected((web3 as any).isConnected as boolean);
      }
    }

    setLoopId(setTimeout(() => loop(web3, isConnected), 5000));
  };

  useEffect(() => {
    setLoopId(setTimeout(() => loop(web3, isConnected), 1000));
    return () => {
      clearTimeout(loopId);
    };
    // eslint-disable-next-line
  }, [web3, isConnected]);

  useEffect(() => {
    window.addEventListener("aptos#initialized", () => {});
    window.addEventListener("aptos#connected", connectedEvent);
    window.addEventListener("aptos#disconnected", disconnectedEvent);
    window.addEventListener("aptos#changeAccount", getAccount);
    window.addEventListener("aptos#changeBalance", getBalance);
    window.addEventListener("aptos#changeNetwork", getNetwork);
    window.addEventListener("aptos#transaction", pushTransaction);

    return () => {
      window.removeEventListener("aptos#initialized", () => {});
      window.removeEventListener("aptos#connected", connectedEvent);
      window.removeEventListener("aptos#disconnected", disconnectedEvent);
      window.removeEventListener("aptos#changeAccount", getAccount);
      window.removeEventListener("aptos#changeBalance", getBalance);
      window.removeEventListener("aptos#changeNetwork", getNetwork);
      window.removeEventListener("aptos#transaction", pushTransaction);
    };
    // eslint-disable-next-line
  }, [web3]);

  const Component = popups.length > 0 ? popups[popups.length - 1].Component : () => <></>;

  return (
    <Web3Context.Provider value={{ init, account, balance, isConnected, txs, addPopup, removePopup, removeAll, connect, disconnect, network, changeWeb3, web3 }}>
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
  const { removePopup, changeWeb3 } = useContext(Web3Context);
  // const [loading, setLoading] = useState(false);

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
              changeWeb3(item.code, () => {
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

// popup background
const PopupBackground = styled.div`
  overflow-y: auto;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 40;
`;

const PopupBackgroundScreen = styled.div`
  display: flex;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 1rem;
  padding-bottom: 5rem;
  text-align: center;
  justify-content: center;
  align-items: center;
  min-height: 100vh;

  @media (min-width: 640px) {
    display: block;
    padding: 0;
  }
`;

const PopupBackgroundWrapper = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transition-property: opacity;
`;

const PopupBackgroundBackground = styled.div`
  background: rgba(255, 227, 227, 0.1) !important;
  backdrop-filter: blur(3px) !important;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

// button

const ConnectWalletButton = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 15px 30px;
  gap: 10px;

  background: #14161a;

  border-radius: 100px;

  flex: none;
  order: 0;
  flex-grow: 0;

  cursor: pointer;

  line-height: 120%;
  color: #ffffff;
  font-weight: bold;
  font-size: 18px;

  outline: 0;

  border: none;

  &:hover {
    background-color: #2a2c33;
  }

  transition: background-color 0.2s ease-in-out;
`;

// popup
const Popup = styled.div`
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  position: relative;
  display: inline-block;
  overflow: hidden;
  z-index: 50;
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  background-color: #ffffff;
  transition-property: all;
  text-align: left;
  vertical-align: bottom;
  width: 100%;
  border-radius: 0.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);

  @media (min-width: 640px) {
    margin-top: 2rem;
    margin-bottom: 2rem;
    vertical-align: middle;
    max-width: 480px;
  }

  background-color: #050507;
  border-radius: 40px;
`;

const PopupTitle = styled.h1`
  font-style: normal;
  font-weight: 500;
  font-size: 32px;
  line-height: 120%;

  text-align: center;
  letter-spacing: 0.02em;

  color: #ffffff;

  max-width: 70%;
  margin: 36px auto 60px;
`;

const PopupClose = styled.div`
  display: flex;
  background-color: #000000;
  justify-content: flex-end;
  cursor: pointer;
`;

// wallet list
const WalletList = styled.div<{ grid: boolean }>`
  ${(props) =>
    props.grid
      ? css`
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        `
      : css`
          flex-direction: column;
        `}
`;

const WalletItem = styled.div<{ grid: boolean }>`
  ${(props) =>
    props.grid
      ? css`
          flex-direction: column;
          display: flex;
          border-radius: 16px;
          border-width: 1px;
          background: #201e28;
          margin-bottom: 16px;
        `
      : css`
          display: flex;
          border-radius: 16px;
          border-width: 1px;
          background: #201e28;
          margin-bottom: 16px;
        `}
  align-items: center;
  cursor: pointer;
`;

const WalletTitleWrapper = styled.div<{ grid: boolean }>`
  ${(props) =>
    props.grid
      ? css`
          flex-direction: column;
        `
      : css`
          flex-direction: row;
        `}
  display: flex;
  padding: 24px 16px;
`;

const WalletIcon = styled.div<{ grid: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;

  ${(props) =>
    props.grid
      ? css`
          margin-bottom: 12px;
        `
      : css`
          margin-right: 16px;
        `}
`;

const WalletTitle = styled.div`
  color: #ffffff;

  font-style: normal;
  font-weight: 500;
  font-size: 28px;
  line-height: 120%;
`;

const WalletDetected = styled.div<{ grid: boolean }>`
  color: #3b82f6;
  font-size: 24px;

  ${(props) =>
    props.grid
      ? css`
          margin-bottom: 15px;
        `
      : css`
          margin-left: auto;
          margin-right: 24px;
        `}
`;

const wallets = [
  {
    code: "aptos",
    title: "Aptos",
    icon36: (
      <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="36px" height="36px" viewBox="0 0 36 36" version="1.1">
        <g id="surface1">
          <path
            style={{ stroke: "none", fillRule: "nonzero", fill: "#ffffff", fillOpacity: 1 }}
            d="M 27.882812 12.042969 L 24.695312 12.042969 C 24.328125 12.042969 23.976562 11.886719 23.730469 11.609375 L 22.433594 10.15625 C 22.242188 9.941406 21.964844 9.816406 21.675781 9.816406 C 21.386719 9.816406 21.109375 9.941406 20.914062 10.15625 L 19.800781 11.398438 C 19.433594 11.808594 18.914062 12.042969 18.367188 12.042969 L 0.964844 12.042969 C 0.457031 13.476562 0.132812 14.972656 0 16.488281 L 16.453125 16.488281 C 16.742188 16.488281 17.019531 16.371094 17.21875 16.164062 L 18.757812 14.566406 C 18.945312 14.367188 19.210938 14.253906 19.488281 14.257812 L 19.546875 14.257812 C 19.839844 14.257812 20.117188 14.378906 20.308594 14.597656 L 21.601562 16.050781 C 21.84375 16.328125 22.195312 16.484375 22.566406 16.488281 L 36 16.488281 C 35.871094 14.972656 35.554688 13.476562 35.050781 12.042969 L 27.851562 12.042969 Z M 27.882812 12.042969 "
          />
          <path
            style={{ stroke: "none", fillRule: "nonzero", fill: "#ffffff", fillOpacity: 1 }}
            d="M 9.960938 25.828125 C 10.246094 25.828125 10.523438 25.710938 10.722656 25.507812 L 12.257812 23.910156 C 12.449219 23.710938 12.714844 23.597656 12.988281 23.597656 L 13.050781 23.597656 C 13.335938 23.601562 13.609375 23.726562 13.800781 23.941406 L 15.089844 25.390625 C 15.335938 25.671875 15.691406 25.832031 16.0625 25.828125 L 34.273438 25.828125 C 34.960938 24.40625 35.460938 22.898438 35.753906 21.34375 L 18.28125 21.34375 C 17.910156 21.34375 17.558594 21.1875 17.308594 20.910156 L 16.019531 19.453125 C 15.828125 19.234375 15.550781 19.109375 15.261719 19.109375 C 14.972656 19.109375 14.695312 19.234375 14.503906 19.453125 L 13.390625 20.699219 C 13.03125 21.109375 12.511719 21.34375 11.964844 21.34375 L 0.246094 21.34375 C 0.539062 22.898438 1.039062 24.40625 1.726562 25.828125 Z M 9.960938 25.828125 "
          />
          <path
            style={{ stroke: "none", fillRule: "nonzero", fill: "#ffffff", fillOpacity: 1 }}
            d="M 22.871094 7.199219 C 23.160156 7.203125 23.433594 7.085938 23.632812 6.875 L 25.199219 5.269531 C 25.390625 5.070312 25.65625 4.960938 25.933594 4.960938 L 25.992188 4.960938 C 26.28125 4.960938 26.558594 5.082031 26.753906 5.296875 L 28.042969 6.757812 C 28.292969 7.03125 28.644531 7.1875 29.015625 7.1875 L 32.476562 7.1875 C 29.054688 2.648438 23.695312 -0.015625 18.011719 -0.015625 C 12.328125 -0.0117188 6.972656 2.660156 3.550781 7.199219 Z M 22.871094 7.199219 "
          />
          <path
            style={{ stroke: "none", fillRule: "nonzero", fill: "#ffffff", fillOpacity: 1 }}
            d="M 15.917969 30.277344 L 11.183594 30.277344 C 10.808594 30.28125 10.449219 30.121094 10.199219 29.84375 L 8.910156 28.386719 C 8.714844 28.171875 8.441406 28.050781 8.152344 28.050781 C 7.863281 28.050781 7.585938 28.171875 7.390625 28.386719 L 6.28125 29.632812 C 5.917969 30.042969 5.398438 30.277344 4.855469 30.277344 L 4.800781 30.277344 C 8.222656 33.925781 13 35.992188 18 35.992188 C 23 35.992188 27.777344 33.925781 31.199219 30.277344 Z M 15.917969 30.277344 "
          />
        </g>
      </svg>
    ),
    icon60: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" width="60px" height="60px" fill="#ffffff">
        <path d="M46.47,20.07H41.16a2.15,2.15,0,0,1-1.61-.72l-2.16-2.42a1.69,1.69,0,0,0-2.53,0L33,19a3.21,3.21,0,0,1-2.39,1.07h-29A30.26,30.26,0,0,0,0,27.48H27.42a1.78,1.78,0,0,0,1.28-.54l2.56-2.66a1.67,1.67,0,0,1,1.22-.52h.1a1.7,1.7,0,0,1,1.27.57L36,26.75a2.17,2.17,0,0,0,1.61.73H60a30.26,30.26,0,0,0-1.58-7.41h-12Z"></path>
        <path d="M16.6,43.05a1.78,1.78,0,0,0,1.27-.54l2.56-2.66a1.7,1.7,0,0,1,1.22-.52h.1A1.7,1.7,0,0,1,23,39.9l2.15,2.42a2.14,2.14,0,0,0,1.62.73H57.12a29.73,29.73,0,0,0,2.47-7.48H30.47a2.17,2.17,0,0,1-1.62-.72L26.7,32.42a1.69,1.69,0,0,0-2.53,0L22.32,34.5a3.18,3.18,0,0,1-2.38,1.07H.41a29.73,29.73,0,0,0,2.47,7.48Z"></path>
        <path d="M38.12,12a1.74,1.74,0,0,0,1.27-.54L42,8.78a1.69,1.69,0,0,1,1.22-.51h.1a1.69,1.69,0,0,1,1.27.56l2.15,2.43a2.17,2.17,0,0,0,1.62.72h5.77A30.19,30.19,0,0,0,5.92,12Z"></path> <path d="M26.53,50.46H18.64A2.17,2.17,0,0,1,17,49.74l-2.15-2.43a1.71,1.71,0,0,0-2.53,0l-1.85,2.08a3.18,3.18,0,0,1-2.38,1.07H8a30.16,30.16,0,0,0,44,0Z"></path>
      </svg>
    ),
  },
  {
    code: "fewcha",
    title: "Fewcha",
    icon36: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M27 18H9C9 13.05 13.05 9 18 9C22.95 9 27 13.05 27 18Z" fill="white" />
        <path d="M18 0C8.055 0 0 8.055 0 18C0 27.945 8.055 36 18 36C27.945 36 36 27.945 36 18C36 8.055 27.945 0 18 0ZM18 31.5C10.575 31.5 4.5 25.425 4.5 18C4.5 10.575 10.575 4.5 18 4.5C25.425 4.5 31.5 10.575 31.5 18C31.5 25.425 25.425 31.5 18 31.5Z" fill="white" />
      </svg>
    ),
    icon60: (
      <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M45 30H15C15 21.75 21.75 15 30 15C38.25 15 45 21.75 45 30Z" fill="white" />
        <path d="M30 0C13.425 0 0 13.425 0 30C0 46.575 13.425 60 30 60C46.575 60 60 46.575 60 30C60 13.425 46.575 0 30 0ZM30 52.5C17.625 52.5 7.5 42.375 7.5 30C7.5 17.625 17.625 7.5 30 7.5C42.375 7.5 52.5 17.625 52.5 30C52.5 42.375 42.375 52.5 30 52.5Z" fill="white" />
      </svg>
    ),
  },
  {
    code: "martian",
    title: "Martian",
    icon36: (
      <div style={{ border: "1px solid #ffffff", borderRadius: 5 }}>
        <img src="https://avatars.githubusercontent.com/u/103241191?s=200&v=4" width={33} height={33} style={{ display: "block" }} alt="Martian" />
      </div>
    ),
    icon60: (
      <div style={{ border: "1px solid #ffffff", borderRadius: 5 }}>
        <img src="https://avatars.githubusercontent.com/u/103241191?s=200&v=4" width={56} height={56} style={{ display: "block" }} alt="Martian" />
      </div>
    ),
  },
  {
    code: "hippo",
    title: "Hippo",
    icon36: <img src="https://raw.githubusercontent.com/hippospace/hippo-wallet/main/public/icon/hippo_logo_48.png" width={36} height={36} alt="Logo of Hippo" />,
    icon60: <img src="https://raw.githubusercontent.com/hippospace/hippo-wallet/main/public/icon/hippo_logo_128.png" width={60} height={60} alt="Logo of Hippo" />,
  },
];
