// Copyright 2022 Fewcha. All rights reserved.

import { Types as Gen } from "aptos";
import { createReponse, PublicAccount, Response } from "./types";

export class PetraMask {
  public provider: any;
  constructor(provider: any) {
    this.provider = provider;
  }

  public async connect(): Promise<Response<PublicAccount>> {
    const response = await this.provider.connect();
    if (response) {
      const account = await this.provider.account();
      return createReponse<PublicAccount>("connect", 200, account);
    }
    return createReponse<PublicAccount>("connect", 400, null);
  }
  public async account(): Promise<Response<PublicAccount>> {
    const isConnect = await this.provider.isConnected();
    if (isConnect) {
      const account = await this.provider.account();
      return createReponse<PublicAccount>("isConnected", 200, account);
    }
    return createReponse<PublicAccount>("isConnected", 400, null);
  }
  public async isConnected(): Promise<Response<boolean>> {
    const response = await this.provider.isConnected();
    return createReponse<boolean>("isConnected", 200, response);
  }
  public async disconnect(): Promise<Response<boolean>> {
    const response = await this.provider.disconnect();
    if (response) {
      return createReponse<boolean>("disconnect", 200, true);
    }
    return createReponse<boolean>("disconnect", 400, false);
  }
  public async getNetwork(): Promise<Response<string>> {
    const response = await this.provider.network();
    return createReponse<string>("network", 200, response);
  }
  public async signAndSubmitTransaction(txnRequest: Gen.SubmitTransactionRequest): Promise<Response<Gen.HexEncodedBytes>> {
    const response = await this.provider.signAndSubmitTransaction(txnRequest);
    return createReponse<Gen.HexEncodedBytes>("signAndSubmitTransaction", 200, response);
  }
  public async signTransaction(txnRequest: Gen.SubmitTransactionRequest): Promise<Response<Gen.SubmitTransactionRequest>> {
    const response = await this.provider.signTransaction(txnRequest);
    return createReponse<Gen.SubmitTransactionRequest>("signTransaction", 200, response);
  }
  public async signMessage(message: string): Promise<Response<string>> {
    const response = await this.provider.signMessage(message);
    return createReponse<string>("signMessage", 200, response);
  }
}
