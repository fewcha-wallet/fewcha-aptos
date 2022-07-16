// Copyright 2022 Fewcha. All rights reserved.

import { AptosAccount, MaybeHexString } from "aptos";

class Web3Account extends AptosAccount {
  constructor(privateKeyBytes?: Uint8Array | undefined, address?: MaybeHexString) {
    super(privateKeyBytes, address);
  }
}

export default Web3Account;
