// Copyright 2022 Fewcha. All rights reserved.

import { BCS, HexString, MaybeHexString, OptionalTransactionArgs, TokenTypes, Types as Gen } from "aptos";

export interface Web3ProviderType {
  connect(): Promise<Response<PublicAccount>>;
  disconnect(): Promise<Response<boolean>>;
  isConnected(): Promise<Response<boolean>>;

  generateTransaction(payload: Gen.EntryFunctionPayload, options?: Partial<Gen.SubmitTransactionRequest>): Promise<Response<Uint8Array>>; // tx
  generateRawTransaction(payload: Uint8Array, extraArgs?: OptionalTransactionArgs): Promise<Response<Uint8Array>>; // tx
  generateSignSubmitTransaction(payload: Gen.EntryFunctionPayload, extraArgs?: OptionalTransactionArgs): Promise<Response<Gen.HexEncodedBytes>>; // tx hash
  generateSignSubmitRawTransaction(payload: Uint8Array, options?: Partial<Gen.SubmitTransactionRequest>): Promise<Response<Gen.HexEncodedBytes>>; // tx hash
  generateSignSubmitWaitForTransaction(payload: Uint8Array, extraArgs?: { maxGasAmount?: BCS.Uint64; gasUnitPrice?: BCS.Uint64; expireTimestamp?: BCS.Uint64; checkSuccess?: boolean; timeoutSecs?: number }): Promise<Response<Gen.Transaction>>; // tx detail

  signMessage(message: SignMessagePayload): Promise<Response<SignMessageResponse>>;

  simulateTransaction(rawTransaction: Uint8Array, query?: { estimateGasUnitPrice?: boolean; estimateMaxGasAmount?: boolean }): Promise<Response<Gen.UserTransaction[]>>;

  signTransaction(rawTransaction: Uint8Array): Promise<Response<Uint8Array>>;
  submitTransaction(signedTxn: Uint8Array): Promise<Response<Gen.HexEncodedBytes>>;
  signAndSubmitTransaction(rawTransaction: Uint8Array): Promise<Response<Gen.HexEncodedBytes>>;

  generateBCSTransaction(rawTransaction: Uint8Array): Promise<Response<Uint8Array>>;
  generateBCSSimulation(rawTransaction: Uint8Array): Promise<Response<Uint8Array>>;

  submitSignedBCSTransaction(signedTxn: Uint8Array): Promise<Response<Gen.HexEncodedBytes>>;
  submitBCSSimulation(bcsBody: Uint8Array, query?: { estimateGasUnitPrice?: boolean; estimateMaxGasAmount?: boolean }): Promise<Response<Gen.UserTransaction[]>>;

  account(): Promise<Response<PublicAccount>>;
  getNetwork(): Promise<Response<string>>;
  getNetworkURL(): Promise<Response<string>>;
  getBalance(): Promise<Response<string>>;

  sdk: Web3SDK;
  token: Web3Token; // NFT
  fewchaCoin: FewchaWeb3Coin; // Coin
}

export type Web3SDK = {
  getAccount(accountAddress: MaybeHexString): Promise<Response<Gen.AccountData>>;
  getAccountTransactions(accountAddress: MaybeHexString, query?: PaginationArgs): Promise<Response<Gen.Transaction[]>>;
  getAccountModules(accountAddress: MaybeHexString, query?: { ledgerVersion?: BCS.AnyNumber }): Promise<Response<Gen.MoveModuleBytecode[]>>;
  getAccountModule(accountAddress: MaybeHexString, moduleName: string, query?: { ledgerVersion?: BCS.AnyNumber }): Promise<Response<Gen.MoveModuleBytecode>>;
  getAccountResources(accountAddress: MaybeHexString, query?: { ledgerVersion?: BCS.AnyNumber }): Promise<Response<Gen.MoveResource[]>>;
  getAccountResource(accountAddress: MaybeHexString, resourceType: Gen.MoveStructTag, query?: { ledgerVersion?: BCS.AnyNumber }): Promise<Response<Gen.MoveResource>>;

  getEventsByEventKey(eventKey: string): Promise<Response<Gen.Event[]>>;
  getEventsByCreationNumber(address: MaybeHexString, creationNumber: BCS.AnyNumber | string, query?: PaginationArgs): Promise<Response<Gen.Event[]>>;
  getEventsByEventHandle(address: MaybeHexString, eventHandleStruct: Gen.MoveStructTag, fieldName: string, query?: PaginationArgs): Promise<Response<Gen.Event[]>>;

  getTransactions(query?: PaginationArgs): Promise<Response<Gen.Transaction[]>>;
  getTransactionByHash(txnHash: string): Promise<Response<Gen.Transaction>>;
  getTransactionByVersion(txnVersion: BCS.AnyNumber): Promise<Response<Gen.Transaction>>;
  transactionPending(txnHash: string): Promise<Response<boolean>>;
  waitForTransactionWithResult(txnHash: string, extraArgs?: { timeoutSecs?: number; checkSuccess?: boolean }): Promise<Response<Gen.Transaction>>;
  waitForTransaction(txnHash: string, extraArgs?: { timeoutSecs?: number; checkSuccess?: boolean }): Promise<Response<void>>;

  getLedgerInfo(): Promise<Response<Gen.IndexResponse>>;
  getChainId(): Promise<Response<number>>;
  getTableItem(handle: string, data: Gen.TableItemRequest, query?: { ledgerVersion?: BCS.AnyNumber }): Promise<Response<any>>;

  lookupOriginalAddress(addressOrAuthKey: MaybeHexString): Promise<Response<HexString>>;
  getBlockByHeight(blockHeight: number, withTransactions?: boolean): Promise<Response<Gen.Block>>;
  getBlockByVersion(version: number, withTransactions?: boolean): Promise<Response<Gen.Block>>;
};

