// Copyright 2022 Fewcha. All rights reserved.

import { AptosClient, AptosAccount, MaybeHexString, Types, TokenClient } from "aptos";
import { HexEncodedBytes, LedgerInfo, OnChainTransaction, PendingTransaction, SubmitTransactionRequest, TableItemRequest, Token, TokenData, TokenId, Transaction, UserTransactionRequest } from "aptos/dist/api/data-contracts";
import { RequestParams } from "aptos/dist/api/http-client";
import { RawTransaction } from "aptos/dist/transaction_builder/aptos_types/transaction";
import { PublicAccount, Web3ProviderType } from "../types";
import { Buffer } from "buffer/";

class Aptos implements Web3ProviderType {
  static isNetworkProvider = true;

  private client: AptosClient;
  private tokenClient: TokenClient;
  private currentAccount?: AptosAccount;

  constructor(client: AptosClient, account?: AptosAccount) {
    this.client = client;
    this.tokenClient = new TokenClient(this.client);

    if (account) this.currentAccount = account;
  }

  public changeNetwork(network: string): Aptos {
    this.client = new AptosClient(network);
    this.tokenClient = new TokenClient(this.client);
    return this;
  }
  public changeAccount(account: AptosAccount): AptosAccount {
    this.currentAccount = account;
    return this.currentAccount;
  }

  // Connection API
  public connect(): Promise<PublicAccount> {
    return this.account();
  }
  public disconnect(): Promise<void> {
    this.currentAccount = null;
    return;
  }
  public async isConnected(): Promise<boolean> {
    return !!this.currentAccount;
  }

  // Transaction API
  public async generateTransaction(payload: Types.TransactionPayload, options?: Partial<Types.UserTransactionRequest>): Promise<Types.UserTransactionRequest> {
    return this.client.generateTransaction(await (await this.account()).address, payload, options);
  }
  async signAndSubmitTransaction(txnRequest: UserTransactionRequest): Promise<PendingTransaction> {
    if (!this.currentAccount) throw new Error("No account selected");
    const signed = await this.client.signTransaction(this.currentAccount, txnRequest);
    return await this.client.submitTransaction(signed);
  }
  async signTransaction(txnRequest: UserTransactionRequest): Promise<SubmitTransactionRequest> {
    return await this.client.signTransaction(this.currentAccount, txnRequest);
  }
  async signMessage(message: string): Promise<string> {
    return await this.currentAccount.signBuffer(Buffer.from(message)).hex();
  }
  async submitTransaction(signedTxnRequest: SubmitTransactionRequest): Promise<PendingTransaction> {
    return await this.client.submitTransaction(signedTxnRequest);
  }

  async simulateTransaction(txnRequest: UserTransactionRequest): Promise<OnChainTransaction> {
    if (!this.currentAccount) throw new Error("401");
    return await this.client.simulateTransaction(this.currentAccount, txnRequest);
  }

  generateBCSTransaction(rawTxn: RawTransaction): Uint8Array {
    if (!this.currentAccount) throw new Error("401");
    return AptosClient.generateBCSTransaction(this.currentAccount, rawTxn);
  }
  generateBCSSimulation(rawTxn: RawTransaction): Uint8Array {
    if (!this.currentAccount) throw new Error("401");
    return AptosClient.generateBCSSimulation(this.currentAccount, rawTxn);
  }

  async submitSignedBCSTransaction(signedTxn: Uint8Array): Promise<PendingTransaction> {
    return await this.client.submitSignedBCSTransaction(signedTxn);
  }
  async submitBCSSimulation(bcsBody: Uint8Array): Promise<OnChainTransaction> {
    return await this.client.submitBCSSimulation(bcsBody);
  }

  // Misc API
  public async account(): Promise<PublicAccount> {
    if (this.currentAccount) return { address: this.currentAccount.address().hex(), publicKey: this.currentAccount.pubKey().hex() };
    return { address: "", publicKey: "" };
  }
  public async getNodeURL(): Promise<string> {
    return this.client.nodeUrl;
  }
  public async getBalance(): Promise<string> {
    return this.client.nodeUrl;
  }

