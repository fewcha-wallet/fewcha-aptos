import { AptosClient, AptosAccount, MaybeHexString, Types } from "aptos";
import { RequestParams } from "aptos/dist/api/http-client";
import { Web3ProviderStandard } from "./types";

class AptosClientMask implements Web3ProviderStandard {
  private client: AptosClient;
  private account: AptosAccount;

  constructor(client: AptosClient, account: AptosAccount) {
    this.client = client;
    this.account = account;
  }

  // start web3 standard
  public getCurrentAddress(): Promise<string> {
    return new Promise((resolve, reject) => {
      resolve(this.account.address().hex());
    });
  }

  public getNodeURL(): string {
    return this.client.nodeUrl;
  }

  public isConnected(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      resolve(true);
    });
  }

  connect(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      resolve(true);
    });
  }
  // /end web3 standard

  // start section of onchain call, built-in
  public getAccount(accountAddress: MaybeHexString): Promise<Types.Account> {
    return this.client.getAccount(accountAddress);
  }

  public async getAccountTransactions(query?: {
    start?: number;
    limit?: number;
  }): Promise<Types.OnChainTransaction[]> {
    return this.client.getAccountTransactions(
      await this.getCurrentAddress(),
      query
    );
  }

  public async getAccountModules(query?: {
    version?: Types.LedgerVersion;
  }): Promise<Types.MoveModule[]> {
    return this.client.getAccountModules(await this.getCurrentAddress(), query);
  }

  public async getAccountModule(
    moduleName: string,
    query?: { version?: Types.LedgerVersion }
  ): Promise<Types.MoveModule> {
    return this.client.getAccountModule(
      await this.getCurrentAddress(),
      moduleName,
      query
    );
  }

  public async getAccountResources(query?: {
    version?: Types.LedgerVersion;
  }): Promise<Types.AccountResource[]> {
    return this.client.getAccountResources(
      await this.getCurrentAddress(),
      query
    );
  }

  public async getAccountResource(
    resourceType: string,
    query?: { version?: Types.LedgerVersion }
  ): Promise<Types.AccountResource> {
    return this.client.getAccountResource(
      await this.getCurrentAddress(),
      resourceType,
      query
    );
  }

  public async generateTransaction(
    payload: Types.TransactionPayload,
    options?: Partial<Types.UserTransactionRequest>
  ): Promise<Types.UserTransactionRequest> {
    return this.client.generateTransaction(
      await this.getCurrentAddress(),
      payload,
      options
    );
  }

  public createSigningMessage(
    txnRequest: Types.UserTransactionRequest
  ): Promise<Types.HexEncodedBytes> {
    return this.client.createSigningMessage(txnRequest);
  }

  public signTransaction(
    txnRequest: Types.UserTransactionRequest
  ): Promise<Types.SubmitTransactionRequest> {
    return this.client.signTransaction(this.account, txnRequest);
  }

  public transactionPending(txnHash: Types.HexEncodedBytes): Promise<boolean> {
    return this.client.transactionPending(txnHash);
  }

  public waitForTransaction(txnHash: Types.HexEncodedBytes) {
    this.client.waitForTransaction(txnHash);
  }

  public getLedgerInfo(params: RequestParams): Promise<Types.LedgerInfo> {
    return this.client.getLedgerInfo(params);
  }

  public getTableItem(
    handle: string,
    data: Types.TableItemRequest,
    params?: RequestParams
  ): Promise<any> {
    return this.client.getTableItem(handle, data, params);
  }

  // TO-DO: create built-in functions
  // /end section of onchain call, built-in
}

export default AptosClientMask;
