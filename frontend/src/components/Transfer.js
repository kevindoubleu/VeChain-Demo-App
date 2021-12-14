import { useState } from "react";

export default function Transfer(props) {
  const initialFormData = {
    amount   : 0,
    toAddress: "",
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
    props.onClick(formData)
    setFormData(initialFormData)
  }

  return (
    <>
      <fieldset>
        <legend>transfer {props.name}</legend>

        <label>amount</label>
        <input
          name="amount"
          value={formData.amount}
          onChange={handleChange}

          key={"amount" + props.name}
          type="number"
          placeholder={"in " + props.symbol}/>
        <br />

        <label>recipient</label>
        <input
          name="toAddress"
          value={formData.toAddress}
          onChange={handleChange}

          key={"toAddress" + props.name}
          type="text"
          placeholder="0xsomethingsomething"/>
        <br />

        <button
          onClick={handleClick}
        >
          transfer
        </button>
      </fieldset>
      <br />
    </>
  )
}
