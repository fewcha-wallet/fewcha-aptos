import React, { useEffect, useState } from "react";
import { useWeb3 } from "components/Provider/Provider";

const Header: React.FC = () => {
  const [nodeURL, setNodeURL] = useState("");
  const aptos = useWeb3();

  const { init, account, isConnected, connect, disconnect, web3 } = aptos;

  useEffect(() => {
    if (isConnected) {
      web3.getNodeURL().then((url) => {
        setNodeURL(url);
      });
    }
  }, [isConnected]);

  if (!init) return <header>Loading..</header>;

  return (
    <header>
      {isConnected ? (
        <div>
          {/* logged in */}
          <div>Connected</div>
          <div>Address: {account}</div>
          <div>{nodeURL}</div>
          <div>
            <button
              onClick={() => {
                disconnect();
              }}
            >
              Logout
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div>Disconnected</div>
          <button
            onClick={() => {
              connect();
            }}
          >
            Connect
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
