import { MaybeHexString, Types } from "aptos";
import { RequestParams } from "aptos/dist/api/http-client";

export interface Web3ProviderStandard {
  getCurrentAddress(): Promise<string>; // get current account address
  getNodeURL(): string; // get current network URL
  isConnected(): Promise<boolean>; // check website can connect
  connect(): Promise<boolean>; // trigger website connect to wallet

  // start onchain call
  getAccount(accountAddress: MaybeHexString): Promise<Types.Account>;
  getAccountTransactions(query?: {
    start?: number;
    limit?: number;
  }): Promise<Types.OnChainTransaction[]>;
  getAccountModules(query?: {
    version?: Types.LedgerVersion;
  }): Promise<Types.MoveModule[]>;
  getAccountModule(
    moduleName: string,
    query?: { version?: Types.LedgerVersion }
  ): Promise<Types.MoveModule>;
  getAccountResources(query?: {
    version?: Types.LedgerVersion;
  }): Promise<Types.AccountResource[]>;
  getAccountResource(
    resourceType: string,
    query?: { version?: Types.LedgerVersion }
  ): Promise<Types.AccountResource>;
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
  transactionPending(txnHash: Types.HexEncodedBytes): Promise<boolean>;
  waitForTransaction(txnHash: Types.HexEncodedBytes);
  getLedgerInfo(params: RequestParams): Promise<Types.LedgerInfo>;
  getTableItem(
    handle: string,
    data: Types.TableItemRequest,
    params?: RequestParams
  ): Promise<any>;
  // /end onchain call
}
