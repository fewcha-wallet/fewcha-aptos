// Copyright 2022 Fewcha. All rights reserved.

import * as Aptos from "aptos";
import * as utils from "./utils";
import Web3Provider from "./provider";
import { IWeb3Provider, IWeb3AptosSDK, IWeb3SuiSDK, IWeb3AptosToken, IWeb3Coin, Response, PublicAccount, SignMessagePayload, SignMessageResponse, PaginationArgs, OptionalTransactionArgs, SubmitTransactionRequest } from "./types";
import { MartianMask } from "./martina.mask";
import { PetraMask } from "./petra.mask";

class Web3 {
  public action: IWeb3Provider;

  constructor(provider?: IWeb3Provider) {
    if (provider) {
      if ((provider as any).isFewcha) {
        this.action = new Web3Provider(provider).provider;
      } else {
        if ((provider as any)._isConnected !== undefined) {
          this.action = new MartianMask(provider) as any;
        } else {
          this.action = new PetraMask(provider) as any;
        }
      }
    } else {
      this.action = new Web3Provider((window as any).fewcha).provider;

      window.addEventListener("fewcha#initialized", () => {
        this.action = new Web3Provider((window as any).fewcha).provider;
      });

      window.addEventListener("martian#initialized", () => {
        this.action = new Web3Provider((window as any).martian).provider;
      });
    }

    return this;
  }

  public setProvider(provider: Web3Provider) {
    this.action = provider.provider;
    return this;
  }
}

export { Aptos, utils };

export { Web3Provider };
export type { OptionalTransactionArgs, SubmitTransactionRequest, IWeb3Provider, IWeb3AptosSDK, IWeb3SuiSDK, IWeb3AptosToken, IWeb3Coin, Response, PublicAccount, SignMessagePayload, SignMessageResponse, PaginationArgs };

export default Web3;
