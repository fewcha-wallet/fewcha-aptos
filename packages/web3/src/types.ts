// Copyright 2022 Fewcha. All rights reserved.

import { HexString, MaybeHexString, TokenTypes, Types } from "aptos";
import {
  Base64DataBuffer,
  ExecuteTransactionRequestType,
  GatewayTxSeqNumber,
  GetObjectDataResponse,
  GetTxnDigestsResponse,
  MergeCoinTransaction,
  MoveCallTransaction,
  ObjectId,
  ObjectOwner,
  PayTransaction,
  PublishTransaction,
  SignaturePubkeyPair,
  SignatureScheme,
  SplitCoinTransaction,
  SubscriptionId,
  SuiAddress,
  SuiEventEnvelope,
  SuiEventFilter,
  SuiEvents,
  SuiExecuteTransactionResponse,
  SuiMoveFunctionArgTypes,
  SuiMoveNormalizedFunction,
  SuiMoveNormalizedModule,
  SuiMoveNormalizedModules,
  SuiMoveNormalizedStruct,
  SuiObjectInfo,
  SuiObjectRef,
  SuiTransactionResponse,
  TransactionDigest,
  TransactionEffects,
  TransferObjectTransaction,
  TransferSuiTransaction,
} from "@mysten/sui.js";

export type Response<T> = {
  data: T;
  method: string;
  status: number;
};

export type PublicAccount = {
  address: string;
  publicKey: string;
};

export interface IWeb3Provider {
  connect(): Promise<Response<PublicAccount>>;
  disconnect(): Promise<Response<boolean>>;
  isConnected(): Promise<Response<boolean>>;

  account(): Promise<Response<PublicAccount>>;
  getNetwork(): Promise<Response<string>>;
  getNetworkURL(): Promise<Response<string>>;
  getNetworkType(): Promise<Response<string>>;
  getBalance(): Promise<Response<string>>;

  aptos: IWeb3AptosSDK;
  sui: IWeb3SuiSDK;
  token: IWeb3AptosToken;
  coin: IWeb3Coin;
}

export type OptionalTransactionArgs = {
  maxGasAmount?: string;
  gasUnitPrice?: string;
  expireTimestamp?: string;
};

export type SubmitTransactionRequest = {
  sender: string;
  sequence_number: string;
  max_gas_amount: string;
  gas_unit_price: string;
  expiration_timestamp_secs: string;
  payload: Types.TransactionPayload;
  signature: Types.TransactionSignature;
};

export type EstimateGasArgs = {
  estimateGasUnitPrice?: boolean;
  estimateMaxGasAmount?: boolean;
  estimatePrioritizedGasUnitPrice?: boolean;
};

