import { Keypair, Connection, clusterApiUrl, PublicKey, } from "@solana/web3.js"
function App() {
  const createWallet = async (): Promise<void> => {
    const kp = Keypair.generate();
    const connection = new Connection(clusterApiUrl("devnet"))
    const address = new PublicKey("3pGveX9dpw1pbip3vyBMDCHJEqoV3p7DUnYx9xDcMAdv")
    const balance = await connection.getBalance(address);

    console.log(`keypair is ${kp.publicKey.toString()}`);
    console.log(`${balance/1e9} sol`);

  }

  return (
    <>
      <h1>Solana Wallet Dashboard</h1>
      <button onClick={createWallet}>create wallet</button>
    </>
  )
}

export default App
