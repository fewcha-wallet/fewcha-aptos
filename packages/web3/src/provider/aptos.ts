// Copyright 2022 Fewcha. All rights reserved.

import {
  AptosClient,
  AptosAccount,
  MaybeHexString,
  Types,
  TokenClient,
} from "aptos";
import { RequestParams } from "aptos/dist/api/http-client";
import { RawTransaction } from "aptos/dist/transaction_builder/aptos_types/transaction";
import { Web3ProviderStandard } from "../types";

class Aptos implements Web3ProviderStandard {
  static isNetworkProvider = true;

  private client: AptosClient;
  private token: TokenClient;
  private currentAccount?: AptosAccount;

  constructor(client: AptosClient, account?: AptosAccount) {
    this.client = client;
    this.token = new TokenClient(this.client);

    if (account) this.currentAccount = account;
  }

  public changeNetwork(network: string) {
    this.client = new AptosClient(network);
  }

  public changeAccount(account: AptosAccount) {
    this.currentAccount = account;
  }

  // start web3 standard
  public async account(): Promise<string> {
    if (this.currentAccount) return this.currentAccount.address().hex();
    return "";
  }

  public async getNodeURL(): Promise<string> {
    return this.client.nodeUrl;
  }

  public async isConnected(): Promise<boolean> {
    return false;
  }

  public async isNetworkAccountConnected(): Promise<boolean> {
    return true;
  }

  public async connect(): Promise<void> {
    return;
  }

  public async disconnect(): Promise<void> {
    return;
  }
  // /end web3 standard

  // start section of onchain call, built-in
  public async getAccount(
    accountAddress: MaybeHexString
  ): Promise<Types.Account> {
    return this.client.getAccount(accountAddress);
  }

  public async getAccountTransactions(
    accountAddress: MaybeHexString,
    query?: {
      start?: number;
      limit?: number;
    }
  ): Promise<Types.OnChainTransaction[]> {
    return this.client.getAccountTransactions(accountAddress, query);
  }

  public async getAccountModules(
    accountAddress: MaybeHexString,
    query?: {
      version?: Types.LedgerVersion;
    }
  ): Promise<Types.MoveModule[]> {
    return this.client.getAccountModules(accountAddress, query);
  }

  public async getAccountModule(
    accountAddress: MaybeHexString,
    moduleName: string,
    query?: { version?: Types.LedgerVersion }
  ): Promise<Types.MoveModule> {
    return this.client.getAccountModule(accountAddress, moduleName, query);
  }

  public async getAccountResources(
    accountAddress: MaybeHexString,
    query?: {
      version?: Types.LedgerVersion;
    }
  ): Promise<Types.AccountResource[]> {
    return this.client.getAccountResources(accountAddress, query);
  }

  public async getAccountResource(
    accountAddress: MaybeHexString,
    resourceType: string,
    query?: { version?: Types.LedgerVersion }
  ): Promise<Types.AccountResource> {
    return this.client.getAccountResource(accountAddress, resourceType, query);
  }

  public async generateBCSTransaction(
    accountFrom: AptosAccount,
    rawTxn: RawTransaction
  ): Promise<Uint8Array> {
    return AptosClient.generateBCSTransaction(accountFrom, rawTxn);
  }

  public async generateTransaction(
    payload: Types.TransactionPayload,
    options?: Partial<Types.UserTransactionRequest>
  ): Promise<Types.UserTransactionRequest> {
    return this.client.generateTransaction(
      await this.account(),
      payload,
      options
    );
  }

  public createSigningMessage(
    txnRequest: Types.UserTransactionRequest
  ): Promise<Types.HexEncodedBytes> {
    return this.client.createSigningMessage(txnRequest);
  }

  public async signTransaction(
    txnRequest: Types.UserTransactionRequest
  ): Promise<Types.SubmitTransactionRequest> {
    return await this.client.signTransaction(this.currentAccount, txnRequest);
  }

  public async getEventsByEventKey(
    eventKey: Types.HexEncodedBytes
  ): Promise<Types.Event[]> {
    return await this.client.getEventsByEventKey(eventKey);
  }

