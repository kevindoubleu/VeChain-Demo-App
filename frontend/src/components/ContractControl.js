export default function ContractControl(props) {
  return (
    <>
      <details>
        <summary>contract controls</summary>

        <p>current contract address: {props.address}</p>
        
        <button
          onClick = {props.onClick} >
          deploy new contract
        </button>
      </details>
    </>
  )
}