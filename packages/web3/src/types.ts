// Copyright 2022 Fewcha. All rights reserved.

import { MaybeHexString, TxnBuilderTypes } from "aptos";
import { Account, AccountResource, Event, HexEncodedBytes, LedgerInfo, LedgerVersion, MoveModule, MoveStructTagId, OnChainTransaction, SubmitTransactionRequest, TableItemRequest, Token, TokenData, TokenId, Transaction, TransactionPayload, UserTransactionRequest } from "aptos/dist/api/data-contracts";
import { RequestParams } from "aptos/dist/api/http-client";

export interface Web3ProviderType {
  connect(): Promise<Response<PublicAccount>>;
  disconnect(): Promise<Response<boolean>>;
  isConnected(): Promise<Response<boolean>>;

  generateTransaction(payload: TransactionPayload, options?: Partial<UserTransactionRequest>): Promise<Response<UserTransactionRequest>>;

  signAndSubmitTransaction(txnRequest: UserTransactionRequest): Promise<Response<HexEncodedBytes>>;
  signTransaction(txnRequest: UserTransactionRequest): Promise<Response<SubmitTransactionRequest>>;
  signMessage(message: string): Promise<Response<string>>;
  submitTransaction(signedTxnRequest: SubmitTransactionRequest): Promise<Response<HexEncodedBytes>>;

  simulateTransaction(txnRequest: UserTransactionRequest): Promise<Response<OnChainTransaction>>;

  generateBCSTransaction(rawTxn: TxnBuilderTypes.RawTransaction): Promise<Response<Uint8Array>>;
  generateBCSSimulation(rawTxn: TxnBuilderTypes.RawTransaction): Promise<Response<Uint8Array>>;

  submitSignedBCSTransaction(signedTxn: Uint8Array): Promise<Response<HexEncodedBytes>>;
  submitBCSSimulation(bcsBody: Uint8Array): Promise<Response<OnChainTransaction>>;

  account(): Promise<Response<PublicAccount>>;
  getNetwork(): Promise<Response<string>>;
  getBalance(): Promise<Response<string>>;

  sdk: Web3SDK;
  token: Web3Token;
}

export type Web3SDK = {
  getAccount(accountAddress: MaybeHexString): Promise<Response<Account>>;
  getAccountTransactions(accountAddress: MaybeHexString, query?: { start?: number; limit?: number }): Promise<Response<OnChainTransaction[]>>;
  getAccountModules(accountAddress: MaybeHexString, query?: { version?: LedgerVersion }): Promise<Response<MoveModule[]>>;
  getAccountModule(accountAddress: MaybeHexString, moduleName: string, query?: { version?: LedgerVersion }): Promise<Response<MoveModule>>;
  getAccountResources(accountAddress: MaybeHexString, query?: { version?: LedgerVersion }): Promise<Response<AccountResource[]>>;
  getAccountResource(accountAddress: MaybeHexString, resourceType: string, query?: { version?: LedgerVersion }): Promise<Response<AccountResource>>;

  getEventsByEventKey(eventKey: HexEncodedBytes): Promise<Response<Event[]>>;
  getEventsByEventHandle(address: MaybeHexString, eventHandleStruct: MoveStructTagId, fieldName: string, query?: { start?: number; limit?: number }): Promise<Response<Event[]>>;

  getTransactions(query?: { start?: number; limit?: number }): Promise<Response<OnChainTransaction[]>>;
  getTransaction(txnHashOrVersion: string): Promise<Response<Transaction>>;

  transactionPending(txnHash: HexEncodedBytes): Promise<Response<boolean>>;
  waitForTransaction(txnHash: HexEncodedBytes): Promise<Response<void>>;
  getLedgerInfo(params: RequestParams): Promise<Response<LedgerInfo>>;
  getChainId(params: RequestParams): Promise<Response<number>>;
  getTableItem(handle: string, data: TableItemRequest, params?: RequestParams): Promise<Response<any>>;
};

export type Web3Token = {
  createCollection(name: string, description: string, uri: string): Promise<Response<string>>;
  createToken(collectionName: string, name: string, description: string, supply: number, uri: string, royalty_points_per_million: number): Promise<Response<string>>;
  offerToken(receiver: MaybeHexString, creator: MaybeHexString, collectionName: string, name: string, amount: number): Promise<Response<HexEncodedBytes>>;
  claimToken(sender: MaybeHexString, creator: MaybeHexString, collectionName: string, name: string): Promise<Response<HexEncodedBytes>>;
  cancelTokenOffer(receiver: MaybeHexString, creator: MaybeHexString, collectionName: string, name: string): Promise<Response<HexEncodedBytes>>;

  getCollectionData(creator: MaybeHexString, collectionName: string): Promise<Response<any>>;
  getTokenData(creator: MaybeHexString, collectionName: string, tokenName: string): Promise<Response<TokenData>>;
  getTokenBalance(creator: MaybeHexString, collectionName: string, tokenName: string): Promise<Response<Token>>;
  getTokenBalanceForAccount(account: MaybeHexString, tokenId: TokenId): Promise<Response<Token>>;
};

export type PublicAccount = {
  address: string;
  publicKey: string;
};

export type Response<T> = {
  data: T;
  method: string;
  status: number;
};

export const createReponse = <T>(method: string, status: number, data: T): Response<T> => {
  return {
    method,
    status,
    data,
  };
};
