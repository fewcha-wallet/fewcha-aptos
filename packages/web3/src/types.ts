// Copyright 2022 Fewcha. All rights reserved.

import { MaybeHexString, TxnBuilderTypes } from "aptos";
import { Account, AccountResource, Event, HexEncodedBytes, LedgerInfo, LedgerVersion, MoveModule, MoveStructTagId, OnChainTransaction, PendingTransaction, SubmitTransactionRequest, TableItemRequest, Token, TokenData, TokenId, Transaction, TransactionPayload, UserTransactionRequest } from "aptos/dist/api/data-contracts";
import { RequestParams } from "aptos/dist/api/http-client";

export type PublicAccount = {
  address: string;
  publicKey: string;
};

export interface Web3ProviderType {
  connect(): Promise<PublicAccount>;
  disconnect(): Promise<void>;
  isConnected(): Promise<boolean>;

  generateTransaction(payload: TransactionPayload, options?: Partial<UserTransactionRequest>): Promise<UserTransactionRequest>;

  signAndSubmitTransaction(txnRequest: UserTransactionRequest): Promise<PendingTransaction>;
  signTransaction(txnRequest: UserTransactionRequest): Promise<SubmitTransactionRequest>;
  signMessage(message: string): Promise<string>;
  submitTransaction(signedTxnRequest: SubmitTransactionRequest): Promise<PendingTransaction>;

  simulateTransaction(txnRequest: UserTransactionRequest): Promise<OnChainTransaction>;

  generateBCSTransaction(rawTxn: TxnBuilderTypes.RawTransaction): Uint8Array;
  generateBCSSimulation(rawTxn: TxnBuilderTypes.RawTransaction): Uint8Array;

  submitSignedBCSTransaction(signedTxn: Uint8Array): Promise<PendingTransaction>;
  submitBCSSimulation(bcsBody: Uint8Array): Promise<OnChainTransaction>;

  account(): Promise<PublicAccount>;
  getNodeURL(): Promise<string>;
  getBalance(): Promise<string>;

  sdk: {
    getAccount(accountAddress: MaybeHexString): Promise<Account>;
    getAccountTransactions(accountAddress: MaybeHexString, query?: { start?: number; limit?: number }): Promise<OnChainTransaction[]>;
    getAccountModules(accountAddress: MaybeHexString, query?: { version?: LedgerVersion }): Promise<MoveModule[]>;
    getAccountModule(accountAddress: MaybeHexString, moduleName: string, query?: { version?: LedgerVersion }): Promise<MoveModule>;
    getAccountResources(accountAddress: MaybeHexString, query?: { version?: LedgerVersion }): Promise<AccountResource[]>;
    getAccountResource(accountAddress: MaybeHexString, resourceType: string, query?: { version?: LedgerVersion }): Promise<AccountResource>;

    getEventsByEventKey(eventKey: HexEncodedBytes): Promise<Event[]>;
    getEventsByEventHandle(address: MaybeHexString, eventHandleStruct: MoveStructTagId, fieldName: string, query?: { start?: number; limit?: number }): Promise<Event[]>;

    getTransactions(query?: { start?: number; limit?: number }): Promise<OnChainTransaction[]>;
    getTransaction(txnHashOrVersion: string): Promise<Transaction>;

    transactionPending(txnHash: HexEncodedBytes): Promise<boolean>;
    waitForTransaction(txnHash: HexEncodedBytes): Promise<void>;
    getLedgerInfo(params: RequestParams): Promise<LedgerInfo>;
    getChainId(params: RequestParams): Promise<number>;
    getTableItem(handle: string, data: TableItemRequest, params?: RequestParams): Promise<any>;
  };

  token: {
    createCollection(name: string, description: string, uri: string): Promise<string>;
    createToken(collectionName: string, name: string, description: string, supply: number, uri: string, royalty_points_per_million: number): Promise<string>;
    offerToken(receiver: MaybeHexString, creator: MaybeHexString, collectionName: string, name: string, amount: number): Promise<HexEncodedBytes>;
    claimToken(sender: MaybeHexString, creator: MaybeHexString, collectionName: string, name: string): Promise<HexEncodedBytes>;
    cancelTokenOffer(receiver: MaybeHexString, creator: MaybeHexString, collectionName: string, name: string): Promise<HexEncodedBytes>;

    getCollectionData(creator: MaybeHexString, collectionName: string): Promise<any>;
    getTokenData(creator: MaybeHexString, collectionName: string, tokenName: string): Promise<TokenData>;
    getTokenBalance(creator: MaybeHexString, collectionName: string, tokenName: string): Promise<Token>;
    getTokenBalanceForAccount(account: MaybeHexString, tokenId: TokenId): Promise<Token>;
  };
}