  public async getEventsByEventHandle(
    address: MaybeHexString,
    eventHandleStruct: Types.MoveStructTagId,
    fieldName: string,
    query?: { start?: number; limit?: number }
  ): Promise<Types.Event[]> {
    return await this.client.getEventsByEventHandle(
      address,
      eventHandleStruct,
      fieldName,
      query
    );
  }

  public async submitTransaction(
    signedTxnRequest: Types.SubmitTransactionRequest
  ): Promise<Types.PendingTransaction> {
    return await this.client.submitTransaction(signedTxnRequest);
  }

  public async submitSignedBCSTransaction(
    signedTxn: Uint8Array
  ): Promise<Types.PendingTransaction> {
    return await this.client.submitSignedBCSTransaction(signedTxn);
  }

  public async signAndSubmitTransaction(
    txnRequest: Types.UserTransactionRequest
  ): Promise<Types.HexEncodedBytes> {
    const signed = await this.client.signTransaction(
      this.currentAccount,
      txnRequest
    );
    const tx = await this.client.submitTransaction(signed);
    return tx.hash;
  }

  public async getTransactions(query?: {
    start?: number;
    limit?: number;
  }): Promise<Types.OnChainTransaction[]> {
    return await this.client.getTransactions(query);
  }

  public async getTransaction(
    txnHashOrVersion: string
  ): Promise<Types.Transaction> {
    return await this.client.getTransaction(txnHashOrVersion);
  }

  public async transactionPending(
    txnHash: Types.HexEncodedBytes
  ): Promise<boolean> {
    return await this.client.transactionPending(txnHash);
  }

  public async waitForTransaction(txnHash: Types.HexEncodedBytes) {
    await this.client.waitForTransaction(txnHash);
  }

  public async getLedgerInfo(params: RequestParams): Promise<Types.LedgerInfo> {
    return await this.client.getLedgerInfo(params);
  }

  public async getChainId(params: RequestParams): Promise<number> {
    return await this.client.getChainId(params);
  }

  public async getTableItem(
    handle: string,
    data: Types.TableItemRequest,
    params?: RequestParams
  ): Promise<any> {
    return await this.client.getTableItem(handle, data, params);
  }

  public async createCollection(
    name: string,
    description: string,
    uri: string
  ): Promise<Types.HexEncodedBytes> {
    if (this.currentAccount)
      return await this.token.createCollection(
        this.currentAccount,
        name,
        description,
        uri
      );

    return "";
  }

  public async createToken(
    collectionName: string,
    name: string,
    description: string,
    supply: number,
    uri: string,
    royalty_points_per_million: number
  ): Promise<Types.HexEncodedBytes> {
    if (this.currentAccount)
      return await this.token.createToken(
        this.currentAccount,
        collectionName,
        name,
        description,
        supply,
        uri
      );

    return "";
  }

  public async offerToken(
    receiver: MaybeHexString,
    creator: MaybeHexString,
    collectionName: string,
    name: string,
    amount: number
  ): Promise<Types.HexEncodedBytes> {
    if (this.currentAccount)
      return await this.token.offerToken(
        this.currentAccount,
        receiver,
        creator,
        collectionName,
        name,
        amount
      );

    return "";
  }

  public async claimToken(
    sender: MaybeHexString,
    creator: MaybeHexString,
    collectionName: string,
    name: string
  ): Promise<Types.HexEncodedBytes> {
    if (this.currentAccount)
      return await this.token.claimToken(
        this.currentAccount,
        sender,
        creator,
        collectionName,
        name
      );

    return "";
  }

  public async cancelTokenOffer(
    receiver: MaybeHexString,
    creator: MaybeHexString,
    collectionName: string,
    name: string
  ): Promise<Types.HexEncodedBytes> {
    if (this.currentAccount)
      return await this.token.cancelTokenOffer(
        this.currentAccount,
        receiver,
        creator,
        collectionName,
        name
      );

    return "";
  }

  // /end section of onchain call, built-in
}

export default Aptos;
