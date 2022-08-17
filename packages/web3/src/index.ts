// Copyright 2022 Fewcha. All rights reserved.

import * as Aptos from "aptos";
import * as utils from "./utils";
import Web3Provider from "./provider";
import { Web3ProviderType, Web3SDK, Web3Token } from "./types";

class Web3 {
  public action: Web3ProviderType;

  constructor(provider?: Web3Provider) {
    if (!provider) {
      this.action = new Web3Provider((window as any).fewcha).provider;
      window.addEventListener("fewcha#initialized", () => {
        this.action = new Web3Provider((window as any).fewcha).provider;
      });
      return this;
    }

    this.action = provider.provider;
    return this;
  }

  public setProvider(provider: Web3Provider) {
    this.action = provider.provider;
    return this;
  }
}

export { Aptos, utils };

export { Web3Provider };
export type { Web3ProviderType, Web3Token, Web3SDK };

export default Web3;
