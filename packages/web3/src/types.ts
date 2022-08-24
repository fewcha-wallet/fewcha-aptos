// Copyright 2022 Fewcha. All rights reserved.

import { BCS, MaybeHexString, TxnBuilderTypes, Types as Gen } from "aptos";
import { TransactionPayload } from "aptos/dist/transaction_builder/aptos_types/transaction";
import { Token, TokenData, TokenId } from "aptos/dist/token_types";
import { AccountAddress, ChainId } from "aptos/dist/transaction_builder/aptos_types";
import { Uint64 } from "aptos/dist/transaction_builder/bcs";

export interface Web3ProviderType {
  connect(): Promise<Response<PublicAccount>>;
  disconnect(): Promise<Response<boolean>>;
  isConnected(): Promise<Response<boolean>>;

  generateRawTransaction(payload: TxnBuilderTypes.TransactionPayload, extraArgs?: { maxGasAmount?: BCS.Uint64; gastUnitPrice?: BCS.Uint64; expireTimestamp?: BCS.Uint64 }): Promise<Response<RawTransactionConstructor>>;
  generateTransaction(payload: Gen.TransactionPayload, options?: Partial<Gen.SubmitTransactionRequest>): Promise<Response<Gen.SubmitTransactionRequest>>;

  createSigningMessage(request: Gen.EncodeSubmissionRequest): Promise<Response<string>>;

  signAndSubmitTransaction(txnRequest: Gen.SubmitTransactionRequest): Promise<Response<Gen.HexEncodedBytes>>;
  signTransaction(txnRequest: Gen.SubmitTransactionRequest): Promise<Response<Gen.SubmitTransactionRequest>>;
  signMessage(message: string): Promise<Response<string>>;
  submitTransaction(signedTxnRequest: Gen.SubmitTransactionRequest): Promise<Response<Gen.HexEncodedBytes>>;

  simulateTransaction(txnRequest: Gen.SubmitTransactionRequest): Promise<Response<Gen.UserTransaction[]>>;

  generateBCSTransaction(rawTxn: RawTransactionConstructor): Promise<Response<Uint8Array>>;
  generateBCSSimulation(rawTxn: RawTransactionConstructor): Promise<Response<Uint8Array>>;

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
  getAccountTransactions(accountAddress: MaybeHexString, query?: { start?: BigInt | number; limit?: number }): Promise<Response<Gen.Transaction[]>>;
  getAccountModules(accountAddress: MaybeHexString, query?: { ledgerVersion?: BigInt | number }): Promise<Response<Gen.MoveModuleBytecode[]>>;
  getAccountModule(accountAddress: MaybeHexString, moduleName: string, query?: { ledgerVersion?: BigInt | number }): Promise<Response<Gen.MoveModuleBytecode>>;
  getAccountResources(accountAddress: MaybeHexString, query?: { ledgerVersion?: BigInt | number }): Promise<Response<Gen.MoveResource[]>>;
  getAccountResource(accountAddress: MaybeHexString, resourceType: Gen.MoveStructTag, query?: { ledgerVersion?: BigInt | number }): Promise<Response<Gen.MoveResource>>;

  getEventsByEventKey(eventKey: string): Promise<Response<Gen.Event[]>>;
  getEventsByEventHandle(address: MaybeHexString, eventHandleStruct: Gen.MoveStructTag, fieldName: string, query?: { start?: BigInt | number; limit?: number }): Promise<Response<Gen.Event[]>>;

  getTransactions(query?: { start?: BigInt | number; limit?: number }): Promise<Response<Gen.Transaction[]>>;
  getTransactionByHash(txnHash: string): Promise<Response<Gen.Transaction>>;
  getTransactionByVersion(txnVersion: BigInt | number): Promise<Response<Gen.Transaction>>;
  transactionPending(txnHash: string): Promise<Response<boolean>>;
  waitForTransaction(txnHash: string): Promise<Response<void>>;
  waitForTransactionWithResult(txnHash: string): Promise<Response<Gen.Transaction>>;

  getLedgerInfo(): Promise<Response<Gen.IndexResponse>>;
  getChainId(): Promise<Response<number>>;
  getTableItem(handle: string, data: Gen.TableItemRequest, query?: { ledgerVersion?: BigInt | number }): Promise<Response<any>>;
};

export type Web3Token = {
  createCollection(name: string, description: string, uri: string, maxAmount: BCS.AnyNumber): Promise<Response<string>>;
  createToken(collectionName: string, name: string, description: string, supply: number, uri: string, max: BCS.AnyNumber, royalty_payee_address: MaybeHexString, royalty_points_denominator: number, royalty_points_numerator: number, property_keys: Array<string>, property_values: Array<string>, property_types: Array<string>): Promise<Response<Gen.HexEncodedBytes>>;
  offerToken(receiver: MaybeHexString, creator: MaybeHexString, collectionName: string, name: string, amount: number, property_version: number): Promise<Response<string>>;
  claimToken(sender: MaybeHexString, creator: MaybeHexString, collectionName: string, name: string, property_version: number): Promise<Response<string>>;
  cancelTokenOffer(receiver: MaybeHexString, creator: MaybeHexString, collectionName: string, name: string, property_version: number): Promise<Response<string>>;

  getCollectionData(creator: MaybeHexString, collectionName: string): Promise<Response<any>>;
  getTokenData(creator: MaybeHexString, collectionName: string, tokenName: string): Promise<Response<TokenData>>;
  getTokenBalance(creator: MaybeHexString, collectionName: string, tokenName: string, property_version: string): Promise<Response<Token>>;
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

export type RawTransactionConstructor = {
  sender: AccountAddress;
  sequence_number: Uint64;
  payload: TransactionPayload;
  max_gas_amount: Uint64;
  gas_unit_price: Uint64;
  expiration_timestamp_secs: Uint64;
  chain_id: ChainId;
};
