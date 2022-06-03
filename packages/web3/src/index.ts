// Copyright 2022 Fewcha. All rights reserved.

import { AptosClient } from "aptos";
import { Transaction } from "aptos/dist/api/data-contracts";
import Web3Account from "./account";
import Web3Provider from "./provider";
import { isUrl } from "./utils/isUrl";

class Web3 {
  public provider: Web3Provider = null;
  public account: Web3Account = null;

  constructor() {
    return this;
  }

  public setProvider(client: AptosClient | string) {
    if (typeof client === "string") {
      if (!isUrl(client)) {
        throw Error("invalid provider URL");
      }

      this.provider = new Web3Provider(new AptosClient(client));
    }

    this.provider = new Web3Provider(client);
    return this;
  }

  public getCurrentProvider() {
    return this.provider;
  }

  public isConnect() {
    return !!this.account.address().hex();
  }

  public connect(account: Web3Account) {
    this.account = account;
    return this;
  }

  public send(transaction: Transaction) {}
}

export default Web3;
