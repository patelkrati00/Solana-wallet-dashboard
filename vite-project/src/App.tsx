import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { useWallet } from "@solana/wallet-adapter-react"

function App() {
  const {publicKey} = useWallet();

  return (
    <>
      <h1>Solana Wallet Dashboard</h1>
      <WalletMultiButton></WalletMultiButton>
      {publicKey && 
      <p>Connected: {publicKey.toString()}</p>}
    </>
  )
}

export default App
