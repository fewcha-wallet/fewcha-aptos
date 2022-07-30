// Copyright 2022 Fewcha. All rights reserved.

import { AptosClient, AptosAccount, MaybeHexString, Types, TokenClient } from "aptos";
import { HexEncodedBytes, LedgerInfo, OnChainTransaction, SubmitTransactionRequest, TableItemRequest, Token, TokenData, TokenId, Transaction, UserTransactionRequest } from "aptos/dist/api/data-contracts";
import { RequestParams } from "aptos/dist/api/http-client";
import { RawTransaction } from "aptos/dist/transaction_builder/aptos_types/transaction";
import { PublicAccount, Web3ProviderType, Response, createReponse } from "../types";
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
  public async connect(): Promise<Response<PublicAccount>> {
    return createReponse("connect", 200, await (await this.account()).data);
  }
  public async disconnect(): Promise<Response<boolean>> {
    this.currentAccount = null;
    return createReponse("disconnect", 200, true);
  }
  public async isConnected(): Promise<Response<boolean>> {
    return createReponse("isConnected", 200, !!this.currentAccount);
  }

  // Transaction API
  public async generateTransaction(payload: Types.TransactionPayload, options?: Partial<Types.UserTransactionRequest>): Promise<Response<Types.UserTransactionRequest>> {
    return createReponse("generateTransaction", 200, await this.client.generateTransaction(await (await this.account()).data.address, payload, options));
  }
  async signAndSubmitTransaction(txnRequest: UserTransactionRequest): Promise<Response<HexEncodedBytes>> {
    if (!this.currentAccount) throw new Error("No account selected");
    const signed = await this.client.signTransaction(this.currentAccount, txnRequest);
    const tx = await this.client.submitTransaction(signed);
    await this.client.waitForTransaction(tx.hash);
    return createReponse("signAndSubmitTransaction", 200, tx.hash);
  }
  async signTransaction(txnRequest: UserTransactionRequest): Promise<Response<SubmitTransactionRequest>> {
    return createReponse("signTransaction", 200, await this.client.signTransaction(this.currentAccount, txnRequest));
  }
  async signMessage(message: string): Promise<Response<string>> {
    return createReponse("signMessage", 200, await this.currentAccount.signBuffer(Buffer.from(message)).hex());
  }
  async submitTransaction(signedTxnRequest: SubmitTransactionRequest): Promise<Response<HexEncodedBytes>> {
    const tx = await this.client.submitTransaction(signedTxnRequest);
    await this.client.waitForTransaction(tx.hash);
    return createReponse("submitTransaction", 200, tx.hash);
  }

  async simulateTransaction(txnRequest: UserTransactionRequest): Promise<Response<OnChainTransaction>> {
    if (!this.currentAccount) return createReponse("simulateTransaction", 403, undefined);
    return createReponse("simulateTransaction", 200, await this.client.simulateTransaction(this.currentAccount, txnRequest));
  }

  generateBCSTransaction(rawTxn: RawTransaction): Promise<Response<Uint8Array>> {
    if (!this.currentAccount)
      return new Promise((resolve) => {
        resolve(createReponse("generateBCSTransaction", 403, undefined));
      });
    return new Promise((resolve) => {
      resolve(createReponse("generateBCSTransaction", 200, AptosClient.generateBCSTransaction(this.currentAccount, rawTxn)));
    });
  }
  generateBCSSimulation(rawTxn: RawTransaction): Promise<Response<Uint8Array>> {
    if (!this.currentAccount)
      return new Promise((resolve) => {
        resolve(createReponse("generateBCSSimulation", 403, undefined));
      });
    return new Promise((resolve) => {
      resolve(createReponse("generateBCSSimulation", 200, AptosClient.generateBCSSimulation(this.currentAccount, rawTxn)));
    });
  }

  async submitSignedBCSTransaction(signedTxn: Uint8Array): Promise<Response<HexEncodedBytes>> {
    const tx = await this.client.submitSignedBCSTransaction(signedTxn);
    await this.client.waitForTransaction(tx.hash);
    return createReponse("submitSignedBCSTransaction", 200, tx.hash);
  }
  async submitBCSSimulation(bcsBody: Uint8Array): Promise<Response<OnChainTransaction>> {
    return createReponse("submitBCSSimulation", 200, await this.client.submitBCSSimulation(bcsBody));
  }

  // Misc API
  public async account(): Promise<Response<PublicAccount>> {
    if (this.currentAccount) return createReponse("", 200, { address: this.currentAccount.address().hex(), publicKey: this.currentAccount.pubKey().hex() });
    return createReponse("account", 200, { address: "", publicKey: "" });
  }
  public async getNetwork(): Promise<Response<string>> {
    return createReponse("getNetwork", 200, this.client.nodeUrl);
  }
  public async getBalance(): Promise<Response<string>> {
    return createReponse("getBalance", 200, this.client.nodeUrl);
  }

  // Aptos SDK
  public sdk = {
    getAccount: async (accountAddress: MaybeHexString): Promise<Response<Types.Account>> => {
      return createReponse("getAccount", 200, await this.client.getAccount(accountAddress));
    },
    getAccountTransactions: async (accountAddress: MaybeHexString, query?: { start?: number; limit?: number }): Promise<Response<Types.OnChainTransaction[]>> => {
      return createReponse("getAccountTransactions", 200, await this.client.getAccountTransactions(accountAddress, query));
    },
    getAccountModules: async (accountAddress: MaybeHexString, query?: { version?: Types.LedgerVersion }): Promise<Response<Types.MoveModule[]>> => {
      return createReponse("getAccountModules", 200, await this.client.getAccountModules(accountAddress, query));
    },
    getAccountModule: async (accountAddress: MaybeHexString, moduleName: string, query?: { version?: Types.LedgerVersion }): Promise<Response<Types.MoveModule>> => {
      return createReponse("getAccountModule", 200, await this.client.getAccountModule(accountAddress, moduleName, query));
    },
    getAccountResources: async (accountAddress: MaybeHexString, query?: { version?: Types.LedgerVersion }): Promise<Response<Types.AccountResource[]>> => {
      return createReponse("getAccountResources", 200, await this.client.getAccountResources(accountAddress, query));
    },
    getAccountResource: async (accountAddress: MaybeHexString, resourceType: string, query?: { version?: Types.LedgerVersion }): Promise<Response<Types.AccountResource>> => {
      return createReponse("getAccountResource", 200, await this.client.getAccountResource(accountAddress, resourceType, query));
    },

    getEventsByEventKey: async (eventKey: Types.HexEncodedBytes): Promise<Response<Types.Event[]>> => {
      return createReponse("getEventsByEventKey", 200, await this.client.getEventsByEventKey(eventKey));
    },
    getEventsByEventHandle: async (address: MaybeHexString, eventHandleStruct: Types.MoveStructTagId, fieldName: string, query?: { start?: number; limit?: number }): Promise<Response<Types.Event[]>> => {
      return createReponse("getEventsByEventHandle", 200, await this.client.getEventsByEventHandle(address, eventHandleStruct, fieldName, query));
    },

    getTransactions: async (query?: { start?: number; limit?: number }): Promise<Response<OnChainTransaction[]>> => {
      return createReponse("getTransactions", 200, await this.client.getTransactions(query));
    },
    getTransaction: async (txnHashOrVersion: string): Promise<Response<Transaction>> => {
      return createReponse("getTransaction", 200, await this.client.getTransaction(txnHashOrVersion));
    },

    transactionPending: async (txnHash: HexEncodedBytes): Promise<Response<boolean>> => {
      return createReponse("transactionPending", 200, await this.client.transactionPending(txnHash));
    },
    waitForTransaction: async (txnHash: HexEncodedBytes): Promise<Response<void>> => {
      return createReponse("waitForTransaction", 200, await this.client.waitForTransaction(txnHash));
    },
    getLedgerInfo: async (params: RequestParams): Promise<Response<LedgerInfo>> => {
      return createReponse("getLedgerInfo", 200, await this.client.getLedgerInfo(params));
    },
    getChainId: async (params: RequestParams): Promise<Response<number>> => {
      return createReponse("getChainId", 200, await this.client.getChainId(params));
    },
    getTableItem: async (handle: string, data: TableItemRequest, params?: RequestParams): Promise<Response<any>> => {
      return createReponse("getTableItem", 200, await this.client.getTableItem(handle, data, params));
    },
  };

  public token = {
    createCollection: async (name: string, description: string, uri: string): Promise<Response<Types.HexEncodedBytes>> => {
      if (!this.currentAccount) return createReponse("createCollection", 403, undefined);
      return createReponse("createCollection", 200, await this.tokenClient.createCollection(this.currentAccount, name, description, uri));
    },
    createToken: async (collectionName: string, name: string, description: string, supply: number, uri: string, royalty_points_per_million: number): Promise<Response<Types.HexEncodedBytes>> => {
      if (!this.currentAccount) return createReponse("createToken", 403, undefined);
      return createReponse("createToken", 200, await this.tokenClient.createToken(this.currentAccount, collectionName, name, description, supply, uri, royalty_points_per_million));
    },
    offerToken: async (receiver: MaybeHexString, creator: MaybeHexString, collectionName: string, name: string, amount: number): Promise<Response<Types.HexEncodedBytes>> => {
      if (!this.currentAccount) return createReponse("offerToken", 403, undefined);
      return createReponse("offerToken", 200, await this.tokenClient.offerToken(this.currentAccount, receiver, creator, collectionName, name, amount));
    },
    claimToken: async (sender: MaybeHexString, creator: MaybeHexString, collectionName: string, name: string): Promise<Response<Types.HexEncodedBytes>> => {
      if (!this.currentAccount) return createReponse("claimToken", 403, undefined);
      return createReponse("claimToken", 200, await this.tokenClient.claimToken(this.currentAccount, sender, creator, collectionName, name));
    },
    cancelTokenOffer: async (receiver: MaybeHexString, creator: MaybeHexString, collectionName: string, name: string): Promise<Response<Types.HexEncodedBytes>> => {
      if (!this.currentAccount) return createReponse("cancelTokenOffer", 403, undefined);
      return createReponse("cancelTokenOffer", 200, await this.tokenClient.cancelTokenOffer(this.currentAccount, receiver, creator, collectionName, name));
    },

    getCollectionData: async (creator: MaybeHexString, collectionName: string): Promise<Response<any>> => {
      return createReponse("getCollectionData", 200, await this.tokenClient.getCollectionData(creator, collectionName));
    },
    getTokenData: async (creator: MaybeHexString, collectionName: string, tokenName: string): Promise<Response<TokenData>> => {
      return createReponse("getTokenData", 200, await this.tokenClient.getTokenData(creator, collectionName, tokenName));
    },
    getTokenBalance: async (creator: MaybeHexString, collectionName: string, tokenName: string): Promise<Response<Token>> => {
      return createReponse("getTokenBalance", 200, await this.tokenClient.getTokenBalance(creator, collectionName, tokenName));
    },
    getTokenBalanceForAccount: async (account: MaybeHexString, tokenId: TokenId): Promise<Response<Token>> => {
      return createReponse("getTokenBalanceForAccount", 200, await this.tokenClient.getTokenBalanceForAccount(account, tokenId));
    },
  };
}

export default Aptos;
