const Aptos = require("aptos");
const Web3 = require("@fewcha/web3");

const main = async function () {
  const aptosAccountObject = {
    address: "0x978c213990c4833df71548df7ce49d54c759d6b6d932de22b24d56060b7af2aa",
    privateKeyHex: "0xc5338cd251c22daa8c9c9cc94f498cc8a5c7e1d2e75287a5dda91096fe64efa5de19e5d1880cac87d57484ce9ed2e84cf0f9599f12e7cc3a52e4e7657a763f2c",
    publicKeyHex: "0xde19e5d1880cac87d57484ce9ed2e84cf0f9599f12e7cc3a52e4e7657a763f2c",
  };

  const devnetNodeURL = "https://fullnode.devnet.aptoslabs.com";
  const devnetFaucetURL = "https://faucet.devnet.aptoslabs.com";
  const aitNodeURL = "http://ait2.aptosdev.com";
  const account = Aptos.AptosAccount.fromAptosAccountObject(aptosAccountObject);
  const provider = new Web3.Web3Provider(devnetNodeURL, account);
  const web3 = new Web3.default(provider);

  const address = account.address().hex();

  // check all functions at: https://github.com/fewcha-wallet/aptos-web3/blob/main/packages/web3/src/types.ts

  // connect
  console.log(await web3.action.connect());
  // {
  //   address: '0x978c213990c4833df71548df7ce49d54c759d6b6d932de22b24d56060b7af2aa',
  //   publicKey: '0xde19e5d1880cac87d57484ce9ed2e84cf0f9599f12e7cc3a52e4e7657a763f2c'
  // }

  // get node url
  console.log(await web3.action.getNetwork());
  // https://fullnode.devnet.aptoslabs.com

  // get account detail
  console.log(await web3.action.account());
  // {
  //   address: '0x978c213990c4833df71548df7ce49d54c759d6b6d932de22b24d56060b7af2aa',
  //   publicKey: '0xde19e5d1880cac87d57484ce9ed2e84cf0f9599f12e7cc3a52e4e7657a763f2c'
  // }

  // disconnect
  console.log(await web3.action.disconnect());
  // undefined

  // empty account if disconnected
  console.log(await web3.action.account());
  // { address: '', publicKey: '' }

  // change current account
  console.log(await web3.action.changeAccount(account));
  // {
  //   address: '0x978c213990c4833df71548df7ce49d54c759d6b6d932de22b24d56060b7af2aa',
  //   publicKey: '0xde19e5d1880cac87d57484ce9ed2e84cf0f9599f12e7cc3a52e4e7657a763f2c'
  // }

  // change current network
  console.log(await web3.action.changeNetwork(aitNodeURL));
  //

  // change back to devnet
  console.log(await web3.action.changeNetwork(devnetNodeURL));

  // faucet
  const faucetClient = new Aptos.FaucetClient(devnetNodeURL, devnetFaucetURL);
  const txns = await faucetClient.fundAccount(address, 5000);
  const tx1 = await web3.action.sdk.getTransaction(txns[0]);
  console.log(tx1.hash);
  // transaction hash

  // get balance
  const data = await web3.action.sdk.getAccountResources(address);
  const accountResource = data.find((r) => r.type === "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>");
  const balance = accountResource.data.coin.value;
  console.log(balance);
  // account balance

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
};

main().then();
