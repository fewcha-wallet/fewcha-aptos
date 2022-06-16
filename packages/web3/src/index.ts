// Copyright 2022 Fewcha. All rights reserved.

import Web3Account from "./account";
import Web3Provider from "./provider";
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

export { Web3Account, Web3Provider };
export type { Web3ProviderStandard };

export default Web3;
