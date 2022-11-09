// Copyright 2022 Fewcha. All rights reserved.

import { BCS, MaybeHexString, Types as Gen } from "aptos";
import { createReponse, PublicAccount, Response } from "./types";

type User = {
  address: string;
  publicKey: string;
};

export class MartianMaskSDK {
  public provider: any;

  constructor(provider: any) {
    this.provider = provider;
  }

  public async getAccountResources(accountAddress: MaybeHexString, query?: { ledgerVersion?: BigInt | number }): Promise<Response<Gen.MoveResource[]>> {
    const res = await this.provider.getAccountResources(accountAddress);
    return createReponse<Gen.MoveResource[]>("getAccountResources", 200, res);
  }

  public async getAccount(accountAddress: MaybeHexString): Promise<Response<Gen.AccountData>> {
    const res = await this.provider.getAccount(accountAddress);
    return createReponse<Gen.AccountData>("getAccount", 200, res);
  }

  public async getTransactions(query?: { start?: BigInt | number; limit?: number }): Promise<Response<Gen.Transaction[]>> {
    let res = null;
    if (query) {
      res = await this.provider.getTransactions(query);
    } else {
      res = await this.provider.getTransactions();
    }
    return createReponse<Gen.Transaction[]>("getTransactions", 200, res);
  }
  public async getAccountTransactions(accountAddress: MaybeHexString, query?: { start?: BigInt | number; limit?: number }): Promise<Response<Gen.Transaction[]>> {
    const res = await this.provider.getAccountTransactions(accountAddress);
    return createReponse<Gen.Transaction[]>("getAccountTransactions", 200, res);
  }

  public async getTransactionByHash(txnHash: string): Promise<Response<Gen.Transaction>> {
    const res = await this.provider.getTransaction(txnHash);
    return createReponse<Gen.Transaction>("getTransactionByHash", 200, res);
  }

  public async getChainId(): Promise<Response<number>> {
    const res = await this.provider.getChainId();
    return createReponse<number>("getChainId", 200, res);
  }
}

export class MartianMaskToken {
  public provider: any;
  constructor(provider: any) {
    this.provider = provider;
  }

  public async createCollection(name: string, description: string, uri: string, maxAmount?: BCS.AnyNumber): Promise<Response<string>> {
    const txnHash = await this.provider.createCollection(name, description, uri);
    return createReponse<string>("createCollection", 200, txnHash);
  }
  public async createToken(collectionName: string, name: string, description: string, supply: number, uri: string, max?: BCS.AnyNumber, royalty_payee_address?: MaybeHexString, royalty_points_denominator?: number, royalty_points_numerator?: number, property_keys?: Array<string>, property_values?: Array<string>, property_types?: Array<string>): Promise<Response<string>> {
    const txnHash = await this.provider.createToken(collectionName, name, description, supply, uri, 1);
    return createReponse<string>("createToken", 200, txnHash);
  }
}
export class MartianMask {
  //todo: [generateRawTransaction,generateSignSubmitRawTransaction,BCS,generateSignSubmitWaitForTransaction]
  public provider: any;
  public user: User;
  public sdk: any;
  public token: any;

  constructor(provider: any) {
    this.provider = provider;
    this.sdk = new MartianMaskSDK(provider);
    this.token = new MartianMaskToken(provider);
  }
  public setUser(user: User) {
    this.user = user;
  }

  public async reConnect() {
    const response = await this.provider.connect();
    if (response) {
      const user: User = {
        address: response.address,
        publicKey: response.publicKey,
      };
      this.setUser(user);
    }
  }

  public async connect(): Promise<Response<PublicAccount>> {
    const response = await this.provider.connect();

    if (response) {
      const user: User = {
        address: response.address,
        publicKey: response.publicKey,
      };
      this.setUser(user);
    }

    return createReponse<PublicAccount>("connect", 200, response);
  }

  public async disconnect(): Promise<Response<boolean>> {
    const response = await this.provider.disconnect();

    this.setUser(null);
    return createReponse<boolean>("disconnect", 200, response);
  }

  public async isConnected(): Promise<Response<boolean>> {
    if (this.user.address && this.user.publicKey) {
      return createReponse<boolean>("isConnected", 200, true);
    }

    return createReponse<boolean>("isConnected", 200, false);
  }

