// Copyright 2022 Fewcha. All rights reserved.

import { AptosAccount, AptosClient } from "@fewcha/aptos";
import AptosProvider from "./provider/aptos";
import { Web3ProviderStandard } from "./types";
import { isUrl } from "./utils/isUrl";

class Web3Provider {
  public provider: Web3ProviderStandard;

  constructor(provider: string | AptosClient | Web3ProviderStandard, account?: AptosAccount) {
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

    // for FewchaWallet
    if ((provider as any).isFewchaWallet) {
      this.provider = provider as Web3ProviderStandard;
      return this;
    }

    // for web3provider standard
    const p = provider as Web3ProviderStandard;
    this.provider = p;
    return this;
  }
}

export default Web3Provider;
