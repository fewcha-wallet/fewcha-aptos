// Copyright 2022 Fewcha. All rights reserved.

import { IWeb3Provider } from "./types";

class Web3Provider {
  public provider: IWeb3Provider;

  constructor(provider: IWeb3Provider) {
    this.provider = provider as IWeb3Provider;
    return this;
  }
}

export default Web3Provider;
