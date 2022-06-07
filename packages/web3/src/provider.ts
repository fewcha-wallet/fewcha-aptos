// Copyright 2022 Fewcha. All rights reserved.

import { AptosAccount, AptosClient } from "aptos";
import { RequestParams } from "aptos/dist/api/http-client";
import { resolve } from "path";
import Web3Account from "./account";
import AptosClientMask from "./aptos-client-provider";
import { Web3ProviderStandard } from "./types";
import { isUrl } from "./utils/isUrl";

const EMPTY_PROVIDER = new Error("Provider is empty");

class Web3Provider {
  private client: AptosClient = null;
  private provider: Web3ProviderStandard = null;

  public isEmpty() {
    return !this.provider;
  }

  constructor(
    provider: string | AptosClient | Web3ProviderStandard,
    account?: AptosAccount
  ) {
    // parse node URL
    if (typeof provider === "string") {
      if (!isUrl(provider)) {
        throw Error("invalid provider URL");
      }

      this.client = new AptosClient(provider);
      this.provider = new AptosClientMask(this.client, account);
      return this;
    }

    // for AptosClient
    if (provider instanceof AptosClient) {
      this.client = provider as AptosClient;
      this.provider = new AptosClientMask(this.client, account);
      return this;
    }

    // for web3provider standard
    const p = provider as Web3ProviderStandard;
    this.client = new AptosClient(p.getNodeURL());
    this.provider = p;
    return this;
  }
}

export default Web3Provider;