  // Aptos SDK
  public sdk = {
    getAccount: async (accountAddress: MaybeHexString): Promise<Types.Account> => {
      return this.client.getAccount(accountAddress);
    },
    getAccountTransactions: async (accountAddress: MaybeHexString, query?: { start?: number; limit?: number }): Promise<Types.OnChainTransaction[]> => {
      return this.client.getAccountTransactions(accountAddress, query);
    },
    getAccountModules: async (accountAddress: MaybeHexString, query?: { version?: Types.LedgerVersion }): Promise<Types.MoveModule[]> => {
      return this.client.getAccountModules(accountAddress, query);
    },
    getAccountModule: async (accountAddress: MaybeHexString, moduleName: string, query?: { version?: Types.LedgerVersion }): Promise<Types.MoveModule> => {
      return this.client.getAccountModule(accountAddress, moduleName, query);
    },
    getAccountResources: async (accountAddress: MaybeHexString, query?: { version?: Types.LedgerVersion }): Promise<Types.AccountResource[]> => {
      return this.client.getAccountResources(accountAddress, query);
    },
    getAccountResource: async (accountAddress: MaybeHexString, resourceType: string, query?: { version?: Types.LedgerVersion }): Promise<Types.AccountResource> => {
      return this.client.getAccountResource(accountAddress, resourceType, query);
    },

    getEventsByEventKey: async (eventKey: Types.HexEncodedBytes): Promise<Types.Event[]> => {
      return await this.client.getEventsByEventKey(eventKey);
    },
    getEventsByEventHandle: async (address: MaybeHexString, eventHandleStruct: Types.MoveStructTagId, fieldName: string, query?: { start?: number; limit?: number }): Promise<Types.Event[]> => {
      return await this.client.getEventsByEventHandle(address, eventHandleStruct, fieldName, query);
    },

    getTransactions: async (query?: { start?: number; limit?: number }): Promise<OnChainTransaction[]> => {
      return await this.client.getTransactions(query);
    },
    getTransaction: async (txnHashOrVersion: string): Promise<Transaction> => {
      return await this.client.getTransaction(txnHashOrVersion);
    },

    transactionPending: async (txnHash: HexEncodedBytes): Promise<boolean> => {
      return await this.client.transactionPending(txnHash);
    },
    waitForTransaction: async (txnHash: HexEncodedBytes) => {
      await this.client.waitForTransaction(txnHash);
    },
    getLedgerInfo: async (params: RequestParams): Promise<LedgerInfo> => {
      return await this.client.getLedgerInfo(params);
    },
    getChainId: async (params: RequestParams): Promise<number> => {
      return await this.client.getChainId(params);
    },
    getTableItem: async (handle: string, data: TableItemRequest, params?: RequestParams): Promise<any> => {
      return await this.client.getTableItem(handle, data, params);
    },
  };

  public token = {
    createCollection: async (name: string, description: string, uri: string): Promise<Types.HexEncodedBytes> => {
      if (!this.currentAccount) throw new Error("401");
      return await this.tokenClient.createCollection(this.currentAccount, name, description, uri);
    },
    createToken: async (collectionName: string, name: string, description: string, supply: number, uri: string, royalty_points_per_million: number): Promise<Types.HexEncodedBytes> => {
      if (!this.currentAccount) throw new Error("401");
      return await this.tokenClient.createToken(this.currentAccount, collectionName, name, description, supply, uri, royalty_points_per_million);
    },
    offerToken: async (receiver: MaybeHexString, creator: MaybeHexString, collectionName: string, name: string, amount: number): Promise<Types.HexEncodedBytes> => {
      if (!this.currentAccount) throw new Error("401");
      return await this.tokenClient.offerToken(this.currentAccount, receiver, creator, collectionName, name, amount);
    },
    claimToken: async (sender: MaybeHexString, creator: MaybeHexString, collectionName: string, name: string): Promise<Types.HexEncodedBytes> => {
      if (!this.currentAccount) throw new Error("401");
      return await this.tokenClient.claimToken(this.currentAccount, sender, creator, collectionName, name);
    },
    cancelTokenOffer: async (receiver: MaybeHexString, creator: MaybeHexString, collectionName: string, name: string): Promise<Types.HexEncodedBytes> => {
      if (!this.currentAccount) throw new Error("401");
      return await this.tokenClient.cancelTokenOffer(this.currentAccount, receiver, creator, collectionName, name);
    },

    getCollectionData: (creator: MaybeHexString, collectionName: string): Promise<any> => {
      return this.tokenClient.getCollectionData(creator, collectionName);
    },
    getTokenData: (creator: MaybeHexString, collectionName: string, tokenName: string): Promise<TokenData> => {
      return this.tokenClient.getTokenData(creator, collectionName, tokenName);
    },
    getTokenBalance: (creator: MaybeHexString, collectionName: string, tokenName: string): Promise<Token> => {
      return this.tokenClient.getTokenBalance(creator, collectionName, tokenName);
    },
    getTokenBalanceForAccount: (account: MaybeHexString, tokenId: TokenId): Promise<Token> => {
      return this.tokenClient.getTokenBalanceForAccount(account, tokenId);
    },
  };
}

export default Aptos;
