// Copyright 2022 Fewcha. All rights reserved.

import { AptosClient } from "aptos";

class Web3Provider extends AptosClient {
  constructor(props) {
    super(props);
  }
}

export default Web3Provider;
