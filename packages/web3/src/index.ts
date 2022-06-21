import * as Aptos from "aptos";
import Web3Account from "./account";
import Web3Provider from "./provider";
import AptosProvider from "./provider/aptos";
import { Web3ProviderStandard } from "./types";

class Web3 {
  public action: Web3ProviderStandard;

  constructor(provider: Web3Provider) {
    this.action = provider.provider;
  }

  public setProvider(provider: Web3Provider) {
    this.action = provider.provider;
    return this;
  }
}

const providers = {
  AptosProvider,
};

export { Aptos };

export { Web3Account, Web3Provider, providers };
export type { Web3ProviderStandard };

export default Web3;
