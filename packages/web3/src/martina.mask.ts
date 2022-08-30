import { BCS, MaybeHexString, Types as Gen, TxnBuilderTypes } from "aptos";
import { createReponse, Response } from "./types";
import {} from "aptos";

export class MartianMask {
  public provider: any;

  constructor(provider: any) {
    this.provider = provider;
  }

  public async generateTransaction(payload: Gen.EntryFunctionPayload, options?: Partial<Gen.SubmitTransactionRequest>): Promise<Response<Uint8Array>> {
    const response = await this.provider.connect();
    const sender = response.address;
    const res = await this.provider.generateTransaction(sender, payload);
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
  public async getTransactions(query?: { start?: BigInt | number; limit?: number }): Promise<Response<Gen.Transaction[]>> {
    let res = null;
    if (query) {
      res = await this.provider.getTransactions(query);
    } else {
      res = await this.provider.provider.getTransactions();
    }
    return createReponse<Gen.Transaction[]>("getTransactions", 200, res);
  }
  public async getTransactionByHash(txnHash: string): Promise<Response<Gen.Transaction>> {
    const res = await this.provider.getTransaction(txnHash);
    return createReponse<Gen.Transaction>("getTransactionByHash", 200, res);
  }
  public async getAccountTransactions(accountAddress: MaybeHexString, query?: { start?: BigInt | number; limit?: number }): Promise<Response<Gen.Transaction[]>> {
    const res = await this.provider.getAccountTransactions(accountAddress);
    return createReponse<Gen.Transaction[]>("getAccountTransactions", 200, res);
  }
  public async getAccountResources(accountAddress: MaybeHexString, query?: { ledgerVersion?: BigInt | number }): Promise<Response<Gen.MoveResource[]>> {
    const res = await this.provider.getAccountResources(accountAddress);
    return createReponse<Gen.MoveResource[]>("getAccountResources", 200, res);
  }
  public async getAccount(accountAddress: MaybeHexString): Promise<Response<Gen.AccountData>> {
    const res = await this.provider.getAccount(accountAddress);
    return createReponse<Gen.AccountData>("getAccount", 200, res);
  }
  public async getChainId(): Promise<Response<number>> {
    const res = await this.provider.getChainId();
    return createReponse<number>("getChainId", 200, res);
  }
  public async getLedgerInfo(): Promise<Response<Gen.IndexResponse>> {
    const res = await this.provider.getLedgerInfo();
    return createReponse<Gen.IndexResponse>("getLedgerInfo", 200, res);
  }
}