export type IWeb3AptosSDK = {
  // generateTransaction return transaction as Uint8Array
  generateTransaction(payload: Types.EntryFunctionPayload, options?: Partial<SubmitTransactionRequest>): Promise<Response<Uint8Array>>;
  // generateRawTransaction return transaction as Uint8Array
  generateRawTransaction(payload: Uint8Array, extraArgs?: OptionalTransactionArgs): Promise<Response<Uint8Array>>;
  // generateBCSTransaction return transaction as Uint8Array
  generateBCSTransaction(rawTransaction: Uint8Array): Promise<Response<Uint8Array>>;
  generateBCSSimulation(rawTransaction: Uint8Array): Promise<Response<Uint8Array>>;

  signMessage(message: SignMessagePayload): Promise<Response<SignMessageResponse>>;
  signTransaction(rawTransaction: Uint8Array): Promise<Response<Uint8Array>>;

  // submitTransaction return transaction hash
  submitTransaction(signedTxn: Uint8Array): Promise<Response<Types.HexEncodedBytes>>;
  // signAndSubmitTransaction return transaction hash
  signAndSubmitTransaction(rawTransaction: Uint8Array): Promise<Response<Types.HexEncodedBytes>>;
  // submitSignedBCSTransaction return transaction hash
  submitSignedBCSTransaction(signedTxn: Uint8Array): Promise<Response<Types.HexEncodedBytes>>;

  // generateSignSubmitTransaction return transaction hash
  generateSignSubmitTransaction(payload: Types.EntryFunctionPayload, options?: Partial<SubmitTransactionRequest>): Promise<Response<Types.HexEncodedBytes>>;
  // generateSignSubmitRawTransaction return transaction hash
  generateSignSubmitRawTransaction(payload: Uint8Array, extraArgs?: OptionalTransactionArgs & { checkSuccess?: boolean; timeoutSecs?: number }): Promise<Response<Types.HexEncodedBytes>>; // tx hash
  // generateSignSubmitWaitForTransaction return transaction detail
  generateSignSubmitWaitForTransaction(payload: Uint8Array, extraArgs?: OptionalTransactionArgs & { checkSuccess?: boolean; timeoutSecs?: number }): Promise<Response<Types.Transaction>>;

  simulateTransaction(rawTransaction: Uint8Array, query?: EstimateGasArgs): Promise<Response<Types.UserTransaction[]>>;
  submitBCSSimulation(bcsBody: Uint8Array, query?: EstimateGasArgs): Promise<Response<Types.UserTransaction[]>>;

  getAccount(accountAddress: MaybeHexString): Promise<Response<Types.AccountData>>;
  getAccountTransactions(accountAddress: MaybeHexString, query?: PaginationArgs): Promise<Response<Types.Transaction[]>>;
  getAccountModules(accountAddress: MaybeHexString, query?: { ledgerVersion?: number }): Promise<Response<Types.MoveModuleBytecode[]>>;
  getAccountModule(accountAddress: MaybeHexString, moduleName: string, query?: { ledgerVersion?: number }): Promise<Response<Types.MoveModuleBytecode>>;
  getAccountResources(accountAddress: MaybeHexString, query?: { ledgerVersion?: number }): Promise<Response<Types.MoveResource[]>>;
  getAccountResource(accountAddress: MaybeHexString, resourceType: Types.MoveStructTag, query?: { ledgerVersion?: number }): Promise<Response<Types.MoveResource>>;

  getEventsByCreationNumber(address: MaybeHexString, creationNumber: number | string, query?: PaginationArgs): Promise<Response<Types.Event[]>>;
  getEventsByEventHandle(address: MaybeHexString, eventHandleStruct: Types.MoveStructTag, fieldName: string, query?: PaginationArgs): Promise<Response<Types.Event[]>>;

  getTransactions(query?: PaginationArgs): Promise<Response<Types.Transaction[]>>;
  getTransactionByHash(txnHash: string): Promise<Response<Types.Transaction>>;
  getTransactionByVersion(txnVersion: number): Promise<Response<Types.Transaction>>;

  transactionPending(txnHash: string): Promise<Response<boolean>>;

  waitForTransactionWithResult(txnHash: string, extraArgs?: { timeoutSecs?: number; checkSuccess?: boolean }): Promise<Response<Types.Transaction>>;
  waitForTransaction(txnHash: string, extraArgs?: { timeoutSecs?: number; checkSuccess?: boolean }): Promise<Response<void>>;

  getLedgerInfo(): Promise<Response<Types.IndexResponse>>;
  getChainId(): Promise<Response<number>>;
  getTableItem(handle: string, data: Types.TableItemRequest, query?: { ledgerVersion?: number }): Promise<Response<any>>;
  lookupOriginalAddress(addressOrAuthKey: MaybeHexString): Promise<Response<HexString>>;
  getBlockByHeight(blockHeight: number, withTransactions?: boolean): Promise<Response<Types.Block>>;
  getBlockByVersion(version: number, withTransactions?: boolean): Promise<Response<Types.Block>>;
};

