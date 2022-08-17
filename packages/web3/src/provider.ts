// Copyright 2022 Fewcha. All rights reserved.

import { Web3ProviderType } from "./types";

class Web3Provider {
  public provider: Web3ProviderType;

  constructor(provider: Web3ProviderType) {
    this.provider = provider as Web3ProviderType;
    return this;
  }
}

export default Web3Provider;
