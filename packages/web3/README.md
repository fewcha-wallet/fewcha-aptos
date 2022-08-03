# @fewcha/web3

The `@fewcha/web3` library aims to be an all-in-one toolkit to enable developers interact with Aptos Blockchain and its ecosystem.

Check the documentation at https://docs.fewcha.app/

## Install

Install Aptos SDK and fewcha Web3 to wrapper `window.fewcha` with `TypeScript` types.

```bash
yarn add aptos @fewcha/web3
```

## Supported direct Node URL and Fewcha Wallet

- Node URL, example: `https://fullnode.devnet.aptoslabs.com`
- [Fewcha Wallet](https://fewcha.app)

## Usage

### With Fewcha Wallet

```js
import Web3 from '@fewcha/web3';

const web3 = new Web3();

// ...
<button
  onClick={() => {
    web3.action.connect();
  }}
>
  Connect Aptos
</button>
```

### API

Learn more all functions at https://github.com/fewcha-wallet/aptos-web3/blob/main/packages/web3/src/types.ts

## License

MIT
