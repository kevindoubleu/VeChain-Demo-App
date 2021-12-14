export default function ConnectWallet(props) {
  const getAddress = async () => {
    props.vendor.sign("cert", {
      purpose: "identification",
      payload: {
        type: "text",
        content: "Please sign the certificate to show that you are who you claim to be"
      }
    })
    // .accepted(() => alert("accepted"))
    .request()
    .then((r) => {
      const address = r.annex.signer;
      props.onClick(address)
    })
    .catch((e) => console.log("error authentication:" + e.message));
  }

  const deleteAddress = async () => {
    props.onClick("")
  }

  return (
    <>
      {props.address ?
        <>
          <p>welcome {props.address}</p>
          <button
            onClick={deleteAddress} >
            disconnect wallet
          </button>
        </>
      :
        <button
          onClick={getAddress} >
          connect wallet
        </button>
      }
      <hr />
    </>
  )
}