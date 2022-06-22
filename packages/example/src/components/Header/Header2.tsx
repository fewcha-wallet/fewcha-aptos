import React, { useEffect, useState } from "react";
import { MENUS } from "config/constants";

import MobileMenu from "./MobileMenu";
import logo from "../../public/svgs/logo-light.svg";
import { useWeb3 } from "components/Provider/Provider";
import { truncateEthAddress } from "utils/address";
import { WalletAlt } from "@styled-icons/boxicons-solid";

const Header: React.FC = () => {
  const [showMobile, setShowMobile] = useState(false);

  const toggleMobile = () => {
    setShowMobile(!showMobile);
    if (showMobile) document.body.style.overflow = "";
    else document.body.style.overflow = "hidden";
  };

  const [nodeURL, setNodeURL] = useState("");
  const [balance, setBalance] = useState("");

  const aptos = useWeb3();
  const { init, account, isConnected, connect, disconnect, web3 } = aptos;

  useEffect(() => {
    if (isConnected) {
      web3.getNodeURL().then((url: string) => {
        console.log("useEffect::getNodeURL", url);
        setNodeURL(url);
      });
      // web3.getAccountResources(account).then((data) => {
      //   console.log("useEffect::getAccountResources", data);
      //   const accountResource = data.find(
      //     (r) => r.type === "0x1::Coin::CoinStore<0x1::TestCoin::TestCoin>"
      //   );
      //   const balance = (accountResource!.data as { coin: { value: string } })
      //     .coin.value;
      //   console.log(balance);
      //   setBalance("1");
      // });
    }
  }, [isConnected]);

  console.log(nodeURL);

  const onShowBalance = () => {
    // const resources = await client.getAccountResources(account.address());
    // const accountResource = resources.find(
    //   (r) => r.type === "0x1::Coin::CoinStore<0x1::TestCoin::TestCoin>"
    // );

    // const balance = (accountResource!.data as { coin: { value: string } }).coin
    //   .value;
    return <></>;
  };
  const onShowButton = () => {
    if (isConnected) {
      return (
        <button
          className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 focus:bg-gray-100 w-64 p-4 shadow rounded bg-white text-sm font-medium leading-none text-black flex items-center justify-between cursor-pointer"
          onClick={() => disconnect()}
        >
          <WalletAlt size={24} />
          <div>
            <div>{truncateEthAddress(account)}</div>
            <div>{balance}</div>
          </div>
          <div>
            <div id="open"></div>
          </div>
        </button>
        // <div className="relative ml-auto flex items-center gap-6">
        //   <button
        //     onClick={() => {
        //       console.log("disconnect");
        //       disconnect();
        //     }}
        //     className="hidden sm:inline-block px-6 py-[14px] bg-[#007EFB] text-white font-medium rounded-[34px]"
        //   >
        //     Disconnect
        //   </button>

        //   <div
        //     className={`block lg:hidden hambuger ${
        //       showMobile ? "is-active" : ""
        //     }`}
        //     onClick={toggleMobile}
        //   >
        //     <span className="line"></span>
        //   </div>
        // </div>
      );
    } else {
      return (
        <div className="relative ml-auto flex items-center gap-6">
          <button
            onClick={() => {
              console.log("connect");
              connect();
            }}
            className="hidden sm:inline-block px-6 py-[14px] bg-[#007EFB] text-white font-medium rounded-[34px]"
          >
            Connect
          </button>

          <div
            className={`block lg:hidden hambuger ${
              showMobile ? "is-active" : ""
            }`}
            onClick={toggleMobile}
          >
            <span className="line"></span>
          </div>
        </div>
      );
    }
  };

  if (!init) return <>Loading...</>;

  return (
    <header
      className={
        "mt-4 fixed top-0 left-0 right-0 w-full z-[999] transition-all ease-in-out duration-300"
      }
    >
      <div className="container xs:px-13 flex items-center">
        <div>
          <a className="block">
            <img
              src={logo}
              alt="logo"
              className="max-w-[105px] md:max-w-[155px]"
            />
          </a>
        </div>

        <div className="hidden lg:flex items-center justify-center flex-1 gap-x-10">
          {MENUS.map((menu, idx) => {
            if (menu.external) {
              return (
                <div key={idx}>
                  <a
                    href={menu.external}
                    key={idx}
                    target="_blank"
                    rel="noreferrer"
                    className="header-link py-2 block text-white font-medium font-caption transition-all ease-in duration-150 hover:text-primary-200"
                  >
                    {menu.name}
                  </a>
                </div>
              );
            }

            if (menu.href) {
              return (
                <div key={idx}>
                  <a
                    onClick={(e) => {
                      if (menu.href === "/#roadmap") {
                        e.preventDefault();
                      }
                    }}
                    className="header-link py-2 block text-white font-medium font-caption transition-all ease-in duration-150 hover:text-primary-200"
                  >
                    {menu.name}
                  </a>
                </div>
              );
            }

            return null;
          })}
        </div>
        {onShowButton()}
      </div>
      <MobileMenu isShow={showMobile} />
    </header>
  );
};

export default Header;
