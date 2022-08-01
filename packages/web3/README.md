# @fewcha/web3

The `@fewcha/web3` library aims to be an all-in-one toolkit to enable developers interact with Aptos Blockchain and its ecosystem.

If you are using `React`, you should use the [@fewcha/web3-react](https://github.com/fewcha-wallet/aptos-web3/tree/main/packages/web3-react) for easy integration and get realtime state updates.

## Install

Install Aptos SDK and fewcha Web3

```bash
yarn add aptos @fewcha/web3
```

## Supported direct Node URL and wallets

- Node URL, example: `https://fullnode.devnet.aptoslabs.com`
- [Aptos Official Wallet](https://github.com/aptos-labs/aptos-core/releases/tag/wallet-v0.1.1)
- [Fewcha Wallet](https://fewcha.app)
- [Martian Wallet](https://martianwallet.xyz/)
- [Hippo Wallet](https://github.com/hippospace/hippo-wallet)

## Usage

### With providers (wallets)

```js
import { AptosAccount } from 'aptos';
import Web3, { Web3Provider } from '@fewcha/web3';

const fewcha = (window as any).fewcha;
const fewchaProvider = new Web3Provider(aptos);
const fewchaWeb3 = new Web3(provider);

// ...
<button
  onClick={() => {
    fewchaWeb3.action.connect();
  }}
>
  Connect Aptos
</button>
```

### Nodejs

`Nodejs` and Node URL directly, `AptosAccount`

```js
import { AptosAccount } from 'aptos';
import Web3, { Web3Provider } from '@fewcha/web3';

const aptosAccountObject = {
  address: "0x978c213990c4833df71548df7ce49d54c759d6b6d932de22b24d56060b7af2aa",
  privateKeyHex: "0xc5338cd251c22daa8c9c9cc94f498cc8a5c7e1d2e75287a5dda91096fe64efa5de19e5d1880cac87d57484ce9ed2e84cf0f9599f12e7cc3a52e4e7657a763f2c",
  publicKeyHex: "0xde19e5d1880cac87d57484ce9ed2e84cf0f9599f12e7cc3a52e4e7657a763f2c",
};
const account = AptosAccount.fromAptosAccountObject(aptosAccountObject);

const devnetNodeURL = "https://fullnode.devnet.aptoslabs.com";

const provider = new Web3Provider(devnetNodeURL, account);
const web3 = new Web3(provider);

const main = async function () {
  // get account detail
  await web3.action.connect();
  // await web3.action.disconnect();
  // await web3.action.isConnected();
  console.log(await web3.action.account());
  // {
  //   address: '0x978c213990c4833df71548df7ce49d54c759d6b6d932de22b24d56060b7af2aa',
  //   publicKey: '0xde19e5d1880cac87d57484ce9ed2e84cf0f9599f12e7cc3a52e4e7657a763f2c'
  // }
}

main().then();
```

Learn more at https://github.com/fewcha-wallet/aptos-web3/tree/main/packages/nodejs

### API

Learn more all functions at https://github.com/fewcha-wallet/aptos-web3/blob/main/packages/web3/src/types.ts

```js
// get balance
const data = await web3.action.sdk.getAccountResources(address);
const accountResource = data.find((r) => r.type === "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>");
const balance = accountResource.data.coin.value;
console.log(balance);

// get estimate gas for send balance and call
const receiverAddress = "0x788b3f37e8925b444fafa49becee9bd4489b1ef1a4005fdd6eac47e4e6d71531";
const sendBalance = "1000";
const payload = {
  type: "script_function_payload",
  function: "0x1::Coin::transfer",
  type_arguments: ["0x1::aptos_coin::AptosCoin"],
  arguments: [receiverAddress, sendBalance],
};
const txnRequest = await web3.action.generateTransaction(payload);
const transactionEstRes = await web3.action.simulateTransaction(txnRequest);
if (transactionEstRes.success) {
  console.log(transactionEstRes.gas_used);
} else {
  console.error(transactionEstRes.vm_status);
}
const transactionRes = await web3.action.signAndSubmitTransaction(txnRequest);
console.log(transactionRes.hash);
await web3.action.sdk.waitForTransaction(transactionRes.hash);
const tx = await web3.action.sdk.getTransaction(transactionRes.hash);
console.log(tx.success);
```

## Examples

- [cra-web3](https://github.com/fewcha-wallet/aptos-web3/tree/main/packages/cra-web3) (Create React App)
- [nextjs-web3](https://github.com/fewcha-wallet/aptos-web3/tree/main/packages/nextjs-web3) (Next.js)
- [nodejs](https://github.com/fewcha-wallet/aptos-web3/tree/main/packages/nodejs) (Node.js)

## License

MIT
