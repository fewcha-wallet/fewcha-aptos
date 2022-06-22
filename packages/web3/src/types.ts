import { AptosAccount, MaybeHexString, Types } from "aptos";
import { RequestParams } from "aptos/dist/api/http-client";
import { RawTransaction } from "aptos/dist/transaction_builder/aptos_types/transaction";

export interface Web3ProviderStandard {
  account(): Promise<string>; // get current account address
  getNodeURL(): Promise<string>; // get current network URL
  isConnected(): Promise<boolean>; // check website can connect
  connect(): Promise<void>; // trigger website connect to wallet
  disconnect(): Promise<void>; // trigger disconnect to wallet
  signAndSubmitTransaction(
    txnRequest: Types.UserTransactionRequest
  ): Promise<Types.HexEncodedBytes>;

  // https://github.com/aptos-labs/aptos-core/blob/main/ecosystem/typescript/sdk/src/aptos_client.ts
  getAccount(accountAddress: MaybeHexString): Promise<Types.Account>;
  getAccountTransactions(
    accountAddress: MaybeHexString,
    query?: { start?: number; limit?: number }
  ): Promise<Types.OnChainTransaction[]>;
  getAccountModules(
    accountAddress: MaybeHexString,
    query?: { version?: Types.LedgerVersion }
  ): Promise<Types.MoveModule[]>;
  getAccountModule(
    accountAddress: MaybeHexString,
    moduleName: string,
    query?: { version?: Types.LedgerVersion }
  ): Promise<Types.MoveModule>;
  getAccountResources(
    accountAddress: MaybeHexString,
    query?: { version?: Types.LedgerVersion }
  ): Promise<Types.AccountResource[]>;
  getAccountResource(
    accountAddress: MaybeHexString,
    resourceType: string,
    query?: { version?: Types.LedgerVersion }
  ): Promise<Types.AccountResource>;
  generateBCSTransaction(
    accountFrom: AptosAccount,
    rawTxn: RawTransaction
  ): Promise<Uint8Array>;
  generateTransaction(
    payload: Types.TransactionPayload,
    options?: Partial<Types.UserTransactionRequest>
  ): Promise<Types.UserTransactionRequest>;
  createSigningMessage(
    txnRequest: Types.UserTransactionRequest
  ): Promise<Types.HexEncodedBytes>;
  signTransaction(
    txnRequest: Types.UserTransactionRequest
  ): Promise<Types.SubmitTransactionRequest>;
  getEventsByEventKey(eventKey: Types.HexEncodedBytes): Promise<Types.Event[]>;
  getEventsByEventHandle(
    address: MaybeHexString,
    eventHandleStruct: Types.MoveStructTagId,
    fieldName: string,
    query?: { start?: number; limit?: number }
  ): Promise<Types.Event[]>;
  submitTransaction(
    signedTxnRequest: Types.SubmitTransactionRequest
  ): Promise<Types.PendingTransaction>;
  submitSignedBCSTransaction(
    signedTxn: Uint8Array
  ): Promise<Types.PendingTransaction>;
  getTransactions(query?: {
    start?: number;
    limit?: number;
  }): Promise<Types.OnChainTransaction[]>;
  getTransaction(txnHashOrVersion: string): Promise<Types.Transaction>;
  transactionPending(txnHash: Types.HexEncodedBytes): Promise<boolean>;
  waitForTransaction(txnHash: Types.HexEncodedBytes): Promise<void>;
  getLedgerInfo(params: RequestParams): Promise<Types.LedgerInfo>;
  getChainId(params: RequestParams): Promise<number>;
  getTableItem(
    handle: string,
    data: Types.TableItemRequest,
    params?: RequestParams
  ): Promise<any>;
  createCollection(
    name: string,
    description: string,
    uri: string
  ): Promise<Types.HexEncodedBytes>;
  createToken(
    collectionName: string,
    name: string,
    description: string,
    supply: number,
    uri: string,
    royalty_points_per_million: number
  ): Promise<Types.HexEncodedBytes>;
  // /end onchain call
}
