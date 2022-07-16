// Copyright 2022 Fewcha. All rights reserved.

import { AptosAccount, AptosClient } from "aptos";
import AptosProvider from "./provider/aptos";
import { Web3ProviderType } from "./types";
import { isUrl } from "./utils/isUrl";

class Web3Provider {
  public provider: Web3ProviderType;

  constructor(provider: string | AptosClient | Web3ProviderType, account?: AptosAccount) {
    // parse node URL
    if (typeof provider === "string") {
      if (!isUrl(provider)) {
        throw Error("invalid provider URL");
      }

      this.provider = new AptosProvider(new AptosClient(provider), account);
      return this;
    }

    // for AptosClient
    if (provider instanceof AptosClient) {
      this.provider = new AptosProvider(provider, account);
      return this;
    }

    if (provider) {
      this.provider = provider as Web3ProviderType;
      return this;
    }

    // for web3provider standard
    const p = provider as Web3ProviderType;
    this.provider = p;
    return this;
  }
}

export default Web3Provider;