  public async account(): Promise<Response<PublicAccount>> {
    if (!this.user) {
      await this.reConnect();
    }

    return createReponse<PublicAccount>("account", 200, this.user);
  }

  public async getNetwork(): Promise<Response<string>> {
    const res = await this.provider.network();
    console.log("7s62::getNetwork:", res);
    return createReponse<string>("getNetwork", 200, res);
  }

  public async getNetworkURL(): Promise<Response<string>> {
    const res = await this.provider.network();
    console.log("7s62::getNetworkURL:", res);
    return createReponse<string>("getNetworkURL", 200, res);
  }
  public async getBalance(): Promise<Response<string>> {
    console.log("7s62::getBalance");
    const res = await this.provider.legacy.getAccountBalance();
    console.log("7s62::getBalance:", res);
    return createReponse<string>("getAccountBalance", 200, res);
  }

  public async generateTransaction(payload: Gen.EntryFunctionPayload, options?: Partial<Gen.SubmitTransactionRequest>): Promise<Response<Uint8Array>> {
    console.log("7s62::generateTransaction");
    if (!this.user) {
      await this.reConnect();
    }
    const res = await this.provider.generateTransaction(this.user.address, payload);
    return createReponse<Uint8Array>("generateTransaction", 200, res);
  }
  public async signTransaction(txnRequest: Gen.SubmitTransactionRequest): Promise<Response<Gen.SubmitTransactionRequest>> {
    const res = await this.provider.signTransaction(txnRequest);
    return createReponse<Gen.SubmitTransactionRequest>("signTransaction", 200, res);
  }
  public async submitTransaction(signedTxnRequest: Gen.SubmitTransactionRequest): Promise<Response<Gen.HexEncodedBytes>> {
    const res = await this.provider.submitTransaction(signedTxnRequest);
    return createReponse<Gen.HexEncodedBytes>("submitTransaction", 200, res);
  }
  public async generateSignSubmitTransaction(payload: Gen.EntryFunctionPayload, extraArgs?: { maxGasAmount?: BCS.Uint64; gasUnitPrice?: BCS.Uint64; expireTimestamp?: BCS.Uint64 }): Promise<Response<Gen.HexEncodedBytes>> {
    console.log("7s62::generateSignSubmitTransaction");
    if (!this.user) {
      await this.reConnect();
    }
    const gen = await this.provider.generateTransaction(this.user.address, payload);
    const sign = await this.provider.signTransaction(gen);
    const sub = await this.provider.submitTransaction(sign);
    return createReponse("generateSignSubmitTransaction", 200, sub);
  }

  public async signAndSubmitTransaction(txnRequest: Gen.SubmitTransactionRequest): Promise<Response<Gen.HexEncodedBytes>> {
    const res = await this.provider.signAndSubmitTransaction(txnRequest);
    return createReponse<Gen.HexEncodedBytes>("signAndSubmit", 200, res);
  }
  public async signMessage(message: string): Promise<Response<string>> {
    const res = await this.provider.signMessage(message);
    return createReponse<string>("signMessage", 200, res);
  }
  public async createCollection(name: string, description: string, uri: string, maxAmount: BCS.AnyNumber): Promise<Response<string>> {
    const res = await this.provider.createCollection(name, description, uri, maxAmount);
    return createReponse<string>("createCollection", 200, res);
  }
  public async createToken(collectionName: string, name: string, description: string, supply: number, uri: string, max: BCS.AnyNumber, royalty_payee_address: MaybeHexString, royalty_points_denominator: number, royalty_points_numerator: number, property_keys: Array<string>, property_values: Array<string>, property_types: Array<string>): Promise<Response<Gen.HexEncodedBytes>> {
    const res = await this.provider.createToken(collectionName, name, description, supply, uri, max, royalty_payee_address, royalty_points_denominator, royalty_points_numerator, property_keys, property_values, property_types);
    return createReponse<string>("createToken", 200, res);
  }

  public async getTransactionByHash(txnHash: string): Promise<Response<Gen.Transaction>> {
    const res = await this.provider.getTransaction(txnHash);
    return createReponse<Gen.Transaction>("getTransactionByHash", 200, res);
  }

  public async getLedgerInfo(): Promise<Response<Gen.IndexResponse>> {
    const res = await this.provider.getLedgerInfo();
    return createReponse<Gen.IndexResponse>("getLedgerInfo", 200, res);
  }
}
