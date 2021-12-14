export const waitForReceipt = async (app, txResult) => {
  const tx = await app.connex.thor.transaction(txResult.txid)
  const ticker = app.connex.thor.ticker()
  ticker.next().then(() => {
    tx.getReceipt().then((tx) => {
      console.log(tx)

      alert("transaction successful, txid:" + tx.meta.txID)
      if (tx.outputs[0].contractAddress) {
        alert("contract is live at " + tx.outputs[0].contractAddress)
      }

      return tx
    })
  })
}