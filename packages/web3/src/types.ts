// Copyright 2022 Fewcha. All rights reserved.

import { BCS, HexString, MaybeHexString, TxnBuilderTypes, Types as Gen } from "aptos";
import { Token, TokenData, TokenId } from "aptos/dist/token_types";

export interface Web3ProviderType {
  connect(): Promise<Response<PublicAccount>>;
  disconnect(): Promise<Response<boolean>>;
  isConnected(): Promise<Response<boolean>>;

  generateRawTransaction(payload: TxnBuilderTypes.TransactionPayload, extraArgs?: { maxGasAmount?: BCS.Uint64; gastUnitPrice?: BCS.Uint64; expireTimestamp?: BCS.Uint64 }): Promise<Response<TxnBuilderTypes.RawTransaction>>;
  generateTransaction(payload: Gen.TransactionPayload, options?: Partial<Gen.SubmitTransactionRequest>): Promise<Response<Gen.SubmitTransactionRequest>>;

  createSigningMessage(request: Gen.EncodeSubmissionRequest): Promise<Response<string>>;

  signAndSubmitTransaction(txnRequest: Gen.SubmitTransactionRequest): Promise<Response<Gen.HexEncodedBytes>>;
  signTransaction(txnRequest: Gen.SubmitTransactionRequest): Promise<Response<Gen.SubmitTransactionRequest>>;
  signMessage(message: string): Promise<Response<string>>;
  submitTransaction(signedTxnRequest: Gen.SubmitTransactionRequest): Promise<Response<Gen.HexEncodedBytes>>;

  simulateTransaction(txnRequest: Gen.SubmitTransactionRequest): Promise<Response<Gen.UserTransaction[]>>;

  generateBCSTransaction(rawTxn: TxnBuilderTypes.RawTransaction): Promise<Response<Uint8Array>>;
  generateBCSSimulation(rawTxn: TxnBuilderTypes.RawTransaction): Promise<Response<Uint8Array>>;

  submitSignedBCSTransaction(signedTxn: Uint8Array): Promise<Response<Gen.PendingTransaction>>;
  submitBCSSimulation(bcsBody: Uint8Array): Promise<Response<Gen.UserTransaction[]>>;

  account(): Promise<Response<PublicAccount>>;
  getNetwork(): Promise<Response<string>>;
  getBalance(): Promise<Response<string>>;

  sdk: Web3SDK;
  token: Web3Token; // NFT
  coin: Web3Coin; // Coin
}

export type Web3SDK = {
  getAccount(accountAddress: MaybeHexString): Promise<Response<Gen.AccountData>>;
  getAccountTransactions(accountAddress: MaybeHexString, query?: { start?: BigInt; limit?: number }): Promise<Response<Gen.Transaction[]>>;
  getAccountModules(accountAddress: MaybeHexString, query?: { ledgerVersion?: BigInt }): Promise<Response<Gen.MoveModuleBytecode[]>>;
  getAccountModule(accountAddress: MaybeHexString, moduleName: string, query?: { ledgerVersion?: BigInt }): Promise<Response<Gen.MoveModuleBytecode>>;
  getAccountResources(accountAddress: MaybeHexString, query?: { ledgerVersion?: BigInt }): Promise<Response<Gen.MoveResource[]>>;
  getAccountResource(accountAddress: MaybeHexString, resourceType: Gen.MoveStructTag, query?: { ledgerVersion?: BigInt }): Promise<Response<Gen.MoveResource>>;

  getEventsByEventKey(eventKey: string): Promise<Response<Gen.Event[]>>;
  getEventsByEventHandle(address: MaybeHexString, eventHandleStruct: Gen.MoveStructTag, fieldName: string, query?: { start?: BigInt; limit?: number }): Promise<Response<Gen.Event[]>>;

  getTransactions(query?: { start?: BigInt; limit?: number }): Promise<Response<Gen.Transaction[]>>;
  getTransactionByHash(txnHash: string): Promise<Response<Gen.Transaction>>;
  getTransactionByVersion(txnVersion: BigInt): Promise<Response<Gen.Transaction>>;
  transactionPending(txnHash: string): Promise<Response<boolean>>;
  waitForTransaction(txnHash: string): Promise<Response<void>>;
  waitForTransactionWithResult(txnHash: string): Promise<Response<Gen.Transaction>>;

  getLedgerInfo(): Promise<Response<Gen.IndexResponse>>;
  getChainId(): Promise<Response<number>>;
  getTableItem(handle: string, data: Gen.TableItemRequest, query?: { ledgerVersion?: BigInt }): Promise<Response<any>>;
};

export type Web3Token = {
  createCollection(name: string, description: string, uri: string): Promise<Response<string>>;
  createToken(collectionName: string, name: string, description: string, supply: number, uri: string, royalty_points_per_million: number): Promise<Response<string>>;
  offerToken(receiver: MaybeHexString, creator: MaybeHexString, collectionName: string, name: string, amount: number): Promise<Response<Gen.HexEncodedBytes>>;
  claimToken(sender: MaybeHexString, creator: MaybeHexString, collectionName: string, name: string): Promise<Response<Gen.HexEncodedBytes>>;
  cancelTokenOffer(receiver: MaybeHexString, creator: MaybeHexString, collectionName: string, name: string): Promise<Response<Gen.HexEncodedBytes>>;

  getCollectionData(creator: MaybeHexString, collectionName: string): Promise<Response<any>>;
  getTokenData(creator: MaybeHexString, collectionName: string, tokenName: string): Promise<Response<TokenData>>;
  getTokenBalance(creator: MaybeHexString, collectionName: string, tokenName: string): Promise<Response<Token>>;
  getTokenBalanceForAccount(account: MaybeHexString, tokenId: TokenId): Promise<Response<Token>>;
};

export type Web3Coin = {
  initializeCoin(resource_type: string, name: string, symbol: string, decimals: string): Promise<Response<string>>;
  registerCoin(coin_type_resource: string): Promise<Response<string>>;
  mintCoin(coin_type_resource: string, dst_address: string, amount: number): Promise<Response<string>>;
  transferCoin(coin_type_resource: string, to_address: string, amount: number): Promise<Response<string>>;
  getCoinData(coin_type_resource: string): Promise<Response<CoinData>>;
  getCoinBalance(account_address: string, coin_type_resource: string): Promise<Response<string>>;
  getCoins(account_address: string): Promise<Response<string[]>>;
};

export type PublicAccount = {
  address: string;
  publicKey: string;
};

export type CoinData = {
  coin_type_resource: string;
  name: string;
  symbol: string;
  decimals: number;
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
