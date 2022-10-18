// Copyright 2022 Fewcha. All rights reserved.

import { BCS, HexString, MaybeHexString, TokenTypes, OptionalTransactionArgs, Types as Gen } from "aptos";
import { Base64DataBuffer, ExecuteTransactionRequestType, GatewayTxSeqNumber, GetObjectDataResponse, GetTxnDigestsResponse, MergeCoinTransaction, MoveCallTransaction, ObjectId, ObjectOwner, PayTransaction, PublishTransaction, SignaturePubkeyPair, SignatureScheme, SignerWithProvider, SplitCoinTransaction, SubscriptionId, SuiAddress, SuiEventEnvelope, SuiEventFilter, SuiEvents, SuiExecuteTransactionResponse, SuiMoveFunctionArgTypes, SuiMoveNormalizedFunction, SuiMoveNormalizedModule, SuiMoveNormalizedModules, SuiMoveNormalizedStruct, SuiObjectInfo, SuiObjectRef, SuiTransactionResponse, TransactionDigest, TransactionEffects, TransferObjectTransaction, TransferSuiTransaction } from "@mysten/sui.js";

export interface IWeb3Provider {
  connect(): Promise<Response<PublicAccount>>;
  disconnect(): Promise<Response<boolean>>;
  isConnected(): Promise<Response<boolean>>;
  
  account(): Promise<Response<PublicAccount>>;
  getNetwork(): Promise<Response<string>>;
  getNetworkURL(): Promise<Response<string>>;
  getNetworkType(): Promise<Response<string>>;
  getBalance(): Promise<Response<string>>;

  aptos: IWeb3AptosSDK,
  sui: IWeb3SuiSDK,
  token: IWeb3AptosToken | IWeb3SuiToken;
  coin: IWeb3Coin;
}

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
}

export type IWeb3AptosSDK = {
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

export type IWeb3SuiToken = {}

export type IWeb3AptosToken = {
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

export type IWeb3Coin = {
  faucet(address: string, nodeUrl: string, faucetUrl: string): Promise<void>;
  getCoins(owner: string): Promise<string[]>;
  getCoinInfo(coinResource: string): Promise<CoinData>;
  getBalance(owner: string, coinResource: string, coinManagedType: string): Promise<string>;
  buildTransferCoinPayload(
    receiver: string,
    amount: string,
    coinTypeResource: string,
    sender: string | undefined,
  ): Promise<any>;
  getPublishedCoinPackages(owner: string): Promise<string[]>;
  buildMintCoinPayload(receiver: string, amount: string, coinTypeResource: string): Promise<any>;
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
