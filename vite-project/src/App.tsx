import { Keypair } from "@solana/web3.js"
function App() {
  const createWallet = (): void => {
    const kp = Keypair.generate();
    console.log(`keypair is ${kp.publicKey.toString()}`);

  }

  return (
    <>
      <h1>Solana Wallet Dashboard</h1>
      <button onClick={createWallet}>create wallet</button>
    </>
  )
}

export default App
