import Connex from '@vechain/connex'
import { useEffect, useState } from 'react'
import Transfer from './components/Transfer'

import { waitForReceipt } from './utils/transaction'

import Token from "./artifacts/contracts/Token.sol/Token.json"
import ConnectWallet from './components/ConnectWallet';
import ContractControl from './components/ContractControl';
import ContractInteraction from './components/ContractInteraction';

function App() {
  const [app, setApp] = useState({
    connex  : undefined,
    vendor  : undefined,
  });

  // init vechain web3
  useEffect(() => {
    const connex = new Connex({
      node: 'https://testnet.veblocks.net/',
      network: 'test'
    })
    const vendor = new Connex.Vendor("test")
    setApp((prevState) => {
      return {
        ...prevState,
        connex : connex,
        vendor : vendor
      }
    })
  }, [])

  // init user address
  const [address, setAddress] = useState("")

  const transferVet = (transferFormData) => {
    app.vendor.sign("tx", [
      {
        to: transferFormData.toAddress,
        value: '0x' + (transferFormData.amount * 1e18).toString(16),
        data: '0x',
        // this comment shows in sync browser
        comment: "transfer " + transferFormData.amount + " VET to " + transferFormData.toAddress,
      },
    ])
    // this comment shows in regular browsers
    .comment("transfer " + transferFormData.amount + " VET to " + transferFormData.toAddress)
    .request()
    .then((txResult) => waitForReceipt(app, txResult))
  }

  // contract interactions

  const [contract] = useState({
    address : '0x6C0D251e0C6469451CDc44dcE73e827B2AD73B36',
    abi     : Token.abi
  })

  const deployContract = () => {
    app.vendor.sign("tx", [
      {
        to: null,
        value: '0x' + (0 * 1e18).toString(16),
        data: Token.bytecode,
        comment: "deploy a token contract"
      },
    ])
    .comment("deploy a contract")
    .request()
    .then(waitForReceipt)
  }

  return (
    <>
      <h1>welcome</h1>

      <ConnectWallet
        vendor  = {app.vendor}
        address = {address}
        onClick = {setAddress} />

      <Transfer
        onClick = {transferVet}
        name    = "VeChain Native Coin"
        symbol  = "VET" />

      <ContractInteraction
        app      = {app}
        contract = {contract}
        address  = {address} />

      <ContractControl
        address  = {contract.address}
        onClick  = {deployContract} />
    </>
  );
}

export default App;
