import { useEffect, useState } from "react"
import { waitForReceipt } from "../utils/transaction"

export default function ContractInteraction(props) {
  const contract    = props.contract
  const userAddress = props.address
  const app         = props.app

  // const executeBalanceOf = async () => {
  //   const balanceOfABI = contract.abi.find(methodABI => {
  //     return methodABI.name == "balanceOf"
  //   })

  //   const balanceOfMethod = app.connex.thor.account(contract.address).method(balanceOfABI)
  //   const balanceInfo = await balanceOfMethod.call(address)

  //   setBalance(balanceInfo.decoded[0])
  //   // return balanceInfo
  // }

  // the original function is above, this one is bcs i want it to be more generic
  const executeContractRead = async (methodName, ...methodArgs) => {
    const abi = contract.abi.find(methodABI => {
      return methodABI.name === methodName
    })

    const methodObj = app.connex.thor.account(contract.address).method(abi)
    const retval = await methodObj.call(...methodArgs)

    return retval.decoded[0]
  }

  const [info, setInfo] = useState({
    name   : undefined,
    symbol : undefined,
  })
  useEffect(() => {
    async function getInfo() {
      if (!app.connex) {return}

      const name = await executeContractRead("name")
      const symbol = await executeContractRead("symbol")

      setInfo({
        name   : name,
        symbol : symbol,
      })
    }
    getInfo()
  }, [app])

  

  const [balance, setBalance] = useState("")
  useEffect(() => {
    // reset balance on address change (logout then login)
    setBalance("")
  }, [userAddress])

  const initialFormData = {
    value : 0,
    to    : "",
  }

  const [formData, setFormData] = useState(initialFormData)
  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prevData) => {
      return {
        ...prevData,
        [name]: value,
      }
    })
  }

  const handleClick = (event) => {
    event.preventDefault()
    executeTransfer(formData)
    setFormData(initialFormData)
  }

  const executeTransfer = async () => {
    const transferABI = contract.abi.find(methodABI => {
      return methodABI.name === "transfer"
    })

    const transferMethod = app.connex.thor.account(contract.address).method(transferABI)
    const clause = await transferMethod.asClause(formData.to, formData.value)

    app.connex.vendor
      .sign("tx", [clause])
      .comment("transfer " + formData.value + info.symbol + " to " + formData.to)
      .signer(userAddress)
      .request()
      .then((txResult) => waitForReceipt(app, txResult))
  }

  return (
    <fieldset>
      <legend>contract interaction</legend>
      { userAddress === "" ?
        <p>please login first</p>
      :
      <>
        { info.name ?
          <p>{info.name} ({info.symbol})</p>
        :
          <p>loading</p>
        }

        { balance === "" ?
          <button
            onClick = {async () => {setBalance(await executeContractRead("balanceOf", userAddress))}} >
            check token balance
          </button>
        :
          <>
            <label>balance: {balance}</label>
            <button
              onClick = {async () => {setBalance(await executeContractRead("balanceOf", userAddress))}} >
              update balance
            </button>
          </>
        }
        <br />

        <label>amount</label>
        <input
          name="value"
          value={formData.value}
          onChange={handleChange}

          key={"value" + props.name}
          type="number"
          placeholder={"in " + props.symbol}/>
        <br />

        <label>recipient</label>
        <input
          name="to"
          value={formData.to}
          onChange={handleChange}

          key={"to" + props.name}
          type="text"
          placeholder="0xsomethingsomething"/>
        <br />

        <button
          onClick={handleClick}
        >
          transfer
        </button>
      </>
      }
    </fieldset>
  )
}