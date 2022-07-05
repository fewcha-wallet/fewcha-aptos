import { AptosAccount, MaybeHexString } from "@fewcha/aptos";

class Web3Account extends AptosAccount {
  constructor(privateKeyBytes?: Uint8Array | undefined, address?: MaybeHexString) {
    super(privateKeyBytes, address);
  }
}

export default Web3Account;