export type IWeb3SuiSDK = {
  getMoveFunctionArgTypes(objectId: string, moduleName: string, functionName: string): Promise<Response<SuiMoveFunctionArgTypes>>;
  getNormalizedMoveModulesByPackage(objectId: string): Promise<Response<SuiMoveNormalizedModules>>;
  getNormalizedMoveModule(objectId: string, moduleName: string): Promise<Response<SuiMoveNormalizedModule>>;
  getNormalizedMoveFunction(objectId: string, moduleName: string, functionName: string): Promise<Response<SuiMoveNormalizedFunction>>;
  getNormalizedMoveStruct(objectId: string, moduleName: string, structName: string): Promise<Response<SuiMoveNormalizedStruct>>;
  getObjectsOwnedByAddress(address: string): Promise<Response<SuiObjectInfo[]>>;
  getGasObjectsOwnedByAddress(address: string): Promise<Response<SuiObjectInfo[]>>;
  getObjectsOwnedByObject(objectId: string): Promise<Response<SuiObjectInfo[]>>;
  getObject(objectId: string): Promise<Response<GetObjectDataResponse>>;
  getObjectRef(objectId: string): Promise<Response<SuiObjectRef | undefined>>;
  getObjectBatch(objectIds: string[]): Promise<Response<GetObjectDataResponse[]>>;
  getTransactionsForObject(objectID: string): Promise<Response<GetTxnDigestsResponse>>;
  getTransactionsForAddress(addressID: string): Promise<Response<GetTxnDigestsResponse>>;
  getTransactionWithEffects(digest: TransactionDigest): Promise<Response<SuiTransactionResponse>>;
  getTransactionWithEffectsBatch(digests: TransactionDigest[]): Promise<Response<SuiTransactionResponse[]>>;
  executeTransaction(txnBytes: string, signatureScheme: SignatureScheme, signature: string, pubkey: string): Promise<Response<SuiTransactionResponse>>;
  executeTransactionWithRequestType(txnBytes: string, signatureScheme: SignatureScheme, signature: string, pubkey: string, requestType?: ExecuteTransactionRequestType): Promise<Response<SuiExecuteTransactionResponse>>;
  getTotalTransactionNumber(): Promise<Response<number>>;
  getTransactionDigestsInRange(start: GatewayTxSeqNumber, end: GatewayTxSeqNumber): Promise<Response<GetTxnDigestsResponse>>;
  getRecentTransactions(count: number): Promise<Response<GetTxnDigestsResponse>>;
  syncAccountState(address: string): Promise<Response<any>>;
  getEventsByTransaction(digest: TransactionDigest, count?: number): Promise<Response<SuiEvents>>;
  getEventsByModule(package_: string, module: string, count?: number, startTime?: number, endTime?: number): Promise<Response<SuiEvents>>;
  getEventsByMoveEventStructName(moveEventStructName: string, count?: number, startTime?: number, endTime?: number): Promise<Response<SuiEvents>>;
  getEventsBySender(sender: SuiAddress, count?: number, startTime?: number, endTime?: number): Promise<Response<SuiEvents>>;
  getEventsByRecipient(recipient: ObjectOwner, count?: number, startTime?: number, endTime?: number): Promise<Response<SuiEvents>>;
  getEventsByObject(object: ObjectId, count?: number, startTime?: number, endTime?: number): Promise<Response<SuiEvents>>;
  getEventsByTimeRange(count?: number, startTime?: number, endTime?: number): Promise<Response<SuiEvents>>;
  subscribeEvent(filter: SuiEventFilter, onMessage: (event: SuiEventEnvelope) => void): Promise<Response<SubscriptionId>>;
  unsubscribeEvent(id: SubscriptionId): Promise<Response<boolean>>;
  dryRunTransaction(txnBytes: string, signatureScheme: SignatureScheme, signature: string, pubkey: string): Promise<Response<TransactionEffects>>;

  // Signer
  signAndDryRunTransaction(txBytes: Base64DataBuffer): Promise<Response<TransactionEffects>>;
  transferObjectDryRun(transaction: TransferObjectTransaction): Promise<Response<TransactionEffects>>;
  executeMoveCallDryRun(transaction: MoveCallTransaction): Promise<Response<TransactionEffects>>;
  transferSuiDryRun(transaction: TransferSuiTransaction): Promise<Response<TransactionEffects>>;
  publishDryRun(transaction: PublishTransaction): Promise<Response<TransactionEffects>>;
  signData(data: Base64DataBuffer): Promise<Response<SignaturePubkeyPair>>;
  signAndExecuteTransaction(txBytes: Base64DataBuffer): Promise<Response<SuiTransactionResponse>>;
  signAndExecuteTransactionWithRequestType(txBytes: Base64DataBuffer, requestType: ExecuteTransactionRequestType): Promise<Response<SuiExecuteTransactionResponse>>;
  transferObject(transaction: TransferObjectTransaction): Promise<Response<SuiTransactionResponse>>;
  transferSui(transaction: TransferSuiTransaction): Promise<Response<SuiTransactionResponse>>;
  pay(transaction: PayTransaction): Promise<Response<SuiTransactionResponse>>;
  mergeCoin(transaction: MergeCoinTransaction): Promise<Response<SuiTransactionResponse>>;
  splitCoin(transaction: SplitCoinTransaction): Promise<Response<SuiTransactionResponse>>;
  executeMoveCall(transaction: MoveCallTransaction): Promise<Response<SuiTransactionResponse>>;
  publish(transaction: PublishTransaction): Promise<Response<SuiTransactionResponse>>;
  transferObjectWithRequestType(transaction: TransferObjectTransaction, requestType?: ExecuteTransactionRequestType): Promise<Response<SuiExecuteTransactionResponse>>;
  transferSuiWithRequestType(transaction: TransferSuiTransaction, requestType?: ExecuteTransactionRequestType): Promise<Response<SuiExecuteTransactionResponse>>;
  payWithRequestType(transaction: PayTransaction, requestType?: ExecuteTransactionRequestType): Promise<Response<SuiExecuteTransactionResponse>>;
  mergeCoinWithRequestType(transaction: MergeCoinTransaction, requestType?: ExecuteTransactionRequestType): Promise<Response<SuiExecuteTransactionResponse>>;
  splitCoinWithRequestType(transaction: SplitCoinTransaction, requestType?: ExecuteTransactionRequestType): Promise<Response<SuiExecuteTransactionResponse>>;
  executeMoveCallWithRequestType(transaction: MoveCallTransaction, requestType?: ExecuteTransactionRequestType): Promise<Response<SuiExecuteTransactionResponse>>;
  publishWithRequestType(transaction: PublishTransaction, requestType?: ExecuteTransactionRequestType): Promise<Response<SuiExecuteTransactionResponse>>;
};

export type IWeb3AptosToken = {
  createCollection(name: string, description: string, uri: string, maxAmount: number, extraArgs?: OptionalTransactionArgs): Promise<Response<string>>;
  createToken(
    collectionName: string,
    name: string,
    description: string,
    supply: number,
    uri: string,
    max?: number,
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

export type IWeb3Coin = {
  faucet(address: string, nodeUrl: string, faucetUrl: string): Promise<void>;
  getCoins(owner: string): Promise<string[]>;
  getCoinInfo(coinResource: string): Promise<CoinData>;
  getBalance(owner: string, coinResource: string, coinManagedType: string): Promise<string>;
  buildTransferCoinPayload(receiver: string, amount: string, coinTypeResource: string, sender: string | undefined): Promise<any>;
  getPublishedCoinPackages(owner: string): Promise<string[]>;
  buildMintCoinPayload(receiver: string, amount: string, coinTypeResource: string): Promise<any>;
};

export interface PaginationArgs {
  start?: number;
  limit?: number;
}

export type CoinData = {
  coin_type_resource: string;
  name: string;
  symbol: string;
  decimals: number;
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

export const createReponse = <T>(method: string, status: number, data: T): Response<T> => {
  return { method, status, data };
};
