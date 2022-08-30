// Copyright 2022 Fewcha. All rights reserved.

import { AptosClient, AptosAccount, Types as Gen } from "aptos";
import { Buffer } from "buffer/";

export type FewchaCoinData = {
  coin_type_resource: string;
  name: string;
  symbol: string;
  decimals: number;
};

export type FewchaCoinStore = {
  coin: {
    value: string;
  };
};

/**
 * Class for creating, minting and managing minting coins
 */
export class FewchaCoinClient {
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
  async submitTransactionHelper(account: AptosAccount, payload: Gen.EntryFunctionPayload) {
    const txnRequest = await this.aptosClient.generateTransaction(account.address(), payload, {
      max_gas_amount: "4000",
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
  ): Promise<string> {
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
    const txnHash = await this.submitTransactionHelper(account, payload);
    await this.aptosClient.getTransactionByHash(txnHash);

    return txnHash;
  }

  /** Registers the coin */
  // coin_type_address: something like 0x${coinTypeAddress}
  // resource_type: something like moon_coin::MoonCoin
  async registerCoin(account: AptosAccount, coin_type_resource: string): Promise<string> {
    const payload: {
      function: string;
      arguments: any[];
      type: string;
      type_arguments: any[];
    } = {
      type: "script_function_payload",
      function: "0x1::managed_coin::register",
      type_arguments: [coin_type_resource],
      arguments: [],
    };

    const txnHash = await this.submitTransactionHelper(account, payload);
    await this.aptosClient.getTransactionByHash(txnHash);

    return txnHash;
  }

  /** Mints the coin */
  // coin_type_address: something like 0x${coinTypeAddress}
  // resource_type: something like moon_coin::MoonCoin
  async mintCoin(account: AptosAccount, coin_type_resource: string, dst_address: string, amount: number): Promise<string> {
    const payload: {
      function: string;
      arguments: any[];
      type: string;
      type_arguments: any[];
    } = {
      type: "script_function_payload",
      function: "0x1::managed_coin::mint",
      type_arguments: [coin_type_resource],
      arguments: [dst_address.toString(), amount.toString()],
    };
    const txnHash = await this.submitTransactionHelper(account, payload);
    await this.aptosClient.getTransactionByHash(txnHash);

    return txnHash;
  }

  /** Transfers the coins */
  // coin_type_address: something like 0x${coinTypeAddress}
  // resource_type: something like moon_coin::MoonCoin
  async transferCoin(account: AptosAccount, coin_type_resource: string, to_address: string, amount: number): Promise<string> {
    const payload: {
      function: string;
      arguments: any[];
      type: string;
      type_arguments: any[];
    } = {
      type: "script_function_payload",
      function: "0x1::coin::transfer",
      type_arguments: [coin_type_resource],
      arguments: [to_address.toString(), amount.toString()],
    };
    const txnHash = await this.submitTransactionHelper(account, payload);
    await this.aptosClient.getTransactionByHash(txnHash);

    return txnHash;
  }

  /** Get coin metadata */
  // address: something like 0x${coinTypeAddress}
  // resource_type: something like moon_coin::MoonCoin
  async getCoinData(coin_type_resource: string): Promise<FewchaCoinData> {
    const resource = await this.aptosClient.getAccountResource(coin_type_resource.split("::")[0], `0x1::coin::CoinInfo<${coin_type_resource}>`);
    let coin_data = resource.data as FewchaCoinData;
    return {
      ...coin_data,
      coin_type_resource,
    };
  }

  /** Get coin balance */
  // account_address: something like 0x${accountAddress}
  // coin_type_address: something like 0x${coinTypeAddress}
  // resource_type: something like moon_coin::MoonCoin
  async getCoinBalance(account_address: string, coin_type_resource: string): Promise<string> {
    const coin_info = await this.aptosClient.getAccountResource(account_address, `0x1::coin::CoinStore<${coin_type_resource}>`);
    return (coin_info.data as FewchaCoinStore).coin.value;
  }

  /** Get list registered coins (resource name) */
  // account_address: something like 0x${accountAddress}
  async getCoins(account_address: string): Promise<string[]> {
    const resources = await this.aptosClient.getAccountResources(account_address);
    return resources
      .filter((r) => r.type.startsWith("0x1::coin::CoinStore"))
      .map((r) => {
        var regExp = new RegExp("0x1::coin::CoinStore<(0x[0-9A-Fa-f]+::[^>]+)>", "i");
        var match = regExp.exec(r.type);
        return match[1];
      });
  }
}
