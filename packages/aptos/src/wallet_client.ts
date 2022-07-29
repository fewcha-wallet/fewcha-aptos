import { AptosClient } from './aptos_client';
import { FaucetClient } from './faucet_client';
import { TokenClient } from './token_client';
import { Types } from './types';

export class WalletClient {
  faucetClient: FaucetClient;

  aptosClient: AptosClient;

  tokenClient: TokenClient;

  constructor(node_url: string, faucet_url: string) {
    this.faucetClient = new FaucetClient(node_url, faucet_url);
    this.aptosClient = new AptosClient(node_url);
    this.tokenClient = new TokenClient(this.aptosClient);
  }

  async getAccountResources(accountAddress: string): Promise<Types.AccountResource[]> {
    return await this.aptosClient.getAccountResources(accountAddress);
  }

  // returns a list of token IDs of the tokens in a user's account (including the tokens that were minted)
  async getEventStream(address: string, eventHandleStruct: string, fieldName: string) {
    const response = await fetch(
      `${this.aptosClient.nodeUrl}/accounts/${address}/events/${eventHandleStruct}/${fieldName}`,
      {
        method: 'GET',
      },
    );

    if (response.status == 404) {
      return [];
    }

    return await response.json();
  }
  async getTokenIds(address: string) {
    const depositEvents = await this.getEventStream(address, '0x1::Token::TokenStore', 'deposit_events');
    const withdrawEvents = await this.getEventStream(address, '0x1::Token::TokenStore', 'withdraw_events');
    function isEventEqual(event1: any, event2: any) {
      return (
        event1.data.id.creator === event2.data.id.creator &&
        event1.data.id.collectionName === event2.data.id.collectionName &&
        event1.data.id.name === event2.data.id.name
      );
    }
    var tokenIds = [];
    for (var elem of depositEvents) {
      if (
        !withdrawEvents.some(function (item: any) {
          return isEventEqual(item, elem);
        })
      ) {
        tokenIds.push(elem.data.id);
      }
    }
    return tokenIds;
  }
  async getTokens(address: string) {
    const tokenIds = await this.getTokenIds(address);
    var tokens = [];
    for (var tokenId of tokenIds) {
      const resources: Types.AccountResource[] = await this.aptosClient.getAccountResources(tokenId.creator);
      const accountResource: { type: string; data: any } = resources.find((r) => r.type === '0x1::token::Collections');
      let token = await this.tokenClient.tableItem(
        accountResource.data.token_data.handle,
        '0x1::token::TokenId',
        '0x1::token::TokenData',
        tokenId,
      );
      tokens.push(token);
    }
    return tokens;
  }

  // returns the collection data of a user
}