export type Web3Token = {
  createCollection(name: string, description: string, uri: string, maxAmount: BCS.AnyNumber, extraArgs?: OptionalTransactionArgs): Promise<Response<string>>;
  createToken(
    collectionName: string,
    name: string,
    description: string,
    supply: number,
    uri: string,
    max?: BCS.AnyNumber,
    royalty_payee_address?: MaybeHexString,
    royalty_points_denominator?: number,
    royalty_points_numerator?: number,
    property_keys?: Array<string>,
    property_values?: Array<string>,
    property_types?: Array<string>,
    extraArgs?: OptionalTransactionArgs,
  ): Promise<Response<string>>;
  offerToken(receiver: MaybeHexString, creator: MaybeHexString, collectionName: string, name: string, amount: number, property_version?: number, extraArgs?: OptionalTransactionArgs): Promise<Response<string>>;
  claimToken(sender: MaybeHexString, creator: MaybeHexString, collectionName: string, name: string, property_version?: number, extraArgs?: OptionalTransactionArgs): Promise<Response<string>>;
  cancelTokenOffer(receiver: MaybeHexString, creator: MaybeHexString, collectionName: string, name: string, property_version?: number, extraArgs?: OptionalTransactionArgs): Promise<Response<string>>;

  getCollectionData(creator: MaybeHexString, collectionName: string): Promise<Response<any>>;
  getTokenData(creator: MaybeHexString, collectionName: string, tokenName: string): Promise<Response<TokenTypes.TokenData>>;
  getToken(creator: MaybeHexString, collectionName: string, tokenName: string, property_version: string): Promise<TokenTypes.Token>;
  getTokenForAccount(account: MaybeHexString, tokenId: TokenTypes.TokenId): Promise<Response<TokenTypes.Token>>;
};

export type FewchaWeb3Coin = {
  initializeCoin(resource_type: string, name: string, symbol: string, decimals: string): Promise<Response<string>>;
  registerCoin(coin_type_resource: string): Promise<Response<string>>;
  mintCoin(coin_type_resource: string, dst_address: string, amount: number): Promise<Response<string>>;
  transferCoin(coin_type_resource: string, to_address: string, amount: number): Promise<Response<string>>;

  getCoinData(coin_type_resource: string): Promise<Response<CoinData>>;
  getCoinBalance(account_address: string, coin_type_resource: string): Promise<Response<string>>;
  getCoins(account_address: string): Promise<Response<string[]>>;
};

export interface PaginationArgs {
  start?: BCS.AnyNumber;
  limit?: number;
}

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

export interface SignMessagePayload {
  address?: boolean; // Should we include the address of the account in the message
  application?: boolean; // Should we include the domain of the dapp
  chainId?: boolean; // Should we include the current chain id the wallet is connected to
  message: string; // The message to be signed and displayed to the user
  nonce: string; // A nonce the dapp should generate
}

export interface SignMessageResponse {
  address: string;
  application: string;
  chainId: number;
  fullMessage: string; // The message that was generated to sign
  message: string; // The message passed in by the user
  nonce: string;
  prefix: string; // Should always be APTOS
  signature: string; // The signed full message
}
