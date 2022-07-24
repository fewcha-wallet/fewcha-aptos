import { AptosAccount } from './aptos_account';
import { AptosClient } from './aptos_client';
import { Types } from './types';
import { Buffer } from 'buffer/';

export type CoinData = {
  address: string;
  resource_type: string;
  name: string;
  symbol: string;
  decimals: number;
};

export type CoinStore = {
  coin: {
    value: string
  };
};

/**
 * Class for creating, minting and managing minting coins
 */
export class CoinClient {
  aptosClient: AptosClient;

  /**
   * Creates new CoinClient instance
   * @param aptosClient AptosClient instance
   */
  constructor(aptosClient: AptosClient) {
    this.aptosClient = aptosClient;
  }

  /**
   * Brings together methods for generating, signing and submitting transaction
   * @param account AptosAccount which will sign a transaction
   * @param payload Transaction payload. It depends on transaction type you want to send
   * @returns Promise that resolves to transaction hash
   */
  async submitTransactionHelper(account: AptosAccount, payload: Types.TransactionPayload) {
    const txnRequest = await this.aptosClient.generateTransaction(account.address(), payload, {
      max_gas_amount: '4000',
    });
    const signedTxn = await this.aptosClient.signTransaction(account, txnRequest);
    const res = await this.aptosClient.submitTransaction(signedTxn);
    await this.aptosClient.waitForTransaction(res.hash);
    return Promise.resolve(res.hash);
  }

  /** Initialize the coin */
  // Address of account which is used to initilize a coin `CoinType` must match match the deployer of module containining `CoinType`.
  async initializeCoin(
    account: AptosAccount,
    resource_type: string, // resource_type: something like moon_coin::MoonCoin
    name: string,
    symbol: string,
    decimals: number,
  ) : Promise<string> {
    const payload: {
      function: string;
      arguments: any[];
      type: string;
      type_arguments: any[];
    } = {
      type: "script_function_payload",
      function: "0x1::managed_coin::initialize",
      type_arguments: [`${account.address()}::${resource_type}`], 
      arguments: [
        Buffer.from(name).toString("hex"),
        Buffer.from(symbol).toString("hex"),
        decimals,
        false, // monitor_supply
      ],
    };
    const txnHash = await this.submitTransactionHelper(
      account,
      payload
    );
    await this.aptosClient.getTransaction(txnHash);

    return txnHash;
  }

  /** Registers the coin */
  // coin_type_address: something like 0x${coinTypeAddress}
  // resource_type: something like moon_coin::MoonCoin
  async registerCoin(account: AptosAccount, coin_type_address: string, resource_type: string) : Promise<string> {
    const payload: {
      function: string;
      arguments: any[];
      type: string;
      type_arguments: any[];
    } = {
      type: "script_function_payload",
      function: "0x1::coin::register",
      type_arguments: [`${coin_type_address}::${resource_type}`], 
      arguments: [],
    };

    const txnHash = await this.submitTransactionHelper(
      account,
      payload
    );
    await this.aptosClient.getTransaction(txnHash);

    return txnHash;
  }

  /** Mints the coin */
  // coin_type_address: something like 0x${coinTypeAddress}
  // resource_type: something like moon_coin::MoonCoin
  async mintCoin(
    account: AptosAccount,
    coin_type_address: string, 
    resource_type: string,
    dst_address: string,
    amount: number
  ) : Promise<string>{
    const payload: {
      function: string;
      arguments: any[];
      type: string;
      type_arguments: any[];
    } = {
      type: "script_function_payload",
      function: "0x1::managed_coin::mint",
      type_arguments: [`${coin_type_address}::${resource_type}`], 
      arguments: [dst_address.toString(), amount.toString()],
    };
    const txnHash = await this.submitTransactionHelper(
      account,
      payload
    );
    await this.aptosClient.getTransaction(txnHash);

    return txnHash;
  }

  /** Transfers the coins */
  // coin_type_address: something like 0x${coinTypeAddress}
  // resource_type: something like moon_coin::MoonCoin
  async transferCoin(
    account: AptosAccount,
    coin_type_address: string, 
    resource_type: string,
    to_address: string,
    amount: number
  ) : Promise<string>{
    const payload: {
      function: string;
      arguments: any[];
      type: string;
      type_arguments: any[];
    } = {
      type: "script_function_payload",
      function: "0x1::coin::transfer",
      type_arguments: [`${coin_type_address}::${resource_type}`], 
      arguments: [to_address.toString(), amount.toString()],
    };
    const txnHash = await this.submitTransactionHelper(
      account,
      payload
    );
    await this.aptosClient.getTransaction(txnHash);

    return txnHash;
  }

  /** Get coin metadata */
  // address: something like 0x${coinTypeAddress}
  // resource_type: something like moon_coin::MoonCoin
  async getCoinData(address: string, resource_type: string) : Promise<CoinData> {
    const resource = await this.aptosClient.getAccountResource(
      address,
      `0x1::coin::CoinInfo<${address}::${resource_type}>`
    );
    let coin_data = resource.data as CoinData;
    return {
      ...coin_data,
      address,
      resource_type,
    };
  }

  /** Get coin balance */
  // account_address: something like 0x${accountAddress}
  // coin_type_address: something like 0x${coinTypeAddress}
  // resource_type: something like moon_coin::MoonCoin
  async getCoinBalance(
    account_address: string, 
    coin_type_address: string, 
    resource_type: string,
  ): Promise<string> {
    const coin_info = await this.aptosClient.getAccountResource(
      account_address,
      `0x1::coin::CoinStore<${coin_type_address}::${resource_type}>`
    );
    return (coin_info.data as CoinStore).coin.value;
  }

  /** Get list registered coins */
  // account_address: something like 0x${accountAddress}
  async getCoins(account_address: string) : Promise<CoinData[]> {
    const resources = await this.aptosClient.getAccountResources(account_address);
    return resources.filter(
      (r) => r.type.startsWith("0x1::coin::CoinInfo")
    ).map(
      (r) => {
        let coin_data = r.data as CoinData;
        var regExp = new RegExp("0x1::coin::CoinInfo<(0x[0-9A-Fa-f]+)::([^>]+)>", "i");
        var match = regExp.exec(r.type);
        return {
          ...coin_data,
          address: match[1],
          resource_type: match[2],
        };
      }
    );
  }
}
