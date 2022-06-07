// Copyright 2022 Fewcha. All rights reserved.

import { Transaction } from "aptos/dist/api/data-contracts";
import Web3Account from "./account";
import Web3Provider from "./provider";
import { Web3ProviderStandard } from "./types";

class Web3 {
  public provider: Web3Provider = null;
  public account: Web3Account = null;

  constructor() {
    return this;
  }

  public setProvider(provider: Web3Provider) {
    this.provider = provider;
    return this;
  }

  public getCurrentProvider() {
    return this.provider;
  }

  public send(transaction: Transaction) {}
}

export { Web3Account, Web3Provider };
export type { Web3ProviderStandard };

export default Web3;
